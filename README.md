# Durotech Recruitment

The production website and staff operations portal for [Durotech Recruitment](https://www.durotech.co.uk). The public experience covers international vacancies, candidate applications, CV submissions, training and study-abroad services. The protected portal supports candidate, employer, agent, finance and workflow management.

## Stack

- Next.js 16 and React 19
- TypeScript and Tailwind CSS 4
- Supabase Auth and PostgreSQL
- Vercel Blob for CV storage
- Maileroo for transactional and staff-composed email
- Vercel Analytics

## Main routes

- `/` — public marketing site
- `/jobs` — live vacancies and filters
- `/submit-cv` — speculative candidate submissions
- `/admin` — public-site content and application management
- `/portal` — protected recruitment operations portal
- `/portal/login` — staff sign-in

## Local development

```bash
pnpm install
pnpm dev
```

Copy the required values into `.env.local`. Never commit credentials.

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
BLOB_READ_WRITE_TOKEN=
MAILEROO_API_KEY=
FROM_EMAIL=noreply@durotech.co.uk
ADMIN_EMAIL=info@durotech.co.uk
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

The integrated portal currently uses the existing protected portal backend through server-side proxy routes. Set `PORTAL_BACKEND_URL` only when using a different portal service origin.

## Quality checks

```bash
pnpm lint
pnpm exec tsc --noEmit
pnpm build
```

Database changes are recorded in `scripts/`. Job creation is capped at 50 listings by a transaction-safe PostgreSQL trigger.
