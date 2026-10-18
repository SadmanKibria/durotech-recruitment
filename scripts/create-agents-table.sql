-- Migration: Create agents table and agent-related columns
-- This enables tracking of recruitment agents who manage talent placements

-- Create agents table
CREATE TABLE IF NOT EXISTS public.agents (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name character varying NOT NULL,
  email character varying NOT NULL UNIQUE,
  phone character varying,
  address text,
  commission_rate numeric DEFAULT 0,
  status character varying DEFAULT 'active',
  admin_notes text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Add agent_id column to applications table
ALTER TABLE public.applications
ADD COLUMN IF NOT EXISTS agent_id uuid;

-- Add foreign key constraint for agent_id
ALTER TABLE public.applications
ADD CONSTRAINT fk_applications_agent_id 
FOREIGN KEY (agent_id) REFERENCES public.agents(id) ON DELETE SET NULL;

-- Create index on agent_id for queries
CREATE INDEX IF NOT EXISTS idx_applications_agent_id ON public.applications(agent_id);

-- Create agent_commissions table to track payments to agents
CREATE TABLE IF NOT EXISTS public.agent_commissions (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  agent_id uuid NOT NULL REFERENCES public.agents(id) ON DELETE CASCADE,
  application_id uuid NOT NULL REFERENCES public.applications(id) ON DELETE CASCADE,
  commission_amount numeric NOT NULL,
  currency character varying DEFAULT 'GBP',
  status character varying DEFAULT 'pending',
  paid_date date,
  description text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Create index on agent_id for agent_commissions
CREATE INDEX IF NOT EXISTS idx_agent_commissions_agent_id ON public.agent_commissions(agent_id);

-- Create index on application_id for agent_commissions
CREATE INDEX IF NOT EXISTS idx_agent_commissions_application_id ON public.agent_commissions(application_id);

-- Enable Row Level Security on agents table
ALTER TABLE public.agents ENABLE ROW LEVEL SECURITY;

-- Create RLS policy for authenticated users to have full access to agents
CREATE POLICY "Allow authenticated full access to agents" 
ON public.agents 
FOR ALL 
USING (auth.role() = 'authenticated')
WITH CHECK (auth.role() = 'authenticated');

-- Enable Row Level Security on agent_commissions table
ALTER TABLE public.agent_commissions ENABLE ROW LEVEL SECURITY;

-- Create RLS policy for authenticated users to have full access to agent_commissions
CREATE POLICY "Allow authenticated full access to agent_commissions" 
ON public.agent_commissions 
FOR ALL 
USING (auth.role() = 'authenticated')
WITH CHECK (auth.role() = 'authenticated');

-- Add comments for documentation
COMMENT ON TABLE public.agents IS 'Stores information about recruitment agents who recruit talent';
COMMENT ON COLUMN public.agents.commission_rate IS 'Commission percentage for this agent (e.g., 10 for 10%)';
COMMENT ON COLUMN public.agents.status IS 'Agent status: active, inactive, or suspended';
COMMENT ON TABLE public.agent_commissions IS 'Tracks commission payments to agents for successful placements';
COMMENT ON COLUMN public.agent_commissions.status IS 'Commission status: pending, paid, or overdue';
