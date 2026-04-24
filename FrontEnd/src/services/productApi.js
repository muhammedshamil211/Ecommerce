import { apiClient, API_URL } from './apiClient';

const PRODUCT = `${API_URL}/api/product`;

export const allItems = (key = '') =>
  apiClient(`${PRODUCT}/viewall`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ key }),
  });
export const toggleLike = (accessToken, id) =>
  apiClient(`${PRODUCT}/like/${id}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
  });

export const deleteItem = (accessToken, id) =>
  apiClient(`${PRODUCT}/delete/${id}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
  });
