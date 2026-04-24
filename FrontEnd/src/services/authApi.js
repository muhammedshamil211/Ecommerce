import { apiClient, API_URL } from './apiClient';

const AUTH = `${API_URL}/api/auth`;

export const login = ({ email, password }) =>
  apiClient(`${AUTH}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ email, password }),
  });

export const signup = ({ name, email, password }) =>
  apiClient(`${AUTH}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ name, email, password }),
  });

export const logout = () =>
  apiClient(`${AUTH}/logout`, {
    method: 'POST',
    credentials: 'include',
  });

/** Called by AppContext on boot to silently renew the access token via httpOnly cookie */
export const refreshToken = () =>
  fetch(`${AUTH}/refresh`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
  }).then(async (res) => {
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Refresh failed');
    return data;
  });

export const updateProfile = (accessToken, formData) =>
  apiClient(`${AUTH}/updateUser`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(formData),
  });
