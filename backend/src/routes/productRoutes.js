/**
 * Product Routes
 * 
 * Routes for product browsing, searching, and detail views.
 */

const express = require('express');
const router = express.Router();
const { getProducts, getProductById, getDealProducts, addReview } = require('../controllers/productController');
const { validateId } = require('../middleware/validateRequest');
const { protect } = require('../middleware/authMiddleware');

// GET /api/products/deals - Must be before /:id to avoid conflict
router.get('/deals', getDealProducts);

// GET /api/products - List with search, filter, pagination
router.get('/', getProducts);

// GET /api/products/:id - Single product detail
router.get('/:id', validateId('id'), getProductById);

// POST /api/products/:id/reviews - Add product review
router.post('/:id/reviews', protect, validateId('id'), addReview);

module.exports = router;
