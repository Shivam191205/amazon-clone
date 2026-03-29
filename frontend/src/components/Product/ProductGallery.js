'use client';

/**
 * Amazon Clone - Product Gallery
 * 
 * Interactive image gallery with thumbnail switching.
 */

import React, { useState, useEffect } from 'react';
import styles from '../../app/products/[id]/product-detail.module.css';

export default function ProductGallery({ images }) {
  const [activeImage, setActiveImage] = useState('');

  // Sync active image when images prop changes (on data fetch)
  useEffect(() => {
    if (images && images.length > 0) {
      setActiveImage(images[0].image_url);
    }
  }, [images]);

  if (!images || images.length === 0) return null;

  return (
    <div className={styles.detail_gallery}>
      {/* Main Image */}
      <img
        className={styles.detail_main_image}
        src={activeImage}
        alt="Product View"
      />

      {/* Thumbnails */}
      <div className={styles.detail_thumbnails}>
        {images.map((img, index) => (
          <img
            key={index}
            className={`${styles.detail_thumbnail} ${
              activeImage === img.image_url ? styles.detail_thumbnail_active : ''
            }`}
            src={img.image_url}
            alt={`Thumbnail ${index}`}
            onMouseEnter={() => setActiveImage(img.image_url)}
            onClick={() => setActiveImage(img.image_url)}
          />
        ))}
      </div>
    </div>
  );
}
