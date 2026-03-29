import React, { useState } from 'react';
import { Star } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../lib/api';

export default function ProductReviews({ product, onReviewSubmitted }) {
  const { user } = useAuth();
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return alert('Please login to submit a review');
    if (!comment.trim()) return alert('Review comment cannot be empty');

    setIsSubmitting(true);
    try {
      const res = await api.addReview(product.id, { rating, comment });
      if (res.success) {
        setShowForm(false);
        setComment('');
        setRating(5);
        if (onReviewSubmitted) onReviewSubmitted();
      }
    } catch (error) {
      alert(error.message || 'Failed to submit review');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }).map((_, i) => (
      <Star 
        key={i} 
        size={16} 
        fill={i < rating ? '#FFA41C' : 'none'} 
        color={i < rating ? '#FFA41C' : '#ddd'} 
      />
    ));
  };

  return (
    <div style={{ marginTop: '40px', padding: '20px 0', borderTop: '1px solid #ddd' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: 'bold' }}>Customer Reviews</h2>
        {user ? (
          <button 
            onClick={() => setShowForm(!showForm)}
            style={{ padding: '8px 15px', backgroundColor: '#e7e9ec', border: '1px solid #adb1b8', borderRadius: '8px', cursor: 'pointer' }}
          >
            {showForm ? 'Cancel' : 'Write a Review'}
          </button>
        ) : (
          <p style={{ color: '#565959', fontSize: '13px' }}>Log in to write a review</p>
        )}
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} style={{ marginBottom: '30px', padding: '20px', backgroundColor: '#f9f9f9', borderRadius: '8px', border: '1px solid #ddd' }}>
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Rating</label>
            <select 
              value={rating} 
              onChange={(e) => setRating(Number(e.target.value))}
              style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc', width: '100px' }}
            >
              {[5, 4, 3, 2, 1].map(num => (
                <option key={num} value={num}>{num} Stars</option>
              ))}
            </select>
          </div>
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Review details</label>
            <textarea 
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="What did you like or dislike? What did you use this product for?"
              style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc', minHeight: '100px' }}
              required
            />
          </div>
          <button 
            type="submit" 
            disabled={isSubmitting}
            style={{ padding: '10px 20px', backgroundColor: '#FFD814', border: '1px solid #FCD200', borderRadius: '8px', cursor: 'pointer', fontWeight: '500' }}
          >
            {isSubmitting ? 'Submitting...' : 'Submit Review'}
          </button>
        </form>
      )}

      <div>
        {(!product.reviews || product.reviews.length === 0) ? (
          <p style={{ color: '#565959', padding: '20px 0' }}>No reviews yet. Be the first to review this product!</p>
        ) : (
          product.reviews.map(review => (
            <div key={review.id} style={{ marginBottom: '25px', paddingBottom: '20px', borderBottom: '1px solid #eee' }}>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '5px' }}>
                <div style={{ width: '30px', height: '30px', borderRadius: '50%', backgroundColor: '#e7e9ec', display: 'flex', justifyContent: 'center', alignItems: 'center', marginRight: '10px' }}>
                  <img src="https://upload.wikimedia.org/wikipedia/commons/9/99/Sample_User_Icon.png" alt="user" style={{ width: '100%' }} />
                </div>
                <span style={{ fontWeight: '500' }}>{review.user_name || 'Amazon Customer'}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                <div style={{ display: 'flex', marginRight: '10px' }}>
                  {renderStars(review.rating)}
                </div>
                <span style={{ fontSize: '12px', color: '#565959' }}>
                  Reviewed in India on {new Date(review.created_at).toLocaleDateString()}
                </span>
              </div>
              <p style={{ fontSize: '14px', lineHeight: '1.5' }}>{review.comment}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
