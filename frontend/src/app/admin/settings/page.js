import React from 'react';
import SettingsForm from './SettingsForm';
import { getStoreSettings } from '../../../lib/catalog';
import { isSupabaseConfigured } from '../../../lib/supabase/server';

export const revalidate = 0;

export default async function AdminSettings() {
  if (!isSupabaseConfigured) {
    return (
      <div className="admin-setup">
        <h1>Connect Supabase to edit store settings.</h1>
      </div>
    );
  }

  const settings = await getStoreSettings();

  return (
    <>
      <div className="admin-page-head">
        <div>
          <h1>Settings</h1>
          <p>Storefront details, delivery charges and the cart message.</p>
        </div>
      </div>
      <SettingsForm settings={settings} />
    </>
  );
}
