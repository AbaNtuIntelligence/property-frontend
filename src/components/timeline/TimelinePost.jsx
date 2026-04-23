import React, { useState } from 'react';
import ImageSlider from './ImageSlider';
import './TimelinePost.css';

export default function TimelinePost({ post, onLike, onComment, onShare, onSave, currentUser }) {
  const [showCommentInput, setShowCommentInput] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [showFullDescription, setShowFullDescription] = useState(false);

  const handleSubmitComment = () => {
    if (commentText.trim()) {
      onComment(commentText);
      setCommentText('');
      setShowCommentInput(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = Math.floor((now - date) / 1000 / 60);
    
    if (diff < 1) return 'Just now';
    if (diff < 60) return `${diff} minutes ago`;
    if (diff < 1440) return `${Math.floor(diff / 60)} hours ago`;
    return `${Math.floor(diff / 1440)} days ago`;
  };

  const isProperty = post.type === 'property' || post.price !== undefined;

  return (
    <div className="timeline-post">
      {/* Post Header */}
      <div className="post-header">
        <img src={post.owner?.avatar || '/default-avatar.jpg'} alt="Owner" className="post-avatar" />
        <div className="post-owner-info">
          <h4>{post.owner?.name || 'Property Owner'}</h4>
          <span className="post-location">{post.location || 'Property Listing'}</span>
          <span className="post-time"> • {formatDate(post.createdAt)}</span>
        </div>
        <button className="post-menu-btn">⋮</button>
      </div>

      {/* Post Content */}
      {isProperty ? (
        <div className="property-post">
          <div className="property-title">
            <h3>{post.title}</h3>
            <span className="property-price">${post.price}/month</span>
          </div>
          
          {/* Property Features */}
          <div className="property-features">
            <span>🛏️ {post.bedrooms} {post.bedrooms === 1 ? 'bed' : 'beds'}</span>
            <span>🛁 {post.bathrooms} {post.bathrooms === 1 ? 'bath' : 'baths'}</span>
            {post.squareFeet && <span>📐 {post.squareFeet} sq ft</span>}
            <span>📍 {post.location}</span>
          </div>

          {/* Property Description */}
          <p className="property-description">
            {showFullDescription || post.description.length <= 200 
              ? post.description 
              : `${post.description.substring(0, 200)}...`}
            {post.description.length > 200 && (
              <button className="read-more" onClick={() => setShowFullDescription(!showFullDescription)}>
                {showFullDescription ? 'See less' : 'See more'}
              </button>
            )}
          </p>

          {/* Amenities Tags */}
          {post.amenities && post.amenities.length > 0 && (
            <div className="amenities-tags">
              {post.amenities.slice(0, 5).map((amenity, i) => (
                <span key={i} className="amenity-tag">✓ {amenity}</span>
              ))}
              {post.amenities.length > 5 && (
                <span className="amenity-tag">+{post.amenities.length - 5} more</span>
              )}
            </div>
          )}
        </div>
      ) : (
        <div className="regular-post">
          <p>{post.content}</p>
        </div>
      )}

      {/* Images Slider */}
      {post.images && post.images.length > 0 && (
        <ImageSlider images={post.images} title={post.title} />
      )}

      {/* Post Stats */}
      <div className="post-stats">
        <div className="stats-left">
          <span className="likes-count">❤️ {post.likesCount} likes</span>
        </div>
        <div className="stats-right">
          <span className="comments-count">{post.commentsCount} comments</span>
          <span className="shares-count">{post.sharesCount} shares</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="post-actions">
        <button onClick={onLike} className={post.isLiked ? 'liked' : ''}>
          <span className="action-icon">❤️</span>
          <span className="action-label">Like</span>
        </button>
        <button onClick={() => setShowCommentInput(!showCommentInput)}>
          <span className="action-icon">💬</span>
          <span className="action-label">Comment</span>
        </button>
        <button onClick={onShare}>
          <span className="action-icon">🔗</span>
          <span className="action-label">Share</span>
        </button>
        <button onClick={onSave} className={post.isSaved ? 'saved' : ''}>
          <span className="action-icon">{post.isSaved ? '📕' : '📖'}</span>
          <span className="action-label">{post.isSaved ? 'Saved' : 'Save'}</span>
        </button>
      </div>

      {/* Comment Input */}
      {showCommentInput && (
        <div className="comment-input">
          <img src={currentUser?.avatar || '/default-avatar.jpg'} alt="Your avatar" className="comment-avatar" />
          <input
            type="text"
            placeholder="Write a comment..."
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSubmitComment()}
          />
          <button onClick={handleSubmitComment}>Post</button>
        </div>
      )}

      {/* Comments List */}
      {post.comments && post.comments.length > 0 && (
        <div className="comments-list">
          {post.comments.slice(0, 3).map((comment, i) => (
            <div key={i} className="comment-item">
              <img src={comment.user?.avatar || '/default-avatar.jpg'} alt="" className="comment-avatar-small" />
              <div className="comment-content">
                <strong>{comment.user?.name}</strong>
                <p>{comment.text}</p>
                <span className="comment-time">{formatDate(comment.timestamp)}</span>
              </div>
            </div>
          ))}
          {post.comments.length > 3 && (
            <button className="view-more-comments">View all {post.comments.length} comments</button>
          )}
        </div>
      )}
    </div>
  );
}