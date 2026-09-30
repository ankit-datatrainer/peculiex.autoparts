'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '../context/LanguageContext';
import { useCart } from '../context/CartContext';
import { formatCurrency } from '../lib/translations';
import RecommendationRail from './RecommendationRail';
import { onImageError } from '../lib/imageFallback';
import Price from './Price';
import QtyStepper from './QtyStepper';
import { useCartLines } from '../lib/useCartLines';

export default function CartDrawer({ products = [] }) {
  const router = useRouter();
  const { t, tName } = useLanguage();
  const { isCartDrawerOpen, closeCartDrawer, setQty, removeFromCart, showToast } = useCart();
  const { lines: detailedItems, totals } = useCartLines(products);

  const goToCheckout = () => {
    if (detailedItems.length === 0) {
      showToast('Your cart is empty');
      return;
    }
    closeCartDrawer();
    router.push('/checkout');
  };

  const goToCartPage = () => {
    closeCartDrawer();
    router.push('/cart');
  };

  return (
    <>
      {isCartDrawerOpen && <div className="overlay" onClick={closeCartDrawer} />}

      <aside
        className={`cart-drawer ${isCartDrawerOpen ? 'open' : ''}`}
        id="cartDrawer"
        aria-hidden={!isCartDrawerOpen}
      >
        <div className="drawer-head">
          <div>
            <small>{t('YOUR CART')}</small>
            <h2>{t('Ready for the road')}</h2>
          </div>
          <button id="closeCart" onClick={closeCartDrawer} aria-label={t('Close cart')}>
            ×
          </button>
        </div>

        <div className="cart-items" id="cartItems">
          {detailedItems.length > 0 ? (
            detailedItems.map((item) => (
              <article className="cart-item" key={item.id}>
                <img src={item.image} alt={item.name} onError={onImageError} />
                <div>
                  <h3>{tName(item.name, item.category)}</h3>
                  <strong>
                    <Price amount={item.amounts ? item.amounts.base : null} />
                  </strong>
                  {item.amounts && (
                    <small className="cart-unit">
                      {formatCurrency(item.price)} × {item.qty}
                    </small>
                  )}
                  <QtyStepper value={item.qty} min={item.moq} onChange={(q) => setQty(item.id, q)} />
                  <small className="cart-moq">
                    {t('MOQ')}: {item.moq}
                  </small>
                </div>
                <button
                  className="remove-item"
                  type="button"
                  aria-label={t('Remove item')}
                  onClick={() => removeFromCart(item.id)}
                >
                  ×
                </button>
              </article>
            ))
          ) : (
            <div className="empty-cart">
              <span>🛠</span>
              <h3>{t('Your cart is waiting')}</h3>
              <p>{t('Add the parts and gear you need for your next ride.')}</p>
            </div>
          )}

          {detailedItems.length > 0 && (
            <RecommendationRail variant="column" limit={4} compact />
          )}
        </div>

        <div className="cart-footer">
          {totals ? (
            <>
              <div>
                <span>{t('Subtotal')}</span>
                <strong id="cartSubtotal">{formatCurrency(totals.subtotal)}</strong>
              </div>
              <div className="cart-gst-row">
                <span>{t('GST')}</span>
                <span>{formatCurrency(totals.tax)}</span>
              </div>
              <div>
                <span>{t('Total (incl. GST)')}</span>
                <strong>{formatCurrency(totals.total)}</strong>
              </div>
            </>
          ) : detailedItems.length > 0 ? (
            <div>
              <span>{t('Subtotal')}</span>
              <Price amount={null} />
            </div>
          ) : null}
          <small>{t('GST is added to every item. Delivery is calculated at checkout.')}</small>

          <button
            id="checkoutButton"
            type="button"
            disabled={detailedItems.length === 0}
            onClick={goToCheckout}
          >
            {t('Proceed to checkout')}
          </button>

          <button
            className="continue-button"
            type="button"
            id="continueButton"
            onClick={goToCartPage}
            style={{ fontWeight: 700, marginTop: '8px' }}
          >
            {t('Shopping Cart')} ({t('Full View')})
          </button>

          <button
            className="continue-button"
            type="button"
            onClick={closeCartDrawer}
          >
            {t('Continue shopping')}
          </button>
        </div>
      </aside>
    </>
  );
}
