-- Migration: Create additional admin accounts with restricted permissions
-- Creates 2 new admin accounts (yash@durotech.co.uk, kazi@durotech.co.uk) with no delete permissions
-- Full delete access remains with admin@durotech.com

-- Create admin_users table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.admin_users (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  email character varying NOT NULL UNIQUE,
  full_name character varying,
  role character varying DEFAULT 'editor',
  can_delete boolean DEFAULT false,
  is_active boolean DEFAULT true,
  last_login timestamp with time zone,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Insert admin users
-- Note: These should be synced with Supabase Auth users
-- The passwords should be set through Supabase Auth admin API or reset link

-- Full access admin
INSERT INTO public.admin_users (email, full_name, role, can_delete, is_active)
VALUES ('admin@durotech.co.uk', 'Admin User', 'admin', true, true)
ON CONFLICT (email) DO UPDATE SET 
  role = 'admin',
  can_delete = true,
  is_active = true;

-- Restricted admin - Yash
INSERT INTO public.admin_users (email, full_name, role, can_delete, is_active)
VALUES ('yash@durotech.co.uk', 'Yash', 'editor', false, true)
ON CONFLICT (email) DO UPDATE SET 
  role = 'editor',
  can_delete = false,
  is_active = true;

-- Restricted admin - Kazi
INSERT INTO public.admin_users (email, full_name, role, can_delete, is_active)
VALUES ('kazi@durotech.co.uk', 'Kazi', 'editor', false, true)
ON CONFLICT (email) DO UPDATE SET 
  role = 'editor',
  can_delete = false,
  is_active = true;

-- Enable Row Level Security on admin_users table
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- Create RLS policy for authenticated users to read admin_users
CREATE POLICY IF NOT EXISTS "Allow authenticated users to read admin_users"
ON public.admin_users
FOR SELECT
USING (auth.role() = 'authenticated');

-- Create RLS policy for admins to update admin_users
CREATE POLICY IF NOT EXISTS "Allow admins to update admin_users"
ON public.admin_users
FOR UPDATE
USING (
  auth.role() = 'authenticated' AND
  (
    SELECT can_delete FROM public.admin_users 
    WHERE email = auth.jwt() ->> 'email' LIMIT 1
  ) = true
)
WITH CHECK (
  auth.role() = 'authenticated' AND
  (
    SELECT can_delete FROM public.admin_users 
    WHERE email = auth.jwt() ->> 'email' LIMIT 1
  ) = true
);

-- Note: In your application code, you should check the can_delete flag before allowing delete operations
-- Example: Check admin_users table for can_delete = true before executing DELETE queries

-- Add indexes
CREATE INDEX IF NOT EXISTS idx_admin_users_email ON public.admin_users(email);
CREATE INDEX IF NOT EXISTS idx_admin_users_role ON public.admin_users(role);
CREATE INDEX IF NOT EXISTS idx_admin_users_is_active ON public.admin_users(is_active);

-- Add comments
COMMENT ON TABLE public.admin_users IS 'Stores admin user information and permissions';
COMMENT ON COLUMN public.admin_users.role IS 'User role: admin (full access) or editor (limited access)';
COMMENT ON COLUMN public.admin_users.can_delete IS 'Whether this admin can delete records (true for admin role, false for editor role)';
