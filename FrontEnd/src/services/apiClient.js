// ============================================================
// apiClient.js — The ONLY place the API base URL is defined.
// All API modules must import from here, never hardcode URLs.
// ============================================================

export const API_URL = import.meta.env.PROD
  ? 'https://ecommerce-fd9c.onrender.com'
  : (import.meta.env.VITE_API_BASE_URL || 'http://localhost:4500');

/**
 * Core fetch wrapper. Handles 401 → refresh → retry logic.
 * Uses raw fetch for the refresh call to avoid recursive loops.
 *
 * @param {string} url   Full URL to fetch
 * @param {object} options  Standard fetch options
 */
export async function apiClient(url, options = {}) {
  let res = await fetch(url, options);

  // Token expired — try to silently refresh and retry once
  if (res.status === 401) {
    try {
      const refreshRes = await fetch(`${API_URL}/api/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      });

      if (refreshRes.ok) {
        const data = await refreshRes.json();
        const storedUser = JSON.parse(localStorage.getItem('user'));
        const updatedUser = { ...storedUser, accessToken: data.accessToken };
        localStorage.setItem('user', JSON.stringify(updatedUser));

        // Retry original request with new token
        options.headers = {
          ...options.headers,
          Authorization: `Bearer ${data.accessToken}`,
        };
        res = await fetch(url, options);
      } else {
        // Refresh also failed — clear session and redirect
        localStorage.removeItem('user');
        window.location.href = '/login';
        return;
      }
    } catch {
      localStorage.removeItem('user');
      window.location.href = '/login';
      return;
    }
  }

  if (!res.ok) {
    let body = {};
    try { body = await res.json(); } catch { /* ignore parse errors */ }
    throw new Error(body.message || `Request failed with status ${res.status}`);
  }

  return res.json();
}
