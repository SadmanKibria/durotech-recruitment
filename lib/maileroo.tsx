const MAILEROO_API_KEY = process.env.MAILEROO_API_KEY
const FROM_EMAIL = process.env.FROM_EMAIL || "info@durotech.co.uk"
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@durotech.co.uk"
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://durotech.co.uk"

interface MailerooResponse {
  success: boolean
  message?: string
}

async function sendEmail(to: string, subject: string, html: string): Promise<boolean> {
  if (!MAILEROO_API_KEY) {
    console.error("[MAILEROO] API key not configured")
    return false
  }

  try {
    const response = await fetch("https://smtp.maileroo.com/send", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-Key": MAILEROO_API_KEY,
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: [to],
        subject,
        html,
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error("[MAILEROO] Send failed:", response.status, errorText)
      return false
    }

    return true
  } catch (error) {
    console.error("[MAILEROO] Error:", error)
    return false
  }
}

export async function sendApplicationConfirmation(email: string, name: string, jobTitle: string): Promise<boolean> {
  const subject = `Application Received - ${jobTitle}`
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #1E3A5F; color: white; padding: 30px; text-align: center; }
        .content { background: #f9f9f9; padding: 30px; }
        .button { display: inline-block; padding: 12px 30px; background: #F5C547; color: #1E3A5F; text-decoration: none; border-radius: 5px; font-weight: bold; margin: 20px 0; }
        .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1 style="margin: 0;">Durotech Recruitment</h1>
          <p style="margin: 10px 0 0 0;">Your Application Has Been Received</p>
        </div>
        <div class="content">
          <h2>Dear ${name},</h2>
          <p>Thank you for applying for the <strong>${jobTitle}</strong> position through Durotech Recruitment.</p>
          <p>We have successfully received your application and our team will carefully review your qualifications. If your profile matches our requirements, we will contact you within the next 5-7 business days to discuss the next steps.</p>
          <div style="background: white; padding: 20px; border-left: 4px solid #F5C547; margin: 20px 0;">
            <h3 style="margin-top: 0;">What Happens Next?</h3>
            <ul>
              <li>Our recruitment team will review your CV and application</li>
              <li>We'll assess your qualifications against the job requirements</li>
              <li>Shortlisted candidates will be contacted for an interview</li>
              <li>We'll keep you updated on your application status</li>
            </ul>
          </div>
          <p>In the meantime, feel free to browse more opportunities on our website:</p>
          <a href="${SITE_URL}/jobs" class="button">View More Jobs</a>
          <p>If you have any questions, please don't hesitate to contact us at <a href="mailto:${FROM_EMAIL}">${FROM_EMAIL}</a>.</p>
          <p>Best regards,<br><strong>The Durotech Recruitment Team</strong></p>
        </div>
        <div class="footer">
          <p>Durotech Recruitment | London, United Kingdom</p>
          <p>This is an automated email. Please do not reply directly to this message.</p>
        </div>
      </div>
    </body>
    </html>
  `

  return sendEmail(email, subject, html)
}

export async function sendAdminNotification(
  applicantName: string,
  applicantEmail: string,
  jobTitle: string,
  applicationId: string,
): Promise<boolean> {
  const subject = `New Application: ${jobTitle} - ${applicantName}`
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #1E3A5F; color: white; padding: 20px; }
        .content { background: #f9f9f9; padding: 20px; }
        .info-box { background: white; padding: 15px; margin: 15px 0; border-left: 4px solid #F5C547; }
        .button { display: inline-block; padding: 12px 24px; background: #F5C547; color: #1E3A5F; text-decoration: none; border-radius: 5px; font-weight: bold; margin: 15px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h2 style="margin: 0;">New Job Application</h2>
        </div>
        <div class="content">
          <p><strong>A new application has been submitted:</strong></p>
          <div class="info-box">
            <p><strong>Position:</strong> ${jobTitle}</p>
            <p><strong>Applicant:</strong> ${applicantName}</p>
            <p><strong>Email:</strong> ${applicantEmail}</p>
            <p><strong>Application ID:</strong> ${applicationId}</p>
          </div>
          <p>Please review the application in the admin dashboard:</p>
          <a href="${SITE_URL}/admin/applications/${applicationId}" class="button">View Application</a>
        </div>
      </div>
    </body>
    </html>
  `

  return sendEmail(ADMIN_EMAIL, subject, html)
}

export async function sendCustomEmail(to: string, subject: string, message: string): Promise<boolean> {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #1E3A5F; color: white; padding: 20px; text-align: center; }
        .content { background: #f9f9f9; padding: 30px; }
        .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h2 style="margin: 0;">Durotech Recruitment</h2>
        </div>
        <div class="content">
          ${message}
        </div>
        <div class="footer">
          <p>Durotech Recruitment | London, United Kingdom</p>
          <p><a href="${SITE_URL}">${SITE_URL}</a></p>
        </div>
      </div>
    </body>
    </html>
  `

  return sendEmail(to, subject, html)
}
