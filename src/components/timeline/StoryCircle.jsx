import React from 'react';
import './StoryCircle.css';

export default function StoryCircle({ user, isCreate, hasStory, onClick, onCreateClick }) {
  const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

  const getAvatarUrl = (avatar) => {
    if (!avatar) return null;
    if (avatar.startsWith('http')) return avatar;
    return `${API_URL}${avatar}`;
  };

  if (isCreate) {
    return (
      <div className="story-circle create-story" onClick={onCreateClick}>
        <div className="story-avatar create">
          <span className="plus-icon">+</span>
        </div>
        <span className="story-username">Add Story</span>
      </div>
    );
  }

  // Get the avatar URL properly
  const avatarUrl = user?.avatar ? getAvatarUrl(user.avatar) : null;
  const displayName = user?.name || user?.username || 'User';

  return (
    <div className="story-circle" onClick={onClick}>
      <div className={`story-avatar ${hasStory ? 'has-story' : ''}`}>
        {avatarUrl ? (
          <img 
            src={avatarUrl} 
            alt={displayName}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = `https://ui-avatars.com/api/?background=1877f2&color=fff&name=${encodeURIComponent(displayName)}`;
            }}
          />
        ) : (
          <div className="avatar-placeholder">
            {displayName.charAt(0).toUpperCase()}
          </div>
        )}
      </div>
      <span className="story-username">{displayName.split(' ')[0]}</span>
    </div>
  );
}