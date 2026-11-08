-- Run this migration in the Supabase SQL editor before starting the backend.
-- It creates the auth schema on new projects and upgrades legacy public.users tables.

create table if not exists public.users (
  id text primary key,
  user_id text not null unique,
  email text not null unique,
  name text,
  display_name text not null,
  password_hash text,
  role text not null default 'user',
  has_local_password boolean not null default false,
  avatar_url text,
  failed_login_attempts integer not null default 0,
  lockout_until timestamptz,
  terms_accepted_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  is_banned boolean not null default false
);

-- Add fields that may be missing when upgrading a pre-authentication users table.
alter table public.users
  add column if not exists id text,
  add column if not exists user_id text,
  add column if not exists email text,
  add column if not exists name text,
  add column if not exists display_name text,
  add column if not exists password_hash text,
  add column if not exists role text not null default 'user',
  add column if not exists has_local_password boolean not null default false,
  add column if not exists avatar_url text,
  add column if not exists failed_login_attempts integer not null default 0,
  add column if not exists lockout_until timestamptz,
  add column if not exists terms_accepted_at timestamptz not null default now(),
  add column if not exists created_at timestamptz not null default now(),
  add column if not exists updated_at timestamptz not null default now(),
  add column if not exists is_banned boolean not null default false;

-- Preserve legacy identifiers when possible, otherwise generate an AuraTune ID.
do $$
begin
  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'users' and column_name = 'user_id'
  ) then
    execute 'update public.users set id = coalesce(id, user_id) where id is null';
  end if;
  update public.users set id = gen_random_uuid()::text where id is null;
end $$;

update public.users
set user_id = id
where user_id is null;

update public.users
set display_name = coalesce(nullif(btrim(name), ''), split_part(email, '@', 1))
where display_name is null or btrim(display_name) = '';

update public.users
set name = display_name
where name is null or btrim(name) = '';

update public.users
set has_local_password = (password_hash is not null)
where has_local_password is distinct from (password_hash is not null);

alter table public.users alter column id set not null;
alter table public.users alter column user_id set not null;
create unique index if not exists users_id_unique_idx on public.users (id);
create unique index if not exists users_user_id_unique_idx on public.users (user_id);
create unique index if not exists users_email_unique_idx on public.users (email);

create table if not exists public.oauth_links (
  id uuid primary key default gen_random_uuid(),
  user_id text not null references public.users(id) on delete cascade,
  provider text not null check (provider in ('firebase', 'google', 'facebook')),
  provider_user_id text not null,
  linked_at timestamptz not null default now(),
  last_login_at timestamptz not null default now(),
  unique (provider, provider_user_id),
  unique (user_id, provider)
);

create table if not exists public.user_sessions (
  session_id text primary key,
  user_id text not null references public.users(id) on delete cascade,
  refresh_token_hash text not null unique,
  previous_token_hash text unique,
  grace_expires_at timestamptz,
  device_info text,
  ip_address text,
  remember_me boolean not null default false,
  is_revoked boolean not null default false,
  created_at timestamptz not null default now(),
  last_active_at timestamptz not null default now(),
  inactive_at timestamptz not null,
  expires_at timestamptz not null
);

create index if not exists user_sessions_user_active_idx
  on public.user_sessions (user_id, is_revoked, expires_at, inactive_at);

create table if not exists public.password_reset_tokens (
  token_hash text primary key,
  user_id text not null references public.users(id) on delete cascade,
  expires_at timestamptz not null,
  created_at timestamptz not null default now()
);

create index if not exists password_reset_tokens_user_idx
  on public.password_reset_tokens (user_id);

alter table public.users enable row level security;
alter table public.oauth_links enable row level security;
alter table public.user_sessions enable row level security;
alter table public.password_reset_tokens enable row level security;

notify pgrst, 'reload schema';
