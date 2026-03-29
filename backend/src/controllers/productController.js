/**
 * Product Controller (Using 'pg' Pool directly)
 * 
 * Handles all product-related operations:
 * - List products with search, filter, and pagination
 * - Get single product details with images
 */

const db = require('../config/db');
const { parsePagination, formatProduct, calculateDiscount } = require('../utils/helpers');

/**
 * GET /api/products
 * List products with search, category, and pagination
 */
const getProducts = async (req, res, next) => {
  try {
    const { search, category, sort } = req.query;
    const { page, limit, skip } = parsePagination(req.query);

    let queryText = `
      SELECT p.*, c.name as category_name, c.slug as category_slug,
             pi.image_url as primary_image
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      LEFT JOIN product_images pi ON p.id = pi.product_id AND pi.is_primary = TRUE
      WHERE 1=1
    `;
    const queryParams = [];

    if (search) {
      queryParams.push(`%${search}%`);
      queryText += ` AND (p.name ILIKE $${queryParams.length} OR p.description ILIKE $${queryParams.length} OR p.specifications ILIKE $${queryParams.length} OR c.name ILIKE $${queryParams.length})`;
    }

    if (category) {
      queryParams.push(category);
      queryText += ` AND c.slug = $${queryParams.length}`;
    }

    // Sort order
    if (sort === 'price_asc') queryText += ' ORDER BY p.price ASC';
    else if (sort === 'price_desc') queryText += ' ORDER BY p.price DESC';
    else if (sort === 'rating') queryText += ' ORDER BY p.rating DESC';
    else queryText += ' ORDER BY p.created_at DESC';

    // Pagination
    queryText += ` LIMIT ${limit} OFFSET ${skip}`;

    const { rows: products } = await db.query(queryText, queryParams);
    
    // Total count for pagination
    const { rows: countRows } = await db.query('SELECT count(*) FROM products');
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
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/products/:id
 */
const getProductById = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const { rows: productRows } = await db.query(
      `SELECT p.*, c.name as category_name, c.slug as category_slug
       FROM products p
       LEFT JOIN categories c ON p.category_id = c.id
       WHERE p.id = $1`,
      [id]
    );

    if (productRows.length === 0) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    const product = productRows[0];
    
    // Get all images
    const { rows: images } = await db.query(
      'SELECT image_url, is_primary, sort_order FROM product_images WHERE product_id = $1 ORDER BY sort_order ASC',
      [id]
    );

    // Get reviews with user names
    const { rows: reviews } = await db.query(
       `SELECT r.id, r.rating, r.comment, r.created_at, u.name as user_name 
        FROM reviews r 
        LEFT JOIN users u ON r.user_id = u.id 
        WHERE r.product_id = $1 ORDER BY r.created_at DESC`,
       [id]
    );

    res.json({
      success: true,
      data: {
        ...formatProduct(product),
        category: { name: product.category_name, slug: product.category_slug },
        images: images,
        reviews: reviews,
        discount: calculateDiscount(product.original_price, product.price),
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/products/deals
 * Products with discounts (originalPrice > price)
 */
const getDealProducts = async (req, res, next) => {
  try {
    const { rows: products } = await db.query(
      `SELECT p.*, c.name as category_name, c.slug as category_slug,
              pi.image_url as primary_image
       FROM products p
       LEFT JOIN categories c ON p.category_id = c.id
       LEFT JOIN product_images pi ON p.id = pi.product_id AND pi.is_primary = TRUE
       WHERE p.original_price > p.price
       ORDER BY (p.original_price - p.price) / p.original_price DESC
       LIMIT 10`
    );

    const formatted = products.map((p) => ({
      ...formatProduct(p),
      category: { name: p.category_name, slug: p.category_slug },
      image: p.primary_image,
      discount: calculateDiscount(p.original_price, p.price),
    }));

    res.json({ success: true, data: formatted });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/products/:id/reviews
 * Add a review for a product
 */
const addReview = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { rating, comment } = req.body;

    if (!rating || !comment) {
      return res.status(400).json({ success: false, message: 'Rating and comment are required' });
    }

    // Insert review
    await db.query(
      'INSERT INTO reviews (user_id, product_id, rating, comment) VALUES ($1, $2, $3, $4)',
      [req.user.id, id, rating, comment]
    );

    // Update product average rating & review count
    const { rows: reviewStats } = await db.query(
      'SELECT COUNT(*) as count, AVG(rating) as avg_rating FROM reviews WHERE product_id = $1',
      [id]
    );

    const count = parseInt(reviewStats[0].count, 10);
    const avgRating = parseFloat(reviewStats[0].avg_rating).toFixed(1);

    await db.query(
      'UPDATE products SET review_count = $1, rating = $2 WHERE id = $3',
      [count, avgRating, id]
    );

    res.status(201).json({ success: true, message: 'Review added successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = { getProducts, getProductById, getDealProducts, addReview };
