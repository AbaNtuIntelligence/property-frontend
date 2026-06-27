import React from 'react';
import './StoryCircle.css';

export default function StoryCircle({ user, isCreate, hasStory, onClick, onCreateClick }) {
  const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

  const getAvatarUrl = (avatar) => {
    if (!avatar) return null;
    if (avatar.startsWith('http')) return avatar;
    return `${API_URL}${avatar}`;
  };

  const getInitials = (name) => {
    if (!name) return '?';
    return name.charAt(0).toUpperCase();
  };

  // Create Story
  if (isCreate) {
    return (
      <div className="story-circle create-story" onClick={onCreateClick}>
        <div className="story-avatar create">
          <svg className="plus-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
        </div>
        <span className="story-username">Add Story</span>
      </div>
    );
  }

  // User Story
  const avatarUrl = user?.avatar ? getAvatarUrl(user.avatar) : null;
  const displayName = user?.name || user?.username || 'User';
  const initials = getInitials(displayName);

  return (
    <div className="story-circle" onClick={onClick}>
      <div className={`story-avatar-wrapper ${hasStory ? 'has-story' : ''}`}>
        <div className="story-avatar">
          {avatarUrl ? (
            <img 
              src={avatarUrl} 
              alt={displayName}
              loading="lazy"
              onError={(e) => {
                e.target.onerror = null;
                e.target.style.display = 'none';
                e.target.parentElement.querySelector('.avatar-fallback').style.display = 'flex';
              }}
            />
          ) : null}
          <div className="avatar-fallback" style={{ display: avatarUrl ? 'none' : 'flex' }}>
            {initials}
          </div>
        </div>
        {hasStory && (
          <div className="story-ring">
            <svg viewBox="0 0 100 100" className="story-ring-svg">
              <circle 
                cx="50" 
                cy="50" 
                r="45" 
                fill="none" 
                stroke="url(#storyGradient)" 
                strokeWidth="4"
                strokeLinecap="round"
                strokeDasharray="283"
                strokeDashoffset="70"
              />
              <defs>
                <linearGradient id="storyGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#f09433" />
                  <stop offset="25%" stopColor="#e6683c" />
                  <stop offset="50%" stopColor="#dc2743" />
                  <stop offset="75%" stopColor="#cc2366" />
                  <stop offset="100%" stopColor="#bc1888" />
                </linearGradient>
              </defs>
            </svg>
          </div>
        )}
      </div>
      <span className="story-username">{displayName.split(' ')[0]}</span>
    </div>
  );
}