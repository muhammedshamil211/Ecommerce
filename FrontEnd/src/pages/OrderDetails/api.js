import { apiClient, API_URL } from '../../services/apiClient';

const ORDER = `${API_URL}/api/orders`;

export const getOrderByIdAPI = (accessToken, id) =>
  apiClient(`${ORDER}/${id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
  });

export const cancelOrderAPI = (accessToken, id) =>
  apiClient(`${ORDER}/${id}/cancel`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
  });
