/**
 * Session API Client Interceptor (Spec 013 - FR-005, FR-009)
 * Handles automatic Access Token Authorization headers, 401 Unauthorized interception,
 * and silent background Refresh Token retries.
 */

export async function apiFetch(url, options = {}, authContext = {}) {
  const { getAccessToken, refreshSession, onSessionRevoked } = authContext;

  const headers = new Headers(options.headers || {});
  const currentToken = getAccessToken ? getAccessToken() : null;

  if (currentToken && !headers.has('Authorization')) {
    headers.set('Authorization', `Bearer ${currentToken}`);
  }

  const fetchOptions = {
    ...options,
    headers,
    credentials: 'include', // Ensures HttpOnly Refresh Token cookie is transmitted
  };

  try {
    let response = await fetch(url, fetchOptions);

    if (response.status === 401 && refreshSession) {
      // Intercept 401 Unauthorized and attempt silent refresh
      const refreshResult = await refreshSession();
      if (refreshResult && refreshResult.ok && refreshResult.accessToken) {
        headers.set('Authorization', `Bearer ${refreshResult.accessToken}`);
        response = await fetch(url, { ...fetchOptions, headers });
      } else {
        if (onSessionRevoked) {
          onSessionRevoked(refreshResult?.message || 'Session expired. Please log in again.');
        }
      }
    }

    return response;
  } catch (error) {
    throw error;
  }
}
