import React from 'react';
import Link from 'next/link';
import { createClient, isSupabaseConfigured } from '../../lib/supabase/server';
import { formatCurrency } from '../../lib/translations';
import { STATUS_LABEL } from '../../lib/orderStatus';
import { getT } from '../../lib/i18n-server';

export const revalidate = 0;

export default async function AdminDashboard() {
  const { t } = getT();
  if (!isSupabaseConfigured) {
    return (
      <div className="admin-setup">
        <h1>{t('Finish connecting Supabase')}</h1>
        <p>
          The admin panel needs <code>NEXT_PUBLIC_SUPABASE_URL</code> and{' '}
          <code>NEXT_PUBLIC_SUPABASE_ANON_KEY</code> in <code>frontend/.env.local</code>, and the
          migration in <code>supabase/migrations/0001_motomart_init.sql</code> applied.
        </p>
        <p>{t('See DEPLOYMENT.md for the exact steps.')}</p>
      </div>
    );
  }

  const supabase = createClient();

  const [{ data: stats }, { data: recent }, { data: lowStock }] = await Promise.all([
    supabase.rpc('admin_stats'),
    supabase
      .from('orders')
      .select('id, order_number, status, total, customer_name, placed_at')
      .order('placed_at', { ascending: false })
      .limit(8),
    supabase
      .from('products')
      .select('id, name, stock, brand_id')
      .lte('stock', 5)
      .eq('is_active', true)
      .order('stock')
      .limit(8)
  ]);

  const s = stats && !stats.error ? stats : {};

  const cards = [
    { label: 'Orders', value: s.orders ?? 0, hint: `${s.pendingOrders ?? 0} pending`, href: '/admin/orders' },
    { label: 'Revenue', value: formatCurrency(s.revenue ?? 0), hint: `${formatCurrency(s.revenue30d ?? 0)} last 30 days` },
    { label: 'Products', value: s.products ?? 0, hint: `${s.activeProducts ?? 0} live · ${s.outOfStock ?? 0} out of stock`, href: '/admin/products' },
    { label: 'Customers', value: s.customers ?? 0, hint: 'registered accounts', href: '/admin/customers' },
    { label: 'Brands', value: s.brands ?? 0, hint: `${s.models ?? 0} models`, href: '/admin/brands' },
    { label: 'Categories', value: s.categories ?? 0, hint: 'part categories', href: '/admin/categories' }
  ];

  return (
    <>
      <div className="admin-page-head">
        <div>
          <h1>{t('Dashboard')}</h1>
          <p>{t('Everything on the storefront is managed from here.')}</p>
        </div>
        <Link href="/admin/products/new" className="admin-primary-btn">
          + Add product
        </Link>
      </div>

      <div className="admin-stat-grid">
        {cards.map((c) => {
          const body = (
            <>
              <small>{c.label}</small>
              <strong>{c.value}</strong>
              <em>{c.hint}</em>
            </>
          );
          return c.href ? (
            <Link key={c.label} href={c.href} className="admin-stat">
              {body}
            </Link>
          ) : (
            <div key={c.label} className="admin-stat">
              {body}
            </div>
          );
        })}
      </div>

      <div className="admin-two-col">
        <section className="admin-card">
          <div className="admin-card-head">
            <h2>{t('Recent orders')}</h2>
            <Link href="/admin/orders">{t('View all')} →</Link>
          </div>

          {!recent?.length ? (
            <p className="admin-empty">{t('No orders yet.')}</p>
          ) : (
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>{t('Order')}</th>
                    <th>{t('Customer')}</th>
                    <th>{t('Status')}</th>
                    <th className="right">{t('Total')}</th>
                  </tr>
                </thead>
                <tbody>
                  {recent.map((o) => (
                    <tr key={o.id}>
                      <td>
                        <Link href={`/admin/orders/${o.id}`}>{o.order_number}</Link>
                        <small>
                          {new Date(o.placed_at).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short'
                          })}
                        </small>
                      </td>
                      <td>{o.customer_name}</td>
                      <td>
                        <span className={`order-status s-${o.status}`}>{STATUS_LABEL[o.status]}</span>
                      </td>
                      <td className="right">{formatCurrency(o.total)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <section className="admin-card">
          <div className="admin-card-head">
            <h2>{t('Low stock')}</h2>
            <Link href="/admin/products?stock=low">{t('Manage')} →</Link>
          </div>

          {!lowStock?.length ? (
            <p className="admin-empty">{t('Nothing is running low.')}</p>
          ) : (
            <ul className="admin-lowstock">
              {lowStock.map((p) => (
                <li key={p.id}>
                  <Link href={`/admin/products/${encodeURIComponent(p.id)}`}>{p.name}</Link>
                  <span className={p.stock === 0 ? 'out' : 'low'}>
                    {p.stock === 0 ? 'Out of stock' : `${p.stock} left`}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </>
  );
}
