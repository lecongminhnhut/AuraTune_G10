/**
 * Session API Client Interceptor & Auth Service Client (Spec 011, 012, 013)
 * Connects Frontend directly to Backend Server endpoints (http://localhost:5000/api/v1/auth)
 */

export const API_BASE_URL = typeof import.meta !== 'undefined' && import.meta.env?.VITE_API_BASE_URL
  ? import.meta.env.VITE_API_BASE_URL
  : 'http://localhost:5000/api/v1';

export async function apiFetch(url, options = {}, authContext = {}) {
  const { getAccessToken, refreshSession, onSessionRevoked } = authContext;

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

    if (response.status === 401 && refreshSession && !fullUrl.includes('/auth/refresh')) {
      const refreshResult = await refreshSession();
      if (refreshResult && refreshResult.ok && refreshResult.accessToken) {
        headers.set('Authorization', `Bearer ${refreshResult.accessToken}`);
        response = await fetch(fullUrl, { ...fetchOptions, headers });
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

