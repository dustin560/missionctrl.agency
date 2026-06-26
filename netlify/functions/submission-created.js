// Netlify auto-invokes this function on every VERIFIED form submission
// (file name "submission-created" is the magic trigger — no wiring needed).
// It sends a branded TRANSACTIONAL thank-you via Brevo. Transactional email is
// not subject to marketing-consent gating, so it sends reliably to any submitter.
//
// Required Netlify env var:  BREVO_API_KEY   (Brevo > SMTP & API > API Keys)
// Optional env vars:
//   BREVO_SENDER_EMAIL   (default hello@missionctrl.agency — must be a verified
//                         Brevo sender or on an authenticated Brevo domain)
//   BREVO_SENDER_NAME    (default "Dustin Lawrence — MissionCTRL")
//   BREVO_TEMPLATE_ID    (if set, uses that Brevo template instead of the inline HTML)

exports.handler = async (event) => {
  try {
    const body = JSON.parse(event.body || '{}');
    const payload = body.payload || {};
    const data = payload.data || {};

    // Only handle the website contact form
    const formName = payload.form_name || data['form-name'] || '';
    if (formName && formName !== 'contact') {
      return { statusCode: 200, body: 'skipped: other form (' + formName + ')' };
    }

    const email = String(payload.email || data.email || '').trim();
    const name = String(data.name || payload.name || '').trim();
    if (!email) return { statusCode: 200, body: 'skipped: no email' };

    const apiKey = process.env.BREVO_API_KEY;
    if (!apiKey) {
      console.error('BREVO_API_KEY is not set');
      return { statusCode: 500, body: 'missing BREVO_API_KEY' };
    }

    const senderEmail = process.env.BREVO_SENDER_EMAIL || 'hello@missionctrl.agency';
    const senderName = process.env.BREVO_SENDER_NAME || 'Dustin Lawrence — MissionCTRL';
    const firstName = (name.split(/\s+/)[0] || 'there');

    let msg = {
      sender: { email: senderEmail, name: senderName },
      to: [{ email, name: name || undefined }],
      replyTo: { email: 'hello@missionctrl.agency', name: 'MissionCTRL' },
      tags: ['website-thankyou'],
    };

    if (process.env.BREVO_TEMPLATE_ID) {
      msg.templateId = Number(process.env.BREVO_TEMPLATE_ID);
      msg.params = { FIRSTNAME: firstName, NAME: name };
    } else {
      msg.subject = "Thanks — let's start the conversation";
      msg.htmlContent = renderHtml(firstName);
      msg.textContent =
        'Hi ' + firstName + ',\n\n' +
        "Thanks for reaching out — your message has landed with me, and I'll come back to you personally within one business day.\n\n" +
        "What happens next isn't a pitch or an audit. It's a conversation about trust — the gap between what you believe, what you say, and what your stakeholders actually experience.\n\n" +
        'Talk soon,\nDustin Lawrence\nFounder, MissionCTRL — powered by TrustOS\nmissionctrl.agency';
    }

    const res = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: { 'api-key': apiKey, 'Content-Type': 'application/json', accept: 'application/json' },
      body: JSON.stringify(msg),
    });

    const txt = await res.text();
    if (!res.ok) {
      console.error('Brevo send failed', res.status, txt);
      return { statusCode: 502, body: 'brevo error ' + res.status + ': ' + txt };
    }
    console.log('Thank-you sent to', email);

    // Optional: enrol the enquirer into a Brevo list so the nurture automation can run.
    // No-op unless BREVO_NURTURE_LIST_ID is set, so it's safe to deploy before the list exists.
    if (process.env.BREVO_NURTURE_LIST_ID) {
      try {
        await fetch('https://api.brevo.com/v3/contacts', {
          method: 'POST',
          headers: { 'api-key': apiKey, 'Content-Type': 'application/json', accept: 'application/json' },
          body: JSON.stringify({
            email,
            attributes: { FIRSTNAME: firstName },
            listIds: [Number(process.env.BREVO_NURTURE_LIST_ID)],
            updateEnabled: true,
          }),
        });
      } catch (e) { console.error('nurture enrol failed', e && e.message); }
    }

    return { statusCode: 200, body: 'sent' };
  } catch (e) {
    console.error('submission-created error', e && e.message);
    return { statusCode: 500, body: 'error' };
  }
};

function renderHtml(firstName) {
  return `<!doctype html><html><body style="margin:0;background:#f4f5f7;font-family:Arial,Helvetica,sans-serif;color:#1a1f2b;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f5f7;padding:32px 0;"><tr><td align="center">
    <table width="560" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;max-width:560px;width:100%;">
      <tr><td style="background:#0a0f1a;padding:28px 32px;">
        <span style="font-size:20px;font-weight:700;color:#ffffff;letter-spacing:-0.02em;">MissionCTRL</span>
        <span style="display:block;margin-top:4px;font-size:12px;color:#ff8a4c;letter-spacing:0.04em;text-transform:uppercase;">Powered by TrustOS</span>
      </td></tr>
      <tr><td style="padding:32px;">
        <p style="margin:0 0 16px;font-size:16px;line-height:1.6;">Hi ${escapeHtml(firstName)},</p>
        <p style="margin:0 0 16px;font-size:16px;line-height:1.6;">Thanks for reaching out — your message has landed with me, and I&rsquo;ll come back to you personally within one business day.</p>
        <p style="margin:0 0 16px;font-size:16px;line-height:1.6;">What happens next isn&rsquo;t a pitch or an audit. It&rsquo;s a conversation about <strong>trust</strong> — the gap between what you believe, what you say, and what your stakeholders actually experience.</p>
        <p style="margin:0 0 12px;font-size:16px;line-height:1.6;">If it's useful, grab a 15-minute slot and we'll talk it through — no pitch:</p>
        <p style="margin:0 0 22px;"><a href="https://meetings-eu1.hubspot.com/dustin-lawrence" style="display:inline-block;background:#ff6b2b;color:#ffffff;text-decoration:none;font-weight:700;font-size:15px;padding:13px 24px;border-radius:8px;">Book a 15-minute call &rarr;</a></p>
        <p style="margin:0 0 26px;font-size:14px;line-height:1.6;color:#6b7a8d;">Or read the pattern we keep measuring across sectors: <a href="https://missionctrl.agency/insights/the-alignment-problem-measured" style="color:#e85a1f;text-decoration:none;font-weight:600;">The Alignment Problem, Measured &rarr;</a></p>
        <p style="margin:0;font-size:16px;line-height:1.6;">Talk soon,<br><strong>Dustin Lawrence</strong><br>Founder, MissionCTRL</p>
      </td></tr>
      <tr><td style="padding:20px 32px;border-top:1px solid #eceef1;font-size:12px;color:#8a93a3;line-height:1.5;">
        MissionCTRL Ltd · <a href="https://missionctrl.agency" style="color:#8a93a3;">missionctrl.agency</a> · Brand. Made to move.
      </td></tr>
    </table>
  </td></tr></table></body></html>`;
}

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}
