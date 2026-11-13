import { Router } from 'express';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = Router();
const savedAlbumIdsByUser = new Map();

const success = (message, data = null) => ({ success: true, message, data, error: null });
const failure = (message, code) => ({ success: false, message, data: null, error: { code, details: [] } });

router.get('/users/me/saved-albums', authenticateToken, (req, res) => {
  const savedAlbumIds = [...(savedAlbumIdsByUser.get(req.user.id) ?? [])];
  return res.status(200).json(success('Saved albums retrieved successfully', { savedAlbumIds }));
});

router.put('/albums/:id/save', authenticateToken, (req, res) => {
  const albumId = req.params.id;
  if (!albumId) return res.status(400).json(failure('Album ID is required.', 'INVALID_ALBUM_ID'));

  const savedAlbumIds = new Set(savedAlbumIdsByUser.get(req.user.id) ?? []);
  savedAlbumIds.add(albumId);
  savedAlbumIdsByUser.set(req.user.id, [...savedAlbumIds]);
  return res.status(200).json(success('Album saved successfully'));
});

router.delete('/albums/:id/save', authenticateToken, (req, res) => {
  const albumId = req.params.id;
  if (!albumId) return res.status(400).json(failure('Album ID is required.', 'INVALID_ALBUM_ID'));

  const savedAlbumIds = new Set(savedAlbumIdsByUser.get(req.user.id) ?? []);
  savedAlbumIds.delete(albumId);
  savedAlbumIdsByUser.set(req.user.id, [...savedAlbumIds]);
  return res.status(200).json(success('Album removed successfully'));
});

export default router;
