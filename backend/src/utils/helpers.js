/**
 * Utility Helpers
 * 
 * Shared utility functions used across controllers.
 */

/**
 * Default user ID for the application.
 * Since authentication is not required, all operations use this default user.
 */
const DEFAULT_USER_ID = 1;

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
 * Format a product's price fields from Decimal to number
 * @param {object} product - Prisma product object
 * @returns {object} Product with formatted prices
 */
const formatProduct = (product) => {
  if (!product) return null;
  return {
    ...product,
    price: parseFloat(product.price),
    originalPrice: product.original_price ? parseFloat(product.original_price) : null,
    rating: parseFloat(product.rating),
    isPrime: product.is_prime,
    reviewCount: product.review_count,
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
  DEFAULT_USER_ID,
  parsePagination,
  formatProduct,
  calculateDiscount,
};
