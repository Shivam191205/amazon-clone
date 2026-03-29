'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { CheckCircle, Truck, Package, ChevronRight } from 'lucide-react';
import Link from 'next/link';

export default function OrderSuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const orderId = searchParams.get('id');
  const emailUrl = searchParams.get('emailPreviewUrl');

  const [date, setDate] = useState('');

  useEffect(() => {
    // Generate a交付 date (3 days from now)
    const d = new Date();
    d.setDate(d.getDate() + 3);
    setDate(d.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' }));
  }, []);

  return (
    <div style={{ maxWidth: '800px', margin: '40px auto', padding: '20px', backgroundColor: 'white', borderRadius: '8px', border: '1px solid #ddd' }}>
      <div style={{ display: 'flex', alignItems: 'center', color: '#007600', marginBottom: '20px' }}>
        <CheckCircle size={32} style={{ marginRight: '15px' }} />
        <h1 style={{ fontSize: '24px', fontWeight: '700' }}>Order placed, thank you!</h1>
      </div>

      <p style={{ fontSize: '14px', marginBottom: '20px' }}>
        Your order <strong>#ORD-{String(orderId).padStart(6, '0')}</strong> has been placed successfully. A confirmation will be sent to your email.
      </p>

      <div style={{ borderTop: '1px solid #eee', borderBottom: '1px solid #eee', padding: '20px 0', margin: '20px 0' }}>
        <div style={{ display: 'flex', gap: '20px' }}>
          <div style={{ flex: 1 }}>
            <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '10px' }}>Estimated Delivery:</h3>
            <p style={{ fontSize: '18px', color: '#007600', fontWeight: '500' }}>{date}</p>
          </div>
          <div style={{ flex: 1 }}>
            <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '10px' }}>Shipping to:</h3>
            <p style={{ fontSize: '14px', color: '#565959' }}>Saved Address</p>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '15px', marginTop: '30px' }}>
        <Link href="/orders" style={{ 
          padding: '10px 20px', 
          backgroundColor: '#f0c14b', 
          border: '1px solid #a88734', 
          borderRadius: '3px', 
          textDecoration: 'none', 
          color: '#111', 
          fontSize: '13px', 
          fontWeight: '500' 
        }}>
          View Your Orders
        </Link>
        <Link href="/" style={{ 
          padding: '10px 20px', 
          backgroundColor: '#fff', 
          border: '1px solid #adb1b8', 
          borderRadius: '3px', 
          textDecoration: 'none', 
          color: '#111', 
          fontSize: '13px', 
          fontWeight: '500' 
        }}>
          Continue Shopping
        </Link>
        {emailUrl && (
          <a href={decodeURIComponent(emailUrl)} target="_blank" rel="noopener noreferrer" style={{
            padding: '10px 20px', 
            backgroundColor: '#007185', 
            border: '1px solid #005A6F', 
            borderRadius: '3px', 
            textDecoration: 'none', 
            color: 'white', 
            fontSize: '13px', 
            fontWeight: '600'
          }}>
            View Order Confirmation Email
          </a>
        )}
      </div>

      <div style={{ marginTop: '40px', padding: '20px', backgroundColor: '#fcfcfc', border: '1px solid #eee', borderRadius: '4px' }}>
        <h4 style={{ fontSize: '14px', fontWeight: '700', marginBottom: '10px' }}>What happens next?</h4>
        <ul style={{ fontSize: '13px', color: '#565959', paddingLeft: '20px', lineHeight: '1.6' }}>
          <li>You will receive an email confirmation shortly.</li>
          <li>We'll send you another email when your items have shipped.</li>
          <li>You can track your order status in your "Returns & Orders" section.</li>
        </ul>
      </div>
    </div>
  );
}
