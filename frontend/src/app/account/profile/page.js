import React from 'react';
import { getT } from '../../../lib/i18n-server';
import ProfileForm from './ProfileForm';
import { getSessionUser, isSupabaseConfigured } from '../../../lib/supabase/server';

export async function generateMetadata() {
  return { title: `${getT().t('Profile')} | MotoMart India` };
}
export const revalidate = 0;

export default async function ProfilePage() {
  const { t } = getT();

  if (!isSupabaseConfigured) {
    return (
      <div className="account-card">
        <h2>{t('Profiles are not connected yet')}</h2>
        <p>{t('Apply the Supabase migration to enable account details.')}</p>
      </div>
    );
  }

  const { user, profile } = await getSessionUser();

  return (
    <div className="account-card">
      <h2>{t('Profile')}</h2>
      <p className="account-card-sub">
        {t('This is the name and number we use for delivery updates.')}
      </p>
      <ProfileForm profile={profile} email={user?.email || ''} />
    </div>
  );
}
