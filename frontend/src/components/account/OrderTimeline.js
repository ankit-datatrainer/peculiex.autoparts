import React from 'react';

export const ORDER_FLOW = [
  { id: 'pending', label: 'Order placed', hint: 'We have received your order' },
  { id: 'confirmed', label: 'Confirmed', hint: 'Payment method and stock verified' },
  { id: 'packed', label: 'Packed', hint: 'Your parts are boxed and labelled' },
  { id: 'shipped', label: 'Shipped', hint: 'Handed to the courier' },
  { id: 'out_for_delivery', label: 'Out for delivery', hint: 'Arriving today' },
  { id: 'delivered', label: 'Delivered', hint: 'Enjoy the ride' }
];

export const STATUS_LABEL = {
  pending: 'Order placed',
  confirmed: 'Confirmed',
  packed: 'Packed',
  shipped: 'Shipped',
  out_for_delivery: 'Out for delivery',
  delivered: 'Delivered',
  cancelled: 'Cancelled'
};

const fmt = (ts) =>
  new Date(ts).toLocaleString('en-IN', {
    day: 'numeric',
    month: 'short',
    hour: 'numeric',
    minute: '2-digit'
  });

export default function OrderTimeline({ status, events = [] }) {
  if (status === 'cancelled') {
    const cancelledAt = events.find((e) => e.status === 'cancelled');
    return (
      <div className="track-cancelled">
        <strong>This order was cancelled</strong>
        {cancelledAt && <small>{fmt(cancelledAt.created_at)}</small>}
        {cancelledAt?.note && <p>{cancelledAt.note}</p>}
      </div>
    );
  }

  const reachedAt = {};
  for (const e of events) if (!reachedAt[e.status]) reachedAt[e.status] = e.created_at;

  const currentIndex = ORDER_FLOW.findIndex((s) => s.id === status);

  return (
    <ol className="track-timeline">
      {ORDER_FLOW.map((step, i) => {
        const done = i <= currentIndex;
        const active = i === currentIndex;
        return (
          <li key={step.id} className={`${done ? 'done' : ''} ${active ? 'active' : ''}`}>
            <span className="track-dot" aria-hidden="true" />
            <div>
              <strong>{step.label}</strong>
              <small>{reachedAt[step.id] ? fmt(reachedAt[step.id]) : step.hint}</small>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
