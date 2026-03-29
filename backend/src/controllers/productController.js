/**
 * Product Controller (MongoDB/Mongoose)
 * 
 * Handles all product-related operations:
 * - List products with search, filter, and pagination
 * - Get single product details with images
 */

const Product = require('../models/Product');
const ProductImage = require('../models/ProductImage');
const Category = require('../models/Category');
const Review = require('../models/Review');
const { parsePagination, formatProduct, calculateDiscount } = require('../utils/helpers');

/**
 * GET /api/products
 * List products with search, category, and pagination
 */
const getProducts = async (req, res, next) => {
  try {
    const { search, category, sort } = req.query;
    const { page, limit, skip } = parsePagination(req.query);

    let filter = {};

    if (search) {
      const regex = new RegExp(search, 'i');
      // Also search by category name
      const matchingCategories = await Category.find({ name: regex }).select('_id');
      const catIds = matchingCategories.map(c => c._id);

      filter.$or = [
        { name: regex },
        { description: regex },
        { specifications: regex },
        { category_id: { $in: catIds } },
      ];
    }

    if (category) {
      const cat = await Category.findOne({ slug: category });
      if (cat) {
        filter.category_id = cat._id;
      }
    }

    // Sort order
    let sortObj = { created_at: -1 };
    if (sort === 'price_asc') sortObj = { price: 1 };
    else if (sort === 'price_desc') sortObj = { price: -1 };
    else if (sort === 'rating') sortObj = { rating: -1 };

    const [products, total] = await Promise.all([
      Product.find(filter)
        .sort(sortObj)
        .skip(skip)
        .limit(limit)
        .populate('category_id', 'name slug')
        .lean(),
      Product.countDocuments(filter),
    ]);

    // Get primary images for all products
    const productIds = products.map(p => p._id);
    const primaryImages = await ProductImage.find({ product_id: { $in: productIds }, is_primary: true }).lean();
    const imageMap = {};
    primaryImages.forEach(img => { imageMap[img.product_id.toString()] = img.image_url; });

    const formatted = products.map((p) => ({
      ...formatProduct(p),
      category: p.category_id ? { name: p.category_id.name, slug: p.category_id.slug } : null,
      image: imageMap[p._id.toString()] || null,
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

    const product = await Product.findById(id).populate('category_id', 'name slug').lean();
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    // Get all images
    const images = await ProductImage.find({ product_id: id }).sort({ sort_order: 1 }).lean();

    // Get reviews with user names
    const reviews = await Review.find({ product_id: id })
      .populate('user_id', 'name')
      .sort({ created_at: -1 })
      .lean();

    const formattedReviews = reviews.map(r => ({
      id: r._id,
      rating: r.rating,
      comment: r.comment,
      created_at: r.created_at,
      user_name: r.user_id ? r.user_id.name : 'Unknown',
    }));

    res.json({
      success: true,
      data: {
        ...formatProduct(product),
        category: product.category_id ? { name: product.category_id.name, slug: product.category_id.slug } : null,
        images: images.map(i => ({ image_url: i.image_url, is_primary: i.is_primary, sort_order: i.sort_order })),
        reviews: formattedReviews,
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
    const products = await Product.find({
      original_price: { $ne: null },
      $expr: { $gt: ['$original_price', '$price'] },
    })
      .populate('category_id', 'name slug')
      .lean();

    // Get primary images
    const productIds = products.map(p => p._id);
    const primaryImages = await ProductImage.find({ product_id: { $in: productIds }, is_primary: true }).lean();
    const imageMap = {};
    primaryImages.forEach(img => { imageMap[img.product_id.toString()] = img.image_url; });

    const formatted = products.map((p) => ({
      ...formatProduct(p),
      category: p.category_id ? { name: p.category_id.name, slug: p.category_id.slug } : null,
      image: imageMap[p._id.toString()] || null,
      discount: calculateDiscount(p.original_price, p.price),
    }));

    // Sort by discount percentage descending
    formatted.sort((a, b) => b.discount - a.discount);

    res.json({ success: true, data: formatted.slice(0, 10) });
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
    await Review.create({
      user_id: req.user.id,
      product_id: id,
      rating,
      comment,
    });

    // Update product average rating & review count
    const stats = await Review.aggregate([
      { $match: { product_id: require('mongoose').Types.ObjectId.createFromHexString(id) } },
      { $group: { _id: null, count: { $sum: 1 }, avg_rating: { $avg: '$rating' } } },
    ]);

    if (stats.length > 0) {
      await Product.findByIdAndUpdate(id, {
        review_count: stats[0].count,
        rating: parseFloat(stats[0].avg_rating.toFixed(1)),
      });
    }

    res.status(201).json({ success: true, message: 'Review added successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = { getProducts, getProductById, getDealProducts, addReview };
