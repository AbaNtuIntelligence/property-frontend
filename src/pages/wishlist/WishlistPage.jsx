import React from 'react';
import { useWishlist } from '../../hooks/useWishlist';
import PropertyCard from '../../components/property/PropertyCard';
import './WishlistPage.css';

export default function WishlistPage() {
  const { wishlist, loading } = useWishlist();

  if (loading) {
    return <div className="loading">Loading your wishlist...</div>;
  }

  return (
    <div className="wishlist-page">
      <div className="container">
        <h1>My Wishlist</h1>
        
        {wishlist.length === 0 ? (
          <div className="empty-wishlist">
            <span className="empty-icon">❤️</span>
            <h2>Your wishlist is empty</h2>
            <p>Save properties you love to see them here</p>
            <button 
              className="browse-btn"
              onClick={() => window.location.href = '/properties'}
            >
              Browse Properties
            </button>
          </div>
        ) : (
          <div className="wishlist-grid">
            {wishlist.map(property => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}