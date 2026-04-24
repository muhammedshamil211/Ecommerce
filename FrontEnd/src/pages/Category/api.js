import { API_URL } from '../../services/apiClient';

const PRODUCT = `${API_URL}/api/product`;

export const categoryItem = (category, page = 1, limit = 10) =>
  fetch(`${PRODUCT}/${category}?page=${page}&limit=${limit}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  }).then(async (res) => {
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to fetch category products');
    return data;
  });
