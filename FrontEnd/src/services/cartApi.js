import { apiClient, API_URL } from './apiClient';

const CART = `${API_URL}/api/cart`;

export const getCart = (accessToken) =>
  apiClient(`${CART}/`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
  });

export const addToCartAPI = (accessToken, productId, qty = 1) =>
  apiClient(`${CART}/add`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({ productId, qty }),
  });

export const updateCartItemAPI = (accessToken, productId, qty) =>
  apiClient(`${CART}/update`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({ productId, qty }),
  });

export const removeFromCartAPI = (accessToken, productId) =>
  apiClient(`${CART}/remove/${productId}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
  });

export const clearCartAPI = (accessToken) =>
  apiClient(`${CART}/clear`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
  });
