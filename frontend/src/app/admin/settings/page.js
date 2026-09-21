import React from 'react';
import SettingsForm from './SettingsForm';
import { getStoreSettings } from '../../../lib/catalog';
import { isSupabaseConfigured } from '../../../lib/supabase/server';
import { getT } from '../../../lib/i18n-server';

export const revalidate = 0;

export default async function AdminSettings() {
  const { t } = getT();
  if (!isSupabaseConfigured) {
    return (
      <div className="admin-setup">
        <h1>{t('Connect Supabase to edit store settings.')}</h1>
      </div>
    );
  }

  const settings = await getStoreSettings();

  return (
    <>
      <div className="admin-page-head">
        <div>
          <h1>{t('Settings')}</h1>
          <p>{t('Storefront details, delivery charges and the cart message.')}</p>
        </div>
      </div>
      <SettingsForm settings={settings} />
    </>
  );
}
