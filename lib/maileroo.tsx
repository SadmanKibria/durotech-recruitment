/**
 * Email notification service for Durotech Group
 * Handles sending application confirmations and admin notifications via Maileroo
 */

const ADMIN_EMAIL = "info@durotech.co.uk"
const FROM_EMAIL = "noreply@durotech.co.uk"

function generateApplicationConfirmationHtml(applicantName: string, jobTitle: string): string {
  return `
    <html>
      <body style="font-family: Arial, sans-serif; background-color: #f5f5f5; padding: 20px;">
        <div style="max-width: 600px; margin: 0 auto; background-color: white; border-radius: 8px; padding: 30px;">
          <h1 style="color: #1E3A5F; border-bottom: 3px solid #F5C547; padding-bottom: 10px;">Durotech Group</h1>
          
          <h2 style="color: #1E3A5F; margin-top: 20px;">Thank You for Your Application!</h2>
          
          <p style="color: #333; line-height: 1.6;">Dear ${applicantName},</p>
          
          <p style="color: #333; line-height: 1.6;">
            Thank you for applying for the position of <strong>${jobTitle}</strong> with Durotech Group. 
            We have received your application and appreciate your interest in joining our team.
          </p>
          
          <div style="background-color: #f9f9f9; border-left: 4px solid #F5C547; padding: 15px; margin: 20px 0;">
            <p style="margin: 0; color: #666; font-size: 14px;">
              <strong>What happens next?</strong><br/>
              Our recruitment team will review your application and contact you within 5-7 working days if you meet the requirements for the next stage.
            </p>
          </div>
          
          <p style="color: #333; line-height: 1.6;">
            If you have any questions, please don't hesitate to reach out to us.
          </p>
          
          <p style="color: #333; line-height: 1.6;">
            Best regards,<br/>
            <strong>The Durotech Group Team</strong>
          </p>
          
          <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;" />
          
          <p style="color: #999; font-size: 12px; text-align: center;">
            Durotech Group | info@durotech.co.uk | +44 7950 206007<br/>
            London, United Kingdom
          </p>
        </div>
      </body>
    </html>
  `
}

function generateAdminNotificationHtml(
  applicantName: string,
  applicantEmail: string,
  jobTitle: string,
  applicationId: string
): string {
  return `
    <html>
      <body style="font-family: Arial, sans-serif; background-color: #f5f5f5; padding: 20px;">
        <div style="max-width: 600px; margin: 0 auto; background-color: white; border-radius: 8px; padding: 30px;">
          <h1 style="color: #1E3A5F; border-bottom: 3px solid #F5C547; padding-bottom: 10px;">New Application Alert</h1>
          
          <div style="background-color: #e3f2fd; border-left: 4px solid #1E3A5F; padding: 15px; margin: 20px 0;">
            <h2 style="margin: 0 0 10px 0; color: #1E3A5F;">Application Details</h2>
            <p style="margin: 5px 0; color: #333;"><strong>Job Title:</strong> ${jobTitle}</p>
            <p style="margin: 5px 0; color: #333;"><strong>Applicant:</strong> ${applicantName}</p>
            <p style="margin: 5px 0; color: #333;"><strong>Email:</strong> ${applicantEmail}</p>
            <p style="margin: 5px 0; color: #333;"><strong>Application ID:</strong> ${applicationId}</p>
            <p style="margin: 5px 0; color: #666; font-size: 12px;"><strong>Received:</strong> ${new Date().toLocaleString()}</p>
          </div>
          
          <p style="color: #333; line-height: 1.6;">
            A new application has been received and is awaiting review. Log in to the admin dashboard to view and manage the application.
          </p>
          
          <a href="https://durotech.co.uk/admin/applications/${applicationId}" 
             style="display: inline-block; background-color: #F5C547; color: #1E3A5F; padding: 10px 20px; text-decoration: none; border-radius: 4px; margin: 20px 0; font-weight: bold;">
            View Application
          </a>
          
          <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;" />
          
          <p style="color: #999; font-size: 12px;">
            This is an automated notification from Durotech Group Admin System.
          </p>
        </div>
      </body>
    </html>
  `
}

