'use client';

/**
 * Amazon Clone - Product Card
 * 
 * Individual high-fidelity card with rating, price, image, and badging.
 */

import React from 'react';
import Link from 'next/link';
import { Star } from 'lucide-react';
import styles from '../../app/home.module.css';
import { useCart } from '../../context/CartContext';

export default function ProductCard({ product }) {
  const { addToCart } = useCart();

  if (!product) return null;

  const renderRating = (rating) => {
    return (
      <div className={styles.product_card_rating}>
        {Array(5)
          .fill()
          .map((_, i) => (
            <Star
              key={i}
              size={14}
              fill={i < Math.floor(rating) ? '#de7921' : 'none'}
              strokeWidth={1}
            />
          ))}
        <span style={{ fontSize: '12px', color: '#007185', marginLeft: '5px' }}>
          {product.review_count}
        </span>
      </div>
    );
  };

  return (
    <div className={styles.product_card}>
      <div className={styles.product_card_info}>
        <Link href={`/products/${product.id}`}>
          <p className="line-clamp-2" style={{ fontSize: '16px', fontWeight: '500' }}>
            {product.name}
          </p>
        </Link>
        {renderRating(product.rating)}
        <p className={styles.product_card_price}>
          <span className="price-symbol">₹</span>
          <span className="price">{product.price}</span>
          {product.originalPrice && (
            <span style={{ textDecoration: 'line-through', color: '#565959', fontSize: '13px', marginLeft: '5px' }}>
              ₹{product.originalPrice}
            </span>
          )}
        </p>
      </div>

      <Link href={`/products/${product.id}`}>
        <img
          className={styles.product_card_image}
          src={product.image}
          alt={product.name}
        />
      </Link>

      {product.isPrime && (
        <div style={{ marginTop: '5px' }}>
          <img
            style={{ height: '15px', objectFit: 'contain' }}
            src="https://upload.wikimedia.org/wikipedia/commons/b/bb/Prime_logo.png"
            alt="Prime"
          />
        </div>
      )}

      <button onClick={() => addToCart(product)} className="amz-button">
        Add to Cart
      </button>
    </div>
  );
}
