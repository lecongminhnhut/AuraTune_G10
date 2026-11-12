import { createReadStream } from 'node:fs';
import { stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createDemoAudio } from './demoAudio.js';

// Xác định nguồn âm thanh của một bài hát cho endpoint stream (Group 040).
// Đây là điểm nối với kho media (Group 090): khi kho lưu trữ có API riêng, chỉ cần thêm
// một nhánh tại đây, controller stream không phải thay đổi.
//   1. audio_url là URL http(s)  -> chuyển hướng tới kho lưu trữ (Supabase Storage, CDN...)
//   2. tệp cục bộ trong MEDIA_DIR -> audio_url tương đối hoặc <song_id>.<đuôi>
//   3. âm thanh demo tổng hợp     -> chỉ khi không chạy production và DEMO_AUDIO khác 'false'

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DEFAULT_MEDIA_DIR = path.resolve(__dirname, '../media');
const DEFAULT_DURATION_SECONDS = 180;

const CONTENT_TYPES = {
  '.mp3': 'audio/mpeg',
  '.m4a': 'audio/mp4',
  '.aac': 'audio/aac',
  '.ogg': 'audio/ogg',
  '.oga': 'audio/ogg',
  '.opus': 'audio/ogg',
  '.wav': 'audio/wav',
  '.flac': 'audio/flac',
  '.webm': 'audio/webm',
};

export function mediaDirectory() {
  return process.env.MEDIA_DIR ? path.resolve(process.env.MEDIA_DIR) : DEFAULT_MEDIA_DIR;
}

export function demoAudioEnabled() {
  if (process.env.DEMO_AUDIO) return process.env.DEMO_AUDIO !== 'false';
  return process.env.NODE_ENV !== 'production';
}

// Trả về đường dẫn tuyệt đối nằm trong thư mục media, hoặc null nếu cố thoát ra ngoài.
function insideMediaDir(mediaDir, relativePath) {
  const resolved = path.resolve(mediaDir, relativePath);
  return resolved.startsWith(mediaDir + path.sep) ? resolved : null;
}

async function regularFile(filePath) {
  try {
    const info = await stat(filePath);
    return info.isFile() ? info : null;
  } catch {
    return null;
  }
}

function fileSource(filePath, info) {
  return {
    type: 'file',
    size: info.size,
    contentType: CONTENT_TYPES[path.extname(filePath).toLowerCase()] ?? 'application/octet-stream',
    createReadStream: ({ start, end }) => createReadStream(filePath, { start, end }),
  };
}

export async function resolveAudioSource(song) {
  const audioUrl = typeof song.audio_url === 'string' ? song.audio_url.trim() : '';
  if (/^https?:\/\//i.test(audioUrl)) return { type: 'redirect', url: audioUrl };

  const mediaDir = mediaDirectory();
  const candidates = [];
  if (audioUrl) candidates.push(insideMediaDir(mediaDir, audioUrl));
  for (const extension of Object.keys(CONTENT_TYPES)) candidates.push(insideMediaDir(mediaDir, `${song.song_id}${extension}`));

  for (const candidate of candidates) {
    if (!candidate || !CONTENT_TYPES[path.extname(candidate).toLowerCase()]) continue;
    const info = await regularFile(candidate);
    if (info) return fileSource(candidate, info);
  }

  if (!demoAudioEnabled()) return null;
  return { type: 'demo', ...createDemoAudio(song.song_id, song.duration ?? DEFAULT_DURATION_SECONDS) };
}
