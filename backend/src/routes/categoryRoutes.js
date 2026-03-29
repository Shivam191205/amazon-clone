/**
 * Category Routes
 */

const express = require('express');
const router = express.Router();
const { getCategories, getProductsByCategory } = require('../controllers/categoryController');

// GET /api/categories - List all categories
router.get('/', getCategories);

// GET /api/categories/:slug/products - Products in a category
router.get('/:slug/products', getProductsByCategory);

module.exports = router;
