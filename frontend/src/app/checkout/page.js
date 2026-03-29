'use client';

/**
 * Amazon Clone - Checkout Page
 * 
 * Simplified high-fidelity shipping form and purchase summary.
 * Features:
 * - Shipping address form
 * - Secure purchase flow
 * - Order submission to the backend API
 */

import React, { useState, useEffect } from 'react';
import { Lock, ChevronRight, MapPin, Truck, CreditCard } from 'lucide-react';
import { useRouter } from 'next/navigation';
import styles from './checkout.module.css';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../lib/api';

export default function CheckoutPage() {
  const { cartItems, totalItems, totalAmount, clearCart } = useCart();
  const { user, loading } = useAuth();
  const router = useRouter();

  const [formData, setFormData] = useState({
    shippingName: '',
    shippingAddress: '',
    shippingCity: '',
    shippingState: '',
    shippingZip: '',
    shippingPhone: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login?redirect=/checkout');
    }
    if (user) {
      setFormData(prev => ({ ...prev, shippingName: user.name }));
    }
  }, [user, loading, router]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await api.placeOrder(formData);
      if (res.success) {
        await clearCart();
        router.push(`/checkout/success?id=${res.data.id}&emailPreviewUrl=${res.data.emailPreviewUrl ? encodeURIComponent(res.data.emailPreviewUrl) : ''}`);
      }
    } catch (err) {
      console.error('Checkout failed:', err);
      alert('Order placement failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <div className={styles.loading}>Loading checkout...</div>;
  if (!user) return null;

  if (cartItems.length === 0) {
    return (
      <div className={styles.empty_checkout}>
        <h2>Your cart is empty.</h2>
        <button onClick={() => router.push('/')} className={styles.continue_shopping}>
          Continue shopping
        </button>
      </div>
    );
  }

  return (
    <div className={styles.checkout_container}>
      <header className={styles.checkout_header}>
        <img 
          src="https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg" 
          alt="Amazon" 
          className={styles.logo}
          onClick={() => router.push('/')}
        />
        <h1>Checkout ({totalItems} items)</h1>
        <Lock size={20} color="#999" />
      </header>

      <div className={styles.checkout_content}>
        <div className={styles.checkout_left}>
          {/* Section 1: Shipping Address */}
          <section className={styles.checkout_section}>
            <div className={styles.section_title}>
              <span>1</span>
              <h3>Choose a shipping address</h3>
            </div>
            <div className={styles.section_content}>
              <form onSubmit={handlePlaceOrder} id="checkout-form" className={styles.address_form}>
                <div className={styles.input_group}>
                  <label>Full Name</label>
                  <input type="text" name="shippingName" value={formData.shippingName} onChange={handleInputChange} required />
                </div>
                <div className={styles.input_group}>
                  <label>Address</label>
                  <input type="text" name="shippingAddress" value={formData.shippingAddress} onChange={handleInputChange} required placeholder="Street address, P.O. box" />
                </div>
                <div className={styles.input_row}>
                  <div className={styles.input_group}>
                    <label>City</label>
                    <input type="text" name="shippingCity" value={formData.shippingCity} onChange={handleInputChange} required />
                  </div>
                  <div className={styles.input_group}>
                    <label>State</label>
                    <input type="text" name="shippingState" value={formData.shippingState} onChange={handleInputChange} required />
                  </div>
                  <div className={styles.input_group}>
                    <label>Zip Code</label>
                    <input type="text" name="shippingZip" value={formData.shippingZip} onChange={handleInputChange} required />
                  </div>
                </div>
                <div className={styles.input_group}>
                  <label>Phone Number</label>
                  <input type="text" name="shippingPhone" value={formData.shippingPhone} onChange={handleInputChange} required />
                </div>
              </form>
            </div>
          </section>

          {/* Section 2: Payment Method */}
          <section className={styles.checkout_section}>
            <div className={styles.section_title}>
              <span>2</span>
              <h3>Payment method</h3>
            </div>
            <div className={styles.section_content}>
              <div className={styles.payment_option}>
                <input type="radio" checked readOnly />
                <label>Pay on Delivery (Cash/Card)</label>
              </div>
            </div>
          </section>

          {/* Section 3: Review items and shipping */}
          <section className={styles.checkout_section}>
            <div className={styles.section_title}>
              <span>3</span>
              <h3>Review items and shipping</h3>
            </div>
            <div className={styles.section_content}>
              <div className={styles.items_review}>
                {cartItems.map((item) => (
                  <div key={item.id} className={styles.review_item}>
                    <img src={item.image} alt={item.name} />
                    <div className={styles.item_details}>
                      <h4>{item.name}</h4>
                      <p className={styles.item_price}>₹{item.price}</p>
                      <p className={styles.item_qty}>Quantity: {item.quantity}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>

        <div className={styles.checkout_right}>
          <div className={styles.order_summary_card}>
            <button 
              type="submit" 
              form="checkout-form"
              className={styles.place_order_btn}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Placing Order...' : 'Place Your Order'}
            </button>
            <p className={styles.legal_text}>
              By placing your order, you agree to Amazon's privacy notice and conditions of use.
            </p>

            <div className={styles.summary_details}>
              <h3>Order Summary</h3>
              <div className={styles.summary_row}>
                <span>Items:</span>
                <span>₹{totalAmount}</span>
              </div>
              <div className={styles.summary_row}>
                <span>Shipping & handling:</span>
                <span>₹0.00</span>
              </div>
              <div className={`${styles.summary_row} ${styles.summary_total}`}>
                <span>Order Total:</span>
                <span>₹{totalAmount}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
