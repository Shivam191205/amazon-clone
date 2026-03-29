'use client';

/**
 * Amazon Clone - Category Card
 * 
 * Individual high-fidelity card with title, image, and link.
 */

import React from 'react';
import Link from 'next/link';
import styles from '../../app/home.module.css';

export default function CategoryCard({ category }) {
  if (!category) return null;

  return (
    <div className={styles.category_card}>
      <h2>{category.name}</h2>
      <img
        className={styles.category_card_image}
        src={category.image_url}
        alt={category.name}
      />
      <Link href={`/search?category=${category.slug}`} className={styles.category_card_link}>
        Shop now
      </Link>
    </div>
  );
}
