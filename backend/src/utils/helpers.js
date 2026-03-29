/**
 * Utility Helpers
 * 
 * Shared utility functions used across controllers.
 */

/**
 * Parse pagination parameters from query string
 * @param {object} query - Express request query object
 * @returns {{ page: number, limit: number, skip: number }}
 */
const parsePagination = (query) => {
  const page = Math.max(1, parseInt(query.page, 10) || 1);
  const limit = Math.min(50, Math.max(1, parseInt(query.limit, 10) || 20));
  const skip = (page - 1) * limit;
  return { page, limit, skip };
};

/**
 * Format a product's price fields from DB document to API response
 * @param {object} product - MongoDB product document
 * @returns {object} Product with formatted prices
 */
const formatProduct = (product) => {
  if (!product) return null;
  return {
    id: product._id,
    name: product.name,
    description: product.description,
    specifications: product.specifications,
    price: product.price,
    originalPrice: product.original_price || null,
    stock: product.stock,
    rating: product.rating,
    reviewCount: product.review_count,
    isPrime: product.is_prime,
    createdAt: product.created_at,
  };
};

/**
 * Calculate discount percentage
 * @param {number} originalPrice 
 * @param {number} currentPrice 
 * @returns {number} Discount percentage (0-100)
 */
const calculateDiscount = (originalPrice, currentPrice) => {
  if (!originalPrice || originalPrice <= currentPrice) return 0;
  return Math.round(((originalPrice - currentPrice) / originalPrice) * 100);
};

module.exports = {
  parsePagination,
  formatProduct,
  calculateDiscount,
};
