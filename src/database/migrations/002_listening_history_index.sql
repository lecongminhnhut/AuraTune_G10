-- Feature 101: Listening History Analysis
-- Compound index on listening_history (user_id, played_at) to support sub-1.5s aggregations
-- on accounts with up to 10,000 records (SC-001, Performance Goals).

CREATE INDEX IF NOT EXISTS idx_listening_history_user_played 
ON public.listening_history(user_id, played_at);
