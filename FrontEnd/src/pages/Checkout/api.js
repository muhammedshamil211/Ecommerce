import { apiClient, API_URL } from '../../services/apiClient';

const ORDER = `${API_URL}/api/orders`;

export const placeOrderAPI = (accessToken, { shippingAddress, paymentMethod }) =>
  apiClient(`${ORDER}/place`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({ shippingAddress, paymentMethod }),
  });
