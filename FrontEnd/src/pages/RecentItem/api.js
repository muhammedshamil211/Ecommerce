import { apiClient, API_URL } from '../../services/apiClient';

const PRODUCT = `${API_URL}/api/product`;

export const recentItems = (page = 1, limit = 10) =>
  apiClient(`${PRODUCT}/latest?page=${page}&limit=${limit}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  });
