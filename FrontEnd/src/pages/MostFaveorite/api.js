import { apiClient, API_URL } from '../../services/apiClient';

const PRODUCT = `${API_URL}/api/product`;

export const allItems = (key = '') =>
  apiClient(`${PRODUCT}/viewall`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ key }),
  });

/** Sort by like count client-side from allProduct context — no extra endpoint needed */
export const getMostLiked = (allProducts = []) =>
  [...allProducts]
    .filter((item) => item.likes?.length > 0)
    .sort((a, b) => b.likes.length - a.likes.length);
