// =============================================================================
// INVOICE PDF
//
// Rendered server side with pdfkit so it can be attached to an email as well as
// downloaded. Fully localised: labels, part names and the number format all
// follow the language the invoice is requested in.
//
// Font handling: Noto Sans covers Latin, digits and ₹; the Devanagari and
// Gujarati Notos cover their own scripts but carry no Latin letters. pdfkit has
// no automatic fallback, so drawText() splits a string into runs by script and
// draws each run with the right font. That keeps "Honda Activa માટે સ્પીડોમીટર"
// and "₹1,200.00" rendering correctly in one line.
// =============================================================================

import PDFDocument from 'pdfkit';
import path from 'node:path';
import { translateProductName } from './translations.parts.js';
import { statusLabel, paymentLabel } from './orderStatus.js';

const FONT_DIR = path.join(process.cwd(), 'src', 'lib', 'fonts');

const FONTS = {
  latin: path.join(FONT_DIR, 'NotoSans-Regular.ttf'),
  latinBold: path.join(FONT_DIR, 'NotoSans-Bold.ttf'),
  // Noto *Serif* Devanagari: the Sans build trips a fontkit GPOS bug
  // ("cannot read xCoordinate") when shaping conjuncts. The serif face shapes
  // correctly and is what Hindi/Marathi invoices use.
  deva: path.join(FONT_DIR, 'NotoSerifDevanagari-Regular.ttf'),
  guj: path.join(FONT_DIR, 'NotoSansGujarati-Regular.ttf')
};

const LABELS = {
  en: {
    invoice: 'TAX INVOICE',
    invoiceNo: 'Invoice number',
    order: 'Order number',
    date: 'Invoice date',
    billTo: 'Bill to',
    shipTo: 'Delivery address',
    item: 'Item',
    qty: 'Qty',
    rate: 'Rate',
    amount: 'Amount',
    subtotal: 'Subtotal',
    delivery: 'Delivery',
    total: 'Total',
    payment: 'Payment method',
    cod: 'Pay on delivery',
    status: 'Status',
    note: 'Order note',
    thanks: 'Thank you for shopping with us.',
    footer: 'Prices are inclusive of all applicable taxes. This is a computer-generated invoice.',
    free: 'FREE'
  },
  hi: {
    invoice: 'कर चालान',
    invoiceNo: 'चालान नंबर',
    order: 'ऑर्डर नंबर',
    date: 'चालान दिनांक',
    billTo: 'बिल प्राप्तकर्ता',
    shipTo: 'डिलीवरी पता',
    item: 'वस्तु',
    qty: 'मात्रा',
    rate: 'दर',
    amount: 'राशि',
    subtotal: 'उप-योग',
    delivery: 'डिलीवरी',
    total: 'कुल',
    payment: 'भुगतान विधि',
    cod: 'डिलीवरी पर भुगतान',
    status: 'स्थिति',
    note: 'ऑर्डर नोट',
    thanks: 'हमारे साथ खरीदारी करने के लिए धन्यवाद।',
    footer: 'कीमतों में सभी लागू कर शामिल हैं। यह कंप्यूटर से बनाया गया चालान है।',
    free: 'मुफ़्त'
  },
  mr: {
    invoice: 'कर चलन',
    invoiceNo: 'चलन क्रमांक',
    order: 'ऑर्डर क्रमांक',
    date: 'चलन दिनांक',
    billTo: 'बिल प्राप्तकर्ता',
    shipTo: 'डिलिव्हरी पत्ता',
    item: 'वस्तू',
    qty: 'संख्या',
    rate: 'दर',
    amount: 'रक्कम',
    subtotal: 'उप-एकूण',
    delivery: 'डिलिव्हरी',
    total: 'एकूण',
    payment: 'पेमेंट पद्धत',
    cod: 'डिलिव्हरीवर पेमेंट',
    status: 'स्थिती',
    note: 'ऑर्डर नोट',
    thanks: 'आमच्यासोबत खरेदी केल्याबद्दल धन्यवाद.',
    footer: 'किमतींमध्ये सर्व लागू कर समाविष्ट आहेत. हे संगणकाने तयार केलेले चलन आहे.',
    free: 'मोफत'
  },
  gu: {
    invoice: 'કર ઇન્વોઇસ',
    invoiceNo: 'ઇન્વોઇસ નંબર',
    order: 'ઓર્ડર નંબર',
    date: 'ઇન્વોઇસ તારીખ',
    billTo: 'બિલ મેળવનાર',
    shipTo: 'ડિલિવરી સરનામું',
    item: 'વસ્તુ',
    qty: 'જથ્થો',
    rate: 'દર',
    amount: 'રકમ',
    subtotal: 'પેટા-કુલ',
    delivery: 'ડિલિવરી',
    total: 'કુલ',
    payment: 'પેમેન્ટ પદ્ધતિ',
    cod: 'ડિલિવરી પર પેમેન્ટ',
    status: 'સ્થિતિ',
    note: 'ઓર્ડર નોંધ',
    thanks: 'અમારી સાથે ખરીદી કરવા બદલ આભાર.',
    footer: 'ભાવમાં તમામ લાગુ કર સામેલ છે. આ કમ્પ્યુટરથી બનેલું ઇન્વોઇસ છે.',
    free: 'મફત'
  }
};

