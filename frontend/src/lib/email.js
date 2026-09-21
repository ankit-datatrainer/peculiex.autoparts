// =============================================================================
// TRANSACTIONAL EMAIL
//
// Provider is chosen from the environment, so nothing here needs changing when
// you switch sender:
//   RESEND_API_KEY   -> Resend HTTPS API (no extra dependency)
//   SMTP_URL         -> any SMTP server, via nodemailer (npm i nodemailer)
//   neither          -> disabled; calls are logged and report why
//
// Sending is always best-effort: an order must never fail because the mail
// server is down, so every path resolves rather than throws.
// =============================================================================

import { paymentLabel } from './orderStatus.js';
import { translateProductName } from './translations.parts.js';

const FROM = process.env.MAIL_FROM || 'MotoMart <orders@motomart.in>';

export function emailProvider() {
  if (process.env.RESEND_API_KEY) return 'resend';
  if (process.env.SMTP_URL) return 'smtp';
  return null;
}

export function emailConfigured() {
  return emailProvider() !== null;
}

/**
 * @param {object} msg
 * @param {string} msg.to
 * @param {string} msg.subject
 * @param {string} msg.html
 * @param {string} [msg.text]
 * @param {{filename:string, content:Buffer, contentType?:string}[]} [msg.attachments]
 * @returns {Promise<{sent:boolean, provider?:string, reason?:string, error?:string}>}
 */
export async function sendMail({ to, subject, html, text, attachments = [] }) {
  const provider = emailProvider();

  if (!provider) {
    console.info(
      `[email] skipped "${subject}" to ${to} — no provider configured. ` +
        'Set RESEND_API_KEY or SMTP_URL to enable sending.'
    );
    return { sent: false, reason: 'not-configured' };
  }

  if (!to) return { sent: false, reason: 'no-recipient' };

  try {
    if (provider === 'resend') {
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          from: FROM,
          to: [to],
          subject,
          html,
          text,
          attachments: attachments.map((a) => ({
            filename: a.filename,
            content: Buffer.from(a.content).toString('base64')
          }))
        })
      });

      if (!res.ok) {
        const body = await res.text();
        console.error('[email] resend rejected the message:', res.status, body.slice(0, 300));
        return { sent: false, provider, error: `${res.status} ${body.slice(0, 200)}` };
      }
      return { sent: true, provider };
    }

    // SMTP — nodemailer is an optional dependency. webpackIgnore keeps the
    // bundler from trying to resolve it at build time when it is not installed.
    const nodemailer = await import(/* webpackIgnore: true */ 'nodemailer').catch(() => null);
    if (!nodemailer) {
      console.error('[email] SMTP_URL is set but nodemailer is not installed. Run: npm i nodemailer');
      return { sent: false, provider, error: 'nodemailer-missing' };
    }

    const transport = nodemailer.default.createTransport(process.env.SMTP_URL);
    await transport.sendMail({ from: FROM, to, subject, html, text, attachments });
    return { sent: true, provider };
  } catch (err) {
    console.error('[email] send failed:', err.message);
    return { sent: false, provider, error: err.message };
  }
}

const COPY = {
  en: {
    subject: (n) => `Your MotoMart order ${n} is confirmed`,
    preheader: 'Your invoice is attached. Track your order any time.',
    greeting: (name) => (name ? `Hi ${name},` : 'Hi,'),
    body: 'Thanks for your order. Your invoice is attached as a PDF.',
    items: 'What you ordered',
    qty: 'Qty',
    tracking: 'Track your order',
    subtotal: 'Subtotal',
    deliveryFee: 'Delivery',
    free: 'FREE',
    total: 'Order total',
    paymentMethod: 'Payment method',
    deliverTo: 'Delivering to',
    help: 'Reply to this email if anything looks wrong.'
  },
  hi: {
    subject: (n) => `आपका MotoMart ऑर्डर ${n} कन्फ़र्म हो गया`,
    preheader: 'आपका चालान संलग्न है। ऑर्डर कभी भी ट्रैक करें।',
    greeting: (name) => (name ? `नमस्ते ${name},` : 'नमस्ते,'),
    body: 'आपके ऑर्डर के लिए धन्यवाद। आपका चालान PDF में संलग्न है।',
    items: 'आपने क्या ऑर्डर किया',
    qty: 'मात्रा',
    tracking: 'अपना ऑर्डर ट्रैक करें',
    subtotal: 'उप-योग',
    deliveryFee: 'डिलीवरी',
    free: 'मुफ़्त',
    total: 'ऑर्डर कुल',
    paymentMethod: 'भुगतान विधि',
    deliverTo: 'डिलीवरी यहाँ',
    help: 'कुछ गलत लगे तो इसी ईमेल का जवाब दें।'
  },
  mr: {
    subject: (n) => `तुमची MotoMart ऑर्डर ${n} निश्चित झाली`,
    preheader: 'तुमचे चलन जोडले आहे. ऑर्डर कधीही ट्रॅक करा.',
    greeting: (name) => (name ? `नमस्कार ${name},` : 'नमस्कार,'),
    body: 'तुमच्या ऑर्डरबद्दल धन्यवाद. तुमचे चलन PDF मध्ये जोडले आहे.',
    items: 'तुम्ही काय ऑर्डर केले',
    qty: 'संख्या',
    tracking: 'तुमची ऑर्डर ट्रॅक करा',
    subtotal: 'उप-एकूण',
    deliveryFee: 'डिलिव्हरी',
    free: 'मोफत',
    total: 'ऑर्डर एकूण',
    paymentMethod: 'पेमेंट पद्धत',
    deliverTo: 'येथे डिलिव्हरी',
    help: 'काही चुकीचे वाटल्यास याच ईमेलला उत्तर द्या.'
  },
  gu: {
    subject: (n) => `તમારો MotoMart ઓર્ડર ${n} કન્ફર્મ થયો`,
    preheader: 'તમારું ઇન્વોઇસ જોડેલું છે. ઓર્ડર ગમે ત્યારે ટ્રેક કરો.',
    greeting: (name) => (name ? `નમસ્તે ${name},` : 'નમસ્તે,'),
    body: 'તમારા ઓર્ડર બદલ આભાર. તમારું ઇન્વોઇસ PDF માં જોડેલું છે.',
    items: 'તમે શું ઓર્ડર કર્યું',
    qty: 'જથ્થો',
    tracking: 'તમારો ઓર્ડર ટ્રેક કરો',
    subtotal: 'પેટા-કુલ',
    deliveryFee: 'ડિલિવરી',
    free: 'મફત',
    total: 'ઓર્ડર કુલ',
    paymentMethod: 'પેમેન્ટ પદ્ધતિ',
    deliverTo: 'ડિલિવરી સ્થળ',
    help: 'કંઈ ખોટું લાગે તો આ જ ઇમેઇલનો જવાબ આપો.'
  }
};

