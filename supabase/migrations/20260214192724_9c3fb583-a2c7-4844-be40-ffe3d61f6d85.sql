
-- 1. Create enums
CREATE TYPE public.app_role AS ENUM ('patient', 'doctor', 'admin');
CREATE TYPE public.alert_severity AS ENUM ('low', 'medium', 'high', 'critical');
CREATE TYPE public.alert_status AS ENUM ('active', 'acknowledged', 'resolved');

-- 2. Profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  first_name TEXT,
  last_name TEXT,
  avatar_url TEXT,
  phone TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 3. User roles table (RBAC)
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role public.app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

-- 4. Medications
CREATE TABLE public.medications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  drug_name TEXT NOT NULL,
  dosage TEXT NOT NULL,
  schedule TEXT NOT NULL,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 5. Medication logs
CREATE TABLE public.medication_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  medication_id UUID REFERENCES public.medications(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  taken BOOLEAN NOT NULL,
  logged_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 6. Symptom logs
CREATE TABLE public.symptom_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  symptom_text TEXT NOT NULL,
  severity INTEGER NOT NULL CHECK (severity >= 1 AND severity <= 5),
  logged_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 7. AI recommendations
CREATE TABLE public.ai_recommendations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  recommendation_type TEXT NOT NULL,
  explanation TEXT NOT NULL,
  confidence_score NUMERIC(3,2) CHECK (confidence_score >= 0 AND confidence_score <= 1),
  risk_level TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 8. Alerts
CREATE TABLE public.alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  doctor_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  severity public.alert_severity NOT NULL DEFAULT 'low',
  status public.alert_status NOT NULL DEFAULT 'active',
  message TEXT NOT NULL,
  resolved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 9. Chat messages
CREATE TABLE public.chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  conversation_id UUID NOT NULL DEFAULT gen_random_uuid(),
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 10. Audit logs
CREATE TABLE public.audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id UUID,
  details JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 11. Indexes
CREATE INDEX idx_profiles_user_id ON public.profiles(user_id);
CREATE INDEX idx_user_roles_user_id ON public.user_roles(user_id);
CREATE INDEX idx_medications_user_id ON public.medications(user_id);
CREATE INDEX idx_medication_logs_user_id ON public.medication_logs(user_id);
CREATE INDEX idx_medication_logs_medication_id ON public.medication_logs(medication_id);
CREATE INDEX idx_medication_logs_logged_at ON public.medication_logs(logged_at);
CREATE INDEX idx_symptom_logs_user_id ON public.symptom_logs(user_id);
CREATE INDEX idx_symptom_logs_logged_at ON public.symptom_logs(logged_at);
CREATE INDEX idx_ai_recommendations_patient_id ON public.ai_recommendations(patient_id);
CREATE INDEX idx_alerts_patient_id ON public.alerts(patient_id);
CREATE INDEX idx_alerts_doctor_id ON public.alerts(doctor_id);
CREATE INDEX idx_alerts_status ON public.alerts(status);
CREATE INDEX idx_chat_messages_user_id ON public.chat_messages(user_id);
CREATE INDEX idx_chat_messages_conversation_id ON public.chat_messages(conversation_id);
CREATE INDEX idx_audit_logs_user_id ON public.audit_logs(user_id);
CREATE INDEX idx_audit_logs_created_at ON public.audit_logs(created_at);

-- 12. has_role() security definer function
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- 13. Updated_at trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Updated_at triggers
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_medications_updated_at BEFORE UPDATE ON public.medications FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_alerts_updated_at BEFORE UPDATE ON public.alerts FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 14. Auto-create profile + assign patient role on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, first_name, last_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'first_name', ''), COALESCE(NEW.raw_user_meta_data->>'last_name', ''));
  
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'patient');
  
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 15. Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.medications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.medication_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.symptom_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_recommendations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- 16. RLS Policies

-- profiles
CREATE POLICY "Users can read own profile" ON public.profiles FOR SELECT TO authenticated
  USING (user_id = auth.uid() OR public.has_role(auth.uid(), 'doctor') OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE TO authenticated
  USING (user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Profile created via trigger" ON public.profiles FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid());

-- user_roles (admin-only management, users can read own)
CREATE POLICY "Users can read own roles" ON public.user_roles FOR SELECT TO authenticated
  USING (user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins manage roles" ON public.user_roles FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins update roles" ON public.user_roles FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins delete roles" ON public.user_roles FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- medications
CREATE POLICY "Patients read own medications" ON public.medications FOR SELECT TO authenticated
  USING (user_id = auth.uid() OR public.has_role(auth.uid(), 'doctor') OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Patients create own medications" ON public.medications FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Patients update own medications" ON public.medications FOR UPDATE TO authenticated
  USING (user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Patients delete own medications" ON public.medications FOR DELETE TO authenticated
  USING (user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'));

-- medication_logs
CREATE POLICY "Patients read own med logs" ON public.medication_logs FOR SELECT TO authenticated
  USING (user_id = auth.uid() OR public.has_role(auth.uid(), 'doctor') OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Patients create own med logs" ON public.medication_logs FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Patients update own med logs" ON public.medication_logs FOR UPDATE TO authenticated
  USING (user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Patients delete own med logs" ON public.medication_logs FOR DELETE TO authenticated
  USING (user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'));

-- symptom_logs
CREATE POLICY "Patients read own symptoms" ON public.symptom_logs FOR SELECT TO authenticated
  USING (user_id = auth.uid() OR public.has_role(auth.uid(), 'doctor') OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Patients create own symptoms" ON public.symptom_logs FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Patients update own symptoms" ON public.symptom_logs FOR UPDATE TO authenticated
  USING (user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Patients delete own symptoms" ON public.symptom_logs FOR DELETE TO authenticated
  USING (user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'));

-- ai_recommendations
CREATE POLICY "Read own recommendations" ON public.ai_recommendations FOR SELECT TO authenticated
  USING (patient_id = auth.uid() OR public.has_role(auth.uid(), 'doctor') OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "System creates recommendations" ON public.ai_recommendations FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins manage recommendations" ON public.ai_recommendations FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins delete recommendations" ON public.ai_recommendations FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- alerts
CREATE POLICY "Read relevant alerts" ON public.alerts FOR SELECT TO authenticated
  USING (patient_id = auth.uid() OR doctor_id = auth.uid() OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "System creates alerts" ON public.alerts FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Doctors update assigned alerts" ON public.alerts FOR UPDATE TO authenticated
  USING (doctor_id = auth.uid() OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins delete alerts" ON public.alerts FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- chat_messages
CREATE POLICY "Users read own chats" ON public.chat_messages FOR SELECT TO authenticated
  USING (user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Users create own chats" ON public.chat_messages FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users update own chats" ON public.chat_messages FOR UPDATE TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users delete own chats" ON public.chat_messages FOR DELETE TO authenticated
  USING (user_id = auth.uid());

-- audit_logs
CREATE POLICY "Any authenticated user can insert audit" ON public.audit_logs FOR INSERT TO authenticated
  WITH CHECK (true);

CREATE POLICY "Admins read audit logs" ON public.audit_logs FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));
