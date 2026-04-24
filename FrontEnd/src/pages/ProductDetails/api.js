import { apiClient, API_URL } from '../../services/apiClient';

const PRODUCT = `${API_URL}/api/product`;

export const fetchProductData = (id) =>
  apiClient(`${PRODUCT}/edit/${id}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  });

// Re-export shared actions
export { deleteItem, toggleLike } from '../../services/productApi';

