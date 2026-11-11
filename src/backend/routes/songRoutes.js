import { Router } from 'express';
import { getSong, streamSong } from '../controllers/songController.js';

// Group 040 — Music Player: thông tin bài hát và luồng âm thanh.
const router = Router();

router.get('/:id', getSong);
router.get('/:id/stream', streamSong);

export default router;
