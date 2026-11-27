import { Router } from 'express';
import { getSong, getSongLyrics, listSongs, streamSong } from '../controllers/songController.js';

// Group 040 — Music Player: thông tin bài hát và luồng âm thanh.
const router = Router();

router.get('/', listSongs);
router.get('/:id', getSong);
router.get('/:id/stream', streamSong);
router.get('/:id/lyrics', getSongLyrics);

export default router;
