interface SendEmailParams {
  to: string
  subject: string
  html: string
  from?: string
}

export async function sendEmail({ to, subject, html, from }: SendEmailParams) {
  const apiKey = process.env.MAILEROO_API_KEY
  const fromEmail = from || process.env.FROM_EMAIL || "noreply@durotech.co.uk"

  if (!apiKey) {
    throw new Error("MAILEROO_API_KEY is not configured")
  }

  try {
    const response = await fetch("https://smtp.maileroo.com/send", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-Key": apiKey,
      },
      body: JSON.stringify({
        from: {
          email: fromEmail,
          name: "Durotech Recruitment",
        },
        to: [{ email: to }],
        subject,
        html,
      }),
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`Email sending failed: ${error}`)
    }

    return { success: true }
  } catch (error) {
    console.error("Email error:", error)
    throw error
  }
}

export function getApplicationConfirmationEmail(applicantName: string, jobTitle: string) {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Application Confirmation</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f5f5f5;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 40px 20px;">
          <tr>
            <td align="center">
              <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                <!-- Header -->
                <tr>
                  <td style="background: linear-gradient(135deg, #1E3A5F 0%, #2C5282 100%); padding: 40px 30px; text-align: center;">
                    <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: bold;">Durotech Recruitment</h1>
                    <p style="margin: 10px 0 0 0; color: #F5C547; font-size: 14px; letter-spacing: 1px;">INTERNATIONAL STAFFING SOLUTIONS</p>
                  </td>
                </tr>
                
                <!-- Body -->
                <tr>
                  <td style="padding: 40px 30px;">
                    <h2 style="margin: 0 0 20px 0; color: #1E3A5F; font-size: 24px;">Application Received!</h2>
                    <p style="margin: 0 0 15px 0; color: #333333; font-size: 16px; line-height: 1.6;">
                      Dear <strong>${applicantName}</strong>,
                    </p>
                    <p style="margin: 0 0 15px 0; color: #333333; font-size: 16px; line-height: 1.6;">
                      Thank you for applying for the position of <strong style="color: #1E3A5F;">${jobTitle}</strong> through Durotech Recruitment.
                    </p>
                    <p style="margin: 0 0 15px 0; color: #333333; font-size: 16px; line-height: 1.6;">
                      We have successfully received your application and our recruitment team is currently reviewing it. We carefully assess each application to ensure the best match between candidates and employers.
                    </p>
                    
                    <!-- Info Box -->
                    <table width="100%" cellpadding="0" cellspacing="0" style="margin: 25px 0; background-color: #f8f9fa; border-left: 4px solid #F5C547; border-radius: 4px;">
                      <tr>
                        <td style="padding: 20px;">
                          <h3 style="margin: 0 0 10px 0; color: #1E3A5F; font-size: 16px;">What Happens Next?</h3>
                          <ul style="margin: 10px 0; padding-left: 20px; color: #666666; font-size: 14px; line-height: 1.8;">
                            <li>Our team will review your application within 2-3 business days</li>
                            <li>If you're shortlisted, we'll contact you to discuss the opportunity</li>
                            <li>We may request additional information or schedule an interview</li>
                            <li>We'll keep you updated throughout the entire process</li>
                          </ul>
                        </td>
                      </tr>
                    </table>
                    
                    <p style="margin: 25px 0 15px 0; color: #333333; font-size: 16px; line-height: 1.6;">
                      If you have any questions or would like to provide additional information, please don't hesitate to contact us.
                    </p>
                    <p style="margin: 0; color: #333333; font-size: 16px; line-height: 1.6;">
                      Best regards,<br>
                      <strong style="color: #1E3A5F;">The Durotech Recruitment Team</strong>
                    </p>
                  </td>
                </tr>
                
                <!-- Footer -->
                <tr>
                  <td style="background-color: #1E3A5F; padding: 30px; text-align: center;">
                    <p style="margin: 0 0 10px 0; color: #F5C547; font-size: 14px; font-weight: bold;">Contact Us</p>
                    <p style="margin: 0 0 5px 0; color: #ffffff; font-size: 13px;">
                      📧 info@durotech.co.uk | 📞 +44 7950 206007
                    </p>
                    <p style="margin: 10px 0 0 0; color: #ffffff; font-size: 13px;">
                      123 Business Street, London, EC1A 1BB, United Kingdom
                    </p>
                    <p style="margin: 15px 0 0 0; color: #94a3b8; font-size: 12px;">
                      © ${new Date().getFullYear()} Durotech Recruitment. All rights reserved.
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

export function getAdminNotificationEmail(applicantName: string, jobTitle: string, applicationId: string) {
  const viewUrl = `${process.env.NEXT_PUBLIC_SITE_URL || "https://durotech.co.uk"}/admin/applications/${applicationId}`

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>New Application Received</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f5f5f5;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 40px 20px;">
          <tr>
            <td align="center">
              <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden;">
                <tr>
                  <td style="background-color: #F5C547; padding: 30px; text-align: center;">
                    <h1 style="margin: 0; color: #1E3A5F; font-size: 24px;">🔔 New Application Alert</h1>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 30px;">
                    <h2 style="margin: 0 0 15px 0; color: #1E3A5F; font-size: 20px;">Application Details</h2>
                    <p style="margin: 0 0 10px 0; color: #333333; font-size: 16px;">
                      <strong>Applicant:</strong> ${applicantName}
                    </p>
                    <p style="margin: 0 0 20px 0; color: #333333; font-size: 16px;">
                      <strong>Position:</strong> ${jobTitle}
                    </p>
                    <table width="100%" cellpadding="0" cellspacing="0" style="margin: 20px 0;">
                      <tr>
                        <td align="center">
                          <a href="${viewUrl}" style="display: inline-block; padding: 12px 30px; background-color: #1E3A5F; color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 16px;">
                            View Application in Dashboard
                          </a>
                        </td>
                      </tr>
                    </table>
                    <p style="margin: 20px 0 0 0; color: #666666; font-size: 14px; text-align: center;">
                      Received: ${new Date().toLocaleString("en-GB", { dateStyle: "full", timeStyle: "short" })}
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
