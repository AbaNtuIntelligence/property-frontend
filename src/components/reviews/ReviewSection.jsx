import React from 'react';
import './ReviewSection.css';

export default function ReviewSection({ propertyId, reviews = [] }) {
  return (
    <div className="review-section">
      <h2>Reviews</h2>
      
      {reviews.length === 0 ? (
        <p className="no-reviews">No reviews yet</p>
      ) : (
        <div className="reviews-list">
          {reviews.map((review, index) => (
            <div key={index} className="review-card">
              <div className="review-header">
                <strong>{review.user?.name || 'Anonymous'}</strong>
                <span className="review-date">
                  {new Date(review.date).toLocaleDateString()}
                </span>
              </div>
              <div className="review-rating">★ {review.rating}</div>
              <p className="review-comment">{review.comment}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}