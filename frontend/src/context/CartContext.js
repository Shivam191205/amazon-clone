'use client';

/**
 * Amazon Clone - Cart Context
 * 
 * Manages the shopping cart state globally.
 * Features:
 * - Persists cart in localStorage
 * - Aggregates total items and amounts
 * - Add/Remove/Update quantity logic
 * - Cart clearing
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { api } from '../lib/api';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  const [isInitialized, setIsInitialized] = useState(false);
  const { user } = useAuth();

  // Load from backend if logged in, otherwise from localStorage
  useEffect(() => {
    async function loadCart() {
      if (user) {
        try {
          const res = await api.getCart();
          if (res.success) {
            // Backend returns { items, totalItems, totalAmount }
            // items is [{ id, quantity, product: { ... } }]
            // We need to map it to our flat cartItems structure for simplicity
            const mappedItems = res.data.items.map(item => ({
              ...item.product,
              id: item.product.id, // Ensure ID is top-level
              cartItemId: item.id, // Save backend ID for updates
              quantity: item.quantity
            }));
            setCartItems(mappedItems);
          }
        } catch (err) {
          console.error('Failed to sync backend cart:', err);
        }
      } else {
        const savedCart = localStorage.getItem('amazon_clone_cart');
        if (savedCart) {
          try {
            setCartItems(JSON.parse(savedCart));
          } catch (err) {
            console.error('Failed to parse saved cart:', err);
          }
        }
      }
      setIsInitialized(true);
    }
    loadCart();
  }, [user]);

  // Save to localStorage on change
  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem('amazon_clone_cart', JSON.stringify(cartItems));
    }
  }, [cartItems, isInitialized]);

  /**
   * Add a product to the cart
   */
  const addToCart = async (product, quantity = 1) => {
    if (user) {
      try {
        await api.addToCart({ productId: product.id, quantity });
        // Refresh cart from backend to ensure consistency
        const res = await api.getCart();
        if (res.success) {
          const mappedItems = res.data.items.map(item => ({
            ...item.product,
            id: item.product.id,
            cartItemId: item.id,
            quantity: item.quantity
          }));
          setCartItems(mappedItems);
        }
      } catch (err) {
        console.error('Failed to add to backend cart:', err);
      }
    } else {
      setCartItems((prev) => {
        const existing = prev.find((item) => item.id === product.id);
        if (existing) {
          return prev.map((item) =>
            item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
          );
        }
        return [...prev, { ...product, quantity }];
      });
    }
  };

  /**
   * Update quantity of a cart item
   */
  const updateQuantity = async (productId, quantity) => {
    if (quantity < 1) {
      removeFromCart(productId);
      return;
    }

    if (user) {
      try {
        const item = cartItems.find(i => i.id === productId);
        if (item && item.cartItemId) {
          await api.updateCart(item.cartItemId, { quantity });
          setCartItems(prev => prev.map(i => i.id === productId ? { ...i, quantity } : i));
        }
      } catch (err) {
        console.error('Failed to update backend cart:', err);
      }
    } else {
      setCartItems((prev) =>
        prev.map((item) => (item.id === productId ? { ...item, quantity } : item))
      );
    }
  };

  /**
   * Remove item from cart
   */
  const removeFromCart = async (productId) => {
    if (user) {
      try {
        const item = cartItems.find(i => i.id === productId);
        if (item && item.cartItemId) {
          await api.removeFromCart(item.cartItemId);
          setCartItems(prev => prev.filter(i => i.id !== productId));
        }
      } catch (err) {
        console.error('Failed to remove from backend cart:', err);
      }
    } else {
      setCartItems((prev) => prev.filter((item) => item.id !== productId));
    }
  };

  /**
   * Clear entire cart
   */
  const clearCart = async () => {
    if (user) {
      try {
        await api.clearCart();
        setCartItems([]);
      } catch (err) {
        console.error('Failed to clear backend cart:', err);
      }
    } else {
      setCartItems([]);
    }
  };

  /**
   * Totals calculation
   */
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const totalAmount = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const value = {
    cartItems,
    totalItems,
    totalAmount: Math.round(totalAmount * 100) / 100,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    isInitialized,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
