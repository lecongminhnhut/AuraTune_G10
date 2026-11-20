import { findSongById, SongLookupError } from '../repositories/songRepository.js';
import { resolveAudioSource } from '../utils/audioSource.js';
import { parseByteRange } from '../utils/httpRange.js';

// Endpoint bài hát cho trình phát (Group 040: 041 điều khiển phát, 042 tiến trình/tua).

const SONG_ID_PATTERN = /^[A-Za-z0-9_-]{1,64}$/;

function sendError(res, status, error, message) {
  return res.status(status).json({ success: false, error, message });
}

function handleUnexpected(res, error) {
  if (error instanceof SongLookupError) {
    console.error('Song lookup failed:', error.cause?.message ?? error.cause);
    return sendError(res, 503, 'song_lookup_failed', 'Không tra cứu được bài hát, vui lòng thử lại.');
  }
  console.error('Song endpoint error:', error);
  if (res.headersSent) return res.destroy(error);
  return sendError(res, 500, 'internal_error', 'Lỗi hệ thống khi xử lý bài hát.');
}

async function findRequestedSong(req, res) {
  const { id } = req.params;
  if (!SONG_ID_PATTERN.test(id)) {
    sendError(res, 400, 'invalid_song_id', 'Mã bài hát không hợp lệ.');
    return null;
  }
  const song = await findSongById(id);
  if (!song) sendError(res, 404, 'song_not_found', 'Không tìm thấy bài hát.');
  return song;
}

// GET /api/v1/songs/:id
export async function getSong(req, res) {
  try {
    const song = await findRequestedSong(req, res);
    if (!song) return undefined;
    return res.json({
      success: true,
      data: {
        id: song.song_id,
        title: song.title,
        artist: song.artist,
        album: song.album,
        duration: song.duration,
        is_active: song.is_active,
        stream_url: `/api/v1/songs/${encodeURIComponent(song.song_id)}/stream`,
      },
    });
  } catch (error) {
    return handleUnexpected(res, error);
  }
}

// GET|HEAD /api/v1/songs/:id/stream — hỗ trợ Range để tua và tải dần (200 / 206 / 416).
export async function streamSong(req, res) {
  try {
    const song = await findRequestedSong(req, res);
    if (!song) return undefined;
    if (!song.is_active) return sendError(res, 410, 'song_unavailable', 'Bài hát này hiện không khả dụng.');

    const source = await resolveAudioSource(song);
    if (!source) return sendError(res, 404, 'audio_not_found', 'Bài hát chưa có tệp âm thanh.');
    if (source.type === 'redirect') return res.redirect(302, source.url);

    const range = parseByteRange(req.headers.range, source.size);
    if (range === 'unsatisfiable') {
      res.set('Content-Range', `bytes */${source.size}`);
      return sendError(res, 416, 'range_not_satisfiable', 'Đoạn dữ liệu yêu cầu nằm ngoài tệp âm thanh.');
    }

    const { start, end } = range ?? { start: 0, end: source.size - 1 };
    res.status(range ? 206 : 200).set({
      'Accept-Ranges': 'bytes',
      'Content-Type': source.contentType,
      'Content-Length': String(end - start + 1),
      'Cache-Control': 'private, max-age=3600',
      'X-Content-Type-Options': 'nosniff',
    });
    if (range) res.set('Content-Range', `bytes ${start}-${end}/${source.size}`);
    if (req.method === 'HEAD') return res.end();

    const stream = source.createReadStream({ start, end });
    stream.on('error', (error) => handleUnexpected(res, error));
    res.on('close', () => stream.destroy());
    return stream.pipe(res);
  } catch (error) {
    return handleUnexpected(res, error);
  }
}