const LOCALE = { en: 'en-IN', hi: 'hi-IN', mr: 'mr-IN', gu: 'gu-IN' };

/**
 * Amounts stay in en-IN digits in every language.
 *
 * mr-IN formats numbers in Devanagari digits (₹२,६४६.५०). On a tax invoice that
 * is the wrong call twice over: the figure would no longer match the price the
 * shopper agreed to at checkout — the storefront formats every price with
 * en-IN — and it would not match the payment or accounting record either.
 * Dates below are localised; amounts deliberately are not.
 */
const money = (n) =>
  '₹' +
  Number(n || 0).toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });

/** Splits text into runs of Devanagari / Gujarati / everything else. */
function scriptRuns(text) {
  const runs = [];
  let current = null;

  for (const ch of String(text ?? '')) {
    const cp = ch.codePointAt(0);
    let script = 'latin';
    if (cp >= 0x0900 && cp <= 0x097f) script = 'deva';
    else if (cp >= 0x0a80 && cp <= 0x0aff) script = 'guj';

    // Keep spaces and combining marks with the run they follow, so shaping holds.
    if (current && (script === current.script || ch === ' ')) current.text += ch;
    else {
      current = { script, text: ch };
      runs.push(current);
    }
  }
  return runs;
}

export function invoiceNumber(order) {
  return `INV-${order.order_number}`;
}

/**
 * @param {object} order   row from public.orders
 * @param {object[]} items rows from public.order_items
 * @param {object} opts    { lang, store }
 * @returns {Promise<Buffer>}
 */
