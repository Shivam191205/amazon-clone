'use client';

/**
 * Amazon Clone - Home Page
 * 
 * Assembles the high-fidelity Hero Carousel, Category Grid, and Product Feed.
 * Connects to the backend API for real-time category and product discovery.
 */

import React, { useState, useEffect } from 'react';
import styles from './home.module.css';
import HeroCarousel from '../components/Hero/HeroCarousel';
import CategoryCard from '../components/Category/CategoryCard';
import ProductCard from '../components/Product/ProductCard';
import { api } from '../lib/api';

export default function HomePage() {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [catRes, prodRes] = await Promise.all([
          api.getCategories(),
          api.getProducts('?limit=8'), // Get first 8 for home feed
        ]);

        if (catRes.success) setCategories(catRes.data);
        if (prodRes.success) setProducts(prodRes.data);
      } catch (err) {
        console.error('Failed to fetch home data:', err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, []);

  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <div style={{ fontSize: '18px', fontWeight: '500', color: '#B12704' }}>Loading Amazon.in...</div>
      </div>
    );
  }

  return (
    <div className={styles.home}>
      <div className={styles.home_container}>
        {/* Banner */}
        <HeroCarousel />

        {/* Category Grid (4 x 4 layout style) */}
        <div className={styles.category_grid}>
          {categories.slice(0, 4).map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>

        {/* Product Feed */}
        <div className={styles.product_feed}>
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* Secondary Category Grid */}
        <div className={styles.category_grid}>
          {categories.slice(4, 8).map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>
      </div>
    </div>
  );
}
