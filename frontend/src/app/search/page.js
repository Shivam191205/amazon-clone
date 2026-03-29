'use client';

/**
 * Amazon Clone - Search Results Page
 * 
 * Handles search queries and category filtering.
 * Replicates the Amazon search results grid.
 */

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import styles from './search.module.css';
import ProductCard from '../../components/Product/ProductCard';
import { api } from '../../lib/api';

function SearchResultsContent() {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const query = searchParams.get('q') || '';
  const category = searchParams.get('category') || 'all';

  useEffect(() => {
    async function fetchResults() {
      setIsLoading(true);
      try {
        let urlParams = new URLSearchParams();
        if (query) urlParams.append('search', query);
        if (category !== 'all') urlParams.append('category', category);
        const res = await api.getProducts(`?${urlParams.toString()}`);

        if (res.success) {
          setProducts(res.data);
        }
      } catch (err) {
        console.error('Search failed:', err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchResults();
  }, [query, category]);

  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <div style={{ fontSize: '18px', fontWeight: '500', color: '#B12704' }}>Searching Amazon...</div>
      </div>
    );
  }

  return (
    <div className={styles.home} style={{ backgroundColor: 'white', minHeight: '80vh' }}>
      <div className={styles.home_container} style={{ width: '100%', padding: '20px' }}>
        <div style={{ marginBottom: '20px', borderBottom: '1px solid #ddd', paddingBottom: '10px' }}>
          <span style={{ fontSize: '14px', color: '#565959' }}>
            {products.length} results for 
            <span style={{ color: '#c45500', fontWeight: '700', marginLeft: '5px' }}>
              "{query || category}"
            </span>
          </span>
        </div>

        {products.length === 0 ? (
          <div style={{ padding: '40px', textAlign: 'center' }}>
            <h2>No results found for "{query || category}"</h2>
            <p>Try checking your spelling or use more general terms.</p>
          </div>
        ) : (
          <div className={styles.product_feed}>
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div>Loading Search...</div>}>
      <SearchResultsContent />
    </Suspense>
  );
}
