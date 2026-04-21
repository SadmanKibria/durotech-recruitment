-- Migration: Add arrival_date, company_name, and status_change_date columns to applications table
-- This adds tracking for applicant arrival dates, assigned companies, and status change history

-- Add arrival_date column
ALTER TABLE public.applications
ADD COLUMN IF NOT EXISTS arrival_date timestamp with time zone;

-- Add company_name column
ALTER TABLE public.applications
ADD COLUMN IF NOT EXISTS company_name text;

-- Add status_change_date column to track when status was last changed
ALTER TABLE public.applications
ADD COLUMN IF NOT EXISTS status_change_date timestamp with time zone;

-- Add index on arrival_date for queries
CREATE INDEX IF NOT EXISTS idx_applications_arrival_date ON public.applications(arrival_date);

-- Add index on company_name for queries
CREATE INDEX IF NOT EXISTS idx_applications_company_name ON public.applications(company_name);

-- Add index on status_change_date for queries
CREATE INDEX IF NOT EXISTS idx_applications_status_change_date ON public.applications(status_change_date);

-- Create a trigger function to automatically update status_change_date when status changes
CREATE OR REPLACE FUNCTION public.update_status_change_date()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status IS DISTINCT FROM OLD.status THEN
    NEW.status_change_date := NOW();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop trigger if it already exists
DROP TRIGGER IF EXISTS trigger_update_status_change_date ON public.applications;

-- Create trigger to automatically set status_change_date
CREATE TRIGGER trigger_update_status_change_date
BEFORE UPDATE ON public.applications
FOR EACH ROW
EXECUTE FUNCTION public.update_status_change_date();

-- Add comments for documentation
COMMENT ON COLUMN public.applications.arrival_date IS 'Date and time when the applicant arrives at their workplace/destination';
COMMENT ON COLUMN public.applications.company_name IS 'Name of the company the applicant is assigned to';
COMMENT ON COLUMN public.applications.status_change_date IS 'Date and time when the application status was last changed';
