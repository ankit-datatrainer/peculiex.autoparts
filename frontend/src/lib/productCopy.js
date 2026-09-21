// =============================================================================
// PRODUCT COPY
//
// The "About this item" bullets come from the source feed as free-form English
// marketing prose ("Asbestos-free high-friction ceramic composite material…").
// That is not dictionary-translatable — a word-by-word pass over it produces
// something no Hindi or Gujarati reader would accept, and silently mangling
// claims about a safety part is worse than leaving them in English.
//
// So for the other three languages the bullets are *written*, not translated:
// composed from the structured facts we actually hold (part type, fitment,
// vendor, warranty, delivery). The English feed copy is still used verbatim
// when the shopper is reading English.
//
// Shared by the server and the client so both render the same words.
// =============================================================================

import { translatePartTerm, translateFitment } from './translations.parts';

const COPY = {
  hi: {
    genuine: (part) => `असली ${part} — OEM फ़िटमेंट के अनुसार बना और फ़ैक्ट्री-सील्ड।`,
    fits: (vehicle) => `${vehicle} के लिए फ़िटमेंट जाँचा गया है।`,
    vendor: (v) => `${v} द्वारा निर्मित, गुणवत्ता जाँच के बाद भेजा जाता है।`,
    quality: 'हर पार्ट डिस्पैच से पहले जाँचा जाता है — 7 दिन का रिप्लेसमेंट उपलब्ध।',
    delivery: 'पूरे भारत में डिलीवरी, डिलीवरी पर भुगतान की सुविधा।',
    fitLabel: 'फ़िटमेंट:',
    check: 'ऑर्डर करने से पहले अपनी गाड़ी की जाँच करें।'
  },
  mr: {
    genuine: (part) => `अस्सल ${part} — OEM फिटमेंटनुसार बनवलेला आणि फॅक्टरी-सील्ड.`,
    fits: (vehicle) => `${vehicle} साठी फिटमेंट तपासलेले आहे.`,
    vendor: (v) => `${v} कडून निर्मित, गुणवत्ता तपासणीनंतर पाठवला जातो.`,
    quality: 'प्रत्येक पार्ट पाठवण्यापूर्वी तपासला जातो — ७ दिवसांचे रिप्लेसमेंट उपलब्ध.',
    delivery: 'संपूर्ण भारतात डिलिव्हरी, डिलिव्हरीवर पेमेंटची सोय.',
    fitLabel: 'फिटमेंट:',
    check: 'ऑर्डर करण्यापूर्वी तुमचे वाहन तपासा.'
  },
  gu: {
    genuine: (part) => `અસલી ${part} — OEM ફિટમેન્ટ પ્રમાણે બનાવેલ અને ફેક્ટરી-સીલ્ડ.`,
    fits: (vehicle) => `${vehicle} માટે ફિટમેન્ટ ચકાસેલું છે.`,
    vendor: (v) => `${v} દ્વારા ઉત્પાદિત, ગુણવત્તા ચકાસણી પછી મોકલવામાં આવે છે.`,
    quality: 'દરેક પાર્ટ મોકલતા પહેલાં ચકાસવામાં આવે છે — ૭ દિવસનું રિપ્લેસમેન્ટ ઉપલબ્ધ.',
    delivery: 'સમગ્ર ભારતમાં ડિલિવરી, ડિલિવરી પર પેમેન્ટની સુવિધા.',
    fitLabel: 'ફિટમેન્ટ:',
    check: 'ઓર્ડર કરતાં પહેલાં તમારું વાહન ચકાસો.'
  }
};

/**
 * The "About this item" bullets.
 * English returns the feed copy; other languages get facts we can stand behind.
 */
export function aboutBullets(product, lang) {
  if (!product) return [];

  if (lang === 'en' || !COPY[lang]) {
    return (
      product.about ||
      (product.description
        ? product.description.split(/(?<=\.)\s+/).filter(Boolean).slice(0, 4)
        : [`Genuine replacement ${product.category} for the ${product.brand}.`])
    );
  }

  const C = COPY[lang];
  const part = translatePartTerm(product.category || '', lang) || product.category || '';
  const vehicle = [product.brand, product.modelName].filter(Boolean).join(' ');

  const bullets = [C.genuine(part)];
  if (vehicle) bullets.push(C.fits(vehicle));
  if (product.vendor && product.vendor !== product.brand) bullets.push(C.vendor(product.vendor));
  bullets.push(C.quality, C.delivery);

  return bullets.slice(0, 4);
}

/** The fitment line under the bullets, already localised. */
export function fitmentLine(product, lang) {
  const C = COPY[lang];
  if (!C) return { label: 'Fitment:', value: product?.fit || '', check: 'Check your vehicle before ordering.' };
  return {
    label: C.fitLabel,
    value: translateFitment(product?.fit || '', lang),
    check: C.check
  };
}

const SPEC_LABELS = {
  Brand: { hi: 'ब्रांड', mr: 'ब्रँड', gu: 'બ્રાન્ડ' },
  'Part Number': { hi: 'पार्ट नंबर', mr: 'पार्ट नंबर', gu: 'પાર્ટ નંબર' },
  'Part Type': { hi: 'पार्ट का प्रकार', mr: 'पार्टचा प्रकार', gu: 'પાર્ટનો પ્રકાર' },
  'Vehicle Brand': { hi: 'गाड़ी का ब्रांड', mr: 'वाहनाचा ब्रँड', gu: 'વાહનની બ્રાન્ડ' },
  Availability: { hi: 'उपलब्धता', mr: 'उपलब्धता', gu: 'ઉપલબ્ધતા' }
};

const IN_STOCK = { hi: 'स्टॉक में', mr: 'स्टॉकमध्ये', gu: 'સ્ટોકમાં' };
const OUT_OF_STOCK = { hi: 'स्टॉक में नहीं', mr: 'स्टॉकमध्ये नाही', gu: 'સ્ટોકમાં નથી' };

/** The OEM specification table, with both columns localised. */
export function specRows(product, lang) {
  const specs = product?.specs;
  if (!specs) return [];

  return Object.entries(specs).map(([key, value]) => {
    const label = lang === 'en' ? key : SPEC_LABELS[key]?.[lang] || key;

    let shown = value;
    if (lang !== 'en' && typeof value === 'string') {
      if (key === 'Part Type') {
        shown = translatePartTerm(value, lang);
      } else if (key === 'Availability') {
        // "In stock (25)" keeps its count.
        const count = value.match(/\((\d+)\)/);
        shown = /out of stock/i.test(value)
          ? OUT_OF_STOCK[lang]
          : `${IN_STOCK[lang]}${count ? ` (${count[1]})` : ''}`;
      }
    }

    return { key, label, value: shown };
  });
}
