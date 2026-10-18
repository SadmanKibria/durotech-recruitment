# Durotech Recruitment Website

International recruitment agency website by **Sadman Kibria**, connecting talented professionals with top employers across Europe, Middle East, and Asia.

🌐 **Live Site**: [https://durotech.co.uk](https://durotech.co.uk)

## 🌟 Features

- **Job Listings**: Browse international job opportunities across 6 key industries
- **Application System**: Complete application workflow with CV upload and tracking
- **Admin Dashboard**: Comprehensive management with analytics, charts, and role-based access
- **Email Notifications**: Automated emails powered by Maileroo
- **Talent Pool**: Speculative CV submissions for future opportunities
- **Study Abroad**: Information and application for international study programs
- **Payment Tracking**: Full financial management with incoming/outgoing payments
- **Role-Based Access**: Superadmin, Manager, and Admin roles with different permissions

## 🚀 Tech Stack

- **Framework**: Next.js 16.0.10 with React 19.2
- **Database**: Supabase (PostgreSQL)
- **Storage**: Vercel Blob
- **Email**: Maileroo
- **Analytics**: Vercel Analytics
- **Styling**: Tailwind CSS v4
- **Charts**: Recharts
- **UI Components**: Radix UI + shadcn/ui

## 📋 Environment Variables

Required environment variables (set in Vercel/Netlify dashboard or `.env.local`):

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Database (Auto-configured with Supabase)
POSTGRES_URL=your_postgres_url
POSTGRES_PRISMA_URL=your_prisma_url
POSTGRES_URL_NON_POOLING=your_non_pooling_url
POSTGRES_USER=your_user
POSTGRES_PASSWORD=your_password
POSTGRES_DATABASE=your_database
POSTGRES_HOST=your_host

# Vercel Blob
BLOB_READ_WRITE_TOKEN=your_blob_token

# Maileroo Email
MAILEROO_API_KEY=your_maileroo_api_key
FROM_EMAIL=noreply@durotech.co.uk
ADMIN_EMAIL=admin@durotech.co.uk

# Site Configuration
NEXT_PUBLIC_SITE_URL=https://durotech.co.uk
```

## 🛠️ Local Development

1. Clone the repository:
```bash
git clone <your-repo-url>
cd durotech-recruitment
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env.local` and add your environment variables

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000)

## 📦 Database Setup

The application requires the following Supabase tables:
- `jobs` - Job listings
- `applications` - Job applications with visa status and agreed amounts
- `application_notes` - Admin notes and activity logs
- `application_payments` - Payment tracking (incoming/outgoing)
- `speculative_cvs` - Talent pool submissions
- `companies` - Client companies
- `admin_users` - Admin users with role-based access

### Initial Setup

1. Run the main schema in your Supabase SQL editor
2. Run `scripts/add-admin-roles-and-fields.sql` to add admin roles and new fields
3. Create admin users in Supabase Auth
4. Add admin users to `admin_users` table with appropriate roles

See `DEPLOYMENT.md` for detailed setup instructions.

## 🔐 Admin Access & Roles

### Admin Roles

**Superadmin**
- Full access (Create, Read, Update, Delete)
- Can delete applicants and financial records
- Can manage other admin users

**Manager**
- Create, Read, Update (No Delete)
- Cannot delete applicants or financial data
- Can access all financial information

**Admin**
- Read and Write only
- Cannot delete anything
- Limited financial access

### Default Admin Account
```
Email: admin@durotech.co.uk
Password: DurotechAdmin2024!
```

**⚠️ IMPORTANT:** Change the default password immediately after first login!

Access the admin panel at: `/admin`

## 🌐 Deployment

### Quick Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

### Netlify

1. Connect your repository to Netlify
2. Add environment variables in Netlify dashboard
3. Deploy using the included `netlify.toml` configuration

### Manual Deployment

See `DEPLOYMENT.md` for comprehensive deployment instructions including:
- Environment setup
- Database configuration
- Admin user creation
- Domain configuration
- Post-deployment checklist

## 📧 Email Templates

Professional HTML email templates included for:
- Application confirmations with next steps
- Admin notifications for new applications
- Custom messages from admin panel

## 🎨 Branding

- **Company**: Durotech Recruitment Ltd
- **Founder**: Sadman Kibria
- **Primary Color**: `#1E3A5F` (Navy Blue)
- **Accent Color**: `#F5C547` (Gold)
- **Domain**: https://durotech.co.uk
- **Logo**: `/durotech-logo.png`

## 📱 Features by Section

### Public Website
- Modern responsive design with animations
- Job search and filtering
- Online application with CV upload
- Study abroad information
- Contact forms
- SEO optimized

### Admin Dashboard
- Application management with status tracking
- Payment tracking (incoming/outgoing)
- CV upload/replacement
- Activity logs with notes and payments
- Company management (CRUD)
- Analytics charts (company distribution, industry breakdown, etc.)
- Talent pool management
- Role-based permissions

## 🔒 Security Features

- Row Level Security (RLS) on all tables
- Role-based access control
- Secure file uploads with validation
- Rate limiting on submissions
- HTTPS enforced
- Security headers configured
- Environment variables protection

## 👨‍💼 About

**Durotech Recruitment** is an international recruitment agency founded by **Sadman Kibria**, specializing in:
- Construction
- Healthcare
- Engineering
- Warehousing
- Food Production
- Garment Industry
- Study Abroad Programs

Operating across Europe, Middle East, and Asia with 15+ years of expertise and 5000+ successful placements.

## 📞 Contact

**Durotech Recruitment Ltd**
- **Founder**: Sadman Kibria
- **Website**: https://durotech.co.uk
- **Email**: info@durotech.co.uk
- **Phone**: +44 20 1234 5678
- **Address**: 123 Business Street, London, EC1A 1BB, UK

## 📄 License

Proprietary - All rights reserved by Durotech Recruitment Ltd © 2025

## 🤝 Contributing

See `CONTRIBUTING.md` for development guidelines.

## 📚 Documentation

- `DEPLOYMENT.md` - Comprehensive deployment guide
- `CONTRIBUTING.md` - Contribution guidelines
- `scripts/` - Database setup scripts

---

**Built by Sadman Kibria** | Powered by Next.js, Supabase & Vercel
