interface EmailOptions {
  to: string
  subject: string
  html: string
}

async function sendEmail({ to, subject, html }: EmailOptions): Promise<boolean> {
  try {
    const apiKey = process.env.MAILEROO_API_KEY
    const fromEmail = process.env.FROM_EMAIL || "noreply@durotech.co.uk"

    if (!apiKey) {
      console.error("MAILEROO_API_KEY not configured")
      return false
    }

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
      const error = await response.text()
      console.error("Maileroo error:", error)
      return false
    }

    return true
  } catch (error) {
    console.error("Email send error:", error)
    return false
  }
}

function getEmailTemplate(title: string, content: string, ctaText?: string, ctaLink?: string): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
          
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #1E3A5F 0%, #2C5282 100%); padding: 40px 30px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: bold;">
                Durotech<span style="color: #F5C547;">Recruitment</span>
              </h1>
              <p style="margin: 10px 0 0 0; color: #E5E7EB; font-size: 14px;">International Staffing Solutions</p>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 40px 30px;">
              ${content}
            </td>
          </tr>
          
          <!-- CTA Button (if provided) -->
          ${
            ctaText && ctaLink
              ? `
          <tr>
            <td style="padding: 0 30px 40px 30px; text-align: center;">
              <a href="${ctaLink}" style="display: inline-block; background-color: #1E3A5F; color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 6px; font-weight: 600; font-size: 16px;">
                ${ctaText}
              </a>
            </td>
          </tr>
          `
              : ""
          }
          
          <!-- Footer -->
          <tr>
            <td style="background-color: #F9FAFB; padding: 30px; text-align: center; border-top: 1px solid #E5E7EB;">
              <p style="margin: 0 0 10px 0; color: #6B7280; font-size: 14px;">
                <strong>Durotech Recruitment Ltd</strong>
              </p>
              <p style="margin: 0 0 10px 0; color: #6B7280; font-size: 13px;">
                123 Business Street, London, EC1A 1BB, United Kingdom
              </p>
              <p style="margin: 0 0 10px 0; color: #6B7280; font-size: 13px;">
                Phone: <a href="tel:+442012345678" style="color: #1E3A5F; text-decoration: none;">+44 20 1234 5678</a> | 
                Email: <a href="mailto:info@durotech.co.uk" style="color: #1E3A5F; text-decoration: none;">info@durotech.co.uk</a>
              </p>
              <p style="margin: 15px 0 0 0; color: #9CA3AF; font-size: 12px;">
                © ${new Date().getFullYear()} Durotech Recruitment Ltd. All rights reserved.
              </p>
            </td>
          </tr>
          
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `
}

export async function sendApplicationConfirmation(
  applicantEmail: string,
  applicantName: string,
  jobTitle: string,
): Promise<boolean> {
  const content = `
    <h2 style="margin: 0 0 20px 0; color: #1E3A5F; font-size: 24px;">Application Received!</h2>
    <p style="margin: 0 0 15px 0; color: #374151; font-size: 16px; line-height: 1.6;">
      Dear ${applicantName},
    </p>
    <p style="margin: 0 0 15px 0; color: #374151; font-size: 16px; line-height: 1.6;">
      Thank you for applying for the <strong>${jobTitle}</strong> position with Durotech Recruitment. We have successfully received your application and our team is reviewing it carefully.
    </p>
    <p style="margin: 0 0 15px 0; color: #374151; font-size: 16px; line-height: 1.6;">
      <strong>What happens next?</strong>
    </p>
    <ul style="margin: 0 0 15px 0; padding-left: 20px; color: #374151; font-size: 16px; line-height: 1.8;">
      <li>Our recruitment team will review your application within 2-3 business days</li>
      <li>If your profile matches our requirements, we'll contact you for an initial discussion</li>
      <li>You may be asked to provide additional documents or attend an interview</li>
    </ul>
    <p style="margin: 0 0 15px 0; color: #374151; font-size: 16px; line-height: 1.6;">
      If you have any questions in the meantime, please don't hesitate to contact us.
    </p>
    <p style="margin: 0; color: #374151; font-size: 16px; line-height: 1.6;">
      Best regards,<br>
      <strong>The Durotech Recruitment Team</strong>
    </p>
  `

  return sendEmail({
    to: applicantEmail,
    subject: `Application Received - ${jobTitle}`,
    html: getEmailTemplate("Application Received", content, "View Job Details", "https://durotech.co.uk/jobs"),
  })
}

export async function sendAdminNotification(
  applicantName: string,
  applicantEmail: string,
  jobTitle: string,
  applicationId: string,
): Promise<boolean> {
  const adminEmail = process.env.ADMIN_EMAIL || "admin@durotech.co.uk"

  const content = `
    <h2 style="margin: 0 0 20px 0; color: #1E3A5F; font-size: 24px;">New Application Received</h2>
    <p style="margin: 0 0 15px 0; color: #374151; font-size: 16px; line-height: 1.6;">
      A new application has been submitted on the Durotech Recruitment website.
    </p>
    <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
      <tr>
        <td style="padding: 12px; background-color: #F9FAFB; border: 1px solid #E5E7EB; font-weight: 600; color: #1E3A5F;">Applicant Name:</td>
        <td style="padding: 12px; background-color: #FFFFFF; border: 1px solid #E5E7EB; color: #374151;">${applicantName}</td>
      </tr>
      <tr>
        <td style="padding: 12px; background-color: #F9FAFB; border: 1px solid #E5E7EB; font-weight: 600; color: #1E3A5F;">Email:</td>
        <td style="padding: 12px; background-color: #FFFFFF; border: 1px solid #E5E7EB; color: #374151;">${applicantEmail}</td>
      </tr>
      <tr>
        <td style="padding: 12px; background-color: #F9FAFB; border: 1px solid #E5E7EB; font-weight: 600; color: #1E3A5F;">Position:</td>
        <td style="padding: 12px; background-color: #FFFFFF; border: 1px solid #E5E7EB; color: #374151;">${jobTitle}</td>
      </tr>
      <tr>
        <td style="padding: 12px; background-color: #F9FAFB; border: 1px solid #E5E7EB; font-weight: 600; color: #1E3A5F;">Application ID:</td>
        <td style="padding: 12px; background-color: #FFFFFF; border: 1px solid #E5E7EB; color: #374151;">${applicationId}</td>
      </tr>
    </table>
    <p style="margin: 20px 0 0 0; color: #374151; font-size: 16px; line-height: 1.6;">
      Please review this application in the admin dashboard.
    </p>
  `

  return sendEmail({
    to: adminEmail,
    subject: `🔔 New Application: ${jobTitle} - ${applicantName}`,
    html: getEmailTemplate(
      "New Application",
      content,
      "View in Dashboard",
      `https://durotech.co.uk/admin/applications/${applicationId}`,
    ),
  })
}

export async function sendCustomEmail(to: string, subject: string, message: string): Promise<boolean> {
  const content = `
    <p style="margin: 0 0 15px 0; color: #374151; font-size: 16px; line-height: 1.6; white-space: pre-wrap;">
      ${message}
    </p>
  `

  return sendEmail({
    to,
    subject,
    html: getEmailTemplate(subject, content),
  })
}
