'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { translations } from '../lib/translations';

const LanguageContext = createContext({
  language: 'en',
  setLanguage: () => {},
  t: (text) => text,
  local: (en, hi, mr) => en
});

export function LanguageProvider({ children }) {
  const [language, setLangState] = useState('en');

  useEffect(() => {
    try {
      const saved = localStorage.getItem('motomart-language');
      if (saved && ['en', 'hi', 'mr'].includes(saved)) {
        setLangState(saved);
        document.documentElement.lang = saved;
      }
    } catch (e) {}
  }, []);

  const setLanguage = (lang) => {
    const valid = ['en', 'hi', 'mr'].includes(lang) ? lang : 'en';
    setLangState(valid);
    try {
      localStorage.setItem('motomart-language', valid);
      document.documentElement.lang = valid;
    } catch (e) {}
  };

  const t = (text) => {
    if (!text || language === 'en') return text;
    return translations[language]?.[text] || text;
  };

  const local = (en, hi, mr) => {
    if (language === 'hi') return hi || en;
    if (language === 'mr') return mr || en;
    return en;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, local }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
