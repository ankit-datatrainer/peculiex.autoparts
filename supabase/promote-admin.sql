-- =============================================================================
-- Make an existing account the super admin.
--
-- Run AFTER 0001_motomart_init.sql, and after the user exists (create them in
-- Supabase Dashboard -> Authentication -> Users -> "Add user", with
-- "Auto Confirm User" ticked).
--
-- Change the email on the next line, then Run.
-- =============================================================================
do $$
declare
  v_email text := 'admin@autoparts.com';   -- <<< your admin email
  v_id    uuid;
begin
  -- Step 1 has to have happened first, or there is nowhere to record the role.
  if to_regclass('public.profiles') is null then
    raise exception
      'public.profiles does not exist — run supabase/migrations/0001_motomart_init.sql first, then re-run this script.';
  end if;

  select id into v_id from auth.users where lower(email) = lower(v_email);

  if v_id is null then
    raise exception
      'No account with email %. Create it first: Dashboard -> Authentication -> Users -> Add user (tick Auto Confirm User).',
      v_email;
  end if;

  -- the signup trigger normally creates this row; upsert covers users made
  -- from the dashboard before the trigger existed
  insert into public.profiles (id, full_name, role)
  values (v_id, 'Super Admin', 'admin')
  on conflict (id) do update set role = 'admin';

  raise notice 'OK: % is now a super admin. Sign in at /signin, then open /admin.', v_email;
end $$;

-- Confirm it worked — should print your email with role = admin.
select u.email, p.role, u.email_confirmed_at is not null as email_confirmed
from public.profiles p
join auth.users u on u.id = p.id
where p.role = 'admin';
