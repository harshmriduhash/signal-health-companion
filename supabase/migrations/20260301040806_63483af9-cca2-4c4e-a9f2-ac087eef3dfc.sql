
-- Fix all RLS policies: change from RESTRICTIVE to PERMISSIVE
-- Drop and recreate all policies as PERMISSIVE

-- profiles
DROP POLICY IF EXISTS "Profile created via trigger" ON public.profiles;
DROP POLICY IF EXISTS "Users can read own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;

CREATE POLICY "Profile created via trigger" ON public.profiles FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY "Users can read own profile" ON public.profiles FOR SELECT TO authenticated USING ((user_id = auth.uid()) OR has_role(auth.uid(), 'doctor') OR has_role(auth.uid(), 'admin'));
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE TO authenticated USING ((user_id = auth.uid()) OR has_role(auth.uid(), 'admin'));

-- user_roles
DROP POLICY IF EXISTS "Users can read own roles" ON public.user_roles;
DROP POLICY IF EXISTS "Admins manage roles" ON public.user_roles;
DROP POLICY IF EXISTS "Admins update roles" ON public.user_roles;
DROP POLICY IF EXISTS "Admins delete roles" ON public.user_roles;

CREATE POLICY "Users can read own roles" ON public.user_roles FOR SELECT TO authenticated USING ((user_id = auth.uid()) OR has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins manage roles" ON public.user_roles FOR INSERT TO authenticated WITH CHECK (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins update roles" ON public.user_roles FOR UPDATE TO authenticated USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins delete roles" ON public.user_roles FOR DELETE TO authenticated USING (has_role(auth.uid(), 'admin'));

-- medications
DROP POLICY IF EXISTS "Patients create own medications" ON public.medications;
DROP POLICY IF EXISTS "Patients read own medications" ON public.medications;
DROP POLICY IF EXISTS "Patients update own medications" ON public.medications;
DROP POLICY IF EXISTS "Patients delete own medications" ON public.medications;

CREATE POLICY "Patients create own medications" ON public.medications FOR INSERT TO authenticated WITH CHECK ((user_id = auth.uid()) OR has_role(auth.uid(), 'admin'));
CREATE POLICY "Patients read own medications" ON public.medications FOR SELECT TO authenticated USING ((user_id = auth.uid()) OR has_role(auth.uid(), 'doctor') OR has_role(auth.uid(), 'admin'));
CREATE POLICY "Patients update own medications" ON public.medications FOR UPDATE TO authenticated USING ((user_id = auth.uid()) OR has_role(auth.uid(), 'admin'));
CREATE POLICY "Patients delete own medications" ON public.medications FOR DELETE TO authenticated USING ((user_id = auth.uid()) OR has_role(auth.uid(), 'admin'));

-- medication_logs
DROP POLICY IF EXISTS "Patients create own med logs" ON public.medication_logs;
DROP POLICY IF EXISTS "Patients read own med logs" ON public.medication_logs;
DROP POLICY IF EXISTS "Patients update own med logs" ON public.medication_logs;
DROP POLICY IF EXISTS "Patients delete own med logs" ON public.medication_logs;

CREATE POLICY "Patients create own med logs" ON public.medication_logs FOR INSERT TO authenticated WITH CHECK ((user_id = auth.uid()) OR has_role(auth.uid(), 'admin'));
CREATE POLICY "Patients read own med logs" ON public.medication_logs FOR SELECT TO authenticated USING ((user_id = auth.uid()) OR has_role(auth.uid(), 'doctor') OR has_role(auth.uid(), 'admin'));
CREATE POLICY "Patients update own med logs" ON public.medication_logs FOR UPDATE TO authenticated USING ((user_id = auth.uid()) OR has_role(auth.uid(), 'admin'));
CREATE POLICY "Patients delete own med logs" ON public.medication_logs FOR DELETE TO authenticated USING ((user_id = auth.uid()) OR has_role(auth.uid(), 'admin'));

-- symptom_logs
DROP POLICY IF EXISTS "Patients create own symptoms" ON public.symptom_logs;
DROP POLICY IF EXISTS "Patients read own symptoms" ON public.symptom_logs;
DROP POLICY IF EXISTS "Patients update own symptoms" ON public.symptom_logs;
DROP POLICY IF EXISTS "Patients delete own symptoms" ON public.symptom_logs;

CREATE POLICY "Patients create own symptoms" ON public.symptom_logs FOR INSERT TO authenticated WITH CHECK ((user_id = auth.uid()) OR has_role(auth.uid(), 'admin'));
CREATE POLICY "Patients read own symptoms" ON public.symptom_logs FOR SELECT TO authenticated USING ((user_id = auth.uid()) OR has_role(auth.uid(), 'doctor') OR has_role(auth.uid(), 'admin'));
CREATE POLICY "Patients update own symptoms" ON public.symptom_logs FOR UPDATE TO authenticated USING ((user_id = auth.uid()) OR has_role(auth.uid(), 'admin'));
CREATE POLICY "Patients delete own symptoms" ON public.symptom_logs FOR DELETE TO authenticated USING ((user_id = auth.uid()) OR has_role(auth.uid(), 'admin'));

-- ai_recommendations
DROP POLICY IF EXISTS "Read own recommendations" ON public.ai_recommendations;
DROP POLICY IF EXISTS "System creates recommendations" ON public.ai_recommendations;
DROP POLICY IF EXISTS "Admins manage recommendations" ON public.ai_recommendations;
DROP POLICY IF EXISTS "Admins delete recommendations" ON public.ai_recommendations;

CREATE POLICY "Read own recommendations" ON public.ai_recommendations FOR SELECT TO authenticated USING ((patient_id = auth.uid()) OR has_role(auth.uid(), 'doctor') OR has_role(auth.uid(), 'admin'));
CREATE POLICY "System creates recommendations" ON public.ai_recommendations FOR INSERT TO authenticated WITH CHECK (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins manage recommendations" ON public.ai_recommendations FOR UPDATE TO authenticated USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins delete recommendations" ON public.ai_recommendations FOR DELETE TO authenticated USING (has_role(auth.uid(), 'admin'));

-- alerts
DROP POLICY IF EXISTS "Read relevant alerts" ON public.alerts;
DROP POLICY IF EXISTS "System creates alerts" ON public.alerts;
DROP POLICY IF EXISTS "Doctors update assigned alerts" ON public.alerts;
DROP POLICY IF EXISTS "Admins delete alerts" ON public.alerts;

CREATE POLICY "Read relevant alerts" ON public.alerts FOR SELECT TO authenticated USING ((patient_id = auth.uid()) OR (doctor_id = auth.uid()) OR has_role(auth.uid(), 'doctor') OR has_role(auth.uid(), 'admin'));
CREATE POLICY "System creates alerts" ON public.alerts FOR INSERT TO authenticated WITH CHECK (has_role(auth.uid(), 'admin'));
CREATE POLICY "Doctors update alerts" ON public.alerts FOR UPDATE TO authenticated USING ((doctor_id = auth.uid()) OR has_role(auth.uid(), 'doctor') OR has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins delete alerts" ON public.alerts FOR DELETE TO authenticated USING (has_role(auth.uid(), 'admin'));

-- chat_messages
DROP POLICY IF EXISTS "Users read own chats" ON public.chat_messages;
DROP POLICY IF EXISTS "Users create own chats" ON public.chat_messages;
DROP POLICY IF EXISTS "Users update own chats" ON public.chat_messages;
DROP POLICY IF EXISTS "Users delete own chats" ON public.chat_messages;

CREATE POLICY "Users read own chats" ON public.chat_messages FOR SELECT TO authenticated USING ((user_id = auth.uid()) OR has_role(auth.uid(), 'admin'));
CREATE POLICY "Users create own chats" ON public.chat_messages FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY "Users update own chats" ON public.chat_messages FOR UPDATE TO authenticated USING (user_id = auth.uid());
CREATE POLICY "Users delete own chats" ON public.chat_messages FOR DELETE TO authenticated USING (user_id = auth.uid());

-- audit_logs
DROP POLICY IF EXISTS "Admins read audit logs" ON public.audit_logs;
DROP POLICY IF EXISTS "Authenticated users insert own audit" ON public.audit_logs;

CREATE POLICY "Admins read audit logs" ON public.audit_logs FOR SELECT TO authenticated USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "Authenticated users insert own audit" ON public.audit_logs FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());

-- Allow new users to read their own roles immediately (needed for auth flow)
-- The trigger inserts the role, but the user needs to read it
-- Fix: allow users to read roles where user_id matches
DROP POLICY IF EXISTS "Users can read own roles" ON public.user_roles;
CREATE POLICY "Users can read own roles" ON public.user_roles FOR SELECT TO authenticated USING (user_id = auth.uid() OR has_role(auth.uid(), 'admin'));
