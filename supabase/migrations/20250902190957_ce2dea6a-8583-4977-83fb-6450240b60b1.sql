-- Create user roles system for RBAC
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

-- Create user_roles table
CREATE TABLE public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    role app_role NOT NULL DEFAULT 'user',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    created_by UUID,
    UNIQUE(user_id, role)
);

-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check user roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  );
$$;

-- Function to check if current user is admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT public.has_role(auth.uid(), 'admin');
$$;

-- RLS policies for user_roles table
CREATE POLICY "Admins can view all user roles" ON public.user_roles
  FOR SELECT USING (public.is_admin());

CREATE POLICY "Admins can create user roles" ON public.user_roles
  FOR INSERT WITH CHECK (public.is_admin() AND created_by = auth.uid());

CREATE POLICY "Admins can update user roles" ON public.user_roles
  FOR UPDATE USING (public.is_admin());

CREATE POLICY "Admins can delete user roles" ON public.user_roles
  FOR DELETE USING (public.is_admin());

-- Update API keys policies to admin-only
DROP POLICY IF EXISTS "Authenticated users can view api_keys" ON public.api_keys;
DROP POLICY IF EXISTS "Authenticated users can create api_keys" ON public.api_keys;
DROP POLICY IF EXISTS "Authenticated users can update api_keys" ON public.api_keys;
DROP POLICY IF EXISTS "Authenticated users can delete api_keys" ON public.api_keys;

CREATE POLICY "Admins can view api_keys" ON public.api_keys
  FOR SELECT USING (public.is_admin());

CREATE POLICY "Admins can create api_keys" ON public.api_keys
  FOR INSERT WITH CHECK (public.is_admin() AND created_by = auth.uid());

CREATE POLICY "Admins can update api_keys" ON public.api_keys
  FOR UPDATE USING (public.is_admin());

CREATE POLICY "Admins can delete api_keys" ON public.api_keys
  FOR DELETE USING (public.is_admin());

-- Update webhooks policies to admin-only
DROP POLICY IF EXISTS "Authenticated users can view webhooks" ON public.webhooks;
DROP POLICY IF EXISTS "Authenticated users can create webhooks" ON public.webhooks;
DROP POLICY IF EXISTS "Authenticated users can update webhooks" ON public.webhooks;
DROP POLICY IF EXISTS "Authenticated users can delete webhooks" ON public.webhooks;

CREATE POLICY "Admins can view webhooks" ON public.webhooks
  FOR SELECT USING (public.is_admin());

CREATE POLICY "Admins can create webhooks" ON public.webhooks
  FOR INSERT WITH CHECK (public.is_admin());

CREATE POLICY "Admins can update webhooks" ON public.webhooks
  FOR UPDATE USING (public.is_admin());

CREATE POLICY "Admins can delete webhooks" ON public.webhooks
  FOR DELETE USING (public.is_admin());

-- Also secure other admin-only tables
DROP POLICY IF EXISTS "Authenticated users can view alerts" ON public.alerts;
DROP POLICY IF EXISTS "Authenticated users can create alerts" ON public.alerts;
DROP POLICY IF EXISTS "Authenticated users can update alerts" ON public.alerts;
DROP POLICY IF EXISTS "Authenticated users can delete alerts" ON public.alerts;

CREATE POLICY "Admins can view alerts" ON public.alerts
  FOR SELECT USING (public.is_admin());

CREATE POLICY "Admins can create alerts" ON public.alerts
  FOR INSERT WITH CHECK (public.is_admin());

CREATE POLICY "Admins can update alerts" ON public.alerts
  FOR UPDATE USING (public.is_admin());

CREATE POLICY "Admins can delete alerts" ON public.alerts
  FOR DELETE USING (public.is_admin());

-- Secure other admin tables
DROP POLICY IF EXISTS "Authenticated users can view devices" ON public.devices;
DROP POLICY IF EXISTS "Authenticated users can create devices" ON public.devices;
DROP POLICY IF EXISTS "Authenticated users can update devices" ON public.devices;
DROP POLICY IF EXISTS "Authenticated users can delete devices" ON public.devices;

