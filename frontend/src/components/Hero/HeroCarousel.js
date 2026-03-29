'use client';

/**
 * Amazon Clone - Hero Carousel
 * 
 * High-fidelity hero banner with Amazon's gradient mask and auto-sliding capability.
 */

import React, { useState, useEffect } from 'react';
import styles from '../../app/home.module.css';

const BANNERS = [
  'https://m.media-amazon.com/images/I/61zAjw4bqPL._SX3000_.jpg',
  'https://m.media-amazon.com/images/I/61lwJy4B8PL._SX3000_.jpg',
  'https://m.media-amazon.com/images/I/71Ie3JXGfVL._SX3000_.jpg',
  'https://m.media-amazon.com/images/I/61DUO0NqyyL._SX3000_.jpg',
];

export default function HeroCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % BANNERS.length);
    }, 5000); // Slide every 5 seconds
    
    return () => clearInterval(timer);
  }, []);

  return (
    <div className={styles.hero}>
      <div className={styles.hero_image_container}>
        <img
          className={styles.hero_image}
          src={BANNERS[currentIndex]}
          alt={`Promotion Banner ${currentIndex + 1}`}
        />
      </div>
    </div>
  );
}
