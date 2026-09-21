'use client';

import React, { useState, useRef, useEffect } from 'react';
import { askChatbot } from '../lib/api';
import { useLanguage } from '../context/LanguageContext';

export default function Chatbot() {
  const { t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    {
      type: 'bot',
      text: t(
        'Hi! I can help with delivery, returns, fitment, payments, orders and trade-ins. What would you like to know?'
      )
    }
  ]);
  const [loading, setLoading] = useState(false);

  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (isOpen && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const handleSend = async (question) => {
    const clean = (question || input).trim();
    if (!clean || loading) return;

    setMessages((prev) => [...prev, { type: 'user', text: clean }]);
    setInput('');
    setLoading(true);

    try {
      const res = await askChatbot(clean);
      if (res.success && res.data?.answer) {
        setMessages((prev) => [...prev, { type: 'bot', text: res.data.answer }]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            type: 'bot',
            text:
              'I can help with delivery, returns, fitment, payments, orders, products and trade-ins. Try asking about one of those topics or choose a suggestion above.'
          }
        ]);
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          type: 'bot',
          text:
            'I can help with delivery, returns, fitment, payments, orders, products and trade-ins. Feel free to contact our customer support for specific queries.'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  // The question stays English — that is what the backend matches on — while
  // the chip the shopper reads is localised.
  const quickReplies = [
    { label: t('Delivery'), q: 'How long does delivery take?' },
    { label: t('Returns'), q: 'What is the return policy?' },
    { label: t('Fitment'), q: 'How do I check part fitment?' },
    { label: t('Payments'), q: 'Which payment methods are available?' }
  ];

  return (
    <>
      <section
        className="chatbot-panel"
        id="chatbotPanel"
        role="dialog"
        aria-modal="false"
        aria-labelledby="chatbotTitle"
        hidden={!isOpen}
      >
        <header className="chatbot-header">
          <div>
            <span className="chatbot-status" aria-hidden="true" />
            <div>
              <strong id="chatbotTitle">{t('MotoMart Help')}</strong>
              <small>{t('Quick answers for riders')}</small>
            </div>
          </div>
          <button
            id="closeChatbot"
            type="button"
            aria-label={t('Close chat')}
            onClick={() => setIsOpen(false)}
          >
            ×
          </button>
        </header>

        <div className="chatbot-messages" id="chatbotMessages" role="log" aria-live="polite">
          {messages.map((m, idx) => (
            <p key={idx} className={`chat-message ${m.type}`}>
              {m.text}
            </p>
          ))}
          {loading && <p className="chat-message bot">{t('MotoMart AI is typing...')}</p>}
          <div ref={messagesEndRef} />
        </div>

        <div className="chatbot-quick-replies" aria-label={t('Suggested questions')}>
          {quickReplies.map((qr) => (
            <button key={qr.label} type="button" onClick={() => handleSend(qr.q)}>
              {qr.label}
            </button>
          ))}
        </div>

        <form
          className="chatbot-form"
          id="chatbotForm"
          onSubmit={(e) => {
            e.preventDefault();
            handleSend(input);
          }}
        >
          <label className="sr-only" htmlFor="chatbotInput">
            {t('Ask MotoMart a question')}
          </label>
          <input
            id="chatbotInput"
            type="text"
            maxLength={180}
            autoComplete="off"
            placeholder={t('Type your question...')}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            required
          />
          <button type="submit" aria-label={t('Send question')} disabled={loading}>
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="m3.4 20.4 17.45-7.48c.81-.35.81-1.49 0-1.84L3.4 3.6c-.66-.29-1.36.2-1.27.92L3 10.5l11 1.5-11 1.5-.87 5.98c-.09.72.61 1.21 1.27.92Z" />
            </svg>
          </button>
        </form>
      </section>

      <button
        className="chatbot-launcher"
        id="chatbotLauncher"
        type="button"
        aria-label={t('Open MotoMart help chat')}
        aria-controls="chatbotPanel"
        aria-expanded={isOpen}
        title={t('Help chat')}
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M20 2H4a2 2 0 0 0-2 2v18l4-4h14a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2Zm-2 11H6v-2h12v2Zm0-3H6V8h12v2Zm0-3H6V5h12v2Z" />
        </svg>
      </button>
    </>
  );
}
