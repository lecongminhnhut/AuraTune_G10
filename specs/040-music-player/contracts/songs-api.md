# Contract: Songs API for the Music Player (Group 040)

Base path: `/api/v1/songs`. No authentication is required, because Public listeners may play available tracks (041-FR-012).

Errors use the JSON envelope `{ "success": false, "error": "<code>", "message": "<Vietnamese text>" }`.

## GET /api/v1/songs/:id

Returns song metadata and the stream path.

**200**

```json
{
  "success": true,
  "data": {
    "id": "t8",
    "title": "Midnight Coffee",
    "artist": "AuraTune Studio",
    "album": "Lofi bên cửa sổ",
    "duration": 204,
    "is_active": true,
    "stream_url": "/api/v1/songs/t8/stream"
  }
}
```

| Status | `error` | When |
| --- | --- | --- |
| 400 | `invalid_song_id` | `:id` does not match `^[A-Za-z0-9_-]{1,64}$` |
| 404 | `song_not_found` | No song in the database or the demo catalog |
| 503 | `song_lookup_failed` | Database error and no demo fallback |

## GET (and HEAD) /api/v1/songs/:id/stream

Streams the audio bytes.

| Request `Range` | Response |
| --- | --- |
| none, or not a single `bytes=` range | **200**, full body |
| `bytes=start-end`, `bytes=start-`, `bytes=-suffix` | **206**, `Content-Range: bytes start-end/size` |
| starts at or after the end of the file, or `bytes=-0` | **416**, `Content-Range: bytes */size`, JSON error `range_not_satisfiable` |

Headers on 200 and 206 responses:
- `Accept-Ranges: bytes`
- `Content-Type`: `audio/mpeg`, `audio/mp4`, `audio/ogg`, `audio/wav`, … taken from the source
- `Content-Length`
- `Cache-Control: private, max-age=3600`
- `X-Content-Type-Options: nosniff`

Other outcomes:

| Status | `error` | When |
| --- | --- | --- |
| 302 | — | The song's `audio_url` is an `http(s)` URL; `Location` points to it |
| 400 / 404 / 503 | as above | Same lookup rules as metadata |
| 404 | `audio_not_found` | No remote URL, no file in `MEDIA_DIR`, and demo audio disabled |
| 410 | `song_unavailable` | Song exists but is inactive (moderated or removed) |

Configuration:

| Variable | Default | Effect |
| --- | --- | --- |
| `MEDIA_DIR` | `src/backend/media` | Folder searched for `<audio_url>` or `<song_id>.<mp3\|m4a\|aac\|ogg\|oga\|opus\|wav\|flac\|webm>` |
| `DEMO_AUDIO` | on unless `NODE_ENV=production` | `false` disables synthesized demo audio |
