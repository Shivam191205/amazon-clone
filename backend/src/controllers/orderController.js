/**
 * Order Controller (MongoDB/Mongoose)
 */

const Order = require('../models/Order');
const OrderItem = require('../models/OrderItem');
const CartItem = require('../models/CartItem');
const Product = require('../models/Product');
const ProductImage = require('../models/ProductImage');
const { sendOrderConfirmation } = require('../utils/mailer');

/**
 * POST /api/orders
 */
const placeOrder = async (req, res, next) => {
  try {
    const {
      shippingName,
      shippingAddress,
      shippingCity,
      shippingState,
      shippingZip,
      shippingPhone,
    } = req.body;

    const cartItems = await CartItem.find({ user_id: req.user.id })
      .populate('product_id', 'name price stock')
      .lean();

    if (cartItems.length === 0) {
      return res.status(400).json({ success: false, message: 'Cart is empty' });
    }

    const totalAmount = cartItems.reduce((sum, item) => sum + item.product_id.price * item.quantity, 0);

    // Create order
    const order = await Order.create({
      user_id: req.user.id,
      total_amount: totalAmount,
      shipping_name: shippingName,
      shipping_address: shippingAddress,
      shipping_city: shippingCity,
      shipping_state: shippingState,
      shipping_zip: shippingZip,
      shipping_phone: shippingPhone,
    });

    // Create order items and update stock
    for (const item of cartItems) {
      await OrderItem.create({
        order_id: order._id,
        product_id: item.product_id._id,
        quantity: item.quantity,
        price_at_purchase: item.product_id.price,
      });
      await Product.findByIdAndUpdate(item.product_id._id, { $inc: { stock: -item.quantity } });
    }

    // Clear cart
    await CartItem.deleteMany({ user_id: req.user.id });

    // Send email notification (async) and capture URL
    const emailPreviewUrl = await sendOrderConfirmation(req.user, { id: order._id, totalAmount });

    res.status(201).json({
      success: true,
      message: 'Order placed successfully!',
      data: { id: order._id, emailPreviewUrl: emailPreviewUrl },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/orders
 */
const getOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ user_id: req.user.id }).sort({ created_at: -1 }).lean();

    const formatted = [];
    for (const order of orders) {
      const items = await OrderItem.find({ order_id: order._id })
        .populate('product_id', 'name')
        .lean();

      // Get primary images for order item products
      const prodIds = items.map(i => i.product_id?._id).filter(Boolean);
      const primaryImages = await ProductImage.find({ product_id: { $in: prodIds }, is_primary: true }).lean();
      const imageMap = {};
      primaryImages.forEach(img => { imageMap[img.product_id.toString()] = img.image_url; });

      formatted.push({
        id: order._id,
        totalAmount: order.total_amount,
        status: order.status,
        createdAt: order.created_at,
        items: items.map((i) => ({
          id: i._id,
          quantity: i.quantity,
          priceAtPurchase: i.price_at_purchase,
          product: i.product_id ? {
            id: i.product_id._id,
            name: i.product_id.name,
            image: imageMap[i.product_id._id.toString()] || null,
          } : null,
        })),
      });
    }

    res.json({ success: true, data: formatted });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/orders/:id
 */
const getOrderById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const order = await Order.findById(id).lean();
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    const items = await OrderItem.find({ order_id: id })
      .populate('product_id', 'name')
      .lean();

    const prodIds = items.map(i => i.product_id?._id).filter(Boolean);
    const primaryImages = await ProductImage.find({ product_id: { $in: prodIds }, is_primary: true }).lean();
    const imageMap = {};
    primaryImages.forEach(img => { imageMap[img.product_id.toString()] = img.image_url; });

    res.json({
      success: true,
      data: {
        id: order._id,
        totalAmount: order.total_amount,
        status: order.status,
        shipping: {
          name: order.shipping_name,
          address: order.shipping_address,
          city: order.shipping_city,
          state: order.shipping_state,
          zip: order.shipping_zip,
          phone: order.shipping_phone,
        },
        items: items.map((i) => ({
          id: i._id,
          quantity: i.quantity,
          priceAtPurchase: i.price_at_purchase,
          product: i.product_id ? {
            id: i.product_id._id,
            name: i.product_id.name,
            image: imageMap[i.product_id._id.toString()] || null,
          } : null,
        })),
        createdAt: order.created_at,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { placeOrder, getOrders, getOrderById };
