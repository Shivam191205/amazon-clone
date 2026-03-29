'use client';

/**
 * Amazon Clone - Orders Page
 * 
 * Replicates the "Your Orders" historical view.
 * Features:
 * - List of past orders with items and status
 * - Order tracking info
 * - Confirmation message for new orders
 */

import React, { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle, ChevronRight, Package, Truck, Home } from 'lucide-react';
import { api } from '../../lib/api';
import { useAuth } from '../../context/AuthContext';

export default function OrdersPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [trackingOrderId, setTrackingOrderId] = useState(null);
  const success = searchParams.get('success');

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login?redirect=/orders');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    async function fetchOrders() {
      if (!user) return;
      try {
        const res = await api.getOrders();
        if (res.success) {
          setOrders(res.data);
        }
      } catch (err) {
        console.error('Failed to fetch orders:', err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchOrders();
  }, [user]);

  if (authLoading || (user && isLoading)) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <p style={{ fontSize: '18px', fontWeight: '500', color: '#B12704' }}>Loading Your Orders...</p>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div style={{ maxWidth: '1100px', margin: '20px auto', padding: '0 20px' }}>
      {success && (
        <div style={{ padding: '15px', backgroundColor: '#e7f3ef', border: '1px solid #007600', borderRadius: '4px', marginBottom: '20px', display: 'flex', alignItems: 'center' }}>
          <CheckCircle color="#007600" style={{ marginRight: '10px' }} />
          <div>
            <p style={{ fontWeight: '700', color: '#007600' }}>Order placed, thank you!</p>
            <p style={{ fontSize: '14px' }}>Confirmation will be sent to your email.</p>
          </div>
        </div>
      )}

      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '15px', fontSize: '14px', color: '#565959' }}>
        <span style={{ color: '#007185', cursor: 'pointer' }}>Your Account</span>
        <ChevronRight size={14} style={{ margin: '0 5px' }} />
        <span style={{ color: '#c45500' }}>Your Orders</span>
      </div>

      <h1 style={{ fontSize: '28px', fontWeight: '400', marginBottom: '20px' }}>Your Orders</h1>

      <div style={{ borderBottom: '1px solid #ddd', marginBottom: '20px', display: 'flex', gap: '20px', fontSize: '14px', paddingBottom: '10px' }}>
        <span style={{ fontWeight: '700', borderBottom: '2px solid #e47911', paddingBottom: '8px' }}>Orders</span>
        <span>Buy Again</span>
        <span>Not Yet Shipped</span>
        <span>Cancelled Orders</span>
      </div>

      <div style={{ marginTop: '20px' }}>
        {orders.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '50px', backgroundColor: 'white', border: '1px solid #ddd' }}>
            <p>You haven't placed any orders yet.</p>
          </div>
        ) : (
          orders.map((order) => (
            <div key={order.id} style={{ border: '1px solid #ddd', borderRadius: '8px', marginBottom: '25px', overflow: 'hidden', backgroundColor: 'white' }}>
              {/* Order Header */}
              <div style={{ backgroundColor: '#f0f2f2', padding: '15px 20px', display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #ddd', fontSize: '12px', color: '#565959' }}>
                <div style={{ display: 'flex', gap: '40px' }}>
                  <div>
                    <span style={{ display: 'block' }}>ORDER PLACED</span>
                    <span style={{ color: '#0f1111' }}>{new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                  </div>
                  <div>
                    <span style={{ display: 'block' }}>TOTAL</span>
                    <span style={{ color: '#0f1111' }}>₹{order.totalAmount}</span>
                  </div>
                  <div>
                    <span style={{ display: 'block' }}>SHIP TO</span>
                    <span style={{ color: '#007185', cursor: 'pointer' }}>{user.name}</span>
                  </div>
                </div>
                <div>
                  <span style={{ display: 'block' }}>ORDER # ORD-{String(order.id).padStart(6, '0')}</span>
                  <div style={{ display: 'flex', gap: '10px', marginTop: '5px' }}>
                    <span style={{ color: '#007185', cursor: 'pointer' }}>Order Details</span>
                    <span style={{ borderLeft: '1px solid #ddd', paddingLeft: '10px', color: '#007185', cursor: 'pointer' }}>Invoice</span>
                  </div>
                </div>
              </div>

              {/* Order Body */}
              <div style={{ padding: '20px', display: 'flex', justifyContent: 'space-between' }}>
                <div style={{ flex: 1 }}>
                  <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '15px', color: '#0F1111' }}>
                    {order.status === 'confirmed' ? 'Arriving Sunday' : order.status}
                  </h3>
                  {order.items.map((item) => (
                    <div key={item.id} style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
                      <img src={item.product.image} alt={item.product.name} style={{ width: '90px', height: '90px', objectFit: 'contain' }} />
                      <div>
                        <Link href={`/products/${item.product.id}`} style={{ color: '#007185', fontSize: '14px', fontWeight: '500', textDecoration: 'none' }}>
                          {item.product.name}
                        </Link>
                        <p style={{ fontSize: '12px', color: '#565959', marginTop: '5px' }}>Status: {order.status}</p>
                        <div style={{ marginTop: '10px', display: 'flex', gap: '10px' }}>
                          <button style={{ backgroundColor: '#FFD814', border: '1px solid #FCD200', borderRadius: '8px', padding: '5px 15px', fontSize: '12px', cursor: 'pointer' }}>
                            Buy it again
                          </button>
                          <button 
                            onClick={() => setTrackingOrderId(trackingOrderId === order.id ? null : order.id)}
                            style={{ backgroundColor: 'white', border: '1px solid #D5D9D9', borderRadius: '8px', padding: '5px 15px', fontSize: '12px', cursor: 'pointer' }}
                          >
                            {trackingOrderId === order.id ? 'Hide tracking' : 'Track package'}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div style={{ width: '200px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <button style={{ width: '100%', padding: '7px', borderRadius: '8px', border: '1px solid #D5D9D9', fontSize: '13px', background: 'white' }}>Return items</button>
                  <button style={{ width: '100%', padding: '7px', borderRadius: '8px', border: '1px solid #D5D9D9', fontSize: '13px', background: 'white' }}>Share gift receipt</button>
                  <button style={{ width: '100%', padding: '7px', borderRadius: '8px', border: '1px solid #D5D9D9', fontSize: '13px', background: 'white' }}>Write a product review</button>
                </div>
              </div>

              {/* Enhanced Order Tracking Timeline */}
              {trackingOrderId === order.id && (
                <div style={{ borderTop: '1px solid #ddd', padding: '30px 20px', backgroundColor: '#f9f9f9' }}>
                  <h4 style={{ marginBottom: '30px', fontSize: '18px', color: '#0F1111' }}>Delivery Status</h4>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative', width: '90%', margin: '0 auto' }}>
                    
                    {/* Progress Bar Background */}
                    <div style={{ position: 'absolute', top: '20px', left: '0', right: '0', height: '4px', backgroundColor: '#ddd', zIndex: 0 }}></div>
                    {/* Active Progress Bar (Filled slightly for Confirmed) */}
                    <div style={{ position: 'absolute', top: '20px', left: '0', width: '15%', height: '4px', backgroundColor: '#007600', zIndex: 1 }}></div>

                    {/* Step 1: Confirmed */}
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 2, backgroundColor: '#f9f9f9', padding: '0 10px' }}>
                      <div style={{ width: '44px', height: '44px', borderRadius: '50%', backgroundColor: '#007600', display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'white' }}>
                        <CheckCircle size={22} />
                      </div>
                      <p style={{ marginTop: '12px', fontSize: '13px', fontWeight: 'bold', color: '#0F1111' }}>Confirmed</p>
                    </div>

                    {/* Step 2: Packed */}
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 2, backgroundColor: '#f9f9f9', padding: '0 10px' }}>
                      <div style={{ width: '44px', height: '44px', borderRadius: '50%', backgroundColor: '#ddd', display: 'flex', justifyContent: 'center', alignItems: 'center', color: '#767676' }}>
                        <Package size={22} />
                      </div>
                      <p style={{ marginTop: '12px', fontSize: '13px', color: '#767676' }}>Packed</p>
                    </div>

                    {/* Step 3: Shipped */}
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 2, backgroundColor: '#f9f9f9', padding: '0 10px' }}>
                      <div style={{ width: '44px', height: '44px', borderRadius: '50%', backgroundColor: '#ddd', display: 'flex', justifyContent: 'center', alignItems: 'center', color: '#767676' }}>
                        <Truck size={22} />
                      </div>
                      <p style={{ marginTop: '12px', fontSize: '13px', color: '#767676' }}>Shipped</p>
                    </div>

                    {/* Step 4: Out for Delivery */}
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 2, backgroundColor: '#f9f9f9', padding: '0 10px' }}>
                      <div style={{ width: '44px', height: '44px', borderRadius: '50%', backgroundColor: '#ddd', display: 'flex', justifyContent: 'center', alignItems: 'center', color: '#767676' }}>
                        <Truck size={22} />
                      </div>
                      <p style={{ marginTop: '12px', fontSize: '13px', color: '#767676' }}>Out for delivery</p>
                    </div>

                    {/* Step 5: Delivered */}
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 2, backgroundColor: '#f9f9f9', padding: '0 10px' }}>
                      <div style={{ width: '44px', height: '44px', borderRadius: '50%', backgroundColor: '#ddd', display: 'flex', justifyContent: 'center', alignItems: 'center', color: '#767676' }}>
                        <Home size={22} />
                      </div>
                      <p style={{ marginTop: '12px', fontSize: '13px', color: '#767676' }}>Delivered</p>
                    </div>

                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
