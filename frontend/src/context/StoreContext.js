'use client';

import React, { createContext, useContext, useMemo } from 'react';
import {
  DEFAULT_GST_RATE,
  DEFAULT_MOQ,
  DEFAULT_BULK_DISCOUNT,
  DEFAULT_BULK_MIN_QTY,
  gstRateFor,
  moqFor,
  unitPriceFor,
  priceTiers
} from '../lib/commerce';

const StoreContext = createContext({
  access: { status: 'guest', canSee: false, email: null },
  gstRate: DEFAULT_GST_RATE,
  defaultMoq: DEFAULT_MOQ,
  bulkDiscount: DEFAULT_BULK_DISCOUNT,
  bulkMinQty: DEFAULT_BULK_MIN_QTY,
  gstFor: () => DEFAULT_GST_RATE,
  moqFor: () => DEFAULT_MOQ,
  unitPrice: () => null,
  tiersFor: () => ({ bulk: false })
});

/**
 * Who is looking (can they see prices?) plus the store-wide GST % and MOQ.
 * Filled in by the root layout on every request, so signing in or verifying
 * followed by router.refresh() updates every price on the page.
 */
export function StoreProvider({ access, commerce, children }) {
  const value = useMemo(() => {
    const store = {
      gstRate: commerce?.gstRate ?? DEFAULT_GST_RATE,
      defaultMoq: commerce?.defaultMoq ?? DEFAULT_MOQ,
      bulkDiscount: commerce?.bulkDiscount ?? DEFAULT_BULK_DISCOUNT,
      bulkMinQty: commerce?.bulkMinQty ?? DEFAULT_BULK_MIN_QTY
    };
    return {
      access: access || { status: 'guest', canSee: false, email: null },
      ...store,
      gstFor: (product) => gstRateFor(product, store),
      moqFor: (product) => moqFor(product, store),
      // price of one piece when buying qty pieces (MRP below the bulk
      // threshold, MRP minus the bulk discount at or above it)
      unitPrice: (product, qty) => unitPriceFor(product, qty, store),
      tiersFor: (product) => priceTiers(product, store)
    };
  }, [access, commerce]);

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  return useContext(StoreContext);
}
