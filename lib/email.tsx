const MAILEROO_API_KEY = process.env.MAILEROO_API_KEY
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@durotechrecruitment.com"
const FROM_EMAIL = process.env.FROM_EMAIL || "noreply@durotechrecruitment.com"

interface SendEmailParams {
  to: string
  subject: string
  html: string
}

async function sendEmail({ to, subject, html }: SendEmailParams) {
  if (!MAILEROO_API_KEY) {
    console.warn("MAILEROO_API_KEY not set, skipping email")
    return
  }

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

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`Failed to send email: ${error}`)
  }

  return response.json()
}

export async function sendApplicantConfirmation({
  to,
  applicantName,
  jobTitle,
}: {
  to: string
  applicantName: string
  jobTitle: string
}) {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #0066cc; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background-color: #f9f9f9; }
        .footer { padding: 20px; text-align: center; font-size: 12px; color: #666; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Application Received</h1>
        </div>
        <div class="content">
          <p>Dear ${applicantName},</p>
          <p>Thank you for applying for the <strong>${jobTitle}</strong> position at Durotech Recruitment.</p>
          <p>We have received your application and our recruitment team will review it shortly. If your qualifications match our requirements, we will be in touch to discuss the next steps.</p>
          <p>In the meantime, feel free to browse other opportunities on our website.</p>
          <p>Best regards,<br>The Durotech Recruitment Team</p>
        </div>
        <div class="footer">
          <p>&copy; ${new Date().getFullYear()} Durotech Recruitment. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `

  return sendEmail({
    to,
    subject: `Application Received - ${jobTitle}`,
    html,
  })
}

export async function sendAdminNotification({
  applicantName,
  applicantEmail,
  jobTitle,
  applicationId,
}: {
  applicantName: string
  applicantEmail: string
  jobTitle: string
  applicationId: string
}) {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #0066cc; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background-color: #f9f9f9; }
        .details { background-color: white; padding: 15px; border-radius: 5px; margin: 15px 0; }
        .footer { padding: 20px; text-align: center; font-size: 12px; color: #666; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>New Application Received</h1>
        </div>
        <div class="content">
          <p>A new application has been submitted:</p>
          <div class="details">
            <p><strong>Position:</strong> ${jobTitle}</p>
            <p><strong>Applicant:</strong> ${applicantName}</p>
            <p><strong>Email:</strong> ${applicantEmail}</p>
            <p><strong>Application ID:</strong> ${applicationId}</p>
          </div>
          <p>Please log in to the admin dashboard to review this application.</p>
        </div>
        <div class="footer">
          <p>&copy; ${new Date().getFullYear()} Durotech Recruitment. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `

  return sendEmail({
    to: ADMIN_EMAIL,
    subject: `New Application - ${jobTitle} - ${applicantName}`,
    html,
  })
}

export async function sendEmailToApplicant({
  to,
  subject,
  message,
  applicantName,
}: {
  to: string
  subject: string
  message: string
  applicantName: string
}) {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #0066cc; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background-color: #f9f9f9; }
        .message { background-color: white; padding: 15px; border-radius: 5px; white-space: pre-wrap; }
        .footer { padding: 20px; text-align: center; font-size: 12px; color: #666; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Durotech Recruitment</h1>
        </div>
        <div class="content">
          <p>Dear ${applicantName},</p>
          <div class="message">${message}</div>
          <p style="margin-top: 20px;">Best regards,<br>The Durotech Recruitment Team</p>
        </div>
        <div class="footer">
          <p>&copy; ${new Date().getFullYear()} Durotech Recruitment. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `

  return sendEmail({
    to,
    subject,
    html,
  })
}
