-- Owner-supplied follow schema. Requires existing users/artists/user_sessions
-- and migrations 003/004. No history invention or delete-policy changes.
BEGIN;
CREATE TABLE IF NOT EXISTS public.user_follows_artist (
  user_id text NOT NULL REFERENCES public.users(user_id),
  artist_id bigint NOT NULL REFERENCES public.artists(artist_id),
  created_at timestamptz DEFAULT now(),
  PRIMARY KEY (user_id, artist_id)
);
DO $preflight$
BEGIN
  IF EXISTS (SELECT 1 FROM public.user_follows_artist WHERE created_at IS NULL) THEN
    RAISE EXCEPTION 'Follow history contains NULL created_at; resolve authoritative original times before rollout';
  END IF;
END;
$preflight$;
ALTER TABLE public.user_follows_artist ALTER COLUMN created_at SET NOT NULL;
ALTER TABLE public.user_follows_artist ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.user_follows_artist FROM PUBLIC;

-- Actor is the canonical signed JWT user_id; session owner references users.id.
-- Locks keep ban/revocation ordered with the current operation's commit.
CREATE FUNCTION public.artist_follow_authorize(p_user_id text,p_session_id text,p_device text)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path='' AS $body$
DECLARE actor public.users%ROWTYPE; active_session public.user_sessions%ROWTYPE;
BEGIN
  SELECT * INTO actor FROM public.users WHERE user_id=p_user_id FOR SHARE;
  IF NOT FOUND THEN RAISE EXCEPTION USING ERRCODE='P0401',MESSAGE='Unauthorized'; END IF;
  IF actor.is_banned THEN RAISE EXCEPTION USING ERRCODE='P0403',MESSAGE='User banned'; END IF;
  IF actor.role IS NULL OR actor.role NOT IN ('user','artist','admin') THEN
    RAISE EXCEPTION USING ERRCODE='P0405',MESSAGE='Forbidden';
  END IF;
  SELECT * INTO active_session FROM public.user_sessions WHERE session_id=p_session_id FOR SHARE;
  IF NOT FOUND THEN RAISE EXCEPTION USING ERRCODE='P0401',MESSAGE='Unauthorized'; END IF;
  IF active_session.user_id IS DISTINCT FROM actor.id OR active_session.is_revoked
    OR active_session.expires_at<=clock_timestamp() OR active_session.inactive_at<=clock_timestamp()
    OR (active_session.device_info IS NOT NULL AND p_device IS DISTINCT FROM active_session.device_info) THEN
    RAISE EXCEPTION USING ERRCODE='P0401',MESSAGE='Unauthorized';
  END IF;
END;
$body$;

CREATE FUNCTION public.artist_follow_set(p_user_id text,p_session_id text,p_device text,p_artist_id bigint,p_follow boolean)
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path='' AS $body$
DECLARE target public.artists%ROWTYPE; is_public boolean; removed integer;
BEGIN
  PERFORM public.artist_follow_authorize(p_user_id,p_session_id,p_device);
  IF p_follow IS NULL THEN RAISE EXCEPTION USING ERRCODE='22023',MESSAGE='Invalid operation'; END IF;
  SELECT * INTO target FROM public.artists WHERE artist_id=p_artist_id FOR UPDATE;
  IF NOT FOUND THEN RAISE EXCEPTION USING ERRCODE='P0404',MESSAGE='Artist not found'; END IF;
  IF target.user_id IS NOT NULL THEN
    PERFORM 1 FROM public.users WHERE user_id=target.user_id FOR SHARE;
  END IF;
  -- A long lock wait must not allow an expired session to write afterwards.
  PERFORM public.artist_follow_authorize(p_user_id,p_session_id,p_device);
  SELECT EXISTS(SELECT 1 FROM public.artist_profile_public WHERE id=p_artist_id::text) INTO is_public;
  IF p_follow THEN
    IF NOT is_public THEN RAISE EXCEPTION USING ERRCODE='P0404',MESSAGE='Artist not found'; END IF;
    INSERT INTO public.user_follows_artist(user_id,artist_id,created_at)
    VALUES(p_user_id,p_artist_id,clock_timestamp()) ON CONFLICT(user_id,artist_id) DO NOTHING;
  ELSE
    DELETE FROM public.user_follows_artist WHERE user_id=p_user_id AND artist_id=p_artist_id;
    GET DIAGNOSTICS removed=ROW_COUNT;
    IF NOT is_public AND removed=0 THEN RAISE EXCEPTION USING ERRCODE='P0404',MESSAGE='Artist not found'; END IF;
  END IF;
  RETURN 'null'::jsonb;
END;
$body$;

CREATE FUNCTION public.artist_follow_list(p_user_id text,p_session_id text,p_device text,p_artist_id bigint DEFAULT NULL)
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path='' AS $body$
DECLARE snapshot jsonb;
BEGIN
  PERFORM public.artist_follow_authorize(p_user_id,p_session_id,p_device);
  -- Target visibility and full list use one statement snapshot. No row-cap or
  -- two-request visibility gap can turn a hidden retained pair into negative state.
  SELECT CASE WHEN p_artist_id IS NOT NULL AND NOT EXISTS(
      SELECT 1 FROM public.artist_profile_public WHERE id=p_artist_id::text
    ) THEN NULL ELSE jsonb_build_object('complete',true,'artists',COALESCE((
      SELECT jsonb_agg(jsonb_build_object('id',a.id,'name',a.name,'imageUrl',a.image_url,
        'followedAt',f.created_at) ORDER BY f.created_at DESC,f.artist_id ASC)
      FROM public.user_follows_artist f JOIN public.artist_profile_public a ON a.id=f.artist_id::text
      WHERE f.user_id=p_user_id
    ),'[]'::jsonb)) END INTO snapshot;
  IF snapshot IS NULL THEN RAISE EXCEPTION USING ERRCODE='P0404',MESSAGE='Artist not found'; END IF;
  RETURN snapshot;
END;
$body$;

REVOKE ALL ON FUNCTION public.artist_follow_authorize(text,text,text) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.artist_follow_set(text,text,text,bigint,boolean) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.artist_follow_list(text,text,text,bigint) FROM PUBLIC;
DO $permissions$
DECLARE role_name text;
BEGIN
  FOREACH role_name IN ARRAY ARRAY['anon','authenticated'] LOOP
    IF EXISTS(SELECT 1 FROM pg_roles WHERE rolname=role_name) THEN
      EXECUTE format('REVOKE ALL ON public.user_follows_artist FROM %I',role_name);
      EXECUTE format('REVOKE ALL ON FUNCTION public.artist_follow_authorize(text,text,text) FROM %I',role_name);
      EXECUTE format('REVOKE ALL ON FUNCTION public.artist_follow_set(text,text,text,bigint,boolean) FROM %I',role_name);
      EXECUTE format('REVOKE ALL ON FUNCTION public.artist_follow_list(text,text,text,bigint) FROM %I',role_name);
    END IF;
  END LOOP;
  IF EXISTS(SELECT 1 FROM pg_roles WHERE rolname='service_role') THEN
    GRANT EXECUTE ON FUNCTION public.artist_follow_set(text,text,text,bigint,boolean) TO service_role;
    GRANT EXECUTE ON FUNCTION public.artist_follow_list(text,text,text,bigint) TO service_role;
  END IF;
END;
$permissions$;
COMMIT;
