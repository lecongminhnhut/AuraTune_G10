-- Playlist management (features 061-065). Apply after 001_auth_tables.sql.
-- User created playlists and their memberships live in Supabase Postgres; audio remains in the song catalog/storage.

create table if not exists public.playlists (
  id text primary key default gen_random_uuid()::text,
  user_id_creator text not null references public.users(id) on delete cascade,
  title text not null check (char_length(btrim(title)) between 1 and 80),
  description text not null default '' check (char_length(description) <= 300),
  cover_url text,
  cover_key text not null default 'aurora',
  status text not null default 'Private' check (status in ('Private', 'Public')),
  is_official boolean not null default false,
  is_collaborative boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.playlists add column if not exists user_id_creator text references public.users(id) on delete cascade;
alter table public.playlists add column if not exists title text;
alter table public.playlists add column if not exists description text not null default '';
alter table public.playlists add column if not exists cover_url text;
alter table public.playlists add column if not exists cover_key text not null default 'aurora';
alter table public.playlists add column if not exists status text not null default 'Private';
alter table public.playlists add column if not exists is_official boolean not null default false;
alter table public.playlists add column if not exists is_collaborative boolean not null default false;
alter table public.playlists add column if not exists created_at timestamptz not null default now();
alter table public.playlists add column if not exists updated_at timestamptz not null default now();

create table if not exists public.playlist_songs (
  playlist_id text not null references public.playlists(id) on delete cascade,
  song_id text not null,
  sort_order integer not null check (sort_order >= 0),
  added_by_user_id text references public.users(id) on delete set null,
  added_at timestamptz not null default now(),
  primary key (playlist_id, song_id),
  unique (playlist_id, sort_order)
);

alter table public.playlist_songs add column if not exists sort_order integer not null default 0;
alter table public.playlist_songs add column if not exists added_by_user_id text references public.users(id) on delete set null;
alter table public.playlist_songs add column if not exists added_at timestamptz not null default now();
with ranked as (
  select playlist_id, song_id, row_number() over (partition by playlist_id order by added_at, song_id) - 1 as position
  from public.playlist_songs
)
update public.playlist_songs as membership
set sort_order = ranked.position
from ranked
where membership.playlist_id = ranked.playlist_id
  and membership.song_id = ranked.song_id;
create unique index if not exists playlist_songs_order_idx on public.playlist_songs(playlist_id, sort_order);

create table if not exists public.playlist_shared_users (
  playlist_id text not null references public.playlists(id) on delete cascade,
  shared_with_user_id text not null references public.users(id) on delete cascade,
  joined_at timestamptz not null default now(),
  primary key (playlist_id, shared_with_user_id)
);
alter table public.playlist_shared_users add column if not exists joined_at timestamptz not null default now();

create table if not exists public.playlist_bookmarks (
  user_id text not null references public.users(id) on delete cascade,
  playlist_id text not null references public.playlists(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, playlist_id)
);

create table if not exists public.user_liked_songs (
  user_id text not null references public.users(id) on delete cascade,
  song_id text not null,
  created_at timestamptz not null default now(),
  primary key (user_id, song_id)
);

create index if not exists playlists_owner_updated_idx on public.playlists(user_id_creator, updated_at desc);
create index if not exists playlist_shared_users_user_idx on public.playlist_shared_users(shared_with_user_id);
create index if not exists playlist_bookmarks_user_idx on public.playlist_bookmarks(user_id, created_at desc);

-- The song catalog migration is owned by feature 080 and may not be installed yet.
-- Add the FK only when its identifier exists with the compatible text type.
do $$
begin
  if to_regclass('public.songs') is not null
     and exists (select 1 from information_schema.columns where table_schema='public' and table_name='songs' and column_name='song_id' and data_type='text')
     and not exists (select 1 from pg_constraint where conname='playlist_songs_song_id_fkey' and conrelid='public.playlist_songs'::regclass) then
    alter table public.playlist_songs add constraint playlist_songs_song_id_fkey
      foreign key (song_id) references public.songs(song_id) on delete cascade;
  end if;
  if to_regclass('public.songs') is not null
     and exists (select 1 from information_schema.columns where table_schema='public' and table_name='songs' and column_name='song_id' and data_type='text')
     and not exists (select 1 from pg_constraint where conname='user_liked_songs_song_id_fkey' and conrelid='public.user_liked_songs'::regclass) then
    alter table public.user_liked_songs add constraint user_liked_songs_song_id_fkey
      foreign key (song_id) references public.songs(song_id) on delete cascade;
  end if;
end;
$$;

create or replace function public.reorder_playlist_songs(p_playlist_id text, p_song_ids text[])
returns void
language plpgsql
security invoker
set search_path = public
as $$
declare
  membership_count integer;
begin
  select count(*) into membership_count from public.playlist_songs where playlist_id = p_playlist_id;
  if coalesce(array_length(p_song_ids, 1), 0) <> membership_count
     or (select count(distinct requested.song_id) from unnest(p_song_ids) as requested(song_id)) <> membership_count
     or exists (select 1 from unnest(p_song_ids) as requested(song_id)
       where not exists (select 1 from public.playlist_songs ps where ps.playlist_id = p_playlist_id and ps.song_id = requested.song_id)) then
    raise exception 'Invalid playlist order' using errcode = '22023';
  end if;
  update public.playlist_songs ps
  set sort_order = 1000000 + requested.position - 1
  from unnest(p_song_ids) with ordinality as requested(song_id, position)
  where ps.playlist_id = p_playlist_id and ps.song_id = requested.song_id;
  update public.playlist_songs ps
  set sort_order = requested.position - 1
  from unnest(p_song_ids) with ordinality as requested(song_id, position)
  where ps.playlist_id = p_playlist_id and ps.song_id = requested.song_id;
end;
$$;

create or replace function public.set_playlist_collaboration(p_playlist_id text, p_enabled boolean)
returns void
language plpgsql
security invoker
set search_path = public
as $$
begin
  update public.playlists
  set is_collaborative = p_enabled,
      status = case when p_enabled then 'Public' else 'Private' end,
      updated_at = now()
  where id = p_playlist_id;
  if not p_enabled then
    delete from public.playlist_shared_users where playlist_id = p_playlist_id;
  end if;
end;
$$;

revoke all on function public.reorder_playlist_songs(text, text[]) from public, anon, authenticated;
revoke all on function public.set_playlist_collaboration(text, boolean) from public, anon, authenticated;
grant execute on function public.reorder_playlist_songs(text, text[]) to service_role;
grant execute on function public.set_playlist_collaboration(text, boolean) to service_role;

alter table public.playlists enable row level security;
alter table public.playlist_songs enable row level security;
alter table public.playlist_shared_users enable row level security;
alter table public.playlist_bookmarks enable row level security;
alter table public.user_liked_songs enable row level security;

notify pgrst, 'reload schema';
