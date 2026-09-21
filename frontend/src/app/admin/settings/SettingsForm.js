'use client';

import React from 'react';
import { useFormState, useFormStatus } from 'react-dom';
import { saveSettings } from '../actions';
import { useLanguage } from '../../../context/LanguageContext';

function SaveButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" className="admin-primary-btn" disabled={pending}>
      {pending ? 'Saving…' : 'Save settings'}
    </button>
  );
}

export default function SettingsForm({ settings = {} }) {
  const { t } = useLanguage();
  const [state, action] = useFormState(saveSettings, {});

  return (
    <form action={action} className="admin-card admin-form-stack">
      <h2>{t('Store')}</h2>

      <label>
        <span>{t('Store name')}</span>
        <input name="name" defaultValue={settings.name || ''} />
      </label>

      <div className="admin-form-row">
        <label>
          <span>{t('Support phone')}</span>
          <input name="supportPhone" defaultValue={settings.supportPhone || ''} />
        </label>
        <label>
          <span>{t('Support email')}</span>
          <input name="supportEmail" type="email" defaultValue={settings.supportEmail || ''} />
        </label>
      </div>

      <h2 className="admin-subhead">{t('Delivery charges')}</h2>

      <div className="admin-form-row">
        <label>
          <span>{t('Free delivery above (₹)')}</span>
          <input
            name="freeShippingAbove"
            type="number"
            min="0"
            defaultValue={settings.freeShippingAbove ?? 999}
          />
        </label>
        <label>
          <span>{t('Delivery fee (₹)')}</span>
          <input name="shippingFee" type="number" min="0" defaultValue={settings.shippingFee ?? 59} />
        </label>
      </div>
      <p className="admin-hint">
        These are applied by the database when an order is placed, so changing them here changes
        what customers are charged.
      </p>

      <h2 className="admin-subhead">{t('Cart message')}</h2>
      <label>
        <span>{t('Notice shown on the cart and checkout pages')}</span>
        <textarea name="cartNotice" rows={3} defaultValue={settings.cartNotice || ''} />
      </label>

      {state?.error && <p className="admin-error">{state.error}</p>}
      {state?.notice && <p className="admin-notice">{state.notice}</p>}

      <SaveButton />
    </form>
  );
}
