import { profile } from "@/content/profile";

const escapeHtml = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");

export type ContactMessage = { name: string; email: string; message: string };

/**
 * Sends a contact-form message to Saif via Resend's REST API (no SDK needed for one call).
 * Replying to the email goes straight to the visitor thanks to `reply_to`.
 */
export async function sendContactEmail({ name, email, message }: ContactMessage) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) throw new Error("RESEND_API_KEY is not set");

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: process.env.CONTACT_FROM_EMAIL || "Portfolio <onboarding@resend.dev>",
      to: [process.env.CONTACT_TO_EMAIL || profile.email],
      reply_to: email,
      subject: `Portfolio: message from ${name}`,
      text: `${message}\n\n - ${name} <${email}>\nSent from your portfolio contact form.`,
      html: `<div style="font-family:system-ui,sans-serif;font-size:15px;line-height:1.6;color:#18181b">
  <p style="white-space:pre-wrap;margin:0 0 16px">${escapeHtml(message)}</p>
  <p style="margin:0;color:#52525b"> - ${escapeHtml(name)} &lt;${escapeHtml(email)}&gt;</p>
  <p style="margin:16px 0 0;font-size:12px;color:#a1a1aa">Sent from your portfolio contact form. Reply to answer ${escapeHtml(name)} directly.</p>
</div>`,
    }),
    signal: AbortSignal.timeout(10_000),
  });

  if (!res.ok) {
    throw new Error(`Resend responded ${res.status}: ${await res.text()}`);
  }
}
