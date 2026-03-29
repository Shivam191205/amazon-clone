'use client';

/**
 * Amazon Clone - CartIcon Component
 * 
 * Interactive cart icon with live badge.
 */

import React from 'react';
import Link from 'next/link';
import { ShoppingCart } from 'lucide-react';
import styles from './Header.module.css';
import { useCart } from '../../context/CartContext';

export default function CartIcon() {
  const { totalItems } = useCart();

  return (
    <Link href="/cart">
      <div className={styles.header_option_basket}>
        <ShoppingCart size={32} color="white" />
        <span className={styles.header_basket_badge}>{totalItems}</span>
        <span className={styles.header_basket_count}>Cart</span>
      </div>
    </Link>
  );
}
