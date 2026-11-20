
import { uploadMedia } from '../services/cloudinaryStorageService.js';

export async function uploadAudio(req, res) {
  try {
    if (
      req.body.rightsConfirmed !== 'true' ||
      !req.body.license?.trim() ||
      !req.body.source?.trim()
    ) {
      return res.status(400).json({
        status: 'error',
        message: 'Rights confirmation, license and source are required'
      });
    }

    const result = await uploadMedia(req.file, 'audio');

    return res.status(201).json({
      status: 'success',
      media: result,
      rights: {
        license: req.body.license.trim(),
        source: req.body.source.trim()
      }
    });
  } catch (error) {
    console.error('Audio upload failed:', error.message);
    return res.status(error.statusCode || 502).json({
      status: 'error',
      message: error.statusCode
        ? error.message
        : 'Media storage upload failed'
    });
  }
}

export async function uploadImage(req, res) {
  try {
    const result = await uploadMedia(req.file, 'image');

    return res.status(201).json({
      status: 'success',
      media: result
    });
  } catch (error) {
    console.error('Image upload failed:', error.message);
    return res.status(error.statusCode || 502).json({
      status: 'error',
      message: error.statusCode
        ? error.message
        : 'Media storage upload failed'
    });
  }
}
