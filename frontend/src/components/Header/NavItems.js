'use client';

/**
 * Amazon Clone - NavItems Component
 * 
 * Handles the Account, Orders, and Returns links in the header.
 */

import React from 'react';
import Link from 'next/link';
import styles from './Header.module.css';
import { useAuth } from '../../context/AuthContext';

export default function NavItems() {
  const { user, logout } = useAuth();

  return (
    <div className={styles.header_option_nav}>
      {/* Account & Lists */}
      <div 
        className={styles.header_option} 
        style={{ cursor: 'pointer' }}
        onClick={() => !user && (window.location.href = '/login')}
      >
        <span className={styles.header_option_line_one}>
          Hello, {user ? user.name.split(' ')[0] : 'sign in'}
        </span>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <span className={styles.header_option_line_two}>Account & Lists</span>
          {user && (
            <button 
              onClick={(e) => { e.stopPropagation(); logout(); }}
              style={{ background: 'none', border: 'none', color: '#ff9900', fontSize: '11px', marginLeft: '5px', cursor: 'pointer' }}
            >
              Sign Out
            </button>
          )}
        </div>
      </div>

      {/* Returns & Orders */}
      <Link href="/orders" className={styles.header_option}>
        <span className={styles.header_option_line_one}>Returns</span>
        <span className={styles.header_option_line_two}>& Orders</span>
      </Link>

      {/* Wishlist */}
      <Link href="/wishlist" className={styles.header_option}>
        <span className={styles.header_option_line_one}>Your</span>
        <span className={styles.header_option_line_two}>Wishlist</span>
      </Link>
    </div>
  );
}
