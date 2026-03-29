/**
 * Wishlist Controller (Using 'pg' Pool directly)
 */

const db = require('../config/db');
const { formatProduct } = require('../utils/helpers');

/**
 * GET /api/wishlist
 */
const getWishlist = async (req, res, next) => {
  try {
    const { rows: wishlistItems } = await db.query(
      `SELECT wi.*, p.name, p.price, p.stock, p.rating, p.review_count, p.is_prime,
              pi.image_url as primary_image
       FROM wishlist_items wi
       LEFT JOIN products p ON wi.product_id = p.id
       LEFT JOIN product_images pi ON p.id = pi.product_id AND pi.is_primary = TRUE
       WHERE wi.user_id = $1
       ORDER BY wi.created_at DESC`,
      [req.user.id]
    );

    const formatted = wishlistItems.map((item) => ({
      id: item.id,
      product: {
        id: item.product_id,
        name: item.name,
        price: parseFloat(item.price),
        stock: item.stock,
        rating: item.rating,
        reviewCount: item.review_count,
        isPrime: item.is_prime,
        image: item.primary_image,
      },
    }));

    res.json({ success: true, data: formatted });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/wishlist
 */
const addToWishlist = async (req, res, next) => {
  try {
    const { productId } = req.body;

    const { rows: products } = await db.query('SELECT * FROM products WHERE id = $1', [productId]);
    if (products.length === 0) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    const { rows: existing } = await db.query(
      'SELECT * FROM wishlist_items WHERE user_id = $1 AND product_id = $2',
      [req.user.id, productId]
    );

    if (existing.length > 0) {
      return res.json({ success: true, message: 'Item already in wishlist', data: existing[0] });
    }

    const { rows: created } = await db.query(
      'INSERT INTO wishlist_items (user_id, product_id) VALUES ($1, $2) RETURNING *',
      [req.user.id, productId]
    );

    res.status(201).json({ success: true, message: 'Item added to wishlist', data: created[0] });
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /api/wishlist/:id
 */
const removeFromWishlist = async (req, res, next) => {
  try {
    const { id } = req.params;
    await db.query('DELETE FROM wishlist_items WHERE id = $1', [id]);
    res.json({ success: true, message: 'Item removed from wishlist' });
  } catch (error) {
    next(error);
  }
};

module.exports = { getWishlist, addToWishlist, removeFromWishlist };
