'use client';

/**
 * Amazon Clone - Footer Component
 * 
 * Multi-column footer with "Back to top" functionality.
 */

import React from 'react';
import Link from 'next/link';
import styles from './Footer.module.css';

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className={styles.footer}>
      {/* Back to Top */}
      <div className={styles.back_to_top} onClick={scrollToTop}>
        Back to top
      </div>

      {/* Main Footer Links */}
      <div className={styles.footer_container}>
        <div className={styles.footer_column}>
          <h3>Get to Know Us</h3>
          <ul>
            <li>About Us</li>
            <li>Careers</li>
            <li>Press Releases</li>
            <li>Amazon Science</li>
          </ul>
        </div>
        <div className={styles.footer_column}>
          <h3>Connect with Us</h3>
          <ul>
            <li>Facebook</li>
            <li>Twitter</li>
            <li>Instagram</li>
          </ul>
        </div>
        <div className={styles.footer_column}>
          <h3>Make Money with Us</h3>
          <ul>
            <li>Sell on Amazon</li>
            <li>Supply to Amazon</li>
            <li>Become an Affiliate</li>
            <li>Amazon Pay on Merchants</li>
          </ul>
        </div>
        <div className={styles.footer_column}>
          <h3>Let Us Help You</h3>
          <ul>
            <li>Your Account</li>
            <li>Returns Centre</li>
            <li>100% Purchase Protection</li>
            <li>Help</li>
          </ul>
        </div>
      </div>

      {/* Logo and Credits */}
      <div className={styles.footer_bottom}>
         <img
            className={styles.footer_logo}
            src="https://pngimg.com/uploads/amazon/amazon_PNG11.png"
            alt="Amazon Logo"
          />
          <div className={styles.footer_links}>
             <span>Conditions of Use</span>
             <span>Privacy Notice</span>
             <span>Interest-Based Ads</span>
             <span>© 1996-2024, Amazon.com, Inc. or its affiliates</span>
          </div>
      </div>
    </footer>
  );
}
