
import cloudinary from '../config/cloudinary.js';
import { stat } from 'node:fs/promises';
import path from 'node:path';

async function main() {
  const filePath = process.argv[2];

  if (!filePath) {
    throw new Error('Please provide an image file path');
  }

  const allowedExtensions = ['.jpg', '.jpeg', '.png', '.webp'];
  const extension = path.extname(filePath).toLowerCase();

  if (!allowedExtensions.includes(extension)) {
    throw new Error('Unsupported image extension');
  }

  const file = await stat(filePath);

  if (!file.isFile() || file.size > 10 * 1024 * 1024) {
    throw new Error('Image must be at most 10 MiB');
  }

  const result = await cloudinary.uploader.upload(filePath, {
    resource_type: 'image',
    folder: 'auratune/covers',
    unique_filename: true,
    overwrite: false
  });

  console.log('Image uploaded successfully!');
  console.log('Public ID:', result.public_id);
  console.log('Image URL:', result.secure_url);
}

main().catch((error) => {
  console.error('Upload failed:', error.message ?? error);
  process.exitCode = 1;
});
