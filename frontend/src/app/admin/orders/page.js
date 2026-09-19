import React from 'react';
import Link from 'next/link';
import { createClient, isSupabaseConfigured } from '../../../lib/supabase/server';
import { formatCurrency } from '../../../lib/translations';
import { STATUS_LABEL } from '../../../components/account/OrderTimeline';

export const revalidate = 0;

const TABS = [
  ['', 'All'],
  ['pending', 'Pending'],
  ['confirmed', 'Confirmed'],
  ['packed', 'Packed'],
  ['shipped', 'Shipped'],
  ['out_for_delivery', 'Out for delivery'],
  ['delivered', 'Delivered'],
  ['cancelled', 'Cancelled']
];

export default async function AdminOrders({ searchParams }) {
  if (!isSupabaseConfigured) {
    return (
      <div className="admin-setup">
        <h1>Connect Supabase to manage orders.</h1>
      </div>
    );
  }

  const status = searchParams?.status || '';
  const q = (searchParams?.q || '').trim();

  const supabase = createClient();
  let query = supabase
    .from('orders')
    .select(
      'id, order_number, status, total, customer_name, customer_phone, city, placed_at, order_items(id)'
    )
    .order('placed_at', { ascending: false })
    .limit(200);

  if (status) query = query.eq('status', status);
  if (q) {
    query = query.or(
      `order_number.ilike.%${q}%,customer_name.ilike.%${q}%,customer_phone.ilike.%${q}%`
    );
  }

  const { data: orders, error } = await query;
  const list = orders || [];

  return (
    <>
      <div className="admin-page-head">
        <div>
          <h1>Orders</h1>
          <p>{list.length} shown</p>
        </div>
      </div>

      <nav className="admin-tabs" aria-label="Filter orders by status">
        {TABS.map(([value, label]) => (
          <Link
            key={value || 'all'}
            href={value ? `/admin/orders?status=${value}` : '/admin/orders'}
            className={status === value ? 'active' : ''}
          >
            {label}
          </Link>
        ))}
      </nav>

      <form className="admin-filters" method="get">
        {status && <input type="hidden" name="status" value={status} />}
        <input
          name="q"
          defaultValue={q}
          placeholder="Search order number, name or phone"
          aria-label="Search orders"
        />
        <button type="submit" className="admin-primary-btn">
          Search
        </button>
        <Link href="/admin/orders" className="admin-ghost-btn">
          Reset
        </Link>
      </form>

      <section className="admin-card">
        {error ? (
          <p className="admin-error">{error.message}</p>
        ) : list.length === 0 ? (
          <p className="admin-empty">No orders match.</p>
        ) : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Order</th>
                  <th>Customer</th>
                  <th>City</th>
                  <th className="right">Items</th>
                  <th>Status</th>
                  <th className="right">Total</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {list.map((o) => (
                  <tr key={o.id}>
                    <td>
                      <Link href={`/admin/orders/${o.id}`}>
                        <strong>{o.order_number}</strong>
                      </Link>
                      <small>
                        {new Date(o.placed_at).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </small>
                    </td>
                    <td>
                      {o.customer_name}
                      <small>{o.customer_phone}</small>
                    </td>
                    <td>{o.city}</td>
                    <td className="right">{o.order_items?.length || 0}</td>
                    <td>
                      <span className={`order-status s-${o.status}`}>{STATUS_LABEL[o.status]}</span>
                    </td>
                    <td className="right">{formatCurrency(o.total)}</td>
                    <td className="right">
                      <Link href={`/admin/orders/${o.id}`} className="admin-ghost-btn small">
                        Open
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </>
  );
}
