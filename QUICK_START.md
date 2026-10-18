# Quick Start Guide - Admin Dashboard

## Access the Platform

### Admin Dashboard
- **URL:** `https://your-domain.com/admin`
- **Login Page:** `https://your-domain.com/admin/login`

### Available Admin Accounts
1. **admin@durotech.co.uk** - Superadmin (Full access, can delete)
2. **yash@durotech.co.uk** - Editor (Can edit, cannot delete)
3. **kazi@durotech.co.uk** - Editor (Can edit, cannot delete)

*Note: Each admin needs to set their own password via Supabase Auth email reset link*

---

## Dashboard Overview

### Key Metrics (Top Cards)
- **Total Jobs:** All jobs in the system
- **Active Jobs:** Currently open positions
- **Applications:** Total submissions
- **New Applications:** Pending status applications (highlighted if > 0)
- **Talent Pool:** Speculative CV submissions
- **New CVs:** Recent talent pool entries (highlighted if > 0)

### Financial Summary
- **Left Column (Incoming - Green):** Money received from applicants/companies
- **Right Column (Outgoing - Red):** Expenses, fees, visa costs, etc.
- **Top Banner:** Net balance (profit/loss at a glance)

### Recent Applications
- Shows last 5 submissions
- Click to view full details
- See application status with color coding
- Quick access to applicant info

---

## Main Functions

### 1. Job Management (`/admin/jobs`)
**Create New Job:**
1. Click "Add New Job" button
2. Fill in: Title, Description, Location, Country, Region, Industry
3. Set salary range and employment type
4. Add requirements and benefits
5. Set number of positions
6. Save and publish

**Edit Job:**
1. Go to Jobs list
2. Click job title to edit
3. Update fields as needed
4. Activate/Deactivate toggle on the right

**Delete Job:**
- Superadmin only
- Click delete icon on job card
- Confirm deletion

---

### 2. Application Management (`/admin/applications`)
**View Application:**
1. Click application name in list
2. See full details: Resume, Cover Letter, Contact Info
3. Track status and financial information
4. View admin notes and reference agent

**Update Status:**
1. Click "Update Status" button
2. Select new status from dropdown:
   - Applied → Offer Issued → Visa Applied → Visa Approved → At Embassy → Visa Stamped → Arrived
3. Applicant receives notification email
4. Status change logged with timestamp

**Send Email:**
1. Click "Send Email" button
2. Compose message
3. Send custom communication to applicant

**Financial Tracking:**
- View incoming amounts (money received)
- View outgoing costs (fees paid)
- Add transactions with category and date
- See net balance for application

---

### 3. Talent Pool (`/admin/talent-pool`)
**View Submissions:**
1. Browse speculative CVs
2. See contact info and preferences
3. Review admin notes

**Add to Database:**
1. Click "Add New Candidate" button
2. Enter candidate info manually or upload CV
3. Set preferences (region, industry)
4. Save to database

**Email Candidate:**
1. Open candidate details
2. Click "Send Email"
3. Send job offer or inquiry

---

### 4. Company Management (`/admin/companies`)
**Create Company:**
1. Click "Add Company"
2. Enter: Name, Contact Person, Email, Phone
3. Add address and notes
4. Save

**Link to Jobs:**
- When creating jobs, select company from dropdown
- Helps track which jobs are with which clients

---

### 5. Agent Management (`/admin/agents`)
**Create Agent:**
1. Click "Add Agent"
2. Enter: Name, Email, Phone, Company
3. Set commission rate
4. Add notes (background, specialization)
5. Save

**Track Referrals:**
- Reference agents in applications
- Track their commission history
- Monitor performance

---

## Color Coding Guide

### Application Status
- 🔵 **Blue:** Applied (New submission)
- 🟡 **Amber:** Offer Issued
- 🟣 **Purple:** Visa Applied/In Progress
- 🟢 **Green:** Approved/Completed
- 🔴 **Red:** Rejected
- ⚫ **Gray:** Other status

