# Durotech Recruitment Website

International recruitment agency website connecting talented professionals with top employers across Europe, Middle East, and Asia.

## 🌟 Features

- **Job Listings**: Browse international job opportunities across 6 key industries
- **Application System**: Complete application workflow with CV upload and tracking
- **Admin Dashboard**: Comprehensive management system with analytics and charts
- **Email Notifications**: Automated emails powered by Maileroo
- **Talent Pool**: Speculative CV submissions for future opportunities
- **Study Abroad**: Information and application for international study programs

## 🚀 Tech Stack

- **Framework**: Next.js 16 with React 19
- **Database**: Supabase (PostgreSQL)
- **Storage**: Vercel Blob
- **Email**: Maileroo
- **Analytics**: Vercel Analytics
- **Styling**: Tailwind CSS v4
- **Charts**: Recharts
- **UI Components**: Radix UI + shadcn/ui

## 📋 Environment Variables

Required environment variables (set in Vercel/Netlify dashboard or `.env.local`):

\`\`\`env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Vercel Blob
BLOB_READ_WRITE_TOKEN=your_blob_token

# Maileroo Email
MAILEROO_API_KEY=your_maileroo_api_key
FROM_EMAIL=noreply@durotech.co.uk
ADMIN_EMAIL=admin@durotech.co.uk

# Site Configuration
NEXT_PUBLIC_SITE_URL=https://durotech.co.uk
\`\`\`

## 🛠️ Local Development

1. Clone the repository:
\`\`\`bash
git clone <your-repo-url>
cd durotech-recruitment
\`\`\`

2. Install dependencies:
\`\`\`bash
npm install
\`\`\`

3. Create `.env.local` and add your environment variables

4. Run the development server:
\`\`\`bash
npm run dev
\`\`\`

5. Open [http://localhost:3000](http://localhost:3000)

## 📦 Database Setup

The application requires the following Supabase tables:
- `jobs` - Job listings
- `applications` - Job applications
- `application_notes` - Admin notes and logs
- `application_payments` - Payment tracking
- `speculative_cvs` - Talent pool submissions
- `companies` - Client companies

Run the SQL scripts in the `scripts` folder to set up the database schema.

## 🔐 Admin Access

Default admin credentials:
- Email: admin@durotech.co.uk
- Password: DurotechAdmin2024!

**⚠️ Change these credentials immediately in production!**

Access the admin panel at: `/admin`

## 🌐 Deployment

### Netlify (Recommended)

1. Connect your repository to Netlify
2. Add environment variables in Netlify dashboard
3. Deploy using the included `netlify.toml` configuration

### Vercel

1. Connect your repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy (automatic with Git integration)

## 📧 Email Templates

Professional HTML email templates included for:
- Application confirmations
- Admin notifications
- Custom messages from admin panel

## 🎨 Branding

- Primary Color: `#1E3A5F` (Navy Blue)
- Accent Color: `#F5C547` (Gold)
- Domain: https://durotech.co.uk

## 👨‍💼 Founder

**Sadman Kibria**
- Role: Founder & Director
- Company: Durotech Recruitment Ltd
- Location: London, United Kingdom

## 📄 License

Proprietary - All rights reserved by Durotech Recruitment Ltd

## 🆘 Support

For technical support or questions:
- Email: info@durotech.co.uk
- Phone: +44 20 1234 5678
- Address: 123 Business Street, London, EC1A 1BB, UK

---

Built with ❤️ using [v0.app](https://v0.app) by Vercel
