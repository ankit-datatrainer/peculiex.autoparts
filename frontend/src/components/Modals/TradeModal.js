'use client';

import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useCart } from '../../context/CartContext';
import { submitTradeIn } from '../../lib/api';

export default function TradeModal() {
  const { t } = useLanguage();
  const { activeModal, closeModal, showToast } = useCart();

  const [itemType, setItemType] = useState('');
  const [condition, setCondition] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);

  if (activeModal !== 'trade') return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!itemType || !condition || !phone) {
      showToast('Please fill all fields');
      return;
    }
    if (!/^\d{10}$/.test(phone.trim())) {
      showToast('Enter a valid 10-digit number');
      return;
    }

    setLoading(true);
    try {
      const res = await submitTradeIn({ itemType, condition, phone: phone.trim() });
      if (res.success) {
        showToast(`Request registered! Estimated value: ${res.estimate}`);
      } else {
        showToast('Thanks! Your trade-in estimate request is registered.');
      }
    } catch (err) {
      showToast('Thanks! Your trade-in estimate request is registered.');
    } finally {
      setLoading(false);
      closeModal();
    }
  };

  return (
    <>
      <div className="overlay" onClick={closeModal} />
      <div className="modal" id="tradeModal" role="dialog" aria-modal="true" aria-labelledby="tradeTitle">
        <button className="modal-close" onClick={closeModal} aria-label={t('Close')}>
          ×
        </button>
        <span className="eyebrow dark">{t('MOTOMART TRADE-IN')}</span>
        <h2 id="tradeTitle">{t('Turn old parts into ride credits')}</h2>
        <p>{t('Tell us what you want to sell. We’ll share an estimated exchange value.')}</p>

        <form id="tradeForm" onSubmit={handleSubmit}>
          <label>
            {t('Item type')}
            <select required value={itemType} onChange={(e) => setItemType(e.target.value)}>
              <option value="">{t('Choose an item')}</option>
              <option>{t('Helmet')}</option>
              <option>{t('Exhaust')}</option>
              <option>{t('Alloy wheel')}</option>
              <option>{t('Riding jacket')}</option>
              <option>{t('Other part')}</option>
            </select>
          </label>

          <label>
            {t('Condition')}
            <select required value={condition} onChange={(e) => setCondition(e.target.value)}>
              <option value="">{t('Choose condition')}</option>
              <option>{t('Like new')}</option>
              <option>{t('Good')}</option>
              <option>{t('Well used')}</option>
            </select>
          </label>

          <label>
            {t('Your mobile number')}
            <input
              inputMode="tel"
              placeholder={t('10-digit number')}
              pattern="[0-9]{10}"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </label>

          <button type="submit" disabled={loading}>
            {loading ? 'Submitting...' : t('Get estimate')}
          </button>
        </form>
      </div>
    </>
  );
}
