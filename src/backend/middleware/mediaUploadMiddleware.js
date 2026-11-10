
import multer from 'multer';

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 50 * 1024 * 1024,
    files: 1,
    fields: 10,
    parts: 11
  }
});

export function receiveMedia(req, res, next) {
  upload.single('file')(req, res, (error) => {
    if (error) {
      return res.status(400).json({
        status: 'error',
        message: error.code === 'LIMIT_FILE_SIZE'
          ? 'File exceeds 50 MiB'
          : 'Invalid multipart upload'
      });
    }

    if (!req.file) {
      return res.status(400).json({
        status: 'error',
        message: 'File is required'
      });
    }

    next();
  });
}
