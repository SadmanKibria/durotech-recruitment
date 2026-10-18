# Durotech infrastructure

## Current production services

- `durotech-recruitment` (`kligsixyarentnusnouz`) stores public jobs, applications and the original website-admin data.
- `durotech-portal-production` (`guddhvyyvhkmrxlmfwcm`) stores operational staff, agents, employers, candidates, transactions, activity and portal settings.
- Vercel serves the public website and integrated staff portal.
- Maileroo sends transactional and staff-composed email.

These Supabase projects currently contain different schemas, so neither project is a safe duplicate to delete. Existing test data must remain in place until a tested migration and rollback export exist.

## Recommended delivery architecture

Use one London-region Supabase project for the website and operations portal. Supabase is suitable for this workload because Postgres, Auth, row-level security and file storage cover the product without a separate backend platform. For a live client system, use a paid production plan so inactivity pausing and the lack of free-plan backups do not interrupt operations.

## Consolidation checklist

1. Export both databases and record row counts for every table.
2. Create a merged schema in the London-region project using versioned migrations.
3. Copy public jobs and applications with their existing IDs and timestamps.
4. Update Vercel preview environment variables to the merged project.
5. Test public applications, portal authentication, candidates, finance, reports, jobs and email in preview.
6. Freeze writes briefly, copy the final delta and switch production variables.
7. Keep the old project read-only during an agreed rollback window.
8. Delete the old project only after written approval and a verified backup.

## Email deliverability

The application uses Maileroo and supports primary and CC recipients. Before client delivery, verify Maileroo's SPF and DKIM records and add a DMARC policy for `durotech.co.uk`. No email provider can guarantee inbox placement, but authenticated DNS, a verified sender domain and responsible sending are the required baseline.
