'use client';

/**
 * Amazon Clone - Buy Box
 * 
 * Sticky box with price, stock status, and add-to-cart buttons.
 */

import React, { useState } from 'react';
import { MapPin, Lock } from 'lucide-react';
import styles from '../../app/products/[id]/product-detail.module.css';
import { useCart } from '../../context/CartContext';

export default function BuyBox({ product }) {
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();

  if (!product) return null;

  return (
    <div className={styles.buy_box}>
      <div className={styles.buy_box_price} style={{ color: '#B12704', fontSize: '24px', marginBottom: '5px' }}>
        <span style={{ fontSize: '14px', verticalAlign: 'super' }}>₹</span>
        <span>{product.price}</span>
      </div>

      <div style={{ fontSize: '14px', marginBottom: '15px' }}>
        {product.isPrime && (
          <p style={{ color: '#007185', fontWeight: '500' }}>FREE Returns</p>
        )}
        <p style={{ color: product.stock > 0 ? '#007600' : '#B12704', fontSize: '18px', margin: '10px 0' }}>
          {product.stock > 0 ? 'In Stock' : 'Temporarily Out of Stock'}
        </p>
      </div>

      {product.stock > 0 && (
        <div style={{ marginBottom: '20px' }}>
          <label htmlFor="quantity" style={{ fontSize: '14px', display: 'block', marginBottom: '5px' }}>Quantity:</label>
          <select 
            id="quantity" 
            value={quantity} 
            onChange={(e) => setQuantity(Number(e.target.value))}
            style={{ padding: '5px', borderRadius: '8px', border: '1px solid #D5D9D9', background: '#F0F2F2', width: '100%' }}
          >
            {[...Array(Math.min(10, product.stock))].map((_, i) => (
              <option key={i + 1} value={i + 1}>
                {i + 1}
              </option>
            ))}
          </select>
        </div>
      )}

      <div className={styles.buy_box_buttons}>
        <button 
          onClick={() => addToCart(product, quantity)} 
          className={`${styles.buy_box_button} ${styles.add_to_cart_btn}`}
          disabled={product.stock <= 0}
        >
          Add to Cart
        </button>
        <button 
          onClick={() => {
            addToCart(product, quantity);
            window.location.href = '/checkout';
          }}
          className={`${styles.buy_box_button} ${styles.buy_now_btn}`}
          disabled={product.stock <= 0}
        >
          Buy Now
        </button>
      </div>

      <div style={{ marginTop: '20px', fontSize: '12px', color: '#565959' }}>
        <p style={{ display: 'flex', alignItems: 'center', marginBottom: '5px' }}>
          <Lock size={12} style={{ marginRight: '5px' }} /> Secure transaction
        </p>
        <p style={{ display: 'flex', alignItems: 'center' }}>
          <MapPin size={12} style={{ marginRight: '5px' }} /> Deliver to India
        </p>
      </div>
    </div>
  );
}
