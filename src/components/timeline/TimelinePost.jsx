import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MapPinIcon, BedIcon, BathIcon } from '../icons';
import './TimelinePost.css';

export default function TimelinePost({ post }) {
  const [isExpanded, setIsExpanded] = useState(false);

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const getAvatar = (owner) => {
    if (!owner) return 'https://ui-avatars.com/api/?name=User';
    if (owner.avatar) {
      return owner.avatar.startsWith('http') ? owner.avatar : `${API_URL}${owner.avatar}`;
    }
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(owner.name || 'User')}`;
  };

  return (
    <div className="timeline-post">
      {/* Post Header */}
      <div className="post-header">
        <div className="post-user">
          <img src={getAvatar(post.owner)} alt={post.owner?.name} className="user-avatar" />
          <div className="user-info">
            <Link to={`/host/${post.owner?.id}`} className="user-name">
              {post.owner?.name || 'Host'}
            </Link>
            <span className="post-time">{formatDate(post.createdAt)}</span>
          </div>
        </div>
      </div>

      {/* Post Content */}
      <div className="post-content">
        <Link to={`/property/${post.id}`} className="property-title">
          <h3>{post.title}</h3>
        </Link>
        <div className="property-description-container">
          <p className={`property-description ${isExpanded ? 'expanded' : 'collapsed'}`}>
            {post.description}
          </p>
          {post.description?.length > 150 && (
            <button className="read-more-btn" onClick={() => setIsExpanded(!isExpanded)}>
              {isExpanded ? 'Show less' : '...Read more'}
            </button>
          )}
        </div>
      </div>

      {/* Property Details */}
      <div className="post-property-details">
        <div className="property-location">
          <MapPinIcon />
          <span>{post.location}</span>
        </div>
        <div className="property-specs">
          <span><BedIcon /> {post.bedrooms} beds</span>
          <span><BathIcon /> {post.bathrooms} baths</span>
        </div>
        <div className="property-price">{post.formattedPrice}/month</div>
      </div>

      {/* View Property Button - Kept */}
      <div className="post-footer">
        <Link to={`/property/${post.id}`} className="view-property-btn">
          View Property Details →
        </Link>
      </div>
    </div>
  );
}