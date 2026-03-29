/**
 * Wishlist Routes
 */

const express = require('express');
const router = express.Router();
const { getWishlist, addToWishlist, removeFromWishlist } = require('../controllers/wishlistController');
const { protect } = require('../middleware/authMiddleware');

// Apply protection to all routes
router.use(protect);
const { requireFields } = require('../middleware/validateRequest');

// GET /api/wishlist
router.get('/', getWishlist);

// POST /api/wishlist
router.post('/', requireFields(['productId']), addToWishlist);

// DELETE /api/wishlist/:id
router.delete('/:id', removeFromWishlist);

module.exports = router;
