export interface EmailTemplate {
  subject: string
  html: string
}

export function getApplicationConfirmationEmail(applicantName: string, jobTitle: string): EmailTemplate {
  return {
    subject: `Application Received - ${jobTitle} Position`,
    html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Application Confirmation</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f5f5f5;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 40px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #1E3A5F 0%, #2C5282 100%); padding: 40px 30px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: bold;">
                Durotech<span style="color: #F5C547;">Recruitment</span>
              </h1>
              <p style="margin: 10px 0 0 0; color: #E0E7FF; font-size: 14px;">International Staffing Solutions</p>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 40px 30px;">
              <h2 style="margin: 0 0 20px 0; color: #1E3A5F; font-size: 24px;">Application Received Successfully!</h2>
              
              <p style="margin: 0 0 15px 0; color: #333333; font-size: 16px; line-height: 1.6;">
                Dear <strong>${applicantName}</strong>,
              </p>
              
              <p style="margin: 0 0 15px 0; color: #333333; font-size: 16px; line-height: 1.6;">
                Thank you for applying for the <strong style="color: #1E3A5F;">${jobTitle}</strong> position with Durotech Recruitment. 
                We have successfully received your application and our recruitment team will review it shortly.
              </p>
              
              <div style="background-color: #F0F7FF; border-left: 4px solid #1E3A5F; padding: 20px; margin: 25px 0; border-radius: 4px;">
                <h3 style="margin: 0 0 10px 0; color: #1E3A5F; font-size: 18px;">What Happens Next?</h3>
                <ul style="margin: 10px 0; padding-left: 20px; color: #333333; font-size: 15px; line-height: 1.8;">
                  <li>Our team will carefully review your application and CV</li>
                  <li>If your profile matches the requirements, we'll contact you within 3-5 business days</li>
                  <li>You may be invited for an interview or assessment</li>
                  <li>We'll keep you updated throughout the process</li>
                </ul>
              </div>
              
              <p style="margin: 20px 0 15px 0; color: #333333; font-size: 16px; line-height: 1.6;">
                In the meantime, feel free to browse our other <a href="https://durotech.co.uk/jobs" style="color: #1E3A5F; text-decoration: none; font-weight: bold;">available positions</a> 
                or learn more about <a href="https://durotech.co.uk/about" style="color: #1E3A5F; text-decoration: none; font-weight: bold;">our services</a>.
              </p>
              
              <p style="margin: 20px 0 0 0; color: #333333; font-size: 16px; line-height: 1.6;">
                Best regards,<br>
                <strong style="color: #1E3A5F;">The Durotech Recruitment Team</strong>
              </p>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="background-color: #F8F9FA; padding: 30px; text-align: center; border-top: 1px solid #E5E7EB;">
              <p style="margin: 0 0 10px 0; color: #6B7280; font-size: 14px;">
                <strong>Durotech Recruitment</strong><br>
                123 Business Street, London, EC1A 1BB, United Kingdom
              </p>
              <p style="margin: 10px 0; color: #6B7280; font-size: 13px;">
                Phone: +44 7950 206007 | Email: info@durotech.co.uk
              </p>
              <p style="margin: 10px 0 0 0; color: #9CA3AF; font-size: 12px;">
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
    `.trim(),
  }
}

export function getAdminNotificationEmail(
  applicantName: string,
  applicantEmail: string,
  jobTitle: string,
  applicationId: string,
): EmailTemplate {
  return {
    subject: `New Application: ${applicantName} for ${jobTitle}`,
    html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Application Notification</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f5f5f5;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 40px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
          <tr>
            <td style="background: linear-gradient(135deg, #1E3A5F 0%, #2C5282 100%); padding: 30px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 24px;">New Application Received</h1>
            </td>
          </tr>
          
          <tr>
            <td style="padding: 30px;">
              <div style="background-color: #FEF3C7; border-left: 4px solid #F59E0B; padding: 15px; margin-bottom: 20px; border-radius: 4px;">
                <p style="margin: 0; color: #92400E; font-size: 14px; font-weight: bold;">⚠️ Action Required: New application needs review</p>
              </div>
              
              <h2 style="margin: 0 0 20px 0; color: #1E3A5F; font-size: 20px;">Application Details</h2>
              
              <table width="100%" cellpadding="8" cellspacing="0" style="margin-bottom: 20px;">
                <tr style="background-color: #F9FAFB;">
                  <td style="padding: 12px; border: 1px solid #E5E7EB; font-weight: bold; color: #374151; width: 140px;">Applicant</td>
                  <td style="padding: 12px; border: 1px solid #E5E7EB; color: #1F2937;">${applicantName}</td>
                </tr>
                <tr>
                  <td style="padding: 12px; border: 1px solid #E5E7EB; font-weight: bold; color: #374151;">Email</td>
                  <td style="padding: 12px; border: 1px solid #E5E7EB; color: #1F2937;">${applicantEmail}</td>
                </tr>
                <tr style="background-color: #F9FAFB;">
                  <td style="padding: 12px; border: 1px solid #E5E7EB; font-weight: bold; color: #374151;">Position</td>
                  <td style="padding: 12px; border: 1px solid #E5E7EB; color: #1F2937;">${jobTitle}</td>
                </tr>
                <tr>
                  <td style="padding: 12px; border: 1px solid #E5E7EB; font-weight: bold; color: #374151;">Submitted</td>
                  <td style="padding: 12px; border: 1px solid #E5E7EB; color: #1F2937;">${new Date().toLocaleString("en-GB")}</td>
                </tr>
              </table>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="https://durotech.co.uk/admin/applications/${applicationId}" 
                   style="display: inline-block; background-color: #1E3A5F; color: #ffffff; padding: 14px 32px; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 16px;">
                  Review Application
                </a>
              </div>
              
              <p style="margin: 20px 0 0 0; color: #6B7280; font-size: 14px; text-align: center;">
                Log in to your admin dashboard to view full application details and CV
              </p>
            </td>
          </tr>
          
          <tr>
            <td style="background-color: #F8F9FA; padding: 20px; text-align: center; border-top: 1px solid #E5E7EB;">
              <p style="margin: 0; color: #9CA3AF; font-size: 12px;">
                This is an automated notification from Durotech Recruitment Admin System
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `.trim(),
  }
}

