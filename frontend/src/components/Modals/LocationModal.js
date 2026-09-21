'use client';

import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useCart } from '../../context/CartContext';

export default function LocationModal() {
  const { t } = useLanguage();
  const { activeModal, closeModal, setDeliveryLocation, showToast } = useCart();
  const [pin, setPin] = useState('');

  if (activeModal !== 'location') return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!/^\d{6}$/.test(pin.trim())) {
      showToast('Enter a valid 6-digit PIN code');
      return;
    }
    const newLocation = `India ${pin.trim()}`;
    setDeliveryLocation(newLocation);
    try {
      const savedGarage = JSON.parse(localStorage.getItem('motomart-garage') || '{}');
      savedGarage.pin = newLocation;
      localStorage.setItem('motomart-garage', JSON.stringify(savedGarage));
    } catch (err) {}
    closeModal();
    showToast('Delivery location updated');
  };

  return (
    <>
      <div className="overlay" onClick={closeModal} />
      <div className="modal" id="locationModal" role="dialog" aria-modal="true" aria-labelledby="locationTitle">
        <button className="modal-close" onClick={closeModal} aria-label={t('Close')}>
          ×
        </button>
        <h2 id="locationTitle">{t('Choose your location')}</h2>
        <p>{t('Enter a PIN code to see delivery options and local availability.')}</p>
        <form id="locationForm" onSubmit={handleSubmit}>
          <input
            id="pincodeInput"
            inputMode="numeric"
            maxLength={6}
            pattern="[0-9]{6}"
            placeholder={t('6-digit PIN code')}
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            required
            autoFocus
          />
          <button type="submit">{t('Apply')}</button>
        </form>
      </div>
    </>
  );
}
