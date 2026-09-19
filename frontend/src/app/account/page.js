import React from 'react';
import Link from 'next/link';
import { createClient, isSupabaseConfigured } from '../../lib/supabase/server';
import { formatCurrency } from '../../lib/translations';
import { STATUS_LABEL } from '../../components/account/OrderTimeline';

export const metadata = { title: 'Your account | MotoMart India' };
export const revalidate = 0;

export default async function AccountOverview({ searchParams }) {
  if (!isSupabaseConfigured) {
    return (
      <div className="account-card">
        <h2>Accounts are not connected yet</h2>
        <p>Apply the Supabase migration and set the environment variables to enable sign-in, orders and tracking.</p>
      </div>
    );
  }

  const supabase = createClient();
  const { data: orders } = await supabase
    .from('orders')
    .select('id, order_number, status, total, placed_at, order_items(id)')
    .order('placed_at', { ascending: false })
    .limit(5);

  const list = orders || [];
  const spent = list.reduce((sum, o) => sum + (o.status === 'cancelled' ? 0 : Number(o.total)), 0);
  const open = list.filter((o) => !['delivered', 'cancelled'].includes(o.status)).length;

  return (
    <>
      {searchParams?.denied === 'admin' && (
        <p className="account-denied" role="alert">
          That area is for super admins only.
        </p>
      )}

      <div className="account-stats">
        <div>
          <strong>{list.length}</strong>
          <small>Recent orders</small>
        </div>
        <div>
          <strong>{open}</strong>
          <small>In progress</small>
        </div>
        <div>
          <strong>{formatCurrency(spent)}</strong>
          <small>Recent spend</small>
        </div>
      </div>

      <div className="account-card">
        <div className="account-card-head">
          <h2>Recent orders</h2>
          <Link href="/account/orders">View all →</Link>
        </div>

        {list.length === 0 ? (
          <div className="account-empty">
            <p>You have not placed an order yet.</p>
            <Link href="/brands" className="account-cta">
              Start shopping
            </Link>
          </div>
        ) : (
          <ul className="order-list">
            {list.map((o) => (
              <li key={o.id}>
                <Link href={`/account/orders/${o.id}`}>
                  <div>
                    <strong>{o.order_number}</strong>
                    <small>
                      {new Date(o.placed_at).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                      })}{' '}
                      · {o.order_items?.length || 0} item
                      {(o.order_items?.length || 0) === 1 ? '' : 's'}
                    </small>
                  </div>
                  <span className={`order-status s-${o.status}`}>{STATUS_LABEL[o.status]}</span>
                  <strong className="order-total">{formatCurrency(o.total)}</strong>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}
