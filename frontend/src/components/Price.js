'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useStore } from '../context/StoreContext';
import { useLanguage } from '../context/LanguageContext';
import { formatCurrency } from '../lib/translations';

/**
 * Where the "see the price" link sends a shopper: sign in first, then verify
 * the email, then straight back to the page they were on.
 */
export function usePriceUnlockLink() {
  const pathname = usePathname() || '/';
  const { access } = useStore();
  const next = encodeURIComponent(pathname);
  if (access.status === 'guest') return `/signin?next=${next}`;
  return `/verify-email?next=${next}`;
}

/**
 * A blurred stand-in for a hidden price plus the link that unlocks it.
 * `size`: "sm" on cards and rails, "lg" on the product page.
 */
export function PriceLock({ size = 'sm', className = '' }) {
  const { t } = useLanguage();
  const { access } = useStore();
  const href = usePriceUnlockLink();
  const guest = access.status === 'guest';

  const label =
    size === 'lg'
      ? guest
        ? t('Click here to log in')
        : t('Click here to verify your email')
      : guest
        ? t('Log in to see price')
        : t('Verify email to see price');

  return (
    <span className={`price-lock price-lock-${size} ${className}`.trim()}>
      <span className="price-lock-blur" aria-hidden="true">
        ₹8,888
      </span>
      <Link href={href} className="price-lock-cta" prefetch={false}>
        <span aria-hidden="true">🔒</span> {label}
      </Link>
    </span>
  );
}

/** A price when the viewer may see it, otherwise the blurred lock. */
export default function Price({ amount, className = '', size = 'sm', as: Tag = 'span' }) {
  const { access } = useStore();
  if (!access.canSee) return <PriceLock size={size} className={className} />;
  // Allowed to see it, but this copy was saved while prices were hidden and
  // the fresh one is still loading.
  if (amount === null || amount === undefined) return <Tag className={className}>…</Tag>;
  return <Tag className={className}>{formatCurrency(amount)}</Tag>;
}
