'use client';

import React, { useEffect } from 'react';
import { useCart } from '../context/CartContext';

export default function Toast() {
  const { toastMessage, showToast } = useCart();

  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => {
        showToast('');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage, showToast]);

  if (!toastMessage) return null;

  return (
    <div className={`toast ${toastMessage ? 'show' : ''}`} id="toast" role="status" aria-live="polite">
      {toastMessage}
    </div>
  );
}
