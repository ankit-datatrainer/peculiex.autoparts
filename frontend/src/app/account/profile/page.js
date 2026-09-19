import React from 'react';
import ProfileForm from './ProfileForm';
import { getSessionUser, isSupabaseConfigured } from '../../../lib/supabase/server';

export const metadata = { title: 'Profile | MotoMart India' };
export const revalidate = 0;

export default async function ProfilePage() {
  if (!isSupabaseConfigured) {
    return (
      <div className="account-card">
        <h2>Profiles are not connected yet</h2>
        <p>Apply the Supabase migration to enable account details.</p>
      </div>
    );
  }

  const { user, profile } = await getSessionUser();

  return (
    <div className="account-card">
      <h2>Profile</h2>
      <p className="account-card-sub">
        This is the name and number we use for delivery updates.
      </p>
      <ProfileForm profile={profile} email={user?.email || ''} />
    </div>
  );
}
