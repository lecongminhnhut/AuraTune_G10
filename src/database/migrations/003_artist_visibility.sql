-- Feature 091: extend the existing Supabase artists table.
-- Prerequisite: public.artists already exists (owner-supplied schema).
-- Apply once. No artist table recreation, account-state change or publication.

BEGIN;

-- Add without a default first: existing rows retain NULL (not reviewed).
-- Do not backfill existing artists to either public or hidden implicitly.
ALTER TABLE public.artists
  ADD COLUMN artist_visibility text;

-- This default applies to subsequent INSERTs that omit the column only.
ALTER TABLE public.artists
  ALTER COLUMN artist_visibility SET DEFAULT 'hidden';

-- NULL is intentionally allowed for existing, unreviewed records.
-- Public reads must require artist_visibility = 'public', not COALESCE to public.
ALTER TABLE public.artists
  ADD CONSTRAINT artists_artist_visibility_check
  CHECK (artist_visibility IN ('public', 'hidden'));

COMMENT ON COLUMN public.artists.artist_visibility IS
  'Public profile state: public/hidden; NULL is legacy-unreviewed and not public. New rows default hidden. Unban must not publish an Artist.';

COMMIT;