### Financial
- 🟢 **Green:** Incoming (Money received)
- 🔴 **Red:** Outgoing (Costs/expenses)
- 🔵 **Blue:** Net Profit (when positive)
- 🟠 **Orange:** Net Loss (when negative)

---

## Common Tasks

### Task: Check if New Applications Came In
1. Go to Dashboard
2. Look at "New Applications" card (highlighted if > 0)
3. Click "View all" to see applications list
4. Click application to view details

### Task: Send Status Update to Applicant
1. Go to Applications → Click applicant name
2. Click "Update Status"
3. Select new status (e.g., "Visa Approved")
4. Email is automatically sent to applicant
5. Status change is recorded

### Task: Track Financial for an Application
1. Go to Applications → Click applicant name
2. Scroll to "Financial Summary"
3. Left side: Money received (green)
4. Right side: Costs paid (red)
5. Top banner: Net result (profit/loss)
6. Add transactions by clicking "Add Payment"

### Task: Create Job and Wait for Applications
1. Go to Jobs → Click "Add New Job"
2. Fill in all details
3. Save and ensure "Active" is toggled ON
4. Job appears on public `/jobs` page
5. Applicants submit via "Apply Now" button
6. You see new applications on dashboard

### Task: Manage Talent Pool (CVs without Job)
1. Go to Talent Pool
2. Browse candidates who submitted CV
3. Add notes about potential fits
4. When relevant job opens, email candidate the opportunity

---

## Important Notes

### Security
- ⚠️ Never share login credentials
- ⚠️ Logout when finished (especially on shared computers)
- ⚠️ Superadmin should manage other admin accounts
- ⚠️ All actions are logged with timestamps

### Email Notifications
- ✉️ Applicants get confirmation when they apply
- ✉️ Applicants get notified of status changes
- ✉️ Applicants get rejection/offer emails
- ✉️ Ensure Maileroo account has credits

### Data Management
- 💾 All data is automatically saved
- 📝 Admin notes are private (only visible to admins)
- 🔗 Maintain company/job relationships for reporting
- 📞 Keep contact info up to date

---

## Troubleshooting

### "Login not working"
- Verify email is correct (admin@durotech.co.uk, yash@..., or kazi@...)
- Check password was set via email reset link
- Clear browser cookies and try again
- Check that Supabase auth is connected

### "Payment data not showing"
- Verify payments table exists in database
- Check that payment records have correct application_id
- Ensure column names are correct (payment_type, payment_date)

### "Email not sending"
- Verify MAILEROO_API_KEY is set in environment
- Check Maileroo account has remaining credits
- Review email address is correct
- Check spam folder for bounced emails

### "Application not appearing"
- Refresh the page
- Check that status wasn't set to reject
- Verify job is marked as Active
- Check database connection

---

## Tips & Tricks

1. **Bulk Operations:** Use filters to group applications by status, then take action
2. **Notes:** Add detailed notes to applications for team coordination
3. **Financial Tracking:** Record all expenses immediately to avoid losing data
4. **Regular Backups:** Database backs up automatically, but export critical data weekly
5. **Email Templates:** Customize email templates in `lib/email-templates.tsx`

---

## Emergency Procedures

### Lost Admin Password
1. Contact Vercel support or your developer
2. Request password reset from Supabase Auth
3. Email will be sent to reset password

### Data Corruption
1. Contact database team immediately
2. Check last backup
3. Restore from backup if needed

### System Down
1. Check Vercel status page
2. Check Supabase status page
3. Verify internet connection
4. Contact support if services are down

---

## Getting Help

1. **For Platform Questions:** Refer to `/DEPLOYMENT_CHECKLIST.md`
2. **For Bug Reports:** Document steps to reproduce, screenshot errors
3. **For Feature Requests:** Contact development team
4. **For Database Questions:** Reach out to database administrator

---

**Last Updated:** May 31, 2026  
**Version:** 1.0  
**Status:** Production Ready