CREATE POLICY "Admins can view devices" ON public.devices
  FOR SELECT USING (public.is_admin());

CREATE POLICY "Admins can create devices" ON public.devices
  FOR INSERT WITH CHECK (public.is_admin());

CREATE POLICY "Admins can update devices" ON public.devices
  FOR UPDATE USING (public.is_admin());

CREATE POLICY "Admins can delete devices" ON public.devices
  FOR DELETE USING (public.is_admin());

DROP POLICY IF EXISTS "Authenticated users can view device_logs" ON public.device_logs;
DROP POLICY IF EXISTS "Authenticated users can create device_logs" ON public.device_logs;
DROP POLICY IF EXISTS "Authenticated users can update device_logs" ON public.device_logs;
DROP POLICY IF EXISTS "Authenticated users can delete device_logs" ON public.device_logs;

CREATE POLICY "Admins can view device_logs" ON public.device_logs
  FOR SELECT USING (public.is_admin());

CREATE POLICY "Admins can create device_logs" ON public.device_logs
  FOR INSERT WITH CHECK (public.is_admin());

CREATE POLICY "Admins can update device_logs" ON public.device_logs
  FOR UPDATE USING (public.is_admin());

CREATE POLICY "Admins can delete device_logs" ON public.device_logs
  FOR DELETE USING (public.is_admin());

DROP POLICY IF EXISTS "Authenticated users can view entries" ON public.entries;
DROP POLICY IF EXISTS "Authenticated users can create entries" ON public.entries;
DROP POLICY IF EXISTS "Authenticated users can update entries" ON public.entries;
DROP POLICY IF EXISTS "Authenticated users can delete entries" ON public.entries;

CREATE POLICY "Admins can view entries" ON public.entries
  FOR SELECT USING (public.is_admin());

CREATE POLICY "Admins can create entries" ON public.entries
  FOR INSERT WITH CHECK (public.is_admin());

CREATE POLICY "Admins can update entries" ON public.entries
  FOR UPDATE USING (public.is_admin());

CREATE POLICY "Admins can delete entries" ON public.entries
  FOR DELETE USING (public.is_admin());

DROP POLICY IF EXISTS "Authenticated users can view fee_rules" ON public.fee_rules;
DROP POLICY IF EXISTS "Authenticated users can create fee_rules" ON public.fee_rules;
DROP POLICY IF EXISTS "Authenticated users can update fee_rules" ON public.fee_rules;
DROP POLICY IF EXISTS "Authenticated users can delete fee_rules" ON public.fee_rules;

CREATE POLICY "Admins can view fee_rules" ON public.fee_rules
  FOR SELECT USING (public.is_admin());

CREATE POLICY "Admins can create fee_rules" ON public.fee_rules
  FOR INSERT WITH CHECK (public.is_admin());

CREATE POLICY "Admins can update fee_rules" ON public.fee_rules
  FOR UPDATE USING (public.is_admin());

CREATE POLICY "Admins can delete fee_rules" ON public.fee_rules
  FOR DELETE USING (public.is_admin());

DROP POLICY IF EXISTS "Authenticated users can view reconciliation_files" ON public.reconciliation_files;
DROP POLICY IF EXISTS "Authenticated users can create reconciliation_files" ON public.reconciliation_files;
DROP POLICY IF EXISTS "Authenticated users can update reconciliation_files" ON public.reconciliation_files;
DROP POLICY IF EXISTS "Authenticated users can delete reconciliation_files" ON public.reconciliation_files;

CREATE POLICY "Admins can view reconciliation_files" ON public.reconciliation_files
  FOR SELECT USING (public.is_admin());

CREATE POLICY "Admins can create reconciliation_files" ON public.reconciliation_files
  FOR INSERT WITH CHECK (public.is_admin());

CREATE POLICY "Admins can update reconciliation_files" ON public.reconciliation_files
  FOR UPDATE USING (public.is_admin());

CREATE POLICY "Admins can delete reconciliation_files" ON public.reconciliation_files
  FOR DELETE USING (public.is_admin());