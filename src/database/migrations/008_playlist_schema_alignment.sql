-- Group 060 Playlist Management (061-065) on the shared Supabase schema.
--
-- The shared project uses the team ER design (docs/design/database/er-diagram.md):
--   playlists(playlist_id bigint, user_id_creator -> users.user_id, name, status, created_at)
--   playlist_songs(playlist_id, song_id, added_at)
--   playlist_shared_users(playlist_id, shared_with_user_id, shared_at)
--   user_liked_songs(user_id, song_id, liked_at)
-- Migration 003 assumed different tables (text `id`, `title`) and never matched that schema.
-- This script only ADDS the columns, table and functions the playlist features need, keyed by
-- the existing bigint ids. It does not drop, rename or rewrite existing data. Safe to re-run.

BEGIN;

-- 061: metadata, default cover, official/collaborative flags, last update time.
ALTER TABLE public.playlists ADD COLUMN IF NOT EXISTS description text NOT NULL DEFAULT '';
ALTER TABLE public.playlists ADD COLUMN IF NOT EXISTS cover_url text;
ALTER TABLE public.playlists ADD COLUMN IF NOT EXISTS cover_key text NOT NULL DEFAULT 'aurora';
ALTER TABLE public.playlists ADD COLUMN IF NOT EXISTS is_official boolean NOT NULL DEFAULT false;
ALTER TABLE public.playlists ADD COLUMN IF NOT EXISTS is_collaborative boolean NOT NULL DEFAULT false;
ALTER TABLE public.playlists ADD COLUMN IF NOT EXISTS updated_at timestamptz NOT NULL DEFAULT now();

DO $checks$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conrelid = 'public.playlists'::regclass AND conname = 'playlists_name_length_check') THEN
    ALTER TABLE public.playlists ADD CONSTRAINT playlists_name_length_check
      CHECK (char_length(btrim(name)) BETWEEN 1 AND 80) NOT VALID;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conrelid = 'public.playlists'::regclass AND conname = 'playlists_description_length_check') THEN
    ALTER TABLE public.playlists ADD CONSTRAINT playlists_description_length_check
      CHECK (char_length(description) <= 300);
  END IF;
END;
$checks$;

-- 062: song order and contributor.
ALTER TABLE public.playlist_songs ADD COLUMN IF NOT EXISTS sort_order integer NOT NULL DEFAULT 0;
ALTER TABLE public.playlist_songs ADD COLUMN IF NOT EXISTS added_by_user_id text REFERENCES public.users(user_id) ON DELETE SET NULL;

WITH ranked AS (
  SELECT playlist_id, song_id,
         row_number() OVER (PARTITION BY playlist_id ORDER BY added_at, song_id) - 1 AS position
  FROM public.playlist_songs
)
UPDATE public.playlist_songs AS membership
SET sort_order = ranked.position
FROM ranked
WHERE membership.playlist_id = ranked.playlist_id
  AND membership.song_id = ranked.song_id
  AND membership.sort_order IS DISTINCT FROM ranked.position;

CREATE UNIQUE INDEX IF NOT EXISTS playlist_songs_order_idx ON public.playlist_songs (playlist_id, sort_order);

-- 061: bookmarks of public playlists (a reference, not a copy).
CREATE TABLE IF NOT EXISTS public.playlist_bookmarks (
  user_id text NOT NULL REFERENCES public.users(user_id) ON DELETE CASCADE,
  playlist_id bigint NOT NULL REFERENCES public.playlists(playlist_id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, playlist_id)
);

CREATE INDEX IF NOT EXISTS playlists_owner_created_idx ON public.playlists (user_id_creator, created_at DESC);
CREATE INDEX IF NOT EXISTS playlist_shared_users_user_idx ON public.playlist_shared_users (shared_with_user_id);
CREATE INDEX IF NOT EXISTS playlist_bookmarks_user_idx ON public.playlist_bookmarks (user_id, created_at DESC);

-- 062: atomic reorder. The new order must contain every member exactly once.
CREATE OR REPLACE FUNCTION public.reorder_playlist_songs(p_playlist_id bigint, p_song_ids bigint[])
RETURNS void
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = public
AS $$
DECLARE
  membership_count integer;
BEGIN
  SELECT count(*) INTO membership_count FROM public.playlist_songs WHERE playlist_id = p_playlist_id;
  IF coalesce(array_length(p_song_ids, 1), 0) <> membership_count
     OR (SELECT count(DISTINCT requested.song_id) FROM unnest(p_song_ids) AS requested(song_id)) <> membership_count
     OR EXISTS (SELECT 1 FROM unnest(p_song_ids) AS requested(song_id)
                 WHERE NOT EXISTS (SELECT 1 FROM public.playlist_songs ps
                                    WHERE ps.playlist_id = p_playlist_id AND ps.song_id = requested.song_id)) THEN
    RAISE EXCEPTION 'Invalid playlist order' USING ERRCODE = '22023';
  END IF;
  UPDATE public.playlist_songs ps
  SET sort_order = 1000000 + requested.position - 1
  FROM unnest(p_song_ids) WITH ORDINALITY AS requested(song_id, position)
  WHERE ps.playlist_id = p_playlist_id AND ps.song_id = requested.song_id;
  UPDATE public.playlist_songs ps
  SET sort_order = requested.position - 1
  FROM unnest(p_song_ids) WITH ORDINALITY AS requested(song_id, position)
  WHERE ps.playlist_id = p_playlist_id AND ps.song_id = requested.song_id;
  UPDATE public.playlists SET updated_at = now() WHERE playlist_id = p_playlist_id;
END;
$$;

-- 065: turning collaboration on makes the playlist public; turning it off removes members.
CREATE OR REPLACE FUNCTION public.set_playlist_collaboration(p_playlist_id bigint, p_enabled boolean)
RETURNS void
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = public
AS $$
BEGIN
  UPDATE public.playlists
  SET is_collaborative = p_enabled,
      status = CASE WHEN p_enabled THEN 'Public' ELSE 'Private' END,
      updated_at = now()
  WHERE playlist_id = p_playlist_id;
  IF NOT p_enabled THEN
    DELETE FROM public.playlist_shared_users WHERE playlist_id = p_playlist_id;
  END IF;
END;
$$;

REVOKE ALL ON FUNCTION public.reorder_playlist_songs(bigint, bigint[]) FROM public, anon, authenticated;
REVOKE ALL ON FUNCTION public.set_playlist_collaboration(bigint, boolean) FROM public, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.reorder_playlist_songs(bigint, bigint[]) TO service_role;
GRANT EXECUTE ON FUNCTION public.set_playlist_collaboration(bigint, boolean) TO service_role;

-- The new table is only used by the backend (service role).
ALTER TABLE public.playlist_bookmarks ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.playlist_bookmarks FROM anon, authenticated;

COMMIT;

NOTIFY pgrst, 'reload schema';