export function getCustomEmail(recipientName: string, subject: string, message: string): EmailTemplate {
  return {
    subject,
    html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${subject}</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f5f5f5;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 40px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
          <tr>
            <td style="background: linear-gradient(135deg, #1E3A5F 0%, #2C5282 100%); padding: 40px 30px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: bold;">
                Durotech<span style="color: #F5C547;">Recruitment</span>
              </h1>
            </td>
          </tr>
          
          <tr>
            <td style="padding: 40px 30px;">
              <p style="margin: 0 0 15px 0; color: #333333; font-size: 16px; line-height: 1.6;">
                Dear <strong>${recipientName}</strong>,
              </p>
              
              <div style="color: #333333; font-size: 16px; line-height: 1.6;">
                ${message.replace(/\n/g, "<br>")}
              </div>
              
              <p style="margin: 30px 0 0 0; color: #333333; font-size: 16px; line-height: 1.6;">
                Best regards,<br>
                <strong style="color: #1E3A5F;">The Durotech Recruitment Team</strong>
              </p>
            </td>
          </tr>
          
          <tr>
            <td style="background-color: #F8F9FA; padding: 30px; text-align: center; border-top: 1px solid #E5E7EB;">
              <p style="margin: 0 0 10px 0; color: #6B7280; font-size: 14px;">
                <strong>Durotech Recruitment</strong><br>
                123 Business Street, London, EC1A 1BB, United Kingdom
              </p>
              <p style="margin: 10px 0; color: #6B7280; font-size: 13px;">
                Phone: +44 7950 206007 | Email: info@durotech.co.uk
              </p>
              <p style="margin: 10px 0 0 0; color: #9CA3AF; font-size: 12px;">
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
    `.trim(),
  }
}
