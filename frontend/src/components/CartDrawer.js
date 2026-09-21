'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '../context/LanguageContext';
import { useCart } from '../context/CartContext';
import { formatCurrency } from '../lib/translations';
import RecommendationRail from './RecommendationRail';

export default function CartDrawer({ products = [] }) {
  const router = useRouter();
  const { t } = useLanguage();
  const {
    cart,
    cartSnapshots,
    isCartDrawerOpen,
    closeCartDrawer,
    updateQty,
    removeFromCart,
    showToast
  } = useCart();

  const cartEntries = Object.entries(cart).filter(([id, qty]) => qty > 0);
  const detailedItems = cartEntries
    .map(([id, qty]) => {
      const product = products.find((p) => p.id === id) || cartSnapshots[id];
      return product ? { ...product, qty } : null;
    })
    .filter(Boolean);

  const subtotal = detailedItems.reduce((sum, item) => sum + item.price * item.qty, 0);

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
                <img src={item.image} alt={item.name} />
                <div>
                  <h3>{item.name}</h3>
                  <strong>{formatCurrency(item.price * item.qty)}</strong>
                  <div className="qty-stepper">
                    <button
                      type="button"
                      aria-label={t('Decrease quantity')}
                      onClick={() => updateQty(item.id, -1)}
                    >
                      −
                    </button>
                    <span>{item.qty}</span>
                    <button
                      type="button"
                      aria-label={t('Increase quantity')}
                      onClick={() => updateQty(item.id, 1)}
                    >
                      +
                    </button>
                  </div>
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
          <div>
            <span>{t('Subtotal')}</span>
            <strong id="cartSubtotal">{formatCurrency(subtotal)}</strong>
          </div>
          <small>{t('Taxes included. Delivery calculated at checkout.')}</small>

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
