'use client';

import React from 'react';
import { useFormState, useFormStatus } from 'react-dom';
import { updateOrderStatus } from '../actions';

const STATUSES = [
  ['pending', 'Order placed'],
  ['confirmed', 'Confirmed'],
  ['packed', 'Packed'],
  ['shipped', 'Shipped'],
  ['out_for_delivery', 'Out for delivery'],
  ['delivered', 'Delivered'],
  ['cancelled', 'Cancelled']
];

function UpdateButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" className="admin-primary-btn" disabled={pending}>
      {pending ? 'Updating…' : 'Update status'}
    </button>
  );
}

export default function StatusForm({ orderId, status, adminNote }) {
  const [state, action] = useFormState(updateOrderStatus, {});

  return (
    <form action={action} className="admin-form-stack">
      <input type="hidden" name="order_id" value={orderId} />

      <label>
        <span>Status</span>
        <select name="status" defaultValue={status}>
          {STATUSES.map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </label>

      <label>
        <span>Note for the customer</span>
        <textarea
          name="admin_note"
          rows={3}
          defaultValue={adminNote || ''}
          placeholder="Shown on the customer's tracking timeline"
        />
      </label>

      {state?.error && <p className="admin-error">{state.error}</p>}
      {state?.notice && <p className="admin-notice">{state.notice}</p>}

      <UpdateButton />
    </form>
  );
}
