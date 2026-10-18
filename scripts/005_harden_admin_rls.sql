alter table public.application_payments enable row level security;

drop policy if exists "Authenticated staff manage application payments" on public.application_payments;
create policy "Authenticated staff manage application payments"
on public.application_payments for all to authenticated
using (true) with check (true);

drop policy if exists "Users read their own admin profile" on public.admin_users;
create policy "Users read their own admin profile"
on public.admin_users for select to authenticated
using (id = (select auth.uid()));

drop policy if exists "Allow authenticated users full access to jobs" on public.jobs;
drop policy if exists "Allow authenticated users full access to applications" on public.applications;
