# Durotech Recruitment - Deployment Guide

## Domain
**Production URL:** https://durotech.co.uk

## Prerequisites
- Node.js 18+ installed
- Supabase account with database configured
- Vercel Blob storage configured
- Maileroo account for email services

## Environment Variables

Ensure all environment variables are set in your deployment platform:

### Supabase
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### Database (Postgres)
```
POSTGRES_URL=your_postgres_url
POSTGRES_PRISMA_URL=your_prisma_url
POSTGRES_URL_NON_POOLING=your_non_pooling_url
POSTGRES_USER=your_user
POSTGRES_PASSWORD=your_password
POSTGRES_DATABASE=your_database
POSTGRES_HOST=your_host
```

### Storage
```
BLOB_READ_WRITE_TOKEN=your_vercel_blob_token
```

### Email
```
MAILEROO_API_KEY=your_maileroo_key
FROM_EMAIL=noreply@durotech.co.uk
ADMIN_EMAIL=admin@durotech.co.uk
```

### Site Configuration
```
NEXT_PUBLIC_SITE_URL=https://durotech.co.uk
```

## Database Setup

### Step 1: Run Initial Schema
The main schema should already be set up in your Supabase instance.

### Step 2: Add Admin Roles and Fields
Run the SQL script in `scripts/add-admin-roles-and-fields.sql` in your Supabase SQL editor:

```sql
-- This will add:
-- 1. visa_status field to applications table
-- 2. total_agreed_amount field to applications table
-- 3. admin_users table for role-based access control
```

### Step 3: Create Admin Users
After running the script, create admin users in Supabase Auth, then add them to the admin_users table:

```sql
-- Insert admin users (replace with actual user IDs from auth.users)
INSERT INTO admin_users (email, name, role, user_id)
VALUES 
  ('superadmin@durotech.com', 'Super Admin', 'superadmin', 'user-uuid-here'),
  ('manager@durotech.com', 'Manager Name', 'manager', 'user-uuid-here'),
  ('admin@durotech.com', 'Admin Name', 'admin', 'user-uuid-here')
ON CONFLICT (email) DO NOTHING;
```

## Admin Roles & Permissions

### Superadmin
- **Full Access:** Create, Read, Update, Delete
- Can delete applicants and financial records
- Can manage other admin users
- Full access to all features

### Manager
- **Limited Delete:** Create, Read, Update (No Delete)
- Cannot delete applicants or financial data
- Can access all financial information
- Cannot manage admin users

### Admin
- **Read/Write Only:** Create, Read, Update
- Cannot delete anything
- Limited financial access
- Cannot manage admin users

## Deployment Steps

### Option 1: Vercel (Recommended)
1. Push code to GitHub repository
2. Import project in Vercel
3. Add all environment variables
4. Set domain to `durotech.co.uk`
5. Deploy

### Option 2: Netlify
1. Push code to GitHub repository
2. Import project in Netlify
3. Add all environment variables
4. Set domain to `durotech.co.uk`
5. Build command: `npm run build`
6. Publish directory: `.next`
7. Deploy

### Option 3: Self-Hosted
1. Build the project: `npm run build`
2. Set all environment variables
3. Start the server: `npm start`
4. Configure reverse proxy (nginx) to point to `durotech.co.uk`

## Post-Deployment Checklist

- [ ] All environment variables configured
- [ ] Database schema updated with admin roles
- [ ] Admin users created and assigned roles
- [ ] Test all functionality:
  - [ ] Job applications submit correctly
  - [ ] CV upload works
  - [ ] Email notifications send
  - [ ] Admin login works
  - [ ] Application management works
  - [ ] Payment tracking works
  - [ ] Charts display correctly
- [ ] SSL certificate configured for HTTPS
- [ ] Domain DNS points to deployment
- [ ] Favicon displays correctly
- [ ] SEO metadata verified
- [ ] Test on mobile devices

## Admin Access

### Default Admin Account
```
Email: admin@durotech.com
Password: DurotechAdmin2024!
```

**⚠️ IMPORTANT:** Change the default password immediately after first login!

## Support & Maintenance

### Common Issues

**Upload fails with "Bucket not found"**
- Verify `BLOB_READ_WRITE_TOKEN` is set correctly
- Check Vercel Blob integration is active

**Email not sending**
- Verify `MAILEROO_API_KEY` is correct
- Check `FROM_EMAIL` is verified in Maileroo

**Admin roles not working**
- Ensure `scripts/add-admin-roles-and-fields.sql` was run
- Verify admin users exist in `admin_users` table

### Updating Content

**Add new job:**
1. Login to admin dashboard
2. Go to Jobs → Add New Job
3. Fill in all required fields
4. Set to Active and Save

**Manage applications:**
1. Go to Applications in admin dashboard
2. Click on applicant name
3. Update status, visa info, payments, etc.

## Security Notes

1. Never commit `.env` files
2. Rotate admin passwords regularly
3. Use strong passwords for all admin accounts
4. Enable 2FA on Supabase and deployment platform
5. Regular database backups
6. Monitor for suspicious activity

## Contact

For technical support:
- Email: info@durotech.co.uk
- Developer: Sadman Kibria

---

**Version:** 1.0.0  
**Last Updated:** December 2024
