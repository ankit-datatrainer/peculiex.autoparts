'use client';

import React from 'react';
import Link from 'next/link';
import { useLanguage } from '../context/LanguageContext';
import { LANGUAGES } from '../lib/translations';
import { useCart } from '../context/CartContext';

export default function Footer() {
  const { language, setLanguage, t } = useLanguage();
  const { openModal } = useCart();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cycleLanguage = () => {
    const next = language === 'en' ? 'hi' : language === 'hi' ? 'mr' : 'en';
    setLanguage(next);
  };

  return (
    <footer id="help">
      <button className="back-top" type="button" onClick={scrollToTop}>
        {t('Back to top')} <span aria-hidden="true">↑</span>
      </button>

      <div className="footer-main page-shell">
        <div>
          <h3>{t('Get to know us')}</h3>
          <a href="#help">{t('About MotoMart')}</a>
          <a href="#help">{t('Careers')}</a>
          <a href="#help">{t('Press releases')}</a>
        </div>
        <div>
          <h3>{t('Connect with us')}</h3>
          <a href="https://instagram.com" target="_blank" rel="noreferrer">Instagram</a>
          <a href="https://youtube.com" target="_blank" rel="noreferrer">YouTube</a>
          <a href="https://facebook.com" target="_blank" rel="noreferrer">Facebook</a>
        </div>
        <div>
          <h3>{t('Make money with us')}</h3>
          <button type="button" onClick={() => openModal('trade')}>
            {t('Sell or trade parts')}
          </button>
          <a href="#help">{t('Become a seller')}</a>
          <a href="#help">{t('Advertise products')}</a>
        </div>
        <div>
          <h3>{t('Let us help you')}</h3>
          <button type="button" onClick={() => openModal('signin')}>
            {t('Your account')}
          </button>
          <a href="#help">{t('Returns centre')}</a>
          <a href="/#garage">{t('Fitment help')}</a>
          <a href="#help">{t('Contact us')}</a>
        </div>
      </div>

      <div className="footer-brand">
        <Link className="brand" href="/">
          <span className="brand-mark">
            <img src="/assets/site-icon.svg" alt={t('MotoMart logo')} width="36" height="36" />
          </span>
          <span className="brand-name">
            moto<span>mart</span>
            <small>.in</small>
          </span>
        </Link>
        <button type="button" id="footerLanguage" onClick={cycleLanguage}>
          🌐 {LANGUAGES.find((l) => l.code === language)?.label || 'English'}
        </button>
        <button type="button">🇮🇳 {t('India')}</button>
      </div>

      <div className="footer-bottom">
        <a href="#help">{t('Conditions of use')}</a>
        <a href="#help">{t('Privacy notice')}</a>
        <a href="#help">{t('Interest-based ads')}</a>
        <span>© 2026 MotoMart Commerce</span>
      </div>
    </footer>
  );
}
