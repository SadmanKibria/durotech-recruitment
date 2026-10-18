import { brandedEmail, escapeHtml, messageToHtml, sendEmail } from "@/lib/email"

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "info@durotech.co.uk"

export async function sendApplicationConfirmation(applicantEmail: string, applicantName: string, jobTitle: string) {
  const name = escapeHtml(applicantName)
  const role = escapeHtml(jobTitle)
  return sendEmail({
    to: applicantEmail,
    subject: `Application received — ${jobTitle}`,
    text: `Hello ${applicantName},\n\nWe have received your application for ${jobTitle}. Our recruitment team will review it and contact you if your experience matches the opportunity.\n\nDurotech Recruitment`,
    html: brandedEmail(`<h1 style="color:#0d1974;font-size:24px">Application received</h1><p>Hello ${name},</p><p>We have received your application for <strong>${role}</strong>. Our recruitment team will review it and contact you if your experience matches the opportunity.</p><p>Thank you for choosing Durotech Recruitment.</p>`),
  })
}

export async function sendAdminNotification(applicantName: string, applicantEmail: string, jobTitle: string, applicationId: string) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.durotech.co.uk"
  return sendEmail({
    to: ADMIN_EMAIL,
    subject: `New application — ${jobTitle}`,
    text: `${applicantName} (${applicantEmail}) applied for ${jobTitle}. Application ID: ${applicationId}`,
    html: brandedEmail(`<h1 style="color:#0d1974;font-size:24px">New application</h1><p><strong>${escapeHtml(applicantName)}</strong> applied for ${escapeHtml(jobTitle)}.</p><p>Email: ${escapeHtml(applicantEmail)}</p><p><a href="${baseUrl}/admin/applications/${encodeURIComponent(applicationId)}" style="display:inline-block;background:#ffd35a;color:#0d1974;padding:12px 18px;border-radius:10px;text-decoration:none;font-weight:700">Review application</a></p>`),
  })
}

export async function sendStatusUpdateEmail(applicantEmail: string, applicantName: string, jobTitle: string, newStatus: string) {
  return sendCustomEmail(
    applicantEmail,
    `Application update — ${jobTitle}`,
    `Hello ${applicantName},\n\nYour application for ${jobTitle} has been updated to: ${newStatus}.\n\nIf you have any questions, reply to this email.\n\nDurotech Recruitment`,
  )
}

export async function sendCustomEmail(to: string, subject: string, message: string, cc: string[] = []) {
  try {
    await sendEmail({
      to,
      cc,
      replyTo: process.env.REPLY_TO_EMAIL || "info@durotech.co.uk",
      subject,
      text: message,
      html: brandedEmail(`<div style="white-space:normal">${messageToHtml(message)}</div>`),
    })
    return { success: true }
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : "Email could not be sent" }
  }
}
