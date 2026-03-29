'use client';

/**
 * Amazon Clone - Product Detail Page
 * 
 * Dynamic route to display full product details.
 * Replicates Amazon's 3-column layout (Gallery, Info, Buy Box).
 */

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import styles from './product-detail.module.css';
import ProductGallery from '../../../components/Product/ProductGallery';
import ProductInfo from '../../../components/Product/ProductInfo';
import BuyBox from '../../../components/Product/BuyBox';
import ProductReviews from '../../../components/Product/ProductReviews';
import { api } from '../../../lib/api';

export default function ProductDetailPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchProduct() {
      try {
        const res = await api.getProduct(id);
        if (res.success) {
          setProduct(res.data);
        }
      } catch (err) {
        console.error('Failed to fetch product:', err);
      } finally {
        setIsLoading(false);
      }
    }
    if (id) fetchProduct();
  }, [id]);

  const refreshProduct = async () => {
    try {
      const res = await api.getProduct(id);
      if (res.success) setProduct(res.data);
    } catch (err) {
      console.error('Failed to refresh product:', err);
    }
  };

  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <div style={{ fontSize: '18px', fontWeight: '500', color: '#B12704' }}>Loading Product Details...</div>
      </div>
    );
  }

  if (!product) {
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <h2>Product not found</h2>
        <a href="/" style={{ color: '#007185' }}>Return to home</a>
      </div>
    );
  }

  return (
    <div className={styles.product_detail}>
      {/* 3-Column Layout */}
      
      {/* 1. Left: Image Gallery */}
      <ProductGallery images={product.images} />

      {/* 2. Middle: Product Information */}
      <ProductInfo product={product} />

      {/* 3. Right: Sticky Buy Box */}
      <BuyBox product={product} />

      {/* 4. Bottom: Reviews Section */}
      <div style={{ gridColumn: '1 / -1', width: '100%', maxWidth: '1200px', padding: '0 20px' }}>
        <ProductReviews product={product} onReviewSubmitted={refreshProduct} />
      </div>
    </div>
  );
}
