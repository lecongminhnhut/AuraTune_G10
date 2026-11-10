
import cloudinary from '../config/cloudinary.js';
import { stat } from 'node:fs/promises';
import path from 'node:path';

async function main() {
  const filePath = process.argv[2];

  if (!filePath) {
    throw new Error('Provide a licensed MP3 file path');
  }

  if (path.extname(filePath).toLowerCase() !== '.mp3') {
    throw new Error('Only MP3 files are accepted');
  }

  const file = await stat(filePath);

  if (!file.isFile() || file.size > 50 * 1024 * 1024) {
    throw new Error('File must be at most 50 MiB');
  }

  const result = await cloudinary.uploader.upload(filePath, {
    resource_type: 'video',
    folder: 'auratune/audio',
    unique_filename: true,
    overwrite: false
  });

  console.log('Upload successful!');
  console.log('Public ID:', result.public_id);
  console.log('Audio URL:', result.secure_url);
}

main().catch((error) => {
  console.error('Upload failed:', error.message ?? error);
  process.exitCode = 1;
});
