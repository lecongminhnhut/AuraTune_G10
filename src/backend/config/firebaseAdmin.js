
import { initializeApp, getApps, getApp, applicationDefault } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import dotenv from 'dotenv';
import path from 'node:path';
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const backendDirectory = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
dotenv.config({ path: path.join(backendDirectory, '.env') });

if (process.env.GOOGLE_APPLICATION_CREDENTIALS && !path.isAbsolute(process.env.GOOGLE_APPLICATION_CREDENTIALS)) {
  process.env.GOOGLE_APPLICATION_CREDENTIALS = path.resolve(backendDirectory, process.env.GOOGLE_APPLICATION_CREDENTIALS);
}

if (process.env.GOOGLE_APPLICATION_CREDENTIALS && !existsSync(process.env.GOOGLE_APPLICATION_CREDENTIALS)) {
  throw new Error('GOOGLE_APPLICATION_CREDENTIALS points to a missing file. Check src/backend/.env.');
}

const firebaseAdminApp = getApps().length
  ? getApp()
  : initializeApp({
      credential: applicationDefault(),
      projectId: process.env.FIREBASE_PROJECT_ID,
    });

export const adminAuth = getAuth(firebaseAdminApp);

export default firebaseAdminApp;
