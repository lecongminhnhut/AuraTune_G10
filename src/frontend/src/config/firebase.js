
import { getApp, getApps, initializeApp } from 'firebase/app';
import {
  browserLocalPersistence,
  browserPopupRedirectResolver,
  getAuth,
  inMemoryPersistence,
  initializeAuth,
} from 'firebase/auth';
import { getDatabase } from 'firebase/database';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL || undefined,
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

// Avoid Firebase's IndexedDB persistence: a full browser disk can make it fail
// before the provider popup opens. Keep users in localStorage when available,
// and fall back to in-memory auth if browser storage is unavailable.
let auth;
try {
  auth = initializeAuth(app, {
    persistence: [browserLocalPersistence, inMemoryPersistence],
    popupRedirectResolver: browserPopupRedirectResolver,
  });
} catch (error) {
  // Vite HMR can evaluate this module again while the Firebase app survives.
  if (error.code !== 'auth/already-initialized') throw error;
  auth = getAuth(app);
}

export { auth };
export const realtimeDb = firebaseConfig.databaseURL
  ? getDatabase(app)
  : null;
export const storage = getStorage(app);

export default app;
