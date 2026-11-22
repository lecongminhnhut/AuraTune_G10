
import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';

dotenv.config();

const requiredVariables = [
  'CLOUDINARY_CLOUD_NAME',
  'CLOUDINARY_API_KEY',
  'CLOUDINARY_API_SECRET',
];

let configured = false;

// Configure on first use instead of at import time, so the API server can start
// (and serve playback, playlists, auth...) on machines without Cloudinary
// credentials. Only an actual upload fails, with a 503 the media controller returns.
export function getCloudinary() {
  if (configured) return cloudinary;

  const missingVariables = requiredVariables.filter(
    (variable) => !process.env[variable]
  );

  if (missingVariables.length > 0) {
    const error = new Error(
      `Missing Cloudinary environment variables: ${missingVariables.join(', ')}`
    );
    error.statusCode = 503;
    throw error;
  }

  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
  });
  configured = true;
  return cloudinary;
}

// Scripts keep using `cloudinary.uploader` / `cloudinary.api`; the proxy
// configures the SDK the first time one of them is touched.
export default new Proxy({}, {
  get(_target, property) {
    return getCloudinary()[property];
  },
});
