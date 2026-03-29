/**
 * Cart Controller (Using 'pg' Pool directly)
 */

const db = require('../config/db');
const { formatProduct } = require('../utils/helpers');

/**
 * GET /api/cart
 */
const getCart = async (req, res, next) => {
  try {
    const { rows: cartItems } = await db.query(
      `SELECT ci.*, p.name, p.price, p.original_price, p.stock, p.is_prime,
              pi.image_url as primary_image
       FROM cart_items ci
       LEFT JOIN products p ON ci.product_id = p.id
       LEFT JOIN product_images pi ON p.id = pi.product_id AND pi.is_primary = TRUE
       WHERE ci.user_id = $1
       ORDER BY ci.created_at DESC`,
      [req.user.id]
    );

    const items = cartItems.map((item) => ({
      id: item.id,
      quantity: item.quantity,
      product: {
        id: item.product_id,
        name: item.name,
        price: parseFloat(item.price),
        originalPrice: item.original_price ? parseFloat(item.original_price) : null,
        stock: item.stock,
        isPrime: item.is_prime,
        image: item.primary_image,
      },
      subtotal: parseFloat(item.price) * item.quantity,
    }));

    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
    const totalAmount = items.reduce((sum, item) => sum + item.subtotal, 0);

    res.json({
      success: true,
      data: {
        items,
        totalItems,
        totalAmount: Math.round(totalAmount * 100) / 100,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/cart
 */
const addToCart = async (req, res, next) => {
  try {
    const { productId, quantity = 1 } = req.body;

    const { rows: products } = await db.query('SELECT * FROM products WHERE id = $1', [productId]);
    if (products.length === 0) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    const product = products[0];

    if (product.stock < quantity) {
      return res.status(400).json({ success: false, message: 'Not enough stock available' });
    }

    const { rows: existing } = await db.query(
      'SELECT * FROM cart_items WHERE user_id = $1 AND product_id = $2',
      [req.user.id, productId]
    );

    let cartItem;
    if (existing.length > 0) {
      const { rows: updated } = await db.query(
        'UPDATE cart_items SET quantity = quantity + $1 WHERE id = $2 RETURNING *',
        [quantity, existing[0].id]
      );
      cartItem = updated[0];
    } else {
      const { rows: created } = await db.query(
        'INSERT INTO cart_items (user_id, product_id, quantity) VALUES ($1, $2, $3) RETURNING *',
        [req.user.id, productId, quantity]
      );
      cartItem = created[0];
    }

    res.status(201).json({
      success: true,
      message: 'Item added to cart',
      data: cartItem,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /api/cart/:id
 */
const updateCartItem = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { quantity } = req.body;

    const { rows: cartItems } = await db.query(
      'SELECT ci.*, p.stock FROM cart_items ci LEFT JOIN products p ON ci.product_id = p.id WHERE ci.id = $1',
      [id]
    );

    if (cartItems.length === 0) {
      return res.status(404).json({ success: false, message: 'Cart item not found' });
    }
    const item = cartItems[0];

    if (item.stock < quantity) {
      return res.status(400).json({ success: false, message: 'Not enough stock available' });
    }

    await db.query('UPDATE cart_items SET quantity = $1 WHERE id = $2', [quantity, id]);

    res.json({ success: true, message: 'Cart updated' });
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /api/cart/:id
 */
const removeCartItem = async (req, res, next) => {
  try {
    const { id } = req.params;
    await db.query('DELETE FROM cart_items WHERE id = $1', [id]);
    res.json({ success: true, message: 'Item removed from cart' });
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /api/cart
 */
const clearCart = async (req, res, next) => {
  try {
    await db.query('DELETE FROM cart_items WHERE user_id = $1', [req.user.id]);
    res.json({ success: true, message: 'Cart cleared' });
  } catch (error) {
    next(error);
  }
};

module.exports = { getCart, addToCart, updateCartItem, removeCartItem, clearCart };
