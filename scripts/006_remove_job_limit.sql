-- Job capacity is controlled by the hosting/database plan, not an application rule.
-- This intentionally removes the old 50-listing limit without changing any jobs.
drop trigger if exists jobs_max_50_before_insert on public.jobs;
drop function if exists public.enforce_max_50_jobs();
