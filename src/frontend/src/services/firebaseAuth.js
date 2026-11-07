
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  linkWithPopup,
  linkWithCredential,
  GoogleAuthProvider,
  FacebookAuthProvider,
  signOut,
  onAuthStateChanged,
  sendEmailVerification,
  fetchSignInMethodsForEmail,
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
  provider.setCustomParameters({ prompt: 'select_account' });

  const result = await signInWithPopup(auth, provider);

  return result.user;
}

// Đăng nhập bằng Facebook OAuth
export async function loginWithFacebook() {
  const provider = new FacebookAuthProvider();
  provider.addScope('email');
  provider.addScope('public_profile');

  const result = await signInWithPopup(auth, provider);

  return result.user;
}

/** Link Facebook to the currently authenticated Firebase identity when possible.
 * If Firebase reports that the email already belongs to Google, authenticate that
 * Google account first and then attach the pending Facebook credential.
 */
export async function linkFacebookForAccount() {
  const provider = new FacebookAuthProvider();
  provider.addScope('email');
  provider.addScope('public_profile');

  try {
    const currentUser = auth.currentUser;
    const result = currentUser
      ? await linkWithPopup(currentUser, provider)
      : await signInWithPopup(auth, provider);
    return result.user;
  } catch (error) {
    if (error.code === 'auth/provider-already-linked' && auth.currentUser) {
      return auth.currentUser;
    }
    if (!['auth/account-exists-with-different-credential', 'auth/credential-already-in-use'].includes(error.code)) throw error;

    const pendingCredential = FacebookAuthProvider.credentialFromError(error);
    const email = error.customData?.email?.trim().toLowerCase();
    if (!pendingCredential || !email) {
      throw new Error('Facebook could not be linked. Sign in to the existing account and try again.');
    }

    const currentUser = auth.currentUser;
    if (currentUser?.email?.trim().toLowerCase() === email) {
      try {
        return (await linkWithCredential(currentUser, pendingCredential)).user;
      } catch {
        throw new Error('This Facebook identity is already linked to another Firebase account. Sign in to that account before linking it to AuraTune.');
      }
    }

    const methods = await getSignInMethodsForEmail(email);
    if (methods.includes(GoogleAuthProvider.PROVIDER_ID)) {
      let existingGoogleUser;
      try {
        existingGoogleUser = await loginWithGoogle();
      } catch {
        throw new Error('Sign in with the Google account that already uses this email, then retry linking Facebook.');
      }
      if (existingGoogleUser.email?.trim().toLowerCase() !== email) {
        throw new Error(`Sign in with the existing Google account for ${email}, then link Facebook again.`);
      }
      try {
        return (await linkWithCredential(existingGoogleUser, pendingCredential)).user;
      } catch {
        throw new Error('This Facebook identity is already linked to another Firebase account. Sign in to that account before linking it to AuraTune.');
      }
    }

    if (methods.includes('password')) {
      throw new Error(`This email already uses Email/Password in Firebase. Sign in to that Firebase account, then link Facebook again.`);
    }

    throw new Error('This email already uses another sign-in method. Sign in with that method before linking Facebook.');
  }
}

// Đăng xuất Firebase
export async function logoutFirebase() {
  await signOut(auth);
}

// Theo dõi trạng thái đăng nhập
export function subscribeAuth(callback) {
  return onAuthStateChanged(auth, callback);
}

// Kiểm tra các phương thức đăng nhập đã được liên kết với email
export async function getSignInMethodsForEmail(email) {
  if (!email) return [];
  try {
    return await fetchSignInMethodsForEmail(auth, email);
  } catch {
    return [];
  }
}
