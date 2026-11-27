-- Persist each listener's saved album IDs independently from server memory.
-- Text IDs preserve bigint album identifiers without JavaScript precision loss.
BEGIN;

CREATE TABLE IF NOT EXISTS public.user_saved_albums (
  user_id text NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  album_id text NOT NULL CHECK (char_length(btrim(album_id)) BETWEEN 1 AND 128),
  created_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, album_id)
);

ALTER TABLE public.user_saved_albums ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.user_saved_albums FROM PUBLIC;

DO $permissions$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'anon') THEN
    REVOKE ALL ON public.user_saved_albums FROM anon;
  END IF;
  IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'authenticated') THEN
    REVOKE ALL ON public.user_saved_albums FROM authenticated;
  END IF;
  IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'service_role') THEN
    GRANT SELECT, INSERT, UPDATE, DELETE ON public.user_saved_albums TO service_role;
  END IF;
END;
$permissions$;

COMMENT ON TABLE public.user_saved_albums IS
  'Listener-owned album saves. Access is mediated by the backend and keyed by the authenticated AuraTune user ID.';

NOTIFY pgrst, 'reload schema';
COMMIT;
