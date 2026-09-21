import React from 'react';
import { createClient, isSupabaseConfigured } from '../../../lib/supabase/server';
import { formatCurrency } from '../../../lib/translations';
import { getT } from '../../../lib/i18n-server';

export const revalidate = 0;

export default async function AdminCustomers() {
  const { t } = getT();
  if (!isSupabaseConfigured) {
    return <div className="admin-setup"><h1>{t('Connect Supabase to see customers.')}</h1></div>;
  }

  const supabase = createClient();
  const [{ data: profiles }, { data: orders }] = await Promise.all([
    supabase.from('profiles').select('id, full_name, phone, role, created_at').order('created_at', { ascending: false }),
    supabase.from('orders').select('user_id, total, status')
  ]);

  const stats = {};
  for (const o of orders || []) {
    if (!o.user_id) continue;
    const s = (stats[o.user_id] ||= { orders: 0, spend: 0 });
    s.orders += 1;
    if (o.status !== 'cancelled') s.spend += Number(o.total);
  }

  const list = profiles || [];

  return (
    <>
      <div className="admin-page-head">
        <div>
          <h1>{t('Customers')}</h1>
          <p>{list.length} registered account{list.length === 1 ? '' : 's'}</p>
        </div>
      </div>

      <section className="admin-card">
        {list.length === 0 ? (
          <p className="admin-empty">{t('No accounts yet.')}</p>
        ) : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>{t('Name')}</th>
                  <th>{t('Phone')}</th>
                  <th>{t('Role')}</th>
                  <th className="right">{t('Orders')}</th>
                  <th className="right">{t('Spend')}</th>
                  <th>{t('Joined')}</th>
                </tr>
              </thead>
              <tbody>
                {list.map((p) => (
                  <tr key={p.id}>
                    <td><strong>{p.full_name || '—'}</strong></td>
                    <td>{p.phone || '—'}</td>
                    <td>
                      <span className={`admin-pill ${p.role === 'admin' ? 'on' : 'off'}`}>{p.role}</span>
                    </td>
                    <td className="right">{stats[p.id]?.orders || 0}</td>
                    <td className="right">{formatCurrency(stats[p.id]?.spend || 0)}</td>
                    <td>
                      {new Date(p.created_at).toLocaleDateString('en-IN', {
                        day: 'numeric', month: 'short', year: 'numeric'
                      })}
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
