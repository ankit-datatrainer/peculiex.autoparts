import React from 'react';
import Link from 'next/link';
import { createClient, isSupabaseConfigured } from '../../../lib/supabase/server';
import { formatCurrency } from '../../../lib/translations';
import { STATUS_LABEL } from '../../../lib/orderStatus';
import { getT } from '../../../lib/i18n-server';

export async function generateMetadata() {
  return { title: `${getT().t('My orders')} | MotoMart India` };
}
export const revalidate = 0;

export default async function OrdersPage() {
  const { t, local, date } = getT();

  if (!isSupabaseConfigured) {
    return (
      <div className="account-card">
        <h2>{t('Orders are not connected yet')}</h2>
        <p>{t('Apply the Supabase migration to enable order history and tracking.')}</p>
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
        <h2>{t('My orders')}</h2>
        <small>
          {local(
            `${list.length} total`,
            `कुल ${list.length}`,
            `एकूण ${list.length}`,
            `કુલ ${list.length}`
          )}
        </small>
      </div>

      {list.length === 0 ? (
        <div className="account-empty">
          <p>{t('No orders yet.')}</p>
          <Link href="/brands" className="account-cta">
            {t('Browse spare parts')}
          </Link>
        </div>
      ) : (
        <ul className="order-list detailed">
          {list.map((o) => {
            const n = o.order_items?.length || 0;
            const placed = date(o.placed_at, { day: 'numeric', month: 'short', year: 'numeric' });
            return (
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
                    {local(
                      `${placed} · ${n} item${n === 1 ? '' : 's'}`,
                      `${placed} · ${n} आइटम`,
                      `${placed} · ${n} आयटम`,
                      `${placed} · ${n} આઇટમ`
                    )}
                  </small>
                </div>
                <span className={`order-status s-${o.status}`}>{t(STATUS_LABEL[o.status])}</span>
                <strong className="order-total">{formatCurrency(o.total)}</strong>
              </Link>
              <a
                className="invoice-link"
                href={`/account/orders/${o.id}/invoice`}
                target="_blank"
                rel="noreferrer"
              >
                ⤓ {t('Invoice')}
              </a>
            </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
