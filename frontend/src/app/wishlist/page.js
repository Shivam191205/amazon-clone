'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Heart, ShoppingCart, Trash2 } from 'lucide-react';
import styles from '../cart/cart.module.css';
import { api } from '../../lib/api';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';

export default function WishlistPage() {
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user, loading: authLoading } = useAuth();
  const { addToCart } = useCart();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login?redirect=/wishlist');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    async function fetchWishlist() {
      if (!user) return;
      try {
        const res = await api.getWishlist();
        if (res.success) {
          setItems(res.data);
        }
      } catch (err) {
        console.error('Failed to fetch wishlist:', err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchWishlist();
  }, [user]);

  const removeWishlistItem = async (id) => {
    try {
      await api.removeFromWishlist(id);
      setItems(items.filter(item => item.id !== id));
    } catch (err) {
      console.error('Failed to remove item:', err);
    }
  };

  if (authLoading || (user && isLoading)) {
    return <div style={{ textAlign: 'center', padding: '100px' }}>Loading Your Wishlist...</div>;
  }

  if (!user) return null;

  return (
    <div style={{ maxWidth: '1100px', margin: '30px auto', padding: '0 20px' }}>
      <h1 style={{ fontSize: '28px', fontWeight: '400', marginBottom: '20px', borderBottom: '1px solid #ddd', paddingBottom: '15px' }}>
        Your Wish List
      </h1>

      {items.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '50px', backgroundColor: 'white', border: '1px solid #ddd' }}>
          <Heart size={48} color="#ddd" style={{ marginBottom: '15px' }} />
          <p>Your wishlist is empty.</p>
          <Link href="/" style={{ color: '#007185', marginTop: '10px', display: 'inline-block' }}>Explore products</Link>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px' }}>
          {items.map((item) => (
            <div key={item.id} style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '15px', backgroundColor: 'white', display: 'flex', flexDirection: 'column' }}>
              <Link href={`/products/${item.product.id}`}>
                <img src={item.product.image} alt={item.product.name} style={{ width: '100%', height: '200px', objectFit: 'contain', marginBottom: '10px' }} />
              </Link>
              <Link href={`/products/${item.product.id}`} style={{ fontSize: '14px', fontWeight: '500', color: '#007185', textDecoration: 'none', height: '40px', overflow: 'hidden', display: 'block', marginBottom: '10px' }}>
                {item.product.name}
              </Link>
              <p style={{ fontSize: '18px', fontWeight: '700', marginBottom: '15px' }}>₹{item.product.price}</p>
              
              <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <button 
                  onClick={() => addToCart(item.product, 1)}
                  style={{ background: '#FFD814', border: '1px solid #FCD200', borderRadius: '20px', padding: '8px', fontSize: '13px', cursor: 'pointer' }}
                >
                  Add to Cart
                </button>
                <button 
                  onClick={() => removeWishlistItem(item.id)}
                  style={{ background: 'white', border: '1px solid #D5D9D9', borderRadius: '20px', padding: '8px', fontSize: '13px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px' }}
                >
                  <Trash2 size={14} /> Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
