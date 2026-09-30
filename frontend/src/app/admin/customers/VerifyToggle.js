'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { setCustomerVerified } from '../actions';
import { useLanguage } from '../../../context/LanguageContext';

/** Shows whether a customer can see prices, and lets an admin change it. */
export default function VerifyToggle({ userId, verified, email }) {
  const { t } = useLanguage();
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  const toggle = async () => {
    if (verified && !confirm(t('Remove verification? This customer will stop seeing prices.'))) return;
    setBusy(true);
    const res = await setCustomerVerified(userId, !verified);
    setBusy(false);
    if (res?.error) alert(res.error);
    router.refresh();
  };

  return (
    <div className="admin-verify">
      <span className={`admin-pill ${verified ? 'on' : 'off'}`} title={email}>
        {verified ? t('Verified') : t('Not verified')}
      </span>
      <button type="button" className="admin-ghost-btn small" onClick={toggle} disabled={busy}>
        {verified ? t('Remove') : t('Mark verified')}
      </button>
    </div>
  );
}
