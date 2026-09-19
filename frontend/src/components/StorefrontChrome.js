'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import CartDrawer from './CartDrawer';
import LocationModal from './Modals/LocationModal';
import TradeModal from './Modals/TradeModal';
import SignInModal from './Modals/SignInModal';
import Toast from './Toast';
import LeftFabStack from './LeftFabStack';
import Chatbot from './Chatbot';

/**
 * Shopper-facing overlays (cart drawer, modals, WhatsApp and chat buttons).
 * They are noise inside the admin panel, so they are skipped there — the toast
 * stays, because admin actions use it for feedback.
 */
export default function StorefrontChrome({ products = [] }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith('/admin');

  if (isAdmin) return <Toast />;

  return (
    <>
      <CartDrawer products={products} />
      <LocationModal />
      <TradeModal />
      <SignInModal />
      <Toast />
      <LeftFabStack />
      <Chatbot />
    </>
  );
}
