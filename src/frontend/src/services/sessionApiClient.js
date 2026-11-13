/**
 * Session API Client Interceptor & Auth Service Client (Spec 011, 012, 013)
 * Connects Frontend directly to Backend Server endpoints (http://localhost:5000/api/v1/auth)
 */

export const API_BASE_URL = typeof import.meta !== 'undefined' && import.meta.env?.VITE_API_BASE_URL
  ? import.meta.env.VITE_API_BASE_URL
  : 'http://localhost:5000/api/v1';

let sharedAuthContext = {};
let refreshInFlight = null;
let authGeneration = 0;

export function invalidateAuthRequests() { authGeneration++; refreshInFlight = null; }
export function currentAuthIdentity() {
  const identity = sharedAuthContext.getSessionIdentity?.();
  return identity ? `${authGeneration}/${identity}` : null;
}

export function sessionIdentity(session) {
  if (!session || session.source !== 'backend' || !session.token) return null;
  try {
    const segment = session.token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
    const claims = JSON.parse(atob(segment));
    return `${session.userId}/${claims.user_id}/${claims.session_id}`;
  } catch { return null; }
}

export function configureAuthContext(authContext = {}) {
  invalidateAuthRequests();
  sharedAuthContext = authContext;
}

export async function apiFetch(url, options = {}, authContext = sharedAuthContext) {
  const { getAccessToken, refreshSession, onSessionRevoked } = authContext;
  const generation = authGeneration;
  const origin = authContext.getSessionIdentity?.() ?? getAccessToken?.() ?? null;
  const assertOrigin = () => {
    const current = authContext.getSessionIdentity?.() ?? getAccessToken?.() ?? null;
    if (generation !== authGeneration || current !== origin || options.signal?.aborted) {
      throw new DOMException('Session changed', 'AbortError');
    }
  };

  const fullUrl = url.startsWith('http') ? url : `${API_BASE_URL}${url.startsWith('/') ? '' : '/'}${url}`;

  const headers = new Headers(options.headers || {});
  if (!headers.has('Content-Type') && !(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }

  const currentToken = getAccessToken ? getAccessToken() : null;
  if (currentToken && !headers.has('Authorization')) {
    headers.set('Authorization', `Bearer ${currentToken}`);
  }

  const fetchOptions = {
    ...options,
    headers,
    credentials: 'include', // Transmit HttpOnly Refresh Token cookie
  };

  try {
    let response = await fetch(fullUrl, fetchOptions);
    assertOrigin();

    const isCredentialRequest = /\/auth\/(?:login|register|forgot-password|reset-password|refresh|firebase\/exchange|oauth\/(?:login|callback))(?:$|\?)/.test(fullUrl);
    if (
      response.status === 401 &&
      refreshSession &&
      !isCredentialRequest &&
      (currentToken || headers.has('Authorization'))
    ) {
      if (!refreshInFlight || refreshInFlight.origin !== origin || refreshInFlight.generation !== generation) {
        const active = { origin, generation };
        active.promise = Promise.resolve().then(() => { assertOrigin(); return refreshSession(); })
          .finally(() => { if (refreshInFlight === active) refreshInFlight = null; });
        refreshInFlight = active;
      }
      const refreshResult = await refreshInFlight.promise;
      assertOrigin();
      if (refreshResult && refreshResult.ok && refreshResult.accessToken) {
        headers.set('Authorization', `Bearer ${refreshResult.accessToken}`);
        response = await fetch(fullUrl, { ...fetchOptions, headers });
        assertOrigin();
      } else {
        if (onSessionRevoked) {
          onSessionRevoked(refreshResult?.message || 'Phiên làm việc hết hạn. Vui lòng đăng nhập lại.');
        }
      }
    }

    return response;
  } catch (error) {
    throw error;
  }
}

export const authApi = {
  async forgotPassword(email) {
    const res = await apiFetch('/auth/forgot-password', { method: 'POST', body: JSON.stringify({ email }) });
    return res.json();
  },

  async resetPassword(token, new_password) {
    const res = await apiFetch('/auth/reset-password', { method: 'POST', body: JSON.stringify({ token, new_password }) });
    return res.json();
  },

  async firebaseExchange(firebaseIdToken, termsAccepted = false) {
    if (!firebaseIdToken) {
      throw new Error('Firebase ID Token is required');
    }

    const response = await apiFetch('/auth/firebase/exchange', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${firebaseIdToken}`
      },
      body: JSON.stringify({
        terms_accepted: termsAccepted === true
      })
    });

    const result = await response.json();

    if (!response.ok) {
      const error = new Error(
        result.message || 'Firebase Token Exchange failed'
      );
      error.status = response.status;
      error.code = result.code;
      throw error;
    }

    return result;
  },

  async register(data) {
    const res = await apiFetch('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return res.json();
  },

  async login(data) {
    const res = await apiFetch('/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return res.json();
  },

  async oauthLogin(provider, redirectUrl) {
    const res = await apiFetch('/auth/oauth/login', {
      method: 'POST',
      body: JSON.stringify({ provider, redirect_url: redirectUrl }),
    });
    return res.json();
  },

  async oauthCallback(data) {
    const res = await apiFetch('/auth/oauth/callback', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return res.json();
  },

  async oauthUnlink(provider, token) {
    const res = await apiFetch('/auth/oauth/unlink', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify({ provider }),
    });
    return res.json();
  },

  async linkFacebook(firebaseIdToken, accessToken) {
    const res = await apiFetch('/auth/oauth/link-facebook', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'X-Firebase-ID-Token': firebaseIdToken,
      },
    });
    return res.json();
  },

  async refresh() {
    const res = await apiFetch('/auth/refresh', {
      method: 'POST',
    });
    return res.json();
  },

  async logout() {
    const res = await apiFetch('/auth/logout', {
      method: 'POST',
    });
    return res.json();
  },

  async logoutAll(token) {
    const res = await apiFetch('/auth/logout-all', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.json();
  },

  async getSessions(token) {
    const res = await apiFetch('/auth/sessions', {
      method: 'GET',
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.json();
  },

  async getMe(token) {
    const res = await apiFetch('/auth/me', {
      method: 'GET',
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.json();
  }
};

