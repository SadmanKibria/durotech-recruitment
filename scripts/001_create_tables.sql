-- Create jobs table
CREATE TABLE IF NOT EXISTS jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  location TEXT NOT NULL,
  country TEXT NOT NULL,
  region TEXT NOT NULL CHECK (region IN ('europe', 'middle_east', 'asia')),
  industry TEXT NOT NULL CHECK (industry IN ('construction', 'food_production', 'health', 'engineering', 'warehousing')),
  employment_type TEXT NOT NULL CHECK (employment_type IN ('full_time', 'part_time', 'contract', 'temporary')),
  salary_range TEXT,
  requirements TEXT,
  benefits TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create applications table
CREATE TABLE IF NOT EXISTS applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id UUID NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  right_to_work TEXT NOT NULL,
  resume_url TEXT NOT NULL,
  resume_filename TEXT NOT NULL,
  cover_letter TEXT,
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'reviewed', 'shortlisted', 'rejected', 'hired')),
  admin_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_jobs_region ON jobs(region);
CREATE INDEX IF NOT EXISTS idx_jobs_industry ON jobs(industry);
CREATE INDEX IF NOT EXISTS idx_jobs_is_active ON jobs(is_active);
CREATE INDEX IF NOT EXISTS idx_applications_job_id ON applications(job_id);
CREATE INDEX IF NOT EXISTS idx_applications_status ON applications(status);
CREATE INDEX IF NOT EXISTS idx_applications_email ON applications(email);

-- Enable RLS on jobs table (public read, admin write)
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read active jobs
CREATE POLICY "Allow public to read active jobs" ON jobs 
  FOR SELECT USING (is_active = true);

-- Allow authenticated users (admins) to do everything
CREATE POLICY "Allow authenticated users full access to jobs" ON jobs 
  FOR ALL USING (auth.role() = 'authenticated');

-- Enable RLS on applications table
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert applications (for job applicants)
CREATE POLICY "Allow public to insert applications" ON applications 
  FOR INSERT WITH CHECK (true);

-- Allow authenticated users (admins) to do everything with applications
CREATE POLICY "Allow authenticated users full access to applications" ON applications 
  FOR ALL USING (auth.role() = 'authenticated');
