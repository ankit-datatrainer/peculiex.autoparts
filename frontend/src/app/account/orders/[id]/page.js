import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { createClient, isSupabaseConfigured } from '../../../../lib/supabase/server';
import { formatCurrency } from '../../../../lib/translations';
import OrderTimeline from '../../../../components/account/OrderTimeline';
import { STATUS_LABEL } from '../../../../lib/orderStatus';
import { getT } from '../../../../lib/i18n-server';

export const revalidate = 0;

export async function generateMetadata({ params }) {
  return { title: `Order ${params.id.slice(0, 8)} | MotoMart India` };
}

export default async function OrderDetailPage({ params, searchParams }) {
  const { t, tName, local, date } = getT();

  if (!isSupabaseConfigured) notFound();

  const supabase = createClient();

  // RLS limits this to the buyer's own orders (or any order for an admin).
  const { data: order } = await supabase
    .from('orders')
    .select(
      'id, order_number, status, subtotal, shipping, total, payment_method, customer_name, customer_phone, customer_email, address_line1, address_line2, city, state, pincode, notes, placed_at'
    )
    .eq('id', params.id)
    .maybeSingle();

  if (!order) notFound();

  const [{ data: items }, { data: events }] = await Promise.all([
    supabase.from('order_items').select('*').eq('order_id', order.id),
    supabase
      .from('order_events')
      .select('status, note, created_at')
      .eq('order_id', order.id)
      .order('created_at')
  ]);

  return (
    <>
      {searchParams?.placed === '1' && (
        <div className="order-placed" role="status">
          <strong>{t('Thank you — your order is confirmed.')}</strong>
          <span>
            {local(
              `We will call you on ${order.customer_phone} before dispatch.`,
              `भेजने से पहले हम आपको ${order.customer_phone} पर कॉल करेंगे।`,
              `पाठवण्यापूर्वी आम्ही तुम्हाला ${order.customer_phone} वर कॉल करू.`,
              `મોકલતા પહેલાં અમે તમને ${order.customer_phone} પર કૉલ કરીશું.`
            )}
          </span>
        </div>
      )}

      <div className="account-card">
        <div className="order-detail-head">
          <div>
            <Link href="/account/orders" className="order-back">
              ← {t('All orders')}
            </Link>
            <h2>{order.order_number}</h2>
            <small>
              {t('Placed')}{' '}
              {date(order.placed_at, {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
                hour: 'numeric',
                minute: '2-digit'
              })}
            </small>
          </div>
          <div className="order-head-actions">
            <span className={`order-status s-${order.status}`}>{t(STATUS_LABEL[order.status])}</span>
            <a
              className="invoice-btn"
              href={`/account/orders/${order.id}/invoice`}
              target="_blank"
              rel="noreferrer"
            >
              ⤓ {t('Invoice')} (PDF)
            </a>
          </div>
        </div>

        <h3 className="order-section-title">{t('Tracking')}</h3>
        <OrderTimeline status={order.status} events={events || []} />
      </div>

      <div className="order-detail-grid">
        <div className="account-card">
          <h3 className="order-section-title">{t('Items')}</h3>
          <ul className="order-items">
            {(items || []).map((item) => (
              <li key={item.id}>
                <img src={item.image || '/assets/site-icon.svg'} alt="" />
                <div>
                  {item.product_id ? (
                    <Link href={`/product/${item.product_id}`}>{tName(item.name)}</Link>
                  ) : (
                    <span>{tName(item.name)}</span>
                  )}
                  <small>
                    {formatCurrency(item.price)} × {item.qty}
                  </small>
                </div>
                <strong>{formatCurrency(item.line_total)}</strong>
              </li>
            ))}
          </ul>

          <dl className="checkout-totals">
            <div>
              <dt>{t('Subtotal')}</dt>
              <dd>{formatCurrency(order.subtotal)}</dd>
            </div>
            <div>
              <dt>{t('Delivery')}</dt>
              <dd>{Number(order.shipping) === 0 ? t('FREE') : formatCurrency(order.shipping)}</dd>
            </div>
            <div className="grand">
              <dt>{t('Total')}</dt>
              <dd>{formatCurrency(order.total)}</dd>
            </div>
          </dl>
        </div>

        <div className="account-card">
          <h3 className="order-section-title">{t('Delivery')}</h3>
          <address className="order-address">
            <strong>{order.customer_name}</strong>
            {order.address_line1}
            {order.address_line2 && <>, {order.address_line2}</>}
            <br />
            {order.city}, {order.state} {order.pincode}
            <br />
            {order.customer_phone}
            {order.customer_email && (
              <>
                <br />
                {order.customer_email}
              </>
            )}
          </address>

          <h3 className="order-section-title">{t('Payment')}</h3>
          <p className="order-payment">
            {order.payment_method === 'cod' ? t('Pay on delivery') : order.payment_method}
          </p>

          {order.notes && (
            <>
              <h3 className="order-section-title">{t('Your note')}</h3>
              <p className="order-note">{order.notes}</p>
            </>
          )}
        </div>
      </div>
    </>
  );
}
