import React from 'react';
import Link from 'next/link';
import { createClient, isSupabaseConfigured } from '../../../lib/supabase/server';
import { formatCurrency } from '../../../lib/translations';
import { STATUS_LABEL } from '../../../components/account/OrderTimeline';

export const metadata = { title: 'My orders | MotoMart India' };
export const revalidate = 0;

export default async function OrdersPage() {
  if (!isSupabaseConfigured) {
    return (
      <div className="account-card">
        <h2>Orders are not connected yet</h2>
        <p>Apply the Supabase migration to enable order history and tracking.</p>
      </div>
    );
  }

  const supabase = createClient();
  const { data: orders } = await supabase
    .from('orders')
    .select('id, order_number, status, total, placed_at, order_items(id, name, image, qty)')
    .order('placed_at', { ascending: false });

  const list = orders || [];

  return (
    <div className="account-card">
      <div className="account-card-head">
        <h2>My orders</h2>
        <small>{list.length} total</small>
      </div>

      {list.length === 0 ? (
        <div className="account-empty">
          <p>No orders yet.</p>
          <Link href="/brands" className="account-cta">Browse spare parts</Link>
        </div>
      ) : (
        <ul className="order-list detailed">
          {list.map((o) => (
            <li key={o.id}>
              <Link href={`/account/orders/${o.id}`}>
                <div className="order-thumbs" aria-hidden="true">
                  {(o.order_items || []).slice(0, 3).map((it) => (
                    <img key={it.id} src={it.image || '/assets/site-icon.svg'} alt="" />
                  ))}
                </div>
                <div>
                  <strong>{o.order_number}</strong>
                  <small>
                    {new Date(o.placed_at).toLocaleDateString('en-IN', {
                      day: 'numeric', month: 'short', year: 'numeric'
                    })} · {o.order_items?.length || 0} item{(o.order_items?.length || 0) === 1 ? '' : 's'}
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
  );
}
