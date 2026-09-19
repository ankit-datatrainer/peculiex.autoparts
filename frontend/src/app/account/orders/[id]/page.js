import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { createClient, isSupabaseConfigured } from '../../../../lib/supabase/server';
import { formatCurrency } from '../../../../lib/translations';
import OrderTimeline, { STATUS_LABEL } from '../../../../components/account/OrderTimeline';

export const revalidate = 0;

export async function generateMetadata({ params }) {
  return { title: `Order ${params.id.slice(0, 8)} | MotoMart India` };
}

export default async function OrderDetailPage({ params, searchParams }) {
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
          <strong>Thank you — your order is confirmed.</strong>
          <span>We will call you on {order.customer_phone} before dispatch.</span>
        </div>
      )}

      <div className="account-card">
        <div className="order-detail-head">
          <div>
            <Link href="/account/orders" className="order-back">
              ← All orders
            </Link>
            <h2>{order.order_number}</h2>
            <small>
              Placed{' '}
              {new Date(order.placed_at).toLocaleString('en-IN', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
                hour: 'numeric',
                minute: '2-digit'
              })}
            </small>
          </div>
          <span className={`order-status s-${order.status}`}>{STATUS_LABEL[order.status]}</span>
        </div>

        <h3 className="order-section-title">Tracking</h3>
        <OrderTimeline status={order.status} events={events || []} />
      </div>

      <div className="order-detail-grid">
        <div className="account-card">
          <h3 className="order-section-title">Items</h3>
          <ul className="order-items">
            {(items || []).map((item) => (
              <li key={item.id}>
                <img src={item.image || '/assets/site-icon.svg'} alt="" />
                <div>
                  {item.product_id ? (
                    <Link href={`/product/${item.product_id}`}>{item.name}</Link>
                  ) : (
                    <span>{item.name}</span>
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
              <dt>Subtotal</dt>
              <dd>{formatCurrency(order.subtotal)}</dd>
            </div>
            <div>
              <dt>Delivery</dt>
              <dd>{Number(order.shipping) === 0 ? 'FREE' : formatCurrency(order.shipping)}</dd>
            </div>
            <div className="grand">
              <dt>Total</dt>
              <dd>{formatCurrency(order.total)}</dd>
            </div>
          </dl>
        </div>

        <div className="account-card">
          <h3 className="order-section-title">Delivery</h3>
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

          <h3 className="order-section-title">Payment</h3>
          <p className="order-payment">
            {order.payment_method === 'cod' ? 'Pay on delivery' : order.payment_method}
          </p>

          {order.notes && (
            <>
              <h3 className="order-section-title">Your note</h3>
              <p className="order-note">{order.notes}</p>
            </>
          )}
        </div>
      </div>
    </>
  );
}
