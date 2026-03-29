'use client';

/**
 * Amazon Clone - Shopping Cart Page
 * 
 * Replicates the full "Your Shopping Cart" experience.
 * Features:
 * - List of items with active quantity controls
 * - Sticky subtotal box on the right
 * - Empty cart state with link to homepage
 */

import React from 'react';
import Link from 'next/link';
import { ShoppingCart } from 'lucide-react';
import styles from './cart.module.css';
import CartItem from '../../components/Cart/CartItem';
import { useCart } from '../../context/CartContext';

export default function CartPage() {
  const { cartItems, totalItems, totalAmount, isInitialized } = useCart();

  if (!isInitialized) return null;

  if (cartItems.length === 0) {
    return (
      <div className={styles.cart} style={{ alignItems: 'center', backgroundColor: 'white' }}>
        <div style={{ textAlign: 'center', padding: '100px' }}>
          <ShoppingCart size={80} color="#ddd" style={{ marginBottom: '20px' }} />
          <h1 style={{ fontSize: '24px', fontWeight: '500' }}>Your Amazon Cart is empty.</h1>
          <p style={{ marginTop: '10px' }}>
            Check your Saved for later items or <Link href="/" style={{ color: '#007185' }}>continue shopping</Link>.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.cart}>
      {/* 1. Left: List of Cart Items */}
      <div className={styles.cart_left}>
        <div className={styles.cart_header}>
          <h1 className={styles.cart_title}>Shopping Cart</h1>
          <span className={styles.cart_price_header}>Price</span>
        </div>
        
        <div className={styles.cart_items_list}>
          {cartItems.map((item) => (
            <CartItem key={item.id} item={item} />
          ))}
        </div>

        <div className={styles.cart_subtotal_line}>
          Subtotal ({totalItems} item{totalItems > 1 ? 's' : ''}): 
          <span className={styles.bold_price}>
            <span style={{ fontSize: '13px', verticalAlign: 'super' }}>₹</span>
            {totalAmount}
          </span>
        </div>
      </div>

      {/* 2. Right: Detailed Bill Summary */}
      <div className={styles.cart_right}>
        <div className={styles.bill_card}>
          <div className={styles.free_shipping_banner}>
            <div className={styles.check_circle}>✓</div>
            <p>Your order qualifies for FREE Shipping. Choose this option at checkout.</p>
          </div>

          <div className={styles.bill_details}>
            <h3 className={styles.bill_title}>Order Summary</h3>
            <div className={styles.bill_row}>
              <span>Items ({totalItems}):</span>
              <span>₹{totalAmount}</span>
            </div>
            <div className={styles.bill_row}>
              <span>Shipping & handling:</span>
              <span style={{ color: '#007600' }}>₹0.00</span>
            </div>
            <div className={styles.bill_row}>
              <span>Estimated tax:</span>
              <span>₹0.00</span>
            </div>
            <div className={`${styles.bill_row} ${styles.bill_total}`}>
              <span>Order Total:</span>
              <span>₹{totalAmount}</span>
            </div>
          </div>

          <button 
            onClick={() => window.location.href = '/checkout'}
            className={styles.checkout_btn}
          >
            Proceed to Buy
          </button>
        </div>
      </div>
    </div>
  );
}
