
import { Readable } from 'node:stream';
import { fileTypeFromBuffer } from 'file-type';
import cloudinary from '../config/cloudinary.js';

const formats = {
  audio: ['audio/mpeg'],
  image: ['image/png', 'image/jpeg', 'image/webp']
};

export async function uploadMedia(file, kind) {
  const detected = await fileTypeFromBuffer(file.buffer);

  if (!formats[kind]?.includes(detected?.mime)) {
    const error = new Error('Unsupported file format');
    error.statusCode = 400;
    throw error;
  }

  const options = {
    resource_type: kind === 'audio' ? 'video' : 'image',
    folder: kind === 'audio'
      ? 'auratune/audio'
      : 'auratune/covers',
    format: detected.ext === 'jpg'
      ? 'jpg'
      : detected.ext,
    unique_filename: true,
    overwrite: false
  };

  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      options,
      (error, result) => {
        if (error) return reject(error);
        resolve({
          public_id: result.public_id,
          secure_url: result.secure_url,
          resource_type: result.resource_type,
          bytes: result.bytes
        });
      }
    );

    Readable.from([file.buffer])
      .on('error', reject)
      .pipe(stream);
  });
}
