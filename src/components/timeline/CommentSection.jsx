import React from 'react';
import './CommentSection.css';

export default function CommentSection({ 
  comments, 
  onSubmit, 
  commentText, 
  setCommentText, 
  currentUser 
}) {
  return (
    <div className="comment-section">
      <form onSubmit={onSubmit} className="comment-form">
        <img 
          src={currentUser?.avatar || '/default-avatar.jpg'} 
          alt={currentUser?.name}
          className="comment-user-avatar"
        />
        <div className="comment-input-wrapper">
          <input
            type="text"
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder="Write a comment..."
            className="comment-input"
          />
          <button 
            type="submit" 
            className="comment-submit"
            disabled={!commentText.trim()}
          >
            Post
          </button>
        </div>
      </form>

      <div className="comments-list">
        {comments && comments.length > 0 ? (
          comments.map((comment) => (
            <div key={comment.id} className="comment-item">
              <img 
                src={comment.user?.avatar || '/default-avatar.jpg'} 
                alt={comment.user?.name}
                className="comment-avatar"
              />
              <div className="comment-content">
                <div className="comment-header">
                  <strong>{comment.user?.name}</strong>
                  <span className="comment-time">
                    {formatTime(comment.timestamp)}
                  </span>
                </div>
                <p className="comment-text">{comment.text}</p>
                <div className="comment-actions">
                  <button className="comment-like-btn">Like</button>
                  <button className="comment-reply-btn">Reply</button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="no-comments">
            <p>No comments yet. Be the first to comment!</p>
          </div>
        )}
      </div>
    </div>
  );
}

// Helper function to format time
const formatTime = (timestamp) => {
  const date = new Date(timestamp);
  const now = new Date();
  const diffMinutes = Math.floor((now - date) / (1000 * 60));
  
  if (diffMinutes < 1) return 'Just now';
  if (diffMinutes < 60) return `${diffMinutes}m`;
  if (diffMinutes < 1440) return `${Math.floor(diffMinutes / 60)}h`;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};