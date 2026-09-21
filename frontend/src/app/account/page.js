import React from 'react';
import Link from 'next/link';
import { createClient, isSupabaseConfigured } from '../../lib/supabase/server';
import { formatCurrency } from '../../lib/translations';
import { STATUS_LABEL } from '../../lib/orderStatus';
import { getT } from '../../lib/i18n-server';

export async function generateMetadata() {
  return { title: `${getT().t('YOUR ACCOUNT')} | MotoMart India` };
}
export const revalidate = 0;

export default async function AccountOverview({ searchParams }) {
  const { t, local, date } = getT();

  if (!isSupabaseConfigured) {
    return (
      <div className="account-card">
        <h2>{t('Accounts are not connected yet')}</h2>
        <p>
          {t(
            'Apply the Supabase migration and set the environment variables to enable sign-in, orders and tracking.'
          )}
        </p>
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
          {t('That area is for super admins only.')}
        </p>
      )}

      <div className="account-stats">
        <div>
          <strong>{list.length}</strong>
          <small>{t('Recent orders')}</small>
        </div>
        <div>
          <strong>{open}</strong>
          <small>{t('In progress')}</small>
        </div>
        <div>
          <strong>{formatCurrency(spent)}</strong>
          <small>{t('Recent spend')}</small>
        </div>
      </div>

      <div className="account-card">
        <div className="account-card-head">
          <h2>{t('Recent orders')}</h2>
          <Link href="/account/orders">{t('View all')} →</Link>
        </div>

        {list.length === 0 ? (
          <div className="account-empty">
            <p>{t('You have not placed an order yet.')}</p>
            <Link href="/brands" className="account-cta">
              {t('Start shopping')}
            </Link>
          </div>
        ) : (
          <ul className="order-list">
            {list.map((o) => {
              const n = o.order_items?.length || 0;
              const placed = date(o.placed_at, { day: 'numeric', month: 'short', year: 'numeric' });
              return (
              <li key={o.id}>
                <Link href={`/account/orders/${o.id}`}>
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
                  <span className={`order-status s-${o.status}`}>
                    {t(STATUS_LABEL[o.status])}
                  </span>
                  <strong className="order-total">{formatCurrency(o.total)}</strong>
                </Link>
              </li>
              );
            })}
          </ul>
        )}
      </div>
    </>
  );
}
