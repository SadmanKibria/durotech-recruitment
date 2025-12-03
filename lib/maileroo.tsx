const MAILEROO_API_KEY = process.env.MAILEROO_API_KEY
const FROM_EMAIL = process.env.FROM_EMAIL || "noreply@durotech.com"

interface SendEmailParams {
  to: string
  subject: string
  html: string
}

export async function sendEmail({ to, subject, html }: SendEmailParams): Promise<boolean> {
  if (!MAILEROO_API_KEY) {
    console.warn("MAILEROO_API_KEY not configured, skipping email send")
    return true
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
        to,
        subject,
        html,
      }),
    })

    return response.ok
  } catch (error) {
    console.error("Failed to send email:", error)
    return false
  }
}

export async function sendApplicationConfirmation(
  applicantEmail: string,
  applicantName: string,
  jobTitle: string,
): Promise<boolean> {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #1e40af; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { padding: 30px 20px; background: #f8fafc; }
        .footer { text-align: center; padding: 20px; color: #64748b; font-size: 12px; background: #f1f5f9; border-radius: 0 0 8px 8px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1 style="margin: 0;">Durotech Recruitment</h1>
        </div>
        <div class="content">
          <h2 style="color: #1e40af;">Application Received</h2>
          <p>Dear ${applicantName},</p>
          <p>Thank you for applying for the position of <strong>${jobTitle}</strong> at Durotech Recruitment.</p>
          <p>We have received your application and our team will review it carefully. If your qualifications match our requirements, we will contact you to discuss the next steps.</p>
          <p>In the meantime, feel free to browse other opportunities on our website.</p>
          <p>Best regards,<br/><strong>The Durotech Recruitment Team</strong></p>
        </div>
        <div class="footer">
          <p>Durotech Recruitment - Connecting Talent Across Europe, Middle East & Asia</p>
          <p>This is an automated message. Please do not reply directly to this email.</p>
        </div>
      </div>
    </body>
    </html>
  `

  return sendEmail({ to: applicantEmail, subject: `Application Received: ${jobTitle}`, html })
}

export async function sendAdminNotification(
  applicantName: string,
  applicantEmail: string,
  jobTitle: string,
  applicationId: string,
): Promise<boolean> {
  const adminEmail = process.env.ADMIN_EMAIL || "admin@durotech.com"

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #1e40af; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { padding: 30px 20px; background: #f8fafc; }
        .info-box { background: white; padding: 15px; border-radius: 8px; margin: 15px 0; border: 1px solid #e2e8f0; }
        .footer { text-align: center; padding: 20px; color: #64748b; font-size: 12px; background: #f1f5f9; border-radius: 0 0 8px 8px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1 style="margin: 0;">New Application Alert</h1>
        </div>
        <div class="content">
          <h2 style="color: #1e40af;">New Job Application</h2>
          <p>A new application has been submitted:</p>
          <div class="info-box">
            <p><strong>Applicant:</strong> ${applicantName}</p>
            <p><strong>Email:</strong> ${applicantEmail}</p>
            <p><strong>Position:</strong> ${jobTitle}</p>
            <p><strong>Application ID:</strong> ${applicationId}</p>
          </div>
          <p>Log in to your admin dashboard to review this application.</p>
        </div>
        <div class="footer">
          <p>Durotech Recruitment Admin</p>
        </div>
      </div>
    </body>
    </html>
  `

  return sendEmail({ to: adminEmail, subject: `New Application: ${applicantName} for ${jobTitle}`, html })
}

export async function sendCustomEmail(to: string, subject: string, message: string): Promise<boolean> {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #1e40af; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { padding: 30px 20px; background: #f8fafc; }
        .footer { text-align: center; padding: 20px; color: #64748b; font-size: 12px; background: #f1f5f9; border-radius: 0 0 8px 8px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1 style="margin: 0;">Durotech Recruitment</h1>
        </div>
        <div class="content">
          ${message
            .split("\n")
            .map((p) => `<p>${p}</p>`)
            .join("")}
          <p style="margin-top: 30px;">Best regards,<br/><strong>The Durotech Recruitment Team</strong></p>
        </div>
        <div class="footer">
          <p>Durotech Recruitment - Connecting Talent Across Europe, Middle East & Asia</p>
        </div>
      </div>
    </body>
    </html>
  `

  return sendEmail({ to, subject, html })
}
