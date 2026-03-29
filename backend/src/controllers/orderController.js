/**
 * Order Controller (Using 'pg' Pool directly)
 */

const db = require('../config/db');
const { formatProduct } = require('../utils/helpers');
const { sendOrderConfirmation } = require('../utils/mailer');

/**
 * POST /api/orders
 * Simplified order placement (without complex transactions for now)
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

    const { rows: cartItems } = await db.query(
      'SELECT ci.*, p.name, p.price, p.stock FROM cart_items ci LEFT JOIN products p ON ci.product_id = p.id WHERE ci.user_id = $1',
      [req.user.id]
    );

    if (cartItems.length === 0) {
      return res.status(400).json({ success: false, message: 'Cart is empty' });
    }

    const totalAmount = cartItems.reduce((sum, item) => sum + parseFloat(item.price) * item.quantity, 0);

    // Create order
    const { rows: orderRows } = await db.query(
      `INSERT INTO orders 
       (user_id, total_amount, shipping_name, shipping_address, shipping_city, shipping_state, shipping_zip, shipping_phone)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id`,
      [req.user.id, totalAmount, shippingName, shippingAddress, shippingCity, shippingState, shippingZip, shippingPhone]
    );
    const orderId = orderRows[0].id;

    // Create order items and update stock
    for (const item of cartItems) {
      await db.query(
        'INSERT INTO order_items (order_id, product_id, quantity, price_at_purchase) VALUES ($1, $2, $3, $4)',
        [orderId, item.product_id, item.quantity, item.price]
      );
      await db.query('UPDATE products SET stock = stock - $1 WHERE id = $2', [item.quantity, item.product_id]);
    }

    // Clear cart
    await db.query('DELETE FROM cart_items WHERE user_id = $1', [req.user.id]);

    // Send email notification (async) and capture URL
    const emailPreviewUrl = await sendOrderConfirmation(req.user, { id: orderId, totalAmount });

    res.status(201).json({ 
      success: true, 
      message: 'Order placed successfully!', 
      data: { id: orderId, emailPreviewUrl: emailPreviewUrl } 
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
    const { rows: orders } = await db.query(
      'SELECT * FROM orders WHERE user_id = $1 ORDER BY created_at DESC',
      [req.user.id]
    );

    const formatted = [];
    for (const order of orders) {
      const { rows: items } = await db.query(
        `SELECT oi.*, p.name, pi.image_url as primary_image
         FROM order_items oi
         LEFT JOIN products p ON oi.product_id = p.id
         LEFT JOIN product_images pi ON p.id = pi.product_id AND pi.is_primary = TRUE
         WHERE oi.order_id = $1`,
        [order.id]
      );

      formatted.push({
        id: order.id,
        totalAmount: parseFloat(order.total_amount),
        status: order.status,
        createdAt: order.created_at,
        items: items.map((i) => ({
          id: i.id,
          quantity: i.quantity,
          priceAtPurchase: parseFloat(i.price_at_purchase),
          product: { id: i.product_id, name: i.name, image: i.primary_image },
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
    const { rows: orderRows } = await db.query('SELECT * FROM orders WHERE id = $1', [id]);
    if (orderRows.length === 0) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }
    const order = orderRows[0];

    const { rows: items } = await db.query(
      `SELECT oi.*, p.name, pi.image_url as primary_image
       FROM order_items oi
       LEFT JOIN products p ON oi.product_id = p.id
       LEFT JOIN product_images pi ON p.id = pi.product_id AND pi.is_primary = TRUE
       WHERE oi.order_id = $1`,
      [id]
    );

    res.json({
      success: true,
      data: {
        id: order.id,
        totalAmount: parseFloat(order.total_amount),
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
          id: i.id,
          quantity: i.quantity,
          priceAtPurchase: parseFloat(i.price_at_purchase),
          product: { id: i.product_id, name: i.name, image: i.primary_image },
        })),
        createdAt: order.created_at,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { placeOrder, getOrders, getOrderById };
