import { apiClient, API_URL } from '../../services/apiClient';

const PRODUCT = `${API_URL}/api/product`;

export const getWishList = (accessToken) =>
  apiClient(`${PRODUCT}/user/wishlist`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
  });
