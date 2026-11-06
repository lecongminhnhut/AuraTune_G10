
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
  sendEmailVerification,
} from 'firebase/auth';

import { auth } from '../config/firebase.js';

// Đăng ký bằng Email/Password
export async function registerWithEmail(email, password) {
  const result = await createUserWithEmailAndPassword(
    auth,
    email,
    password
  );

  return result.user;
}
export async function sendVerificationEmail(firebaseUser) {
  if (!firebaseUser) {
    throw new Error('Firebase user is required');
  }

  await sendEmailVerification(firebaseUser);
}
// Đăng nhập bằng Email/Password
export async function loginWithEmail(email, password) {
  const result = await signInWithEmailAndPassword(
    auth,
    email,
    password
  );

  return result.user;
}

// Đăng nhập bằng Google OAuth
export async function loginWithGoogle() {
  const provider = new GoogleAuthProvider();

  const result = await signInWithPopup(auth, provider);

  return result.user;
}

// Đăng xuất Firebase
export async function logoutFirebase() {
  await signOut(auth);
}

// Theo dõi trạng thái đăng nhập
export function subscribeAuth(callback) {
  return onAuthStateChanged(auth, callback);
}
