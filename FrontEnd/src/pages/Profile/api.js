import { apiClient, API_URL } from '../../services/apiClient';

const PRODUCT = `${API_URL}/api/product`;

export const myItems = (accessToken, key = '') =>
  apiClient(`${PRODUCT}/myproduct`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({ key }),
  });
