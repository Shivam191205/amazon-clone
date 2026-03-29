/**
 * Category Controller (MongoDB/Mongoose)
 */

const Category = require('../models/Category');
const Product = require('../models/Product');
const ProductImage = require('../models/ProductImage');
const { parsePagination, formatProduct, calculateDiscount } = require('../utils/helpers');

/**
 * GET /api/categories
 * List all product categories
 */
const getCategories = async (req, res, next) => {
  try {
    const categories = await Category.find().sort({ name: 1 }).lean();

    // Get product counts per category
    const categoriesWithCount = await Promise.all(
      categories.map(async (cat) => {
        const product_count = await Product.countDocuments({ category_id: cat._id });
        return { ...cat, id: cat._id, product_count };
      })
    );

    res.json({
      success: true,
      data: categoriesWithCount,
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

    const category = await Category.findOne({ slug });
    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }

    const filter = { category_id: category._id };

    const [products, total] = await Promise.all([
      Product.find(filter)
        .sort({ rating: -1 })
        .skip(skip)
        .limit(limit)
        .populate('category_id', 'name slug')
        .lean(),
      Product.countDocuments(filter),
    ]);

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