export function renderInvoicePdf(order, items = [], opts = {}) {
  const lang = LABELS[opts.lang] ? opts.lang : 'en';
  const L = LABELS[lang];
  const store = opts.store || {};

  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ size: 'A4', margin: 46 });
    const chunks = [];
    doc.on('data', (c) => chunks.push(c));
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    doc.on('error', reject);

    doc.registerFont('latin', FONTS.latin);
    doc.registerFont('latinBold', FONTS.latinBold);
    doc.registerFont('deva', FONTS.deva);
    doc.registerFont('guj', FONTS.guj);

    const fontFor = (script, bold) =>
      script === 'deva' ? 'deva' : script === 'guj' ? 'guj' : bold ? 'latinBold' : 'latin';

    /** Draws mixed-script text at x,y, switching fonts per run. Returns end x. */
    const drawText = (text, x, y, { size = 10, bold = false, color = '#111827', width } = {}) => {
      let cursor = x;
      doc.fillColor(color).fontSize(size);
      for (const run of scriptRuns(text)) {
        doc.font(fontFor(run.script, bold));
        const w = doc.widthOfString(run.text);
        if (width && cursor + w > x + width) {
          // clip rather than overflow the column
          let clipped = '';
          for (const ch of run.text) {
            if (cursor + doc.widthOfString(clipped + ch + '…') > x + width) break;
            clipped += ch;
          }
          if (clipped) {
            doc.text(clipped + '…', cursor, y, { lineBreak: false });
            cursor += doc.widthOfString(clipped + '…');
          }
          return cursor;
        }
        doc.text(run.text, cursor, y, { lineBreak: false });
        cursor += w;
      }
      return cursor;
    };

    const rightAlign = (text, right, y, o = {}) => {
      let total = 0;
      doc.fontSize(o.size || 10);
      for (const run of scriptRuns(text)) {
        doc.font(fontFor(run.script, o.bold));
        total += doc.widthOfString(run.text);
      }
      return drawText(text, right - total, y, o);
    };

    /** Width of a mixed-script string at a given size, font switches included. */
    const measure = (text, size, bold) => {
      doc.fontSize(size);
      let total = 0;
      for (const run of scriptRuns(text)) {
        doc.font(fontFor(run.script, bold));
        total += doc.widthOfString(run.text);
      }
      return total;
    };

    /**
     * Greedily breaks text into lines that fit `width`.
     *
     * Item names are long — "Graphics Sticker Set for Hero Glamour | Black
     * Vehicle | Both Sides" — and a tax invoice must not abbreviate what the
     * customer bought, so the description wraps instead of being clipped. A
     * single word wider than the column is the one case that still gets cut,
     * since there is nowhere to break it.
     */
    const wrapLines = (text, width, { size = 9, bold = false, maxLines = 3 } = {}) => {
      const words = String(text ?? '').split(/\s+/).filter(Boolean);
      const lines = [];
      let line = '';

      for (const word of words) {
        const candidate = line ? `${line} ${word}` : word;
        if (measure(candidate, size, bold) <= width || !line) {
          line = candidate;
        } else {
          lines.push(line);
          line = word;
          if (lines.length === maxLines) break;
        }
      }
      if (line && lines.length < maxLines) lines.push(line);

      // Trim the last line with an ellipsis only if content was left over.
      const used = lines.join(' ');
      if (used.length < String(text ?? '').replace(/\s+/g, ' ').trim().length) {
        let last = lines[lines.length - 1] || '';
        while (last && measure(`${last}…`, size, bold) > width) {
          last = last.slice(0, -1);
        }
        lines[lines.length - 1] = `${last}…`;
      }
      return lines;
    };

    const PAGE_W = doc.page.width;
    const M = 46;
    const RIGHT = PAGE_W - M;
    let y = M;

    // ---- header ----
    drawText(store.name || 'MotoMart India', M, y, { size: 19, bold: true });
    rightAlign(L.invoice, RIGHT, y + 3, { size: 13, bold: true, color: '#c62828' });
    y += 26;

    drawText(store.supportEmail || 'support@motomart.in', M, y, { size: 9, color: '#6b7280' });
    y += 12;
    drawText(store.supportPhone || '', M, y, { size: 9, color: '#6b7280' });
    y += 22;

    doc.moveTo(M, y).lineTo(RIGHT, y).lineWidth(1).strokeColor('#e5e7eb').stroke();
    y += 16;

    // ---- meta ----
    const metaLeft = [
      [L.invoiceNo, invoiceNumber(order)],
      [L.order, order.order_number],
      [L.date, new Date(order.placed_at).toLocaleDateString(LOCALE[lang] || 'en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      })],
      // Both of these are database enums; without a lookup they printed as
      // "cod" and "out_for_delivery" on every non-English invoice.
      [L.payment, paymentLabel(order.payment_method, lang)],
      [L.status, statusLabel(order.status, lang)]
    ];

    const metaTop = y;
    for (const [label, value] of metaLeft) {
      drawText(label, M, y, { size: 8.5, color: '#6b7280' });
      drawText(String(value ?? ''), M + 96, y, { size: 9.5, bold: true });
      y += 15;
    }

    // ---- bill to ----
    let ry = metaTop;
    const RX = M + 300;
    drawText(L.billTo, RX, ry, { size: 8.5, color: '#6b7280' });
    ry += 13;
    drawText(order.customer_name || '', RX, ry, { size: 10, bold: true });
    ry += 13;
    for (const line of [
      [order.address_line1, order.address_line2].filter(Boolean).join(', '),
      `${order.city || ''}, ${order.state || ''} ${order.pincode || ''}`.trim(),
      order.customer_phone,
      order.customer_email
    ].filter(Boolean)) {
      drawText(String(line), RX, ry, { size: 9, color: '#374151', width: RIGHT - RX });
      ry += 12;
    }

    y = Math.max(y, ry) + 14;

    // ---- items table ----
    const COL = { item: M, qty: M + 292, rate: M + 360, amount: RIGHT };

    doc.rect(M, y - 4, RIGHT - M, 20).fillColor('#f4f4f5').fill();
    drawText(L.item, COL.item + 6, y + 2, { size: 8.5, bold: true, color: '#374151' });
    rightAlign(L.qty, COL.qty + 28, y + 2, { size: 8.5, bold: true, color: '#374151' });
    rightAlign(L.rate, COL.rate + 60, y + 2, { size: 8.5, bold: true, color: '#374151' });
    rightAlign(L.amount, COL.amount - 6, y + 2, { size: 8.5, bold: true, color: '#374151' });
    y += 24;

    const NAME_W = 275;

    for (const item of items) {
      const lines = wrapLines(translateProductName(item.name, lang), NAME_W, { size: 9 });
      const rowHeight = Math.max(18, lines.length * 12 + 6);

      if (y + rowHeight > doc.page.height - 150) {
        doc.addPage();
        y = M;
      }

      lines.forEach((line, i) => drawText(line, COL.item + 6, y + i * 12, { size: 9 }));
      rightAlign(String(item.qty), COL.qty + 28, y, { size: 9 });
      rightAlign(money(item.price), COL.rate + 60, y, { size: 9 });
      rightAlign(money(item.line_total), COL.amount - 6, y, { size: 9, bold: true });

      y += rowHeight;
      doc.moveTo(M, y - 5).lineTo(RIGHT, y - 5).lineWidth(0.5).strokeColor('#f1f1f1').stroke();
    }

    // ---- totals ----
    y += 10;
    const totals = [
      [L.subtotal, money(order.subtotal), false],
      [L.delivery, Number(order.shipping) === 0 ? L.free : money(order.shipping), false],
      [L.total, money(order.total), true]
    ];

    for (const [label, value, strong] of totals) {
      if (strong) {
        doc.moveTo(COL.rate - 30, y - 6).lineTo(RIGHT, y - 6).lineWidth(1).strokeColor('#e5e7eb').stroke();
        y += 4;
      }
      rightAlign(label, COL.rate + 60, y, { size: strong ? 11 : 9.5, bold: strong, color: strong ? '#111827' : '#6b7280' });
      rightAlign(value, COL.amount - 6, y, { size: strong ? 12 : 9.5, bold: true });
      y += strong ? 22 : 16;
    }

    // ---- note + footer ----
    if (order.notes) {
      y += 10;
      drawText(L.note, M, y, { size: 8.5, color: '#6b7280' });
      y += 13;
      drawText(String(order.notes), M, y, { size: 9, color: '#374151', width: RIGHT - M });
      y += 18;
    }

    y = Math.max(y + 16, doc.page.height - 96);
    doc.moveTo(M, y).lineTo(RIGHT, y).lineWidth(1).strokeColor('#e5e7eb').stroke();
    y += 12;
    drawText(L.thanks, M, y, { size: 10, bold: true });
    y += 15;
    drawText(L.footer, M, y, { size: 8, color: '#6b7280', width: RIGHT - M });

    doc.end();
  });
}
