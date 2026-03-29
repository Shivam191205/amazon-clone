/**
 * Order Routes
 */

const express = require('express');
const router = express.Router();
const { placeOrder, getOrders, getOrderById } = require('../controllers/orderController');
const { protect } = require('../middleware/authMiddleware');

// Apply protection to all routes
router.use(protect);
const { requireFields, validateId } = require('../middleware/validateRequest');

// POST /api/orders - Place new order
router.post(
  '/',
  requireFields(['shippingName', 'shippingAddress', 'shippingCity', 'shippingState', 'shippingZip', 'shippingPhone']),
  placeOrder
);

// GET /api/orders - Order history
router.get('/', getOrders);

// GET /api/orders/:id - Order details
router.get('/:id', validateId('id'), getOrderById);

module.exports = router;
