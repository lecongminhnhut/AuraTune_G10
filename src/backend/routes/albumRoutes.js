import { Router } from 'express';
import { authenticateToken } from '../middleware/authMiddleware.js';
import { albumRepository } from '../repositories/albumRepository.js';
import { savedAlbumRepository } from '../repositories/savedAlbumRepository.js';

const success = (message, data = null) => ({ success: true, message, data, error: null });
const failure = (message, code) => ({ success: false, message, data: null, error: { code, details: [] } });

export function createAlbumRouter(repository = albumRepository, savedAlbums = savedAlbumRepository) {
  const router = Router();

  router.get('/albums/:id', async (req, res) => {
    const albumId = req.params.id?.trim();
    if (!albumId || albumId.length > 128) {
      return res.status(400).json(failure('Invalid album ID.', 'VALIDATION_ERROR'));
    }

    try {
      const album = await repository.findAlbumDetails(albumId);
      if (!album) return res.status(404).json(failure('Album not found.', 'NOT_FOUND'));
      res.set('Cache-Control', 'public, max-age=300');
      return res.status(200).json(success('Album details retrieved successfully.', album));
    } catch (error) {
      console.error('Album details lookup failed:', error.message);
      return res.status(503).json(failure('Album details are temporarily unavailable.', 'SERVICE_UNAVAILABLE'));
    }
  });

  router.get('/users/me/saved-albums', authenticateToken, async (req, res) => {
    res.set('Cache-Control', 'private, no-store');
    try {
      const savedAlbumIds = await savedAlbums.list(req.user.id);
      const albums = await Promise.all(savedAlbumIds.map((id) => repository.findAlbumDetails(id)));
      return res.status(200).json(success('Saved albums retrieved successfully', {
        savedAlbumIds,
        albums: albums.filter(Boolean),
      }));
    } catch (error) {
      console.error('Saved album lookup failed:', error.message);
      return res.status(503).json(failure('Saved albums are temporarily unavailable.', 'SERVICE_UNAVAILABLE'));
    }
  });

  router.put('/albums/:id/save', authenticateToken, async (req, res) => {
    const albumId = req.params.id?.trim();
    if (!albumId || albumId.length > 128) return res.status(400).json(failure('Invalid album ID.', 'INVALID_ALBUM_ID'));

    try {
      if (!await repository.findAlbumDetails(albumId)) return res.status(404).json(failure('Album not found.', 'NOT_FOUND'));
      await savedAlbums.add(req.user.id, albumId);
      return res.status(200).json(success('Album saved successfully'));
    } catch (error) {
      console.error('Save album failed:', error.message);
      return res.status(503).json(failure('Album could not be saved right now.', 'SERVICE_UNAVAILABLE'));
    }
  });

  router.delete('/albums/:id/save', authenticateToken, async (req, res) => {
    const albumId = req.params.id?.trim();
    if (!albumId || albumId.length > 128) return res.status(400).json(failure('Invalid album ID.', 'INVALID_ALBUM_ID'));

    try {
      await savedAlbums.remove(req.user.id, albumId);
      return res.status(200).json(success('Album removed successfully'));
    } catch (error) {
      console.error('Remove saved album failed:', error.message);
      return res.status(503).json(failure('Album could not be removed right now.', 'SERVICE_UNAVAILABLE'));
    }
  });

  return router;
}

export default createAlbumRouter();
