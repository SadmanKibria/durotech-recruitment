interface SendEmailParams {
  to: string
  subject: string
  html: string
}

export async function sendEmail({ to, subject, html }: SendEmailParams): Promise<boolean> {
  const apiKey = process.env.MAILEROO_API_KEY
  const fromEmail = process.env.FROM_EMAIL || "noreply@durotech.com"

  if (!apiKey) {
    console.warn("[Maileroo] API key not configured, skipping email send")
    return true // Return true to not block the flow
  }

  try {
    const response = await fetch("https://smtp.maileroo.com/send", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-Key": apiKey,
      },
      body: JSON.stringify({
        from: fromEmail,
        to,
        subject,
        html,
      }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      console.error("[Maileroo] Failed to send email:", errorData)
      return false
    }

    return true
  } catch (error) {
    console.error("[Maileroo] Error sending email:", error)
    return false
  }
}

export async function sendApplicationConfirmation(
  applicantEmail: string,
  applicantName: string,
  jobTitle: string,
): Promise<boolean> {
  return sendEmail({
    to: applicantEmail,
    subject: `Application Received - ${jobTitle}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #0f766e;">Thank You for Your Application</h2>
        <p>Dear ${applicantName},</p>
        <p>We have received your application for the position of <strong>${jobTitle}</strong> at Durotech Recruitment.</p>
        <p>Our team will review your application and get back to you within 5-7 business days.</p>
        <p>If you have any questions, please don't hesitate to contact us.</p>
        <br/>
        <p>Best regards,<br/>Durotech Recruitment Team</p>
        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;"/>
        <p style="color: #6b7280; font-size: 12px;">
          This is an automated message. Please do not reply directly to this email.
        </p>
      </div>
    `,
  })
}

export async function sendAdminNotification(
  applicantName: string,
  applicantEmail: string,
  jobTitle: string,
  applicationId: string,
): Promise<boolean> {
  const adminEmail = process.env.ADMIN_EMAIL

  if (!adminEmail) {
    console.warn("[Maileroo] Admin email not configured, skipping notification")
    return true
  }

  return sendEmail({
    to: adminEmail,
    subject: `New Application - ${jobTitle}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #0f766e;">New Job Application Received</h2>
        <p>A new application has been submitted:</p>
        <ul style="list-style: none; padding: 0;">
          <li><strong>Position:</strong> ${jobTitle}</li>
          <li><strong>Applicant:</strong> ${applicantName}</li>
          <li><strong>Email:</strong> ${applicantEmail}</li>
        </ul>
        <p>
          <a href="${process.env.NEXT_PUBLIC_SITE_URL || ""}/admin/applications/${applicationId}" 
             style="display: inline-block; padding: 10px 20px; background-color: #0f766e; color: white; text-decoration: none; border-radius: 5px;">
            View Application
          </a>
        </p>
        <br/>
        <p>Best regards,<br/>Durotech Recruitment System</p>
      </div>
    `,
  })
}

export async function sendCustomEmail(
  to: string,
  subject: string,
  message: string,
  applicantName: string,
): Promise<boolean> {
  return sendEmail({
    to,
    subject,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <p>Dear ${applicantName},</p>
        <div style="white-space: pre-wrap;">${message}</div>
        <br/>
        <p>Best regards,<br/>Durotech Recruitment Team</p>
        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;"/>
        <p style="color: #6b7280; font-size: 12px;">
          Durotech Recruitment - Connecting Talent Worldwide
        </p>
      </div>
    `,
  })
}
