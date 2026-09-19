import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import StatusForm from '../StatusForm';
import OrderTimeline, { STATUS_LABEL } from '../../../../components/account/OrderTimeline';
import { createClient, isSupabaseConfigured } from '../../../../lib/supabase/server';
import { formatCurrency } from '../../../../lib/translations';

export const revalidate = 0;

export default async function AdminOrderDetail({ params }) {
  if (!isSupabaseConfigured) notFound();

  const supabase = createClient();
  const { data: order } = await supabase
    .from('orders')
    .select('*')
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
      <div className="admin-page-head">
        <div>
          <Link href="/admin/orders" className="admin-back">
            ← Orders
          </Link>
          <h1>{order.order_number}</h1>
          <p>
            Placed{' '}
            {new Date(order.placed_at).toLocaleString('en-IN', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
              hour: 'numeric',
              minute: '2-digit'
            })}
          </p>
        </div>
        <span className={`order-status s-${order.status}`}>{STATUS_LABEL[order.status]}</span>
      </div>

      <div className="admin-two-col wide-left">
        <section className="admin-card">
          <h2>Items</h2>
          <ul className="order-items">
            {(items || []).map((item) => (
              <li key={item.id}>
                <img src={item.image || '/assets/site-icon.svg'} alt="" />
                <div>
                  {item.product_id ? (
                    <Link href={`/admin/products/${encodeURIComponent(item.product_id)}`}>
                      {item.name}
                    </Link>
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

          <h2 className="admin-subhead">Tracking history</h2>
          <OrderTimeline status={order.status} events={events || []} />
        </section>

        <div className="admin-side-stack">
          <section className="admin-card">
            <h2>Update status</h2>
            <StatusForm orderId={order.id} status={order.status} adminNote={order.admin_note} />
          </section>

          <section className="admin-card">
            <h2>Customer</h2>
            <address className="order-address">
              <strong>{order.customer_name}</strong>
              {order.address_line1}
              {order.address_line2 ? `, ${order.address_line2}` : ''}
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

            <h2 className="admin-subhead">Payment</h2>
            <p className="order-payment">
              {order.payment_method === 'cod' ? 'Pay on delivery' : order.payment_method}
            </p>

            {order.notes && (
              <>
                <h2 className="admin-subhead">Customer note</h2>
                <p className="order-note">{order.notes}</p>
              </>
            )}
          </section>
        </div>
      </div>
    </>
  );
}
