import { cookies } from 'next/headers';
import { createClient, isSupabaseConfigured } from '../../../../../lib/supabase/server';
import { getStoreSettings } from '../../../../../lib/catalog';
import { renderInvoicePdf, invoiceNumber } from '../../../../../lib/invoice';

export const dynamic = 'force-dynamic';

const SUPPORTED = ['en', 'hi', 'mr', 'gu'];

// The failure paths are the only thing a customer can see from this route other
// than the PDF itself, so they speak the same language the invoice would have.
const MESSAGES = {
  en: {
    unconfigured: 'Invoices are not available — the store database is not configured.',
    signIn: 'Sign in to download your invoice.',
    notFound: 'Order not found.',
    failed: 'Could not generate the invoice.'
  },
  hi: {
    unconfigured: 'चालान उपलब्ध नहीं है — स्टोर डेटाबेस कॉन्फ़िगर नहीं है।',
    signIn: 'अपना चालान डाउनलोड करने के लिए साइन इन करें।',
    notFound: 'ऑर्डर नहीं मिला।',
    failed: 'चालान नहीं बनाया जा सका।'
  },
  mr: {
    unconfigured: 'चलन उपलब्ध नाही — स्टोअर डेटाबेस कॉन्फिगर केलेला नाही.',
    signIn: 'तुमचे चलन डाउनलोड करण्यासाठी साइन इन करा.',
    notFound: 'ऑर्डर सापडली नाही.',
    failed: 'चलन तयार करता आले नाही.'
  },
  gu: {
    unconfigured: 'ઇન્વોઇસ ઉપલબ્ધ નથી — સ્ટોર ડેટાબેઝ કૉન્ફિગર થયેલો નથી.',
    signIn: 'તમારું ઇન્વોઇસ ડાઉનલોડ કરવા સાઇન ઇન કરો.',
    notFound: 'ઓર્ડર મળ્યો નથી.',
    failed: 'ઇન્વોઇસ બનાવી શકાયું નથી.'
  }
};

const textResponse = (body, status) =>
  new Response(body, {
    status,
    headers: { 'Content-Type': 'text/plain; charset=utf-8' }
  });

/**
 * Invoice PDF for one order.
 *
 * Row level security does the authorisation: the select only returns the order
 * if it belongs to the signed-in customer, or if they are an admin.
 * Language comes from ?lang=, else the language cookie, else English.
 */
export async function GET(request, { params }) {
  const url = new URL(request.url);
  const asked = url.searchParams.get('lang');
  const cookieLang = cookies().get('motomart-language')?.value;
  const lang = SUPPORTED.includes(asked) ? asked : SUPPORTED.includes(cookieLang) ? cookieLang : 'en';
  const M = MESSAGES[lang];

  if (!isSupabaseConfigured) return textResponse(M.unconfigured, 503);

  const supabase = createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) return textResponse(M.signIn, 401);

  const { data: order } = await supabase
    .from('orders')
    .select('*')
    .eq('id', params.id)
    .maybeSingle();

  if (!order) return textResponse(M.notFound, 404);

  const [{ data: items }, store] = await Promise.all([
    supabase.from('order_items').select('*').eq('order_id', order.id),
    getStoreSettings()
  ]);

  try {
    const pdf = await renderInvoicePdf(order, items || [], { lang, store });

    return new Response(pdf, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `inline; filename="${invoiceNumber(order)}-${lang}.pdf"`,
        'Cache-Control': 'private, no-store'
      }
    });
  } catch (err) {
    console.error('invoice render failed', err);
    return textResponse(M.failed, 500);
  }
}
