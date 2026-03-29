'use client';

/**
 * Amazon Clone - SearchBar Component
 * 
 * Functional search bar with category selection and backend connectivity.
 */

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Search } from 'lucide-react';
import styles from './Header.module.css';
import { api } from '../../lib/api';

export default function SearchBar() {
  const router = useRouter();
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch categories for the dropdown
  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await api.getCategories();
        if (res.success) {
          setCategories(res.data);
        }
      } catch (err) {
        console.error('Failed to fetch categories:', err);
      }
    }
    fetchCategories();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${searchQuery}&category=${selectedCategory}`);
    }
  };

  return (
    <div className={styles.header_search}>
      <form onSubmit={handleSearch} style={{ display: 'flex', width: '100%', alignItems: 'center' }}>
        {/* Category Dropdown */}
        <select 
          className={styles.header_category_select}
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option value="all">All</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.slug}>
              {cat.name}
            </option>
          ))}
        </select>

        {/* Search Input */}
        <input
          className={styles.header_search_input}
          type="text"
          placeholder="Search Amazon.in"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        {/* Search Icon */}
        <button type="submit" className={styles.header_search_icon_container}>
          <Search size={24} color="#333" />
        </button>
      </form>
    </div>
  );
}
