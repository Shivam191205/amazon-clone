/**
 * Cart Controller (MongoDB/Mongoose)
 */

const CartItem = require('../models/CartItem');
const Product = require('../models/Product');
const ProductImage = require('../models/ProductImage');

/**
 * GET /api/cart
 */
const getCart = async (req, res, next) => {
  try {
    const cartItems = await CartItem.find({ user_id: req.user.id })
      .populate('product_id', 'name price original_price stock is_prime')
      .sort({ created_at: -1 })
      .lean();

    // Get primary images for all products in cart
    const productIds = cartItems.map(ci => ci.product_id?._id).filter(Boolean);
    const primaryImages = await ProductImage.find({ product_id: { $in: productIds }, is_primary: true }).lean();
    const imageMap = {};
    primaryImages.forEach(img => { imageMap[img.product_id.toString()] = img.image_url; });

    const items = cartItems.map((item) => ({
      id: item._id,
      quantity: item.quantity,
      product: item.product_id ? {
        id: item.product_id._id,
        name: item.product_id.name,
        price: item.product_id.price,
        originalPrice: item.product_id.original_price,
        stock: item.product_id.stock,
        isPrime: item.product_id.is_prime,
        image: imageMap[item.product_id._id.toString()] || null,
      } : null,
      subtotal: item.product_id ? item.product_id.price * item.quantity : 0,
    }));

    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
    const totalAmount = items.reduce((sum, item) => sum + item.subtotal, 0);

    res.json({
      success: true,
      data: {
        items,
        totalItems,
        totalAmount: Math.round(totalAmount * 100) / 100,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/cart
 */
const addToCart = async (req, res, next) => {
  try {
    const { productId, quantity = 1 } = req.body;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    if (product.stock < quantity) {
      return res.status(400).json({ success: false, message: 'Not enough stock available' });
    }

    const existing = await CartItem.findOne({ user_id: req.user.id, product_id: productId });

    let cartItem;
    if (existing) {
      existing.quantity += quantity;
      await existing.save();
      cartItem = existing;
    } else {
      cartItem = await CartItem.create({
        user_id: req.user.id,
        product_id: productId,
        quantity,
      });
    }

    res.status(201).json({
      success: true,
      message: 'Item added to cart',
      data: cartItem,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /api/cart/:id
 */
const updateCartItem = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { quantity } = req.body;

    const cartItem = await CartItem.findById(id).populate('product_id', 'stock');
    if (!cartItem) {
      return res.status(404).json({ success: false, message: 'Cart item not found' });
    }

    if (cartItem.product_id && cartItem.product_id.stock < quantity) {
      return res.status(400).json({ success: false, message: 'Not enough stock available' });
    }

    cartItem.quantity = quantity;
    await cartItem.save();

    res.json({ success: true, message: 'Cart updated' });
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /api/cart/:id
 */
const removeCartItem = async (req, res, next) => {
  try {
    const { id } = req.params;
    await CartItem.findByIdAndDelete(id);
    res.json({ success: true, message: 'Item removed from cart' });
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /api/cart
 */
const clearCart = async (req, res, next) => {
  try {
    await CartItem.deleteMany({ user_id: req.user.id });
    res.json({ success: true, message: 'Cart cleared' });
  } catch (error) {
    next(error);
  }
};

module.exports = { getCart, addToCart, updateCartItem, removeCartItem, clearCart };