function generateStatusUpdateHtml(
  applicantName: string,
  jobTitle: string,
  newStatus: string
): string {
  const statusMessages: Record<string, { message: string; color: string }> = {
    applied: { message: "Your application has been received", color: "#2196F3" },
    shortlisted: {
      message: "Congratulations! You have been shortlisted",
      color: "#4CAF50",
    },
    interview: {
      message: "You are invited for an interview",
      color: "#4CAF50",
    },
    accepted: {
      message: "Congratulations! Your application has been accepted",
      color: "#4CAF50",
    },
    rejected: {
      message: "Unfortunately, your application was not successful",
      color: "#f44336",
    },
    on_hold: { message: "Your application is on hold", color: "#FF9800" },
  }

  const statusInfo = statusMessages[newStatus] || {
    message: "Your application status has been updated",
    color: "#2196F3",
  }

  return `
    <html>
      <body style="font-family: Arial, sans-serif; background-color: #f5f5f5; padding: 20px;">
        <div style="max-width: 600px; margin: 0 auto; background-color: white; border-radius: 8px; padding: 30px;">
          <h1 style="color: #1E3A5F; border-bottom: 3px solid #F5C547; padding-bottom: 10px;">Durotech Group</h1>
          
          <h2 style="color: #1E3A5F; margin-top: 20px;">Application Status Update</h2>
          
          <p style="color: #333; line-height: 1.6;">Dear ${applicantName},</p>
          
          <div style="background-color: #f0f8f0; border-left: 4px solid ${statusInfo.color}; padding: 15px; margin: 20px 0;">
            <p style="margin: 0; color: #333;"><strong>${statusInfo.message}</strong></p>
            <p style="margin: 10px 0 0 0; color: #666; font-size: 14px;">Position: ${jobTitle}</p>
          </div>
          
          <p style="color: #333; line-height: 1.6;">
            We appreciate your interest in Durotech Group. If you have any questions about your application status, 
            please don't hesitate to contact our recruitment team.
          </p>
          
          <p style="color: #333; line-height: 1.6;">
            Best regards,<br/>
            <strong>The Durotech Group Team</strong>
          </p>
          
          <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;" />
          
          <p style="color: #999; font-size: 12px; text-align: center;">
            Durotech Group | info@durotech.co.uk | +44 7950 206007<br/>
            London, United Kingdom
          </p>
        </div>
      </body>
    </html>
  `
}

export async function sendApplicationConfirmation(
  applicantEmail: string,
  applicantName: string,
  jobTitle: string
): Promise<void> {
  try {
    const response = await fetch("/api/send-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        to: applicantEmail,
        subject: `Application Received - ${jobTitle}`,
        html: generateApplicationConfirmationHtml(applicantName, jobTitle),
        from: FROM_EMAIL,
      }),
    })

    if (!response.ok) {
      console.error("Failed to send confirmation email:", response.statusText)
    }
  } catch (error) {
    console.error("Error sending confirmation email:", error)
  }
}

export async function sendAdminNotification(
  applicantName: string,
  applicantEmail: string,
  jobTitle: string,
  applicationId: string
): Promise<void> {
  try {
    const response = await fetch("/api/send-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        to: ADMIN_EMAIL,
        subject: `New Application Received - ${jobTitle}`,
        html: generateAdminNotificationHtml(applicantName, applicantEmail, jobTitle, applicationId),
        from: FROM_EMAIL,
      }),
    })

    if (!response.ok) {
      console.error("Failed to send admin notification:", response.statusText)
    }
  } catch (error) {
    console.error("Error sending admin notification:", error)
  }
}

export async function sendStatusUpdateEmail(
  applicantEmail: string,
  applicantName: string,
  jobTitle: string,
  newStatus: string
): Promise<void> {
  try {
    const response = await fetch("/api/send-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        to: applicantEmail,
        subject: `Application Status Update - ${jobTitle}`,
        html: generateStatusUpdateHtml(applicantName, jobTitle, newStatus),
        from: FROM_EMAIL,
      }),
    })

    if (!response.ok) {
      console.error("Failed to send status update email:", response.statusText)
    }
  } catch (error) {
    console.error("Error sending status update email:", error)
  }
}

export async function sendCustomEmail(
  to: string,
  subject: string,
  html: string
): Promise<void> {
  try {
    const response = await fetch("/api/send-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        to,
        subject,
        html,
        from: FROM_EMAIL,
      }),
    })

    if (!response.ok) {
      console.error("Failed to send custom email:", response.statusText)
    }
  } catch (error) {
    console.error("Error sending custom email:", error)
  }
}
