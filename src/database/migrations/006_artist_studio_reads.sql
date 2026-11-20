-- Read-required Studio extension to the owner-supplied existing catalog.
-- Requires 003/004/005. No source-table recreation or legacy-owner inference.
BEGIN;
ALTER TABLE public.songs
  ADD COLUMN management_artist_id bigint REFERENCES public.artists(artist_id),
  ADD COLUMN artist_preference text NOT NULL DEFAULT 'hidden'
    CHECK(artist_preference IN ('active','hidden')),
  ADD COLUMN admin_restricted boolean NOT NULL DEFAULT false,
  ADD COLUMN deleted_at timestamptz;

CREATE FUNCTION public.artist_studio_read(p_user_id text,p_session_id text,p_device text,p_section text)
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path='' AS $body$
DECLARE principal public.artists%ROWTYPE; account_role text; result jsonb;
BEGIN
  -- Canonical user_id plus actual users.id session ownership, ban/revocation,
  -- expiry and device checks reuse the established 092 transaction boundary.
  PERFORM public.artist_follow_authorize(p_user_id,p_session_id,p_device);
  SELECT role INTO account_role FROM public.users WHERE user_id=p_user_id;
  IF account_role IS DISTINCT FROM 'artist' THEN
    RAISE EXCEPTION USING ERRCODE='P0405',MESSAGE='Artist Studio unavailable';
  END IF;
  SELECT * INTO principal FROM public.artists WHERE user_id=p_user_id FOR SHARE;
  IF NOT FOUND THEN RAISE EXCEPTION USING ERRCODE='P0405',MESSAGE='Artist Studio unavailable'; END IF;
  IF p_section='identity' THEN
    RETURN jsonb_build_object('id',principal.artist_id::text,'name',principal.name,
      'imageUrl',principal.image_url,'profileVisibility',COALESCE(principal.artist_visibility,'unreviewed'));
  ELSIF p_section='catalog' THEN
    SELECT jsonb_build_object('artistId',principal.artist_id::text,'complete',true,'tracks',COALESCE(jsonb_agg(
      jsonb_build_object('id',s.song_id::text,'title',s.title,
        'album',CASE WHEN a.album_id IS NULL THEN NULL ELSE jsonb_build_object('id',a.album_id::text,'title',a.title) END,
        'genre',s.genre,'durationSeconds',CASE WHEN s.duration>=0 THEN s.duration ELSE NULL END,
        'totalPlays',CASE WHEN s.total_plays>=0 THEN s.total_plays::text ELSE NULL END,
        'artistPreference',s.artist_preference,'adminRestricted',s.admin_restricted,
        'coverUrl',NULL,'fileName',NULL)
      ORDER BY s.song_id ASC),'[]'::jsonb)) INTO result
    FROM public.songs s LEFT JOIN public.albums a ON a.album_id=s.album_id AND a.artist_id=principal.artist_id
    WHERE s.management_artist_id=principal.artist_id AND s.deleted_at IS NULL;
    RETURN result;
  ELSIF p_section='stats' THEN
    IF EXISTS(SELECT 1 FROM public.songs WHERE management_artist_id=principal.artist_id
      AND (total_plays IS NULL OR total_plays<0)) THEN
      RAISE EXCEPTION USING ERRCODE='P0500',MESSAGE='Studio statistics unavailable';
    END IF;
    SELECT jsonb_build_object(
      'artistId',principal.artist_id::text,
      'totalTracks',(count(*) FILTER(WHERE s.deleted_at IS NULL))::text,
      'activeTracks',(count(*) FILTER(WHERE s.deleted_at IS NULL AND s.artist_preference='active'
        AND NOT s.admin_restricted AND EXISTS(SELECT 1 FROM public.artist_profile_public WHERE id=principal.artist_id::text)))::text,
      'historicalPlays',COALESCE(sum(s.total_plays::bigint),0)::text) INTO result
    FROM public.songs s WHERE s.management_artist_id=principal.artist_id;
    RETURN result;
  END IF;
  RAISE EXCEPTION USING ERRCODE='22023',MESSAGE='Invalid Studio read';
END;
$body$;
REVOKE ALL ON FUNCTION public.artist_studio_read(text,text,text,text) FROM PUBLIC;
ALTER TABLE public.songs ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.songs FROM PUBLIC;
DO $permissions$
DECLARE role_name text;
BEGIN
  FOREACH role_name IN ARRAY ARRAY['anon','authenticated'] LOOP
    IF EXISTS(SELECT 1 FROM pg_roles WHERE rolname=role_name) THEN
      EXECUTE format('REVOKE ALL ON FUNCTION public.artist_studio_read(text,text,text,text) FROM %I',role_name);
      EXECUTE format('REVOKE ALL ON public.songs FROM %I',role_name);
    END IF;
  END LOOP;
  IF EXISTS(SELECT 1 FROM pg_roles WHERE rolname='service_role') THEN
    GRANT EXECUTE ON FUNCTION public.artist_studio_read(text,text,text,text) TO service_role;
  END IF;
END;
$permissions$;
COMMENT ON COLUMN public.songs.management_artist_id IS
  'Explicit management grant. NULL is unreviewed; never inferred from album credit or browser state.';
COMMENT ON COLUMN public.songs.deleted_at IS
  'Irreversible Studio removal marker; retains original counters and history references. No physical delete policy.';
COMMIT;
