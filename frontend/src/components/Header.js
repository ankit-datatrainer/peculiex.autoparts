'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useLanguage } from '../context/LanguageContext';
import { useCart } from '../context/CartContext';
import BrandNavStrip from './BrandNavStrip';
import catalogIndex from '../data/eauto/index.json';
import { LANGUAGES } from '../lib/translations';

export default function Header({ products = [], brands = [], user = null }) {
  const router = useRouter();
  const { language, setLanguage, t } = useLanguage();
  const { cartCount, openCartDrawer, openModal, deliveryLocation, showToast } = useCart();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [suggestions, setSuggestions] = useState([]);
  const [isSuggestOpen, setIsSuggestOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const searchBoxRef = useRef(null);

  // Close search suggestions on click outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (searchBoxRef.current && !searchBoxRef.current.contains(e.target)) {
        setIsSuggestOpen(false);
      }
    }
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const handleSearchInput = (val) => {
    setSearchQuery(val);
    const q = val.trim().toLowerCase();
    if (!q) {
      setSuggestions([]);
      setIsSuggestOpen(false);
      return;
    }
    const hits = products
      .filter((p) => `${p.name} ${p.brand} ${p.category}`.toLowerCase().includes(q))
      .slice(0, 5);
    setSuggestions(hits);
    setIsSuggestOpen(true);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setIsSuggestOpen(false);
    const q = searchQuery.trim();
    if (selectedCategory !== 'all' && !q) {
      router.push(`/brands/${selectedCategory}`);
    } else if (selectedCategory !== 'all') {
      router.push(`/search?brand=${encodeURIComponent(selectedCategory)}&q=${encodeURIComponent(q)}`);
    } else if (q) {
      router.push(`/search?q=${encodeURIComponent(q)}`);
    } else {
      router.push('/search?q=all');
    }
  };

  const handleLangChange = (e) => {
    const nextLang = e.target.value;
    setLanguage(nextLang);
    showToast(
      {
        hi: 'भाषा हिन्दी में बदल दी गई',
        mr: 'भाषा मराठीत बदलली',
        gu: 'ભાષા ગુજરાતીમાં બદલાઈ'
      }[nextLang] || 'Language changed to English'
    );
  };

  return (
    <>
      <a className="skip-link" href="#main">
        {t('Skip to products')}
      </a>

      {/* Live Deals Ticker */}
      <div id="announcement" className="announcement premium-ticker" aria-label={t('Current offers')}>
        <div className="ticker-label">
          <span aria-hidden="true">⚡</span>
          <strong>{t('LIVE DEALS')}</strong>
        </div>
        <div className="ticker-window">
          <div className="ticker-track">
            <span>{t('Grand Garage Days — extra 10% off on selected essentials')}</span>
            <i aria-hidden="true">◆</i>
            <span>{t('Free delivery on selected bike and scooter parts')}</span>
            <i aria-hidden="true">◆</i>
            <span>{t('Verified fitment for a safer, smarter ride')}</span>
            <i aria-hidden="true">◆</i>
            <span aria-hidden="true">{t('Grand Garage Days — extra 10% off on selected essentials')}</span>
            <i aria-hidden="true">◆</i>
            <span aria-hidden="true">{t('Free delivery on selected bike and scooter parts')}</span>
            <i aria-hidden="true">◆</i>
            <span aria-hidden="true">{t('Verified fitment for a safer, smarter ride')}</span>
          </div>
        </div>
        <button
          onClick={() => {
            const el = document.getElementById('deals');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
            else router.push('/#deals');
          }}
        >
          {t('Shop offers')} <span aria-hidden="true">→</span>
        </button>
      </div>

      {/* Main Red Sticky Header */}
      <header className="site-header" id="top">
        <div className="topbar">
          <button
            className="icon-button menu-button"
            id="menuButton"
            aria-label={t('Open navigation')}
            onClick={() => setIsMobileMenuOpen(true)}
          >
            ☰
          </button>

          <Link className="brand" href="/" aria-label={t('MotoMart home')}>
            <span className="brand-mark">
              <img src="/assets/site-icon.svg" alt={t('MotoMart logo')} width="36" height="36" />
            </span>
            <span className="brand-name">
              moto<span>mart</span>
              <small>.in</small>
            </span>
          </Link>

          <button
            className="deliver-to"
            id="locationButton"
            aria-label={t('Change delivery location')}
            onClick={() => openModal('location')}
          >
            <span className="pin">⌖</span>
            <span>
              <small>{t('Delivering to')}</small>
              <strong id="deliveryText">{deliveryLocation}</strong>
            </span>
          </button>

          <form className="search" id="searchForm" role="search" ref={searchBoxRef} onSubmit={handleSearchSubmit}>
            <label className="sr-only" htmlFor="categorySelect">
              {t('Category')}
            </label>
            <select
              id="categorySelect"
              aria-label={t('Choose company brand')}
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                if (e.target.value !== 'all') {
                  router.push(`/brands/${e.target.value}`);
                }
              }}
            >
              <option value="all">{t('All Companies')}</option>
              {(brands.length ? brands : catalogIndex.brands).map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name}
                </option>
              ))}
            </select>

            <label className="sr-only" htmlFor="searchInput">
              {t('Search MotoMart')}
            </label>
            <input
              id="searchInput"
              type="search"
              autoComplete="off"
              placeholder={t('Search bike parts, brands (Hero, Honda, etc.) and models')}
              value={searchQuery}
              onChange={(e) => handleSearchInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Escape') setIsSuggestOpen(false);
              }}
            />
            <button type="submit" aria-label={t('Search')}>
              ⌕
            </button>

            {isSuggestOpen && (
              <div className="search-suggestions open" id="searchSuggestions" role="listbox">
                {suggestions.length > 0 ? (
                  suggestions.map((p) => (
                    <button
                      key={p.id}
                      className="suggestion"
                      type="button"
                      onClick={() => {
                        setIsSuggestOpen(false);
                        router.push(`/product/${p.id}`);
                      }}
                    >
                      ⌕ <span><strong>{p.brand}</strong> {p.name}</span>
                    </button>
                  ))
                ) : (
                  <button className="suggestion" type="submit">
                    ⌕ Search for “{searchQuery}”
                  </button>
                )}
              </div>
            )}
          </form>

          <label className="language-control" aria-label={t('Choose language')}>
            <span>🇮🇳</span>
            <select id="languageSelect" value={language} onChange={handleLangChange}>
              {LANGUAGES.map((l) => (
                <option key={l.code} value={l.code}>
                  {l.label}
                </option>
              ))}
            </select>
          </label>

          {user ? (
            <Link className="account-button" id="accountButton" href="/account">
              <small>{t('Hello,')} {user.name || user.email.split('@')[0]}</small>
              <strong>{user.role === 'admin' ? t('Admin & Orders⌄') : t('Account & Orders⌄')}</strong>
            </Link>
          ) : (
            <Link className="account-button" id="accountButton" href="/signin">
              <small>{t('Hello, sign in')}</small>
              <strong>{t('Account & Lists⌄')}</strong>
            </Link>
          )}

          <Link className="orders-button" href={user ? '/account/orders' : '/signin?next=/account/orders'}>
            <small>{t('Returns')}</small>
            <strong>{t('& Orders')}</strong>
          </Link>

          <button
            className="cart-button"
            id="cartButton"
            aria-label={t('Open shopping cart')}
            onClick={openCartDrawer}
          >
            <span className="cart-icon">🛒</span>
            <span className="cart-count" id="cartCount">
              {cartCount}
            </span>
            <strong>{t('Cart')}</strong>
          </button>
        </div>

        {/* Brand navigation - every brand, each opening its models on hover */}
        <BrandNavStrip brands={brands} />

        {/* Part-category strip */}
        <nav className="vehicle-strip" aria-label={t('Bike parts navigation')}>
          <strong>{t('GENUINE SPARES')}</strong>
          <Link href="/categories/handle-steering">{t('Handle & Steering')}</Link>
          <Link href="/categories/front-wheel">{t('Front Wheel Parts')}</Link>
          <Link href="/categories/engine-drive">{t('Engine & Drive')}</Link>
          <Link href="/categories/bearing">{t('Bearings & Bushes')}</Link>
          <Link href="/categories/lights">{t('Lights & Indicators')}</Link>
          <Link href="/categories/fuel-supply">{t('Fuel Supply System')}</Link>
          <Link href="/categories/oil-seals">{t('Oil, Seals & Lubricants')}</Link>
          <Link href="/categories/pipes-hoses">{t('Pipes & Hoses')}</Link>
          <Link href="/categories/electricals">{t('Electricals')}</Link>
          <Link href="/categories">{t('All categories')}</Link>
        </nav>

      </header>

      {/* Slide-out Mobile Menu Drawer */}
      <aside className={`mobile-menu ${isMobileMenuOpen ? 'open' : ''}`} id="mobileMenu" aria-hidden={!isMobileMenuOpen}>
        <div className="mobile-menu-head">
          <strong>{t('MotoMart Brands & Parts')}</strong>
          <button onClick={() => setIsMobileMenuOpen(false)} aria-label={t('Close navigation')}>
            ×
          </button>
        </div>
        <div className="mobile-menu-content">
          <h3>{t('Shop spare parts by brand')}</h3>
          {(brands.length ? brands : catalogIndex.brands).map((b) => (
            <Link key={b.id} href={`/brands/${b.id}`} onClick={() => setIsMobileMenuOpen(false)}>
              {b.name} <small>({b.modelCount} {t('models')})</small>
            </Link>
          ))}
          <Link href="/brands" onClick={() => setIsMobileMenuOpen(false)}>
            {t('View all brands')} →
          </Link>
          <hr />
          <h3>{t('Bike & Scooter Parts')}</h3>
          <Link href="/search?partType=Brake" onClick={() => setIsMobileMenuOpen(false)}>{t('Brake (Pads, Shoes, Discs)')}</Link>
          <Link href="/search?partType=Clutch" onClick={() => setIsMobileMenuOpen(false)}>{t('Clutch & Plates')}</Link>
          <Link href="/search?partType=Engine" onClick={() => setIsMobileMenuOpen(false)}>{t('Engine & Cylinders')}</Link>
          <Link href="/search?partType=Shocker" onClick={() => setIsMobileMenuOpen(false)}>{t('Shocker & Forks')}</Link>
          <Link href="/search?partType=Lights" onClick={() => setIsMobileMenuOpen(false)}>{t('Lights & Headlamps')}</Link>
          <Link href="/search?partType=Cables" onClick={() => setIsMobileMenuOpen(false)}>{t('Cables & Levers')}</Link>
          <Link href="/search?partType=Wheels" onClick={() => setIsMobileMenuOpen(false)}>{t('Wheels & Rims')}</Link>
          <Link href="/search?partType=Handle" onClick={() => setIsMobileMenuOpen(false)}>{t('Handle & Grips')}</Link>
          <Link href="/search?partType=Petrol%20Tank" onClick={() => setIsMobileMenuOpen(false)}>{t('Petrol Tank / EV Bay')}</Link>
          <Link href="/search?partType=Oil" onClick={() => setIsMobileMenuOpen(false)}>{t('Oil & Lubricants')}</Link>
          <hr />
          <h3>{t('Help & Account')}</h3>
          <button
            id="mobileLocation"
            onClick={() => {
              setIsMobileMenuOpen(false);
              openModal('location');
            }}
          >
            {t('Change location')}
          </button>
          <button
            id="mobileTrade"
            onClick={() => {
              setIsMobileMenuOpen(false);
              openModal('trade');
            }}
          >
            {t('Sell / Trade-In')}
          </button>
          <Link href={user ? '/account' : '/signin'} onClick={() => setIsMobileMenuOpen(false)}>
            {user ? t('My account') : t('Sign in')}
          </Link>
        </div>
      </aside>

      {isMobileMenuOpen && (
        <div className="overlay" onClick={() => setIsMobileMenuOpen(false)} />
      )}
    </>
  );
}
