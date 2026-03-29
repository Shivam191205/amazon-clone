'use client';

/**
 * Amazon Clone - Header Component
 * 
 * Top-level dark navy navigation bar.
 * Replicates the authentic Amazon header experience.
 * Now using modular sub-components for cleaner structure.
 */

import React from 'react';
import Link from 'next/link';
import { Menu, MapPin } from 'lucide-react';
import styles from './Header.module.css';

import SearchBar from './SearchBar';
import NavItems from './NavItems';
import CartIcon from './CartIcon';

export default function Header() {
  return (
    <header>
      {/* Top Nav Bar */}
      <div className={styles.header}>
        {/* Amazon Logo */}
        <Link href="/">
          <img
            className={styles.header_logo}
            src="https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg"
            alt="Amazon Logo"
          />
        </Link>

        {/* Deliver to */}
        <div className={styles.header_deliver}>
          <MapPin size={20} color="white" />
          <div className={styles.header_deliver_text}>
            <span className={styles.header_option_line_one}>Deliver to</span>
            <span className={styles.header_option_line_two}>India</span>
          </div>
        </div>

        {/* Search Bar */}
        <SearchBar />

        {/* Navigation Items */}
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <NavItems />
          <CartIcon />
        </div>
      </div>

      {/* Bottom Nav Bar */}
      <div className={styles.nav_bottom}>
        <div className={styles.nav_bottom_item}>
          <Menu size={20} style={{ verticalAlign: 'middle', marginRight: '5px' }} />
          All
        </div>
        <Link href="/search?category=all" className={styles.nav_bottom_item} style={{ textDecoration: 'none', color: 'white' }}>Best Sellers</Link>
        <Link href="/search?category=electronics" className={styles.nav_bottom_item} style={{ textDecoration: 'none', color: 'white' }}>Mobiles</Link>
        <Link href="/search?category=clothing" className={styles.nav_bottom_item} style={{ textDecoration: 'none', color: 'white' }}>Fashion</Link>
        <Link href="/search?category=electronics" className={styles.nav_bottom_item} style={{ textDecoration: 'none', color: 'white' }}>Electronics</Link>
        <Link href="/search?category=home-kitchen" className={styles.nav_bottom_item} style={{ textDecoration: 'none', color: 'white' }}>Home & Kitchen</Link>
        <Link href="/search?category=books" className={styles.nav_bottom_item} style={{ textDecoration: 'none', color: 'white' }}>Books</Link>
      </div>
    </header>
  );
}
