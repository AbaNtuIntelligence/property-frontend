import React, { useState, useEffect, lazy, Suspense } from 'react'; // Combined import
import { Link } from 'react-router-dom';
import OptimizedImage from '../ui/OptimizedImage';
import './TimelinePost.css';
import ImageCarousel from '../ui/ImageCarousel'; // import at top

// Lazy load CommentSection only when needed
const CommentSection = lazy(() => import('./CommentSection'));

export default function TimelinePost({ post, onLike, onComment, onShare, onSave, currentUser }) {
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);

  // Debug to see what images we're getting
  useEffect(() => {
    console.log('📸 TimelinePost images:', post?.property?.images);
  }, [post]);

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (commentText.trim()) {
      onComment(commentText);
      setCommentText('');
    }
  };

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

  return (
    <div className="timeline-post">
      <div className="post-header">
        <div className="post-user">
          <OptimizedImage 
            src={post?.user?.avatar || '/default-avatar.jpg'} 
            alt={post?.user?.name || 'User'}
            className="user-avatar"
            width="48"
            height="48"
          />
          <div className="user-info">
            <Link to={`/host/${post?.user?.id}`} className="user-name">
              {post?.user?.name || 'Anonymous Host'}
              {post?.user?.isSuperhost && (
                <span className="superhost-badge" title="Superhost">⭐</span>
              )}
            </Link>
            <span className="post-time">{formatDate(post?.createdAt)}</span>
          </div>
        </div>
      </div>

      <div className="post-content">
        <Link to={`/property/${post?.property?.id}`} className="property-link">
          <h3 className="property-title">{post?.property?.title || 'Untitled Property'}</h3>
        </Link>
        
        <div className="property-description-container">
          <p className={`property-description ${isExpanded ? 'expanded' : 'collapsed'}`}>
            {post?.property?.description || 'No description available.'}
          </p>
          {post?.property?.description?.length > 150 && (
            <button 
              className="read-more-btn"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? 'Show less' : '...Read more'}
            </button>
          )}
        </div>
      </div>

      <div className="post-media">
  {post?.property?.images?.length > 0 ? (
    <ImageCarousel 
      images={post.property.images} 
      propertyId={post.property.id} 
    />
  ) : (
    <OptimizedImage 
      src="https://via.placeholder.com/680x400?text=No+Image" 
      alt="No image available"
      className="property-image"
      width="680"
      height="400"
    />
  )}
</div>

      <div className="post-stats">
        <div className="stats-left">
          <span className="likes-count">❤️ {post?.likesCount || 0}</span>
          <span className="comments-count">💬 {post?.commentsCount || 0}</span>
        </div>
        {post?.property?.rating && (
          <div className="stats-right">
            <span className="rating">
              ★ {post.property.rating} ({post.property.reviewCount || 0} reviews)
            </span>
          </div>
        )}
      </div>

      <div className="post-interactions">
        <button 
          className={`interaction-btn ${post?.isLiked ? 'active' : ''}`}
          onClick={onLike}
        >
          <span className="btn-icon">{post?.isLiked ? '❤️' : '🤍'}</span>
          <span className="btn-label">Like</span>
        </button>

        <button 
          className="interaction-btn"
          onClick={() => setShowComments(!showComments)}
        >
          <span className="btn-icon">💬</span>
          <span className="btn-label">Comment</span>
        </button>

        <button 
          className="interaction-btn"
          onClick={onShare}
        >
          <span className="btn-icon">↗️</span>
          <span className="btn-label">Share</span>
        </button>

        <button 
          className={`interaction-btn ${post?.isSaved ? 'active' : ''}`}
          onClick={onSave}
        >
          <span className="btn-icon">{post?.isSaved ? '🔖' : '📑'}</span>
          <span className="btn-label">Save</span>
        </button>
      </div>

      {showComments && (
        <Suspense fallback={<div className="comments-loading">Loading comments...</div>}>
          <CommentSection 
            comments={post?.comments || []}
            onSubmit={handleCommentSubmit}
            commentText={commentText}
            setCommentText={setCommentText}
            currentUser={currentUser}
          />
        </Suspense>
      )}
    </div>
  );
}