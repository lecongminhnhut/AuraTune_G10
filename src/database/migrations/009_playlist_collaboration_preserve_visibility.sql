-- Keep playlist visibility independent from its collaboration setting.
-- Apply after 008_playlist_schema_alignment.sql.

CREATE OR REPLACE FUNCTION public.set_playlist_collaboration(p_playlist_id bigint, p_enabled boolean)
RETURNS void
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = public
AS $$
BEGIN
  UPDATE public.playlists
  SET is_collaborative = p_enabled,
      updated_at = now()
  WHERE playlist_id = p_playlist_id;

  IF NOT p_enabled THEN
    DELETE FROM public.playlist_shared_users WHERE playlist_id = p_playlist_id;
  END IF;
END;
$$;

REVOKE ALL ON FUNCTION public.set_playlist_collaboration(bigint, boolean) FROM public, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.set_playlist_collaboration(bigint, boolean) TO service_role;

NOTIFY pgrst, 'reload schema';
