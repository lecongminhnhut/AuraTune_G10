# Quickstart: Music Player — Core Playback & Stream (Group 040)

## Run

```bash
cd src/database && npm install     # Supabase client used by the backend
cd ../backend && npm install && npm run dev        # http://localhost:5000
cd ../frontend && npm install && npm run dev       # http://localhost:5173
```

- The frontend needs the `VITE_FIREBASE_*` variables in `src/frontend/.env` (or `.env.local`) to start. Placeholder values are enough for player work.
- To hear a real recording, put `t1.mp3` … `t10.mp3` in `src/backend/media/`; this folder is git-ignored. Without files, the backend synthesizes a demo melody of the right length for each catalog song.

## Automated tests

```bash
cd src/backend && npm test      # Range parsing, metadata, 200/206/416/410, media files, path traversal
cd src/frontend && npm test     # next/previous, shuffle + Play Next, play threshold, lyrics index, snapshot restore
```

## Manual verification

| # | Steps | Expected |
| --- | --- | --- |
| 1 | Home → play album "Lofi bên cửa sổ" | Full player opens; time advances; Network shows `GET /api/v1/songs/t8/stream → 206` |
| 2 | Drag the seek bar far ahead | Spinner on Play and pulsing waveform while loading; resumes at the new position |
| 3 | Tap a lyric line | Playback jumps to that line and keeps playing; the line becomes emphasized |
| 4 | Seek to the last seconds of track 1 | Track 2 starts automatically |
| 5 | Seek to the end of the last track (repeat off) | Playback stops at the end; Play restarts the track |
| 6 | Repeat one → seek to the end | The same track restarts |
| 7 | Previous after 3 s / within 3 s | Restarts the track / goes to the previous track |
| 8 | Stop the backend, play an uncached song | Alert "Không tải được bài hát." with Retry / Skip in both players; restart the backend → Retry plays |
| 9 | Play any song, seek to 1:05, reload the page | Same song and queue, paused at about 1:05; Play resumes there; no stream request before Play |
| 10 | Play a song without lyrics | "Bài hát này chưa có lời." and music keeps playing |
| 11 | Mute, then drag the volume slider | Unmutes at the new level; level stays when the track changes; resets to default after reload |
| 12 | While signed in, play 20 s then skip | No history entry. Play 30 s or more (or half of a short track) and an entry appears in History |
| 13 | Backend account (Supabase in `src/.env`, migration 007 applied): search a catalog song, play it for 30 s or more | Network shows `POST /api/v1/users/me/history → 201`; Supabase `listening_history` has a new row with your `user_id`, the `song_id` and `listened_duration ≥ 30` |
| 14 | Pause, then stop and restart the backend; reload the browser and sign in again | History lists the song with the listened time (`GET /api/v1/users/me/history → 200`); Home shows it under recently played |
| 15 | History → Xóa lịch sử | `DELETE /api/v1/users/me/history → 200`; the rows are gone in Supabase and stay gone after reload |
