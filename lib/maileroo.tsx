// Maileroo email integration for Durotech Recruitment
// Using sending key provided by user

interface EmailOptions {
  to: string
  subject: string
  html: string
}

const MAILEROO_API_KEY =
  process.env.MAILEROO_API_KEY || "c67ffa8f2332e5127315155a08ac29477fee539407ba5b47b6f9e0224baf0752"
const FROM_EMAIL = process.env.FROM_EMAIL || "noreply@durotech.com"
const FROM_NAME = "Durotech Recruitment"
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@durotech.com"

// Professional email template with Durotech branding
function getEmailTemplate(content: string, preheader?: string): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Durotech Recruitment</title>
  ${preheader ? `<span style="display:none;font-size:1px;color:#ffffff;line-height:1px;max-height:0px;max-width:0px;opacity:0;overflow:hidden;">${preheader}</span>` : ""}
</head>
<body style="margin:0;padding:0;background-color:#f5f5f5;font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color:#f5f5f5;">
    <tr>
      <td align="center" style="padding:40px 20px;">
        <table role="presentation" width="600" cellspacing="0" cellpadding="0" style="max-width:600px;width:100%;">
          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#1E3A5F 0%,#2A4A6F 100%);padding:30px 40px;border-radius:12px 12px 0 0;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                <tr>
                  <td>
                    <img src="/images/durotech-logo.png" alt="Durotech" width="50" height="50" style="display:block;border-radius:8px;" />
                  </td>
                  <td style="padding-left:15px;vertical-align:middle;">
                    <h1 style="margin:0;font-size:24px;font-weight:700;color:#ffffff;">Durotech</h1>
                    <p style="margin:2px 0 0 0;font-size:12px;color:#F5C547;text-transform:uppercase;letter-spacing:1px;">Recruitment</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <!-- Body -->
          <tr>
            <td style="background-color:#ffffff;padding:40px;border-left:1px solid #e5e5e5;border-right:1px solid #e5e5e5;">
              ${content}
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="background-color:#1E3A5F;padding:30px 40px;border-radius:0 0 12px 12px;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                <tr>
                  <td style="text-align:center;">
                    <p style="margin:0 0 10px 0;font-size:14px;color:#ffffff;font-weight:600;">Durotech Limited</p>
                    <p style="margin:0 0 5px 0;font-size:12px;color:#94a3b8;">Trading as Durotech Recruitment</p>
                    <p style="margin:15px 0 0 0;font-size:12px;color:#64748b;">
                      Europe • Middle East • Asia
                    </p>
                    <p style="margin:15px 0 0 0;font-size:11px;color:#475569;">
                      This email was sent by Durotech Recruitment. Please do not reply directly to this email.
                    </p>
                  </td>
                </tr>
              </table>
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

export async function sendEmail({ to, subject, html }: EmailOptions): Promise<boolean> {
  if (!MAILEROO_API_KEY) {
    console.warn("Maileroo API key not configured - email not sent")
    return true // Return true to not block the flow
  }

  try {
    const response = await fetch("https://smtp.maileroo.com/send", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-Key": MAILEROO_API_KEY,
      },
      body: JSON.stringify({
        from: `${FROM_NAME} <${FROM_EMAIL}>`,
        to,
        subject,
        html: getEmailTemplate(html),
      }),
    })

    if (!response.ok) {
      const errorData = await response.text()
      console.error("Maileroo error:", errorData)
      return false
    }

    return true
  } catch (error) {
    console.error("Failed to send email:", error)
    return false
  }
}

export async function sendApplicationConfirmation(
  applicantEmail: string,
  applicantName: string,
  jobTitle: string,
  companyName?: string,
): Promise<boolean> {
  const content = `
    <h2 style="margin:0 0 20px 0;font-size:24px;color:#1E3A5F;">Application Received</h2>
    <p style="margin:0 0 15px 0;font-size:16px;color:#374151;line-height:1.6;">Dear ${applicantName},</p>
    <p style="margin:0 0 15px 0;font-size:16px;color:#374151;line-height:1.6;">
      Thank you for applying for the <strong style="color:#1E3A5F;">${jobTitle}</strong> position${companyName ? ` at <strong>${companyName}</strong>` : ""}.
    </p>
    <p style="margin:0 0 20px 0;font-size:16px;color:#374151;line-height:1.6;">
      We have received your application and our recruitment team will review it carefully. If your qualifications match our requirements, we will contact you to discuss the next steps.
    </p>
    <div style="background-color:#FEF9E7;border-left:4px solid #F5C547;padding:15px 20px;margin:25px 0;border-radius:0 8px 8px 0;">
      <p style="margin:0;font-size:14px;color:#1E3A5F;font-weight:600;">What happens next?</p>
      <ul style="margin:10px 0 0 0;padding-left:20px;color:#374151;font-size:14px;line-height:1.8;">
        <li>Our team will review your application within 5-7 business days</li>
        <li>Shortlisted candidates will be contacted for an interview</li>
        <li>We'll guide you through the visa and relocation process if applicable</li>
      </ul>
    </div>
    <p style="margin:25px 0 0 0;font-size:16px;color:#374151;line-height:1.6;">
      Best regards,<br/>
      <strong style="color:#1E3A5F;">The Durotech Recruitment Team</strong>
    </p>
  `

  return sendEmail({
    to: applicantEmail,
    subject: `Application Received - ${jobTitle}`,
    html: content,
  })
}

