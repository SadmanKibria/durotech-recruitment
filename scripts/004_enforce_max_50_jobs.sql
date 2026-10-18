create or replace function public.enforce_max_50_jobs()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  perform pg_advisory_xact_lock(50814721);
  if (select count(*) from public.jobs) >= 50 then
    raise exception using errcode = '23514', message = 'Durotech supports a maximum of 50 job listings.';
  end if;
  return new;
end;
$$;

drop trigger if exists jobs_max_50_before_insert on public.jobs;
create trigger jobs_max_50_before_insert
before insert on public.jobs
for each row execute function public.enforce_max_50_jobs();
