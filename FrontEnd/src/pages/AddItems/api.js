import { apiClient, API_URL } from '../../services/apiClient';

const PRODUCT = `${API_URL}/api/product`;

export const fetchProductData = (id) =>
  apiClient(`${PRODUCT}/edit/${id}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  });

export const addItems = (accessToken, payload) =>
  apiClient(`${PRODUCT}/add`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(payload),
  });

export const updateItem = (accessToken, payload, id) =>
  apiClient(`${PRODUCT}/update/${id}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(payload),
  });
