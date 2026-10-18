-- Add visa_status and total_agreed_amount fields to applications table
ALTER TABLE applications 
ADD COLUMN IF NOT EXISTS visa_status VARCHAR(100),
ADD COLUMN IF NOT EXISTS total_agreed_amount NUMERIC(10, 2);

-- Create admin_users table for role-based access
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255),
  role VARCHAR(20) NOT NULL CHECK (role IN ('superadmin', 'manager', 'admin')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Enable RLS on admin_users table
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Policy: Authenticated users can read their own admin record
CREATE POLICY "Users can read own admin record"
ON admin_users FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Policy: Superadmins can manage all admin users
CREATE POLICY "Superadmins can manage admin users"
ON admin_users FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM admin_users
    WHERE user_id = auth.uid() AND role = 'superadmin'
  )
);

-- Insert default admin users (update emails as needed)
INSERT INTO admin_users (email, name, role, user_id)
VALUES 
  ('admin@durotech.com', 'Super Admin', 'superadmin', (SELECT id FROM auth.users WHERE email = 'admin@durotech.com' LIMIT 1))
ON CONFLICT (email) DO NOTHING;

-- Add comment for documentation
COMMENT ON TABLE admin_users IS 'Admin users with role-based access: superadmin (full access), manager (no delete), admin (read/write only)';
COMMENT ON COLUMN applications.visa_status IS 'Current visa processing status';
COMMENT ON COLUMN applications.total_agreed_amount IS 'Total amount agreed to charge applicant';
