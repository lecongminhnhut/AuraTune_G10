# Data Model: Music Player — Core Playback & Stream (Group 040)

## PlayerState (frontend, `useAudioPlayer`)

| Field | Type | Notes |
| --- | --- | --- |
| `track` | Track | Current track (from `AppStore` / mock catalog) |
| `queue` | Track[] | Display order; never reordered by shuffle |
| `playlistId` | string \| null | Collection that started playback |
| `isPlaying` | boolean | Listener intent |
| `elapsed` | number (s) | Published once per whole second |
| `shuffle` | boolean | |
| `repeatMode` | `'off' \| 'all' \| 'one'` | Cycles off → all → one → off |
| `pinnedNextIds` | string[] | Tracks added by Play Next; win over shuffle |
| `playKey` | number | Listening-session counter; increases when a track starts from 0 |

Values derived and exposed through `PlayerContext`:

| Value | Description |
| --- | --- |
| `duration` | Media duration once metadata loads, otherwise the track's `m:ss` duration |
| `status` | `idle`, `loading`, `buffering`, `ready` or `error` |
| `error` | Error message, or `null` |
| `isBuffering` | Whether the buffering indicator should show |
| `listened` | Seconds of continuous listening in the current session |
| `playCounted` | Whether the session has reached the play threshold |
| `upcoming` | Queue tracks after the current one |
| `volume`, `muted` | Current volume level and mute state |

Actions:
- Playback: `togglePlayback`, `retry`, `seek`, `playFrom`, `nextTrack`, `previousTrack`, `toggleShuffle`, `cycleRepeat`, `playTrack`, `playCollection`.
- Queue (Group 050): `addToQueue`, `addManyToQueue`, `playNext`, `removeFromQueue`, `moveInQueue`, `clearUpcoming`, `playFromQueue`.

State transitions:

```text
idle --play--> loading --canplay/playing--> ready --waiting/seek--> buffering --playing/seeked--> ready
  any --media error--> error --retry/play--> loading
  any --track change (new playKey)--> idle (then loading when playing)
```

## ListeningSession (frontend, engine-internal)

| Field | Type | Notes |
| --- | --- | --- |
| `key` | string | `${trackId}#${playKey}` |
| `seconds` | number | Continuous forward playback only |
| `last` | number | Last observed `currentTime`; reset on seek |
| `counted` | boolean | `seconds >= min(30, duration / 2)`; never resets within the session |

## PlayerSnapshot (frontend, `localStorage['auratune:player']`)

```json
{ "v": 1, "trackId": "t2", "queueIds": ["t1", "t2", "t3"], "playlistId": null,
  "elapsed": 65, "shuffle": false, "repeatMode": "off", "pinnedNextIds": [] }
```

Validation on restore:
- An unknown version or bad JSON discards the snapshot.
- A missing or unplayable current track discards it.
- Missing, duplicate or unplayable queue entries are dropped.
- `elapsed` is clamped to the range from 0 to the duration minus 1.
- The player always restores paused.

## Song (backend, `songRepository.findSongById`)

| Field | Source column(s) | Notes |
| --- | --- | --- |
| `song_id` | `song_id` or `id` | Path parameter `^[A-Za-z0-9_-]{1,64}$` |
| `title`, `artist`, `album` | `title`, `artist`/`artist_name`, `album`/`album_title` | Display metadata |
| `duration` | `duration` or `duration_seconds` | Seconds, or `m:ss` / `h:mm:ss` |
| `audio_url` | `audio_url` or `file_url` | Remote URL or path relative to `MEDIA_DIR` |
| `lyrics` | `lyrics` | Text: LRC or plain lyrics; parsed by `utils/lyrics.js` (T031) |
| `is_active` | `is_active`, or `status === 'active'` | Defaults to active |
| `source` | — | `database` or `demo` |

## AudioSource (backend, `resolveAudioSource`)

| Variant | Fields | Served as |
| --- | --- | --- |
| `redirect` | `url` | 302 to the remote storage URL |
| `file` | `size`, `contentType`, `createReadStream({ start, end })` | 200/206 from disk |
| `demo` | same as `file`; `contentType: audio/wav` | 200/206, generated per range |

## Lyrics (backend response, `GET /api/v1/songs/:id/lyrics`)

| Field | Type | Notes |
| --- | --- | --- |
| `has_lyrics` | boolean | False when the song has no lyrics |
| `synced` | `[{ time, text }]` | Seconds, sorted; empty when not time-stamped |
| `plain` | string or null | Only when the lyrics have no time tags |

## Comment (Supabase `song_comments`, Feature 046)

| Column | Type | Rules |
| --- | --- | --- |
| `comment_id` | bigint identity | Primary key; returned as `id` |
| `song_id` | bigint | References `songs.song_id`, `ON DELETE CASCADE` |
| `user_id` | text | References `users.user_id`, `ON DELETE CASCADE`; the author |
| `content` | text | 1–300 characters after trimming (CHECK) |
| `created_at` | timestamptz | Default `now()` |

In the API, a comment also has `author` (`id`, `name` from `display_name` or `name`, `avatar_url`) and `can_delete` for the viewer. Only the author or an administrator may delete it.

## ShareLink (frontend, `utils/share.js`)

`/search?q=<track title>` for every track while the album page cannot load albums; `/album/<albumId>?track=<id>` when `ALBUM_SHARE_LINKS` is turned on. Results of sharing: `shared`, `copied`, `cancelled` (no message) or `failed`.
