
DROP POLICY "Any authenticated user can insert audit" ON public.audit_logs;
CREATE POLICY "Authenticated users insert own audit" ON public.audit_logs FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid());
