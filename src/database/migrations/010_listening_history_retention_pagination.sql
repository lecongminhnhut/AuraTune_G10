-- Keep the persisted history within the 365-day retention window and support
-- stable keyset pagination by (played_at, history_id).
BEGIN;

CREATE INDEX IF NOT EXISTS idx_listening_history_user_played_id
  ON public.listening_history (user_id, played_at DESC, history_id DESC);

CREATE OR REPLACE FUNCTION public.purge_expired_listening_history()
RETURNS bigint
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
DECLARE
  removed bigint;
BEGIN
  DELETE FROM public.listening_history
  WHERE played_at IS NULL OR played_at < now() - interval '365 days';
  GET DIAGNOSTICS removed = ROW_COUNT;
  RETURN removed;
END;
$function$;

REVOKE ALL ON FUNCTION public.purge_expired_listening_history() FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.purge_expired_listening_history() TO service_role;

-- Schedule daily cleanup when pg_cron is enabled (as on the hosted Supabase
-- deployment). The API also filters expired rows, so retention remains correct
-- when the scheduler extension is unavailable.
DO $schedule$
DECLARE
  existing_job_id bigint;
BEGIN
  IF to_regclass('cron.job') IS NOT NULL THEN
    EXECUTE 'SELECT jobid FROM cron.job WHERE jobname = $1 LIMIT 1'
      INTO existing_job_id USING 'auratune-listening-history-retention';
    IF existing_job_id IS NOT NULL THEN
      EXECUTE 'SELECT cron.unschedule($1)' USING existing_job_id;
    END IF;
    PERFORM cron.schedule(
      'auratune-listening-history-retention',
      '15 3 * * *',
      'SELECT public.purge_expired_listening_history();'
    );
  END IF;
END;
$schedule$;

COMMIT;

NOTIFY pgrst, 'reload schema';
