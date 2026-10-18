-- Migration: Add tracking fields to applications table
-- This adds the missing columns for visa status, agreed amount, arrival date, company name, and status tracking

-- Add visa_status column if it doesn't exist
ALTER TABLE applications 
ADD COLUMN IF NOT EXISTS visa_status VARCHAR(100);

-- Add total_agreed_amount column if it doesn't exist  
ALTER TABLE applications 
ADD COLUMN IF NOT EXISTS total_agreed_amount NUMERIC(10,2);

-- Add arrival_date column if it doesn't exist
ALTER TABLE applications 
ADD COLUMN IF NOT EXISTS arrival_date DATE;

-- Add assigned_company column if it doesn't exist
ALTER TABLE applications 
ADD COLUMN IF NOT EXISTS assigned_company VARCHAR(255);

-- Add status_changed_at column if it doesn't exist
ALTER TABLE applications 
ADD COLUMN IF NOT EXISTS status_changed_at TIMESTAMP WITH TIME ZONE;

-- Add agent_id column for agent assignment if it doesn't exist
ALTER TABLE applications 
ADD COLUMN IF NOT EXISTS agent_id UUID REFERENCES agents(id);

-- Create agents table if it doesn't exist
CREATE TABLE IF NOT EXISTS agents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255),
  phone VARCHAR(50),
  company VARCHAR(255),
  commission_rate NUMERIC(5,2) DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on agents table
ALTER TABLE agents ENABLE ROW LEVEL SECURITY;

-- Create policy for authenticated users
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'agents' AND policyname = 'Allow authenticated full access to agents'
  ) THEN
    CREATE POLICY "Allow authenticated full access to agents" ON agents
      FOR ALL TO authenticated USING (true) WITH CHECK (true);
  END IF;
END $$;

-- Create trigger to update status_changed_at when status changes
CREATE OR REPLACE FUNCTION update_status_changed_at()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.status IS DISTINCT FROM NEW.status THEN
    NEW.status_changed_at = NOW();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop trigger if exists and recreate
DROP TRIGGER IF EXISTS trigger_update_status_changed_at ON applications;

CREATE TRIGGER trigger_update_status_changed_at
  BEFORE UPDATE ON applications
  FOR EACH ROW
  EXECUTE FUNCTION update_status_changed_at();

-- Add comments for documentation
COMMENT ON COLUMN applications.visa_status IS 'Current visa processing status';
COMMENT ON COLUMN applications.total_agreed_amount IS 'Total agreed payment amount in GBP';
COMMENT ON COLUMN applications.arrival_date IS 'Expected or actual arrival date at workplace';
COMMENT ON COLUMN applications.assigned_company IS 'Company the applicant is assigned to work with';
COMMENT ON COLUMN applications.status_changed_at IS 'Timestamp when application status was last changed';
COMMENT ON COLUMN applications.agent_id IS 'Reference to the agent handling this application';
