'use client';

import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';

export default function LeftFabStack() {
  const { t } = useLanguage();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const checkScroll = () => {
      setIsVisible(window.scrollY > 450);
    };
    window.addEventListener('scroll', checkScroll, { passive: true });
    checkScroll();
    return () => window.removeEventListener('scroll', checkScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="left-fab-stack" aria-label={t('Quick actions')}>
      <a
        className="whatsapp-fab"
        href="https://wa.me/?text=Hello%20MotoMart%2C%20I%20need%20help%20with%20bike%20parts."
        target="_blank"
        rel="noopener noreferrer"
        aria-label={t('Chat with MotoMart on WhatsApp')}
        title={t('WhatsApp')}
      >
        <svg viewBox="0 0 32 32" aria-hidden="true">
          <path d="M16.04 3A12.82 12.82 0 0 0 5.01 22.35L3.3 28.6l6.39-1.68A12.8 12.8 0 1 0 16.04 3Zm0 23.46a10.6 10.6 0 0 1-5.41-1.48l-.39-.23-3.79 1 1.01-3.7-.25-.38a10.66 10.66 0 1 1 8.83 4.79Zm5.84-7.98c-.32-.16-1.9-.94-2.2-1.04-.29-.11-.5-.16-.72.16-.21.32-.82 1.04-1.01 1.26-.19.21-.37.24-.69.08-.32-.16-1.35-.5-2.57-1.59a9.63 9.63 0 0 1-1.78-2.21c-.19-.32-.02-.49.14-.65.14-.14.32-.37.48-.56.16-.18.21-.32.32-.53.11-.22.05-.4-.03-.56-.08-.16-.72-1.73-.98-2.37-.26-.62-.52-.54-.72-.55h-.61c-.21 0-.56.08-.85.4-.29.32-1.11 1.09-1.11 2.65 0 1.56 1.14 3.07 1.3 3.28.16.21 2.24 3.42 5.43 4.8.76.33 1.35.52 1.81.67.76.24 1.45.21 2 .13.61-.09 1.9-.78 2.17-1.53.27-.75.27-1.4.19-1.53-.08-.14-.29-.22-.61-.38Z" />
        </svg>
      </a>

      <button
        className={`floating-back-top ${isVisible ? 'visible' : ''}`}
        id="floatingBackTop"
        type="button"
        onClick={scrollToTop}
        aria-label={t('Back to top')}
        title={t('Back to top')}
      >
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="m12 5-7 7 1.4 1.4 4.6-4.58V19h2V8.82l4.6 4.58L19 12l-7-7Z" />
        </svg>
      </button>
    </div>
  );
}
