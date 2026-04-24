import { apiClient, API_URL } from '../../services/apiClient';

const ORDER = `${API_URL}/api/orders`;

export const getMyOrdersAPI = (accessToken, page = 1) =>
  apiClient(`${ORDER}/my?page=${page}&limit=10`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
  });
