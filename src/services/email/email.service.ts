export interface SendEmailOptions {
  to: string;
  toName: string;
  subject: string;
  message: string;
  orderNumber?: string;
}

export interface EmailResult {
  success: boolean;
  error?: string;
}

/**
 * Sends a transactional email via Resend's HTTP API.
 *
 * Requires VITE_RESEND_API_KEY and VITE_EMAIL_FROM in .env.local:
 *   VITE_RESEND_API_KEY=re_xxxxxxxxxxxxx
 *   VITE_EMAIL_FROM=Becute Dreams Luxe <noreply@yourdomain.com>
 */
export const emailService = {
  async sendCustomerEmail(options: SendEmailOptions): Promise<EmailResult> {
    const apiKey = import.meta.env.VITE_RESEND_API_KEY;
    const fromAddress = import.meta.env.VITE_EMAIL_FROM;

    if (!apiKey) {
      return { success: false, error: 'Email service not configured. Missing VITE_RESEND_API_KEY.' };
    }
    if (!fromAddress) {
      return { success: false, error: 'Email service not configured. Missing VITE_EMAIL_FROM.' };
    }

    const htmlBody = buildEmailHtml(options);

    try {
      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: fromAddress,
          to: [options.to],
          subject: options.subject,
          html: htmlBody,
        }),
      });

      if (!response.ok) {
        const body = await response.json().catch(() => ({}));
        const msg = (body as { message?: string }).message ?? response.statusText;
        return { success: false, error: `Resend API error: ${msg}` };
      }

      return { success: true };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      return { success: false, error: message };
    }
  },
};

function buildEmailHtml({ toName, subject, message, orderNumber }: SendEmailOptions): string {
  const orderLine = orderNumber
    ? `<p style="margin:0 0 8px;font-size:13px;color:#9ca3af;">Order: <strong>${orderNumber}</strong></p>`
    : '';

  // Preserve newlines from the textarea as <br> tags
  const safeMessage = message
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\n/g, '<br>');

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${subject}</title>
</head>
<body style="margin:0;padding:0;background:#f9fafb;font-family:'Helvetica Neue',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f9fafb;padding:40px 16px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 1px 4px rgba(0,0,0,0.08);">
          <!-- Header -->
          <tr>
            <td style="background:#1a1a2e;padding:28px 40px;text-align:center;">
              <h1 style="margin:0;font-size:22px;font-weight:700;color:#ffffff;letter-spacing:0.05em;">
                Becute Dreams Luxe
              </h1>
            </td>
          </tr>
          <!-- Body -->
          <tr>
            <td style="padding:40px;">
              <p style="margin:0 0 24px;font-size:15px;color:#374151;">
                Hi <strong>${toName}</strong>,
              </p>
              ${orderLine}
              <div style="margin:24px 0;font-size:15px;color:#374151;line-height:1.7;">
                ${safeMessage}
              </div>
              <hr style="border:none;border-top:1px solid #e5e7eb;margin:32px 0;" />
              <p style="margin:0;font-size:13px;color:#9ca3af;text-align:center;">
                Becute Dreams Luxe &nbsp;·&nbsp; This is an administrative message.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}
