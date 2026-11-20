-- Feature 091. Requires the existing users/artists schema and migration 003.
-- Backend-only, lossless public projection; never expose raw account rows.
BEGIN;

CREATE VIEW public.artist_profile_public WITH (security_barrier = true) AS
SELECT a.artist_id::text AS id, a.name, a.image_url, a.biography
FROM public.artists AS a
LEFT JOIN public.users AS u ON u.user_id = a.user_id
WHERE a.artist_visibility = 'public'
  AND (a.user_id IS NULL OR u.is_banned = false);

REVOKE ALL ON public.artist_profile_public FROM PUBLIC;
DO $permissions$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'anon') THEN
    REVOKE ALL ON public.artist_profile_public FROM anon;
  END IF;
  IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'authenticated') THEN
    REVOKE ALL ON public.artist_profile_public FROM authenticated;
  END IF;
  IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'service_role') THEN
    GRANT SELECT ON public.artist_profile_public TO service_role;
  END IF;
END;
$permissions$;

-- Both ban and unban persist hidden. No remembered-public restoration.
CREATE FUNCTION public.artist_profile_hide_on_account_status()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $function$
BEGIN
  IF TG_OP = 'INSERT' THEN
    IF NOT NEW.is_banned THEN RETURN NEW; END IF;
  ELSE
    IF NOT NEW.is_banned AND NOT OLD.is_banned THEN RETURN NEW; END IF;
  END IF;
  UPDATE public.artists SET artist_visibility = 'hidden'
  WHERE user_id = NEW.user_id AND artist_visibility IS DISTINCT FROM 'hidden';
  RETURN NEW;
END;
$function$;
REVOKE ALL ON FUNCTION public.artist_profile_hide_on_account_status() FROM PUBLIC;

CREATE TRIGGER artist_profile_hide_on_account_status
AFTER INSERT OR UPDATE OF is_banned ON public.users
FOR EACH ROW EXECUTE FUNCTION public.artist_profile_hide_on_account_status();

-- Publication must recheck the linked account, including after relinking.
-- FOR SHARE conflicts with account-status updates; a racing transaction must
-- wait/recheck or roll back, rather than publish based on an obsolete ban flag.
CREATE FUNCTION public.artist_profile_check_publication()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $function$
DECLARE linked_banned boolean;
BEGIN
  IF NEW.artist_visibility = 'public' AND NEW.user_id IS NOT NULL THEN
    SELECT u.is_banned INTO linked_banned FROM public.users AS u
    WHERE u.user_id = NEW.user_id FOR SHARE;
    IF NOT FOUND OR linked_banned IS DISTINCT FROM false THEN
      RAISE EXCEPTION USING ERRCODE = '23514',
        MESSAGE = 'Artist profile cannot be public while its linked account is unavailable';
    END IF;
  END IF;
  RETURN NEW;
END;
$function$;
REVOKE ALL ON FUNCTION public.artist_profile_check_publication() FROM PUBLIC;

CREATE TRIGGER artist_profile_check_publication
BEFORE INSERT OR UPDATE OF artist_visibility, user_id ON public.artists
FOR EACH ROW EXECUTE FUNCTION public.artist_profile_check_publication();

COMMENT ON VIEW public.artist_profile_public IS
  'Backend-only Artist identity. Int8 IDs are text before JSON serialization. Only explicit public profiles and active linked accounts qualify.';
COMMIT;
