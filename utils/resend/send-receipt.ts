import { Resend } from \"resend\";

const from = process.env.EMAIL_FROM || \"Banana image Support <support@bananaimage.site>\";

export async function sendReceiptEmail(to: string, subject: string, html: string) {
  const key = process.env.RESEND_API_KEY;
  if (!key) return;
  const resend = new Resend(key);
  try {
    await resend.emails.send({ from, to, subject, html });
  } catch (e) {
    console.error('Resend send error', e);
  }
}

export function simpleReceiptHTML(opts: { title: string; amount: string; credits: number; balance?: number; orderId?: string; date?: string; }) {
  const d = opts.date || new Date().toISOString();
  let html = "<div style=\\\"font-family:Inter,Arial,sans-serif;line-height:1.6\\\">";
  html += "<h2>" + opts.title + "</h2>";
  html += "<p><strong>Amount:</strong> " + opts.amount + "</p>";
  html += "<p><strong>Credits:</strong> " + String(opts.credits) + "</p>";
  if (typeof opts.balance === "number") html += "<p><strong>Balance:</strong> " + String(opts.balance) + "</p>";
  if (opts.orderId) html += "<p><strong>Order ID:</strong> " + opts.orderId + "</p>";
  html += "<p><strong>Date:</strong> " + d + "</p>";
  html += "<p style=\\\"color:#666\\\">Taxes calculated at checkout.</p>";
  html += "</div>";
  return html;
}
