'use client';

import React, { createContext, useContext, useMemo } from 'react';
import { DEFAULT_GST_RATE, DEFAULT_MOQ, gstRateFor, moqFor } from '../lib/commerce';

const StoreContext = createContext({
  access: { status: 'guest', canSee: false, email: null },
  gstRate: DEFAULT_GST_RATE,
  defaultMoq: DEFAULT_MOQ,
  gstFor: () => DEFAULT_GST_RATE,
  moqFor: () => DEFAULT_MOQ
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
      defaultMoq: commerce?.defaultMoq ?? DEFAULT_MOQ
    };
    return {
      access: access || { status: 'guest', canSee: false, email: null },
      ...store,
      gstFor: (product) => gstRateFor(product, store),
      moqFor: (product) => moqFor(product, store)
    };
  }, [access, commerce]);

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  return useContext(StoreContext);
}
