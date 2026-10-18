# Durotech Group

An independent recruitment operations platform and public website built by **Sadman Kibria** for Durotech Group.

The project combines international job listings, candidate applications and a protected staff workspace for managing candidates, employers, agents, finance, reporting and operational activity.

## Technology

- Next.js 16, React 19 and TypeScript
- Tailwind CSS and accessible UI components
- Supabase PostgreSQL and authentication
- Netlify Next.js Runtime
- Transactional email through a verified email provider

## Main areas

- `/` — Durotech Group public website
- `/jobs` — searchable live vacancies
- `/portal` — integrated staff operations portal
- `/portal/login` — protected staff access
- `/admin` — legacy content administration during consolidation

## Development

```bash
pnpm install
pnpm dev
```

Create `.env.local` with the required Supabase, storage and email credentials. Never commit credentials.

## Quality checks

```bash
pnpm lint
pnpm exec tsc --noEmit
pnpm build
```

## Author

Designed and developed by [Sadman Kibria](https://github.com/SadmanKibria).
