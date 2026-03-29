/**
 * Wishlist Controller (MongoDB/Mongoose)
 */

const WishlistItem = require('../models/WishlistItem');
const Product = require('../models/Product');
const ProductImage = require('../models/ProductImage');

/**
 * GET /api/wishlist
 */
const getWishlist = async (req, res, next) => {
  try {
    const wishlistItems = await WishlistItem.find({ user_id: req.user.id })
      .populate('product_id', 'name price stock rating review_count is_prime')
      .sort({ created_at: -1 })
      .lean();

    // Get primary images
    const productIds = wishlistItems.map(wi => wi.product_id?._id).filter(Boolean);
    const primaryImages = await ProductImage.find({ product_id: { $in: productIds }, is_primary: true }).lean();
    const imageMap = {};
    primaryImages.forEach(img => { imageMap[img.product_id.toString()] = img.image_url; });

    const formatted = wishlistItems.map((item) => ({
      id: item._id,
      product: item.product_id ? {
        id: item.product_id._id,
        name: item.product_id.name,
        price: item.product_id.price,
        stock: item.product_id.stock,
        rating: item.product_id.rating,
        reviewCount: item.product_id.review_count,
        isPrime: item.product_id.is_prime,
        image: imageMap[item.product_id._id.toString()] || null,
      } : null,
    }));

    res.json({ success: true, data: formatted });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/wishlist
 */
const addToWishlist = async (req, res, next) => {
  try {
    const { productId } = req.body;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    const existing = await WishlistItem.findOne({ user_id: req.user.id, product_id: productId });
    if (existing) {
      return res.json({ success: true, message: 'Item already in wishlist', data: existing });
    }

    const created = await WishlistItem.create({ user_id: req.user.id, product_id: productId });

    res.status(201).json({ success: true, message: 'Item added to wishlist', data: created });
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /api/wishlist/:id
 */
const removeFromWishlist = async (req, res, next) => {
  try {
    const { id } = req.params;
    await WishlistItem.findByIdAndDelete(id);
    res.json({ success: true, message: 'Item removed from wishlist' });
  } catch (error) {
    next(error);
  }
};

module.exports = { getWishlist, addToWishlist, removeFromWishlist };