/** Amounts use en-IN digits in every language, exactly as the invoice does. */
const money = (n) => '₹' + Number(n || 0).toLocaleString('en-IN');

const escapeHtml = (v) =>
  String(v ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

/**
 * Order-confirmation email with the invoice attached.
 *
 * Everything the customer reads is localised: the subject line, the body, the
 * item names (through the same walker the storefront and the invoice use), the
 * payment method and the totals. `lang` is the language the shopper had
 * selected when they placed the order.
 */
export async function sendInvoiceEmail({ order, pdf, items = [], lang = 'en', siteUrl = '' }) {
  const C = COPY[lang] || COPY.en;
  const trackUrl = `${siteUrl}/account/orders/${order.id}`;
  const shipping = Number(order.shipping) || 0;
  const payment = paymentLabel(order.payment_method, lang);
  const deliverTo = [order.city, order.pincode].filter(Boolean).join(' ');

  const itemRows = (items || [])
    .map((item) => {
      const name = translateProductName(item.name, lang);
      return `
    <tr>
      <td style="padding:8px 0;border-bottom:1px solid #f1f1f1">
        <span style="font-size:13px">${escapeHtml(name)}</span><br>
        <span style="font-size:12px;color:#6b7280">${escapeHtml(C.qty)} ${Number(item.qty) || 1}</span>
      </td>
      <td style="padding:8px 0;border-bottom:1px solid #f1f1f1;text-align:right;font-size:13px;white-space:nowrap">
        ${money(item.line_total)}
      </td>
    </tr>`;
    })
    .join('');

  const row = (label, value, strong) => `
    <tr>
      <td style="padding:6px 0;color:#6b7280">${escapeHtml(label)}</td>
      <td style="padding:6px 0;text-align:right${strong ? ';font-weight:700' : ''}">${escapeHtml(value)}</td>
    </tr>`;

  const html = `<!doctype html>
<html lang="${lang}">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width"></head>
<body style="margin:0;background:#f6f7f8">
<span style="display:none;max-height:0;overflow:hidden;opacity:0">${escapeHtml(C.preheader)}</span>
<div style="font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif;max-width:560px;margin:0 auto;padding:24px;background:#fff;color:#111827">
  <h1 style="font-size:20px;margin:0 0 4px">MotoMart</h1>
  <p style="margin:0 0 18px;color:#6b7280;font-size:13px">${escapeHtml(order.order_number)}</p>
  <p style="font-size:15px;margin:0 0 8px">${escapeHtml(C.greeting(order.customer_name || ''))}</p>
  <p style="font-size:14px;line-height:1.55;margin:0 0 18px">${escapeHtml(C.body)}</p>
${
  itemRows
    ? `  <h2 style="font-size:14px;margin:0 0 4px">${escapeHtml(C.items)}</h2>
  <table style="width:100%;border-collapse:collapse;margin-bottom:12px">${itemRows}
  </table>`
    : ''
}
  <table style="width:100%;border-collapse:collapse;font-size:14px;margin-bottom:18px">
${row(C.subtotal, money(order.subtotal))}
${row(C.deliveryFee, shipping === 0 ? C.free : money(shipping))}
${row(C.total, money(order.total), true)}
${row(C.paymentMethod, payment)}
${deliverTo ? row(C.deliverTo, deliverTo) : ''}
  </table>
  <a href="${trackUrl}" style="display:inline-block;background:#111;color:#fff;text-decoration:none;padding:11px 22px;border-radius:999px;font-size:14px;font-weight:700">${escapeHtml(C.tracking)}</a>
  <p style="font-size:12px;color:#6b7280;margin:20px 0 0">${escapeHtml(C.help)}</p>
</div>
</body>
</html>`;

  const text = [
    C.greeting(order.customer_name || ''),
    '',
    C.body,
    '',
    ...(items || []).map(
      (i) => `- ${translateProductName(i.name, lang)}  ${C.qty} ${i.qty}  ${money(i.line_total)}`
    ),
    '',
    `${C.total}: ${money(order.total)}`,
    `${C.paymentMethod}: ${payment}`,
    '',
    trackUrl
  ].join('\n');

  return sendMail({
    to: order.customer_email,
    subject: C.subject(order.order_number),
    html,
    text,
    attachments: pdf
      ? [{ filename: `INV-${order.order_number}.pdf`, content: pdf, contentType: 'application/pdf' }]
      : []
  });
}
