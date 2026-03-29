/**
 * Category Controller (Using 'pg' Pool directly)
 */

const db = require('../config/db');
const { parsePagination, formatProduct, calculateDiscount } = require('../utils/helpers');

/**
 * GET /api/categories
 * List all product categories
 */
const getCategories = async (req, res, next) => {
  try {
    const { rows: categories } = await db.query(
      `SELECT c.*, (SELECT count(*) FROM products WHERE category_id = c.id) as product_count 
       FROM categories c ORDER BY name ASC`
    );

    res.json({
      success: true,
      data: categories,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/categories/:slug/products
 * Get all products within a specific category
 */
const getProductsByCategory = async (req, res, next) => {
  try {
    const { slug } = req.params;
    const { page, limit, skip } = parsePagination(req.query);

    const { rows: categories } = await db.query('SELECT * FROM categories WHERE slug = $1', [slug]);
    if (categories.length === 0) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }
    const category = categories[0];

    const { rows: products } = await db.query(
      `SELECT p.*, c.name as category_name, c.slug as category_slug,
              pi.image_url as primary_image
       FROM products p
       LEFT JOIN categories c ON p.category_id = c.id
       LEFT JOIN product_images pi ON p.id = pi.product_id AND pi.is_primary = TRUE
       WHERE p.category_id = $1
       ORDER BY p.rating DESC
       LIMIT ${limit} OFFSET ${skip}`,
      [category.id]
    );

    const { rows: countRows } = await db.query('SELECT count(*) FROM products WHERE category_id = $1', [category.id]);
    const total = parseInt(countRows[0].count, 10);

    const formatted = products.map((p) => ({
      ...formatProduct(p),
      category: { name: p.category_name, slug: p.category_slug },
      image: p.primary_image,
      discount: calculateDiscount(p.original_price, p.price),
    }));

    res.json({
      success: true,
      data: formatted,
      category: { name: category.name, slug: category.slug },
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getCategories, getProductsByCategory };
