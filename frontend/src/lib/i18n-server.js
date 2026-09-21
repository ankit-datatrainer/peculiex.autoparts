// =============================================================================
// SERVER-SIDE TRANSLATION
//
// Most of this site renders on the server, where React context does not exist,
// so useLanguage() is unavailable exactly where the page banners, breadcrumbs,
// account pages and admin tables live. Those components read the language from
// the `motomart-language` cookie instead and get the same four helpers the
// client hook exposes, so a string is written the same way on both sides.
//
// Switching language rewrites the cookie and calls router.refresh(), which
// re-runs these server components with the new value.
// =============================================================================

import { cookies } from 'next/headers';
import { translations, SUPPORTED_LANGUAGES, DEFAULT_LANGUAGE } from './translations';
import {
  translateProductName,
  translatePartTerm,
  translateFitment
} from './translations.parts';

/** The shopper's language for this request. */
export function getLanguage() {
  try {
    const value = cookies().get('motomart-language')?.value;
    return SUPPORTED_LANGUAGES.includes(value) ? value : DEFAULT_LANGUAGE;
  } catch {
    // cookies() throws in a statically rendered segment — English is the default.
    return DEFAULT_LANGUAGE;
  }
}

const LOCALE = { en: 'en-IN', hi: 'hi-IN', mr: 'mr-IN', gu: 'gu-IN' };

/**
 * The same surface as useLanguage(), for server components.
 *
 *   const { t, tName, tCat, local, language } = getT();
 */
export function getT(lang) {
  const language = lang || getLanguage();

  const t = (text) => {
    if (!text || language === 'en') return text;
    return translations[language]?.[text] || text;
  };

  return {
    language,

    t,

    /** A catalog product title — translates the part words, keeps brand/model. */
    tName: (name, categoryName = '') => translateProductName(name, language, categoryName),

    /** A category or part-group name. */
    tCat: (name) => (language === 'en' ? name : translatePartTerm(name, language) || t(name)),

    /** A fitment line — "Fits Honda Activa 6G" — in the right word order. */
    tFit: (text) => translateFitment(text, language),

    /** Inline variants, in language order: English, Hindi, Marathi, Gujarati. */
    local: (en, hi, mr, guj) => {
      if (language === 'hi') return hi || en;
      if (language === 'mr') return mr || en;
      if (language === 'gu') return guj || hi || en;
      return en;
    },

    /**
     * Money stays in en-IN digits in every language — that is how prices are
     * written on Indian price tags, and it matches the invoice PDF.
     */
    money: (value) =>
      new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0
      }).format(Number(value) || 0),

    /** A date in the shopper's language, e.g. "22 सप्टेंबर 2026". */
    date: (value, opts = { day: 'numeric', month: 'long', year: 'numeric' }) => {
      const d = value instanceof Date ? value : new Date(value);
      if (Number.isNaN(d.getTime())) return '';
      try {
        return d.toLocaleString(LOCALE[language] || LOCALE.en, opts);
      } catch {
        return d.toLocaleString(LOCALE.en, opts);
      }
    }
  };
}
