/**
 * Cart Routes
 */

const express = require('express');
const router = express.Router();
const { getCart, addToCart, updateCartItem, removeCartItem, clearCart } = require('../controllers/cartController');
const { protect } = require('../middleware/authMiddleware');
const { requireFields, validateQuantity } = require('../middleware/validateRequest');

// Apply protection to all routes
router.use(protect);

// GET /api/cart - Get cart items
router.get('/', getCart);

// POST /api/cart - Add to cart
router.post('/', requireFields(['productId']), validateQuantity, addToCart);

// PUT /api/cart/:id - Update quantity
router.put('/:id', requireFields(['quantity']), validateQuantity, updateCartItem);

// DELETE /api/cart/:id - Remove single item (must be before DELETE /)
router.delete('/:id', removeCartItem);

// DELETE /api/cart - Clear entire cart
router.delete('/', clearCart);

module.exports = router;