export async function sendAdminNotification(
  applicantName: string,
  applicantEmail: string,
  jobTitle: string,
  isDuplicate = false,
): Promise<boolean> {
  const duplicateWarning = isDuplicate
    ? `<div style="background-color:#FEE2E2;border-left:4px solid #EF4444;padding:15px 20px;margin:0 0 20px 0;border-radius:0 8px 8px 0;">
        <p style="margin:0;font-size:14px;color:#991B1B;font-weight:600;">⚠️ Duplicate Application Detected</p>
        <p style="margin:5px 0 0 0;font-size:13px;color:#7F1D1D;">This applicant has applied to other positions previously.</p>
       </div>`
    : ""

  const content = `
    <h2 style="margin:0 0 20px 0;font-size:24px;color:#1E3A5F;">New Application Received</h2>
    ${duplicateWarning}
    <p style="margin:0 0 20px 0;font-size:16px;color:#374151;line-height:1.6;">
      A new application has been submitted for your review.
    </p>
    <div style="background-color:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;padding:20px;margin:20px 0;">
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
        <tr>
          <td style="padding:8px 0;border-bottom:1px solid #e2e8f0;">
            <span style="font-size:13px;color:#64748b;display:inline-block;width:120px;">Position:</span>
            <span style="font-size:14px;color:#1E3A5F;font-weight:600;">${jobTitle}</span>
          </td>
        </tr>
        <tr>
          <td style="padding:8px 0;border-bottom:1px solid #e2e8f0;">
            <span style="font-size:13px;color:#64748b;display:inline-block;width:120px;">Applicant:</span>
            <span style="font-size:14px;color:#1e293b;">${applicantName}</span>
          </td>
        </tr>
        <tr>
          <td style="padding:8px 0;">
            <span style="font-size:13px;color:#64748b;display:inline-block;width:120px;">Email:</span>
            <a href="mailto:${applicantEmail}" style="font-size:14px;color:#1E3A5F;">${applicantEmail}</a>
          </td>
        </tr>
      </table>
    </div>
    <p style="margin:20px 0 0 0;">
      <a href="${process.env.NEXT_PUBLIC_SITE_URL || ""}/admin/applications" style="display:inline-block;background-color:#1E3A5F;color:#ffffff;padding:12px 24px;border-radius:6px;text-decoration:none;font-weight:600;font-size:14px;">
        View Application
      </a>
    </p>
  `

  return sendEmail({
    to: ADMIN_EMAIL,
    subject: `New Application: ${applicantName} for ${jobTitle}${isDuplicate ? " [DUPLICATE]" : ""}`,
    html: content,
  })
}

export async function sendCustomEmail(
  to: string,
  applicantName: string,
  subject: string,
  message: string,
): Promise<boolean> {
  const content = `
    <p style="margin:0 0 15px 0;font-size:16px;color:#374151;line-height:1.6;">Dear ${applicantName},</p>
    <div style="margin:0 0 25px 0;font-size:16px;color:#374151;line-height:1.8;white-space:pre-wrap;">${message}</div>
    <p style="margin:25px 0 0 0;font-size:16px;color:#374151;line-height:1.6;">
      Best regards,<br/>
      <strong style="color:#1E3A5F;">The Durotech Recruitment Team</strong>
    </p>
  `

  return sendEmail({ to, subject, html: content })
}

export async function sendStudyAbroadConfirmation(
  applicantEmail: string,
  applicantName: string,
  programInterest: string,
): Promise<boolean> {
  const content = `
    <h2 style="margin:0 0 20px 0;font-size:24px;color:#1E3A5F;">Study Abroad Application Received</h2>
    <p style="margin:0 0 15px 0;font-size:16px;color:#374151;line-height:1.6;">Dear ${applicantName},</p>
    <p style="margin:0 0 15px 0;font-size:16px;color:#374151;line-height:1.6;">
      Thank you for your interest in studying abroad. We have received your application for <strong style="color:#1E3A5F;">${programInterest}</strong>.
    </p>
    <p style="margin:0 0 20px 0;font-size:16px;color:#374151;line-height:1.6;">
      Our education consultants will review your profile and contact you within 3-5 business days to discuss suitable programs and universities.
    </p>
    <div style="background-color:#FEF9E7;border-left:4px solid #F5C547;padding:15px 20px;margin:25px 0;border-radius:0 8px 8px 0;">
      <p style="margin:0;font-size:14px;color:#1E3A5F;font-weight:600;">Our Study Abroad Services Include:</p>
      <ul style="margin:10px 0 0 0;padding-left:20px;color:#374151;font-size:14px;line-height:1.8;">
        <li>University and program selection guidance</li>
        <li>Application assistance and document preparation</li>
        <li>Visa application support</li>
        <li>Pre-departure orientation</li>
      </ul>
    </div>
    <p style="margin:25px 0 0 0;font-size:16px;color:#374151;line-height:1.6;">
      Best regards,<br/>
      <strong style="color:#1E3A5F;">The Durotech Recruitment Team</strong>
    </p>
  `

  return sendEmail({
    to: applicantEmail,
    subject: `Study Abroad Application Received - Durotech Recruitment`,
    html: content,
  })
}
