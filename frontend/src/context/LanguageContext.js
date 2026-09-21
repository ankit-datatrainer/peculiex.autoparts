'use client';

import React, { createContext, useContext, useState } from 'react';
import { useRouter } from 'next/navigation';
import { translations, SUPPORTED_LANGUAGES, DEFAULT_LANGUAGE } from '../lib/translations';
import {
  translateProductName,
  translatePartTerm,
  translateFitment
} from '../lib/translations.parts';

const LanguageContext = createContext({
  language: DEFAULT_LANGUAGE,
  setLanguage: () => {},
  t: (text) => text,
  tName: (name) => name,
  tCat: (name) => name,
  tFit: (text) => text,
  local: (en) => en
});

/**
 * `initialLanguage` comes from the root layout, which reads the same cookie
 * this provider writes. Seeding the state from it rather than from
 * localStorage-after-mount is what keeps the server HTML and the first client
 * render identical — otherwise a Gujarati shopper would get a flash of English
 * and a hydration mismatch on every page.
 */
export function LanguageProvider({ children, initialLanguage = DEFAULT_LANGUAGE }) {
  const router = useRouter();
  const [language, setLangState] = useState(
    SUPPORTED_LANGUAGES.includes(initialLanguage) ? initialLanguage : DEFAULT_LANGUAGE
  );

  const setLanguage = (lang) => {
    const valid = SUPPORTED_LANGUAGES.includes(lang) ? lang : DEFAULT_LANGUAGE;
    setLangState(valid);

    try {
      localStorage.setItem('motomart-language', valid);
      document.documentElement.lang = valid;
      document.cookie = `motomart-language=${valid}; path=/; max-age=31536000; samesite=lax`;
    } catch (e) {}

    // Server components hold their own copy of the language, so ask Next to
    // re-render them against the cookie we just wrote. Without this the
    // client-side copy would switch and the server-rendered page around it
    // would stay in the previous language.
    router.refresh();
  };

  /** UI copy, category names and part terms. */
  const t = (text) => {
    if (!text || language === 'en') return text;
    return translations[language]?.[text] || text;
  };

  /** A catalog product title — translates the part words, keeps brand/model. */
  const tName = (name, categoryName = '') => translateProductName(name, language, categoryName);

  /** A category or part-group name. */
  const tCat = (name) => (language === 'en' ? name : translatePartTerm(name, language) || t(name));

  /** A fitment line — "Fits Honda Activa 6G" — in the right word order. */
  const tFit = (text) => translateFitment(text, language);

  /** Inline variants, in language order: English, Hindi, Marathi, Gujarati. */
  const local = (en, hi, mr, guj) => {
    if (language === 'hi') return hi || en;
    if (language === 'mr') return mr || en;
    if (language === 'gu') return guj || hi || en;
    return en;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, tName, tCat, tFit, local }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
