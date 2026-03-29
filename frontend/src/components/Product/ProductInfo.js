'use client';

/**
 * Amazon Clone - Product Info
 * 
 * Displays product title, rating, price, and description.
 */

import React from 'react';
import { Star, StarHalf, Heart } from 'lucide-react';
import styles from '../../app/products/[id]/product-detail.module.css';
import { api } from '../../lib/api';
import { useAuth } from '../../context/AuthContext';
import Link from 'next/link';

export default function ProductInfo({ product }) {
  const { user } = useAuth();
  
  if (!product) return null;

  const handleAddToWishlist = async () => {
    if (!user) {
      window.location.href = `/login?redirect=/products/${product.id}`;
      return;
    }
    try {
      const res = await api.addToWishlist(product.id);
      if (res.success) {
        alert('Product added to wishlist!');
      }
    } catch (err) {
      console.error('Wishlist error:', err);
    }
  };

  const renderRating = (rating) => {
    return (
      <div className={styles.detail_info_rating}>
        {Array(5)
          .fill()
          .map((_, i) => (
            <Star
              key={i}
              size={18}
              fill={i < Math.floor(rating) ? '#de7921' : 'none'}
              strokeWidth={1}
            />
          ))}
        <span style={{ fontSize: '14px', color: '#007185', marginLeft: '10px' }}>
          {product.review_count} ratings
        </span>
      </div>
    );
  };

  return (
    <div className={styles.detail_info}>
      <h1>{product.name}</h1>
      <Link href="/" style={{ fontSize: '14px', color: '#007185' }}>
        Visit the Store
      </Link>
      {renderRating(product.rating)}

      <div className={styles.detail_info_price}>
        <p style={{ display: 'flex', alignItems: 'baseline' }}>
          <span style={{ color: '#565959', fontSize: '14px', marginRight: '5px' }}>Price:</span>
          <span className="price-symbol" style={{ fontSize: '18px' }}>₹</span>
          <span className="price" style={{ fontSize: '28px' }}>{product.price}</span>
          {product.isPrime && (
            <img
              style={{ height: '15px', marginLeft: '10px' }}
              src="https://upload.wikimedia.org/wikipedia/commons/b/bb/Prime_logo.png"
              alt="Prime"
            />
          )}
        </p>
        <p style={{ fontSize: '14px', color: '#565959' }}>
          List Price: <span style={{ textDecoration: 'line-through' }}>₹{product.originalPrice}</span>
        </p>
      </div>

      <div className={styles.detail_info_description}>
        <h3>About this item</h3>
        <ul style={{ fontSize: '14px', lineHeight: '20px', paddingLeft: '20px' }}>
          {product.description.split('. ').map((point, i) => (
            <li key={i} style={{ marginBottom: '5px' }}>{point}</li>
          ))}
        </ul>
      </div>

      {product.specifications && (
        <div className={styles.detail_info_specs}>
          <h3>Product Specifications</h3>
          <table className={styles.specifications_table}>
            <tbody>
              {Object.entries(typeof product.specifications === 'string' ? JSON.parse(product.specifications) : product.specifications).map(([key, value]) => (
                <tr key={key}>
                  <td>{key}</td>
                  <td>{value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div style={{ marginTop: '30px', borderTop: '1px solid #eee', paddingTop: '15px' }}>
        <button 
          onClick={handleAddToWishlist}
          style={{ background: 'none', border: 'none', color: '#007185', fontSize: '14px', display: 'flex', alignItems: 'center', cursor: 'pointer' }}
        >
          <Heart size={16} style={{ marginRight: '8px' }} /> Add to List
        </button>
      </div>
    </div>
  );
}
