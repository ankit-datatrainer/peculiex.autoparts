'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const LINKS = [
  { href: '/admin', label: 'Dashboard', icon: '▤', exact: true },
  { href: '/admin/products', label: 'Products', icon: '⚙' },
  { href: '/admin/products/new', label: 'Add product', icon: '＋' },
  { href: '/admin/products/import', label: 'Bulk import', icon: '⇪' },
  { href: '/admin/categories', label: 'Categories', icon: '☰' },
  { href: '/admin/brands', label: 'Brands & models', icon: '🏍' },
  { href: '/admin/orders', label: 'Orders', icon: '🧾' },
  { href: '/admin/customers', label: 'Customers', icon: '👤' },
  { href: '/admin/settings', label: 'Settings', icon: '⚙' }
];

/**
 * Renders either the mobile menu button (default) or the link list (variant="links").
 * The button toggles a body class so the sidebar slides in on small screens.
 */
export default function AdminNav({ variant = 'button' }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.classList.toggle('admin-nav-open', open);
    return () => document.body.classList.remove('admin-nav-open');
  }, [open]);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  if (variant === 'links') {
    return (
      <nav aria-label="Admin sections">
        {LINKS.map((l) => {
          const active = l.exact ? pathname === l.href : pathname.startsWith(l.href);
          return (
            <Link key={l.href} href={l.href} className={active ? 'active' : ''}>
              <span aria-hidden="true">{l.icon}</span>
              {l.label}
            </Link>
          );
        })}
      </nav>
    );
  }

  return (
    <>
      <button
        type="button"
        className="admin-menu-toggle"
        aria-label={open ? 'Close admin navigation' : 'Open admin navigation'}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        {open ? '×' : '☰'}
      </button>
      {open && <div className="admin-scrim" onClick={() => setOpen(false)} />}
    </>
  );
}
