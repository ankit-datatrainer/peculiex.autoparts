'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext({
  cart: {},
  cartSnapshots: {},
  cartCount: 0,
  isCartDrawerOpen: false,
  openCartDrawer: () => {},
  closeCartDrawer: () => {},
  addToCart: () => {},
  updateQty: () => {},
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
  }, []);

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

  const addToCart = (productId, qty = 1, productBrand = '', snapshot = null) => {
    const quantity = Number(qty) || 1;
    const current = cart[productId] || 0;
    const updated = { ...cart, [productId]: current + quantity };
    saveCartToStorage(updated);
    saveSnapshot(snapshot);
    showToast(productBrand ? `${productBrand} item added to cart` : 'Item added to cart');
  };

  const updateQty = (productId, delta) => {
    const current = cart[productId] || 0;
    const next = current + delta;
    const updated = { ...cart };
    if (next <= 0) {
      delete updated[productId];
    } else {
      updated[productId] = next;
    }
    saveCartToStorage(updated);
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
