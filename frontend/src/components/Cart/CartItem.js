'use client';

/**
 * Amazon Clone - Cart Item
 * 
 * Individual item row for the shopping cart page.
 */

import React from 'react';
import Link from 'next/link';
import styles from '../../app/cart/cart.module.css';
import { useCart } from '../../context/CartContext';

export default function CartItem({ item }) {
  const { updateQuantity, removeFromCart } = useCart();

  if (!item) return null;

  return (
    <div className={styles.cart_item}>
      {/* Product Image */}
      <Link href={`/products/${item.id}`}>
        <img
          className={styles.cart_item_image}
          src={item.image}
          alt={item.name}
        />
      </Link>

      {/* Item Information */}
      <div className={styles.cart_item_info}>
        <Link href={`/products/${item.id}`}>
          <h2 className={styles.cart_item_name}>{item.name}</h2>
        </Link>
        <p className={styles.cart_item_stock}>In Stock</p>
        
        {item.isPrime && (
          <img
            style={{ height: '15px', objectFit: 'contain' }}
            src="https://upload.wikimedia.org/wikipedia/commons/b/bb/Prime_logo.png"
            alt="Prime"
          />
        )}

        {/* Actions Row */}
        <div className={styles.cart_item_actions}>
          <select 
            value={item.quantity}
            onChange={(e) => updateQuantity(item.id, Number(e.target.value))}
          >
            {[...Array(10)].map((_, i) => (
              <option key={i + 1} value={i + 1}>
                Qty: {i + 1}
              </option>
            ))}
          </select>
          <span className={styles.cart_item_delete} onClick={() => removeFromCart(item.id)}>
            Delete
          </span>
        </div>
      </div>

      <div className={styles.cart_item_price}>
        <span className="price-symbol" style={{ fontSize: '13px' }}>₹</span>
        <span className="price" style={{ fontSize: '18px' }}>{item.price}</span>
      </div>
    </div>
  );
}
