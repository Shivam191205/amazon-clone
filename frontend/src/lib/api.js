/**
 * Amazon Clone - API Client
 * 
 * Centralized fetch wrapper to communicate with the Node.js backend.
 * Default Base URL: http://localhost:5000/api
 */

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

/**
 * Executes a fetch request with JSON handling and error catching.
 */
async function apiFetch(endpoint, options = {}) {
  const url = `${BASE_URL}${endpoint}`;
  
  const token = typeof window !== 'undefined' ? localStorage.getItem('amazon_clone_token') : null;
  
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    },
    ...options,
  };

  try {
    const response = await fetch(url, defaultOptions);
    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || 'API request failed');
    }

    return result;
  } catch (error) {
    console.error(`API Error [${endpoint}]:`, error);
    throw error;
  }
}

export const api = {
  // Products
  getProducts: (params = '') => apiFetch(`/products${params}`),
  getProduct: (id) => apiFetch(`/products/${id}`),
  getDeals: () => apiFetch('/products/deals'),
  addReview: (productId, data) => apiFetch(`/products/${productId}/reviews`, { method: 'POST', body: JSON.stringify(data) }),
  
  // Categories
  getCategories: () => apiFetch('/categories'),
  getCategoryProducts: (slug) => apiFetch(`/categories/${slug}/products`),
  
  // Cart (Local state handles most of this, but backend sync is available)
  getCart: () => apiFetch('/cart'),
  addToCart: (data) => apiFetch('/cart', { method: 'POST', body: JSON.stringify(data) }),
  updateCart: (id, data) => apiFetch(`/cart/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  removeFromCart: (id) => apiFetch(`/cart/${id}`, { method: 'DELETE' }),
  
  // Orders
  placeOrder: (data) => apiFetch('/orders', { method: 'POST', body: JSON.stringify(data) }),
  getOrders: () => apiFetch('/orders'),
  getOrder: (id) => apiFetch(`/orders/${id}`),
  
  // Wishlist
  getWishlist: () => apiFetch('/wishlist'),
  addToWishlist: (productId) => apiFetch('/wishlist', { method: 'POST', body: JSON.stringify({ productId }) }),
  removeFromWishlist: (id) => apiFetch(`/wishlist/${id}`, { method: 'DELETE' }),

  // Auth
  login: (data) => apiFetch('/auth/login', { method: 'POST', body: JSON.stringify(data) }),
  signup: (data) => apiFetch('/auth/signup', { method: 'POST', body: JSON.stringify(data) }),
  getMe: () => apiFetch('/auth/me'),
};
