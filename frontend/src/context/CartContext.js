'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useStore } from './StoreContext';
import { clampQty } from '../lib/commerce';

const CartContext = createContext({
  cart: {},
  cartSnapshots: {},
  cartCount: 0,
  isCartDrawerOpen: false,
  openCartDrawer: () => {},
  closeCartDrawer: () => {},
  addToCart: () => {},
  updateQty: () => {},
  setQty: () => {},
  moqOf: () => 1,
  removeFromCart: () => {},
  clearCart: () => {},
  // Modals
  activeModal: null,
  openModal: () => {},
  closeModal: () => {},
  // Location
  deliveryLocation: 'Bengaluru 560001',
  setDeliveryLocation: () => {},
  // Toast
  toastMessage: '',
  showToast: () => {}
});

export function CartProvider({ children }) {
  const [cart, setCart] = useState({});
  // Lightweight copies of items that live outside the curated product feed
  // (e.g. spare parts browsed via Spares by Bike) so the cart can render them.
  const [cartSnapshots, setCartSnapshots] = useState({});
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);
  const [activeModal, setActiveModal] = useState(null); // 'location', 'trade', 'signin', null
  const [deliveryLocation, setDeliveryLocation] = useState('Bengaluru 560001');
  const [toastMessage, setToastMessage] = useState('');
  const [loaded, setLoaded] = useState(false);
  const { moqFor } = useStore();

  /** Minimum order quantity for a cart line (its own MOQ, else the store's). */
  const moqOf = (productId, snapshot = null) => moqFor(snapshot || cartSnapshots[productId] || {});

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem('motomart-cart');
      if (savedCart) setCart(JSON.parse(savedCart));

      const savedSnapshots = localStorage.getItem('motomart-cart-items');
      if (savedSnapshots) setCartSnapshots(JSON.parse(savedSnapshots));

      const savedGarage = localStorage.getItem('motomart-garage');
      if (savedGarage) {
        const parsed = JSON.parse(savedGarage);
        if (parsed.pin) setDeliveryLocation(parsed.pin);
      }
    } catch (e) {}
    setLoaded(true);
  }, []);

  // Carts saved before minimum order quantities existed can hold 1 or 2 of a
  // part; lift those lines to the MOQ once, so checkout does not reject them.
  useEffect(() => {
    if (!loaded) return;
    let changed = false;
    const next = { ...cart };
    for (const [id, qty] of Object.entries(cart)) {
      const min = moqOf(id);
      if (qty > 0 && qty < min) {
        next[id] = min;
        changed = true;
      }
    }
    if (changed) saveCartToStorage(next);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loaded]);

  const saveCartToStorage = (newCart) => {
    setCart(newCart);
    try {
      localStorage.setItem('motomart-cart', JSON.stringify(newCart));
    } catch (e) {}
  };

  const saveSnapshot = (snapshot) => {
    if (!snapshot || !snapshot.id) return;
    const next = { ...cartSnapshots, [snapshot.id]: snapshot };
    setCartSnapshots(next);
    try {
      localStorage.setItem('motomart-cart-items', JSON.stringify(next));
    } catch (e) {}
  };

  const addToCart = (productId, qty = null, productBrand = '', snapshot = null) => {
    const min = moqOf(productId, snapshot);
    const current = cart[productId] || 0;
    // Card buttons pass no quantity: add one minimum order's worth.
    const quantity = Number(qty) || min;
    const updated = { ...cart, [productId]: clampQty(current + quantity, min) };
    saveCartToStorage(updated);
    saveSnapshot(snapshot);
    // slide the cart out so the shopper sees what they just added
    setIsCartDrawerOpen(true);
    showToast(productBrand ? `${productBrand} item added to cart` : 'Item added to cart');
  };

  /** +1 / -1 steppers. Never drops below the MOQ; "Delete" removes a line. */
  const updateQty = (productId, delta) => {
    const current = cart[productId] || 0;
    if (!current) return;
    saveCartToStorage({ ...cart, [productId]: clampQty(current + delta, moqOf(productId)) });
  };

  /** A typed quantity, kept between the MOQ and the safety ceiling. */
  const setQty = (productId, qty) => {
    if (!cart[productId]) return;
    saveCartToStorage({ ...cart, [productId]: clampQty(qty, moqOf(productId)) });
  };

  const removeFromCart = (productId) => {
    const updated = { ...cart };
    delete updated[productId];
    saveCartToStorage(updated);
  };

  const clearCart = () => {
    saveCartToStorage({});
  };

  const showToast = (msg) => {
    setToastMessage(msg);
  };

  const openCartDrawer = () => setIsCartDrawerOpen(true);
  const closeCartDrawer = () => setIsCartDrawerOpen(false);

  const openModal = (name) => setActiveModal(name);
  const closeModal = () => setActiveModal(null);

  const cartCount = Object.values(cart).reduce((sum, q) => sum + (Number(q) || 0), 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        cartSnapshots,
        cartCount,
        isCartDrawerOpen,
        openCartDrawer,
        closeCartDrawer,
        addToCart,
        updateQty,
        setQty,
        moqOf,
        removeFromCart,
        clearCart,
        activeModal,
        openModal,
        closeModal,
        deliveryLocation,
        setDeliveryLocation,
        toastMessage,
        showToast
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
