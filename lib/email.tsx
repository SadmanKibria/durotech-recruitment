interface SendEmailParams {
  to: string
  cc?: string[]
  replyTo?: string
  subject: string
  html: string
  text?: string
  from?: string
}

export function escapeHtml(value: string) {
  return value.replace(/[&<>'"]/g, char => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" })[char]!)
}

export function messageToHtml(message: string) {
  return escapeHtml(message).replace(/\n/g, "<br />")
}

export function brandedEmail(body: string) {
  return `<!doctype html><html><body style="margin:0;background:#f4f6fb;font-family:Arial,sans-serif;color:#172033"><table width="100%" cellpadding="0" cellspacing="0" style="padding:28px 12px"><tr><td align="center"><table width="100%" cellpadding="0" cellspacing="0" style="max-width:620px;background:#fff;border-radius:20px;overflow:hidden"><tr><td style="background:#0d1974;padding:25px 30px;color:#fff"><strong style="font-size:23px">Durotech Recruitment</strong><div style="color:#ffd35a;font-size:12px;margin-top:6px;letter-spacing:1.2px">GLOBAL OPPORTUNITIES. PERSONAL SUPPORT.</div></td></tr><tr><td style="padding:30px;line-height:1.65">${body}</td></tr><tr><td style="background:#f8fafc;padding:20px 30px;color:#64748b;font-size:12px">Durotech Recruitment · info@durotech.co.uk · +44 7950 206007<br>London, United Kingdom</td></tr></table></td></tr></table></body></html>`
}

export async function sendEmail({ to, cc = [], replyTo, subject, html, text, from }: SendEmailParams) {
  const apiKey = process.env.MAILEROO_API_KEY
  const fromEmail = from || process.env.FROM_EMAIL || "noreply@durotech.co.uk"
  if (!apiKey) throw new Error("MAILEROO_API_KEY is not configured")

  const response = await fetch("https://smtp.maileroo.com/api/v2/emails", {
    method: "POST",
    headers: { "Content-Type": "application/json", "X-API-Key": apiKey },
    body: JSON.stringify({
      from: { address: fromEmail, display_name: "Durotech Group" },
      to: [{ address: to }],
      ...(cc.length ? { cc: cc.map(address => ({ address })) } : {}),
      ...(replyTo ? { reply_to: { address: replyTo, display_name: "Durotech Group" } } : {}),
      subject,
      html,
      plain: text,
    }),
  })
  if (!response.ok) {
    const detail = await response.text()
    console.error("Maileroo send failed", response.status, detail.slice(0, 300))
    throw new Error("The email provider rejected the message")
  }
  return { success: true }
}
