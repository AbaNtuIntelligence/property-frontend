import React from 'react';
import './StoryCircle.css';

export default function StoryCircle({ user, isCreate, hasStory, onClick, onCreateClick }) {
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

  return (
    <div className="story-circle" onClick={onClick}>
      <div className={`story-avatar ${hasStory ? 'has-story' : ''}`}>
        <img src={user?.avatar || '/default-avatar.jpg'} alt={user?.name} />
      </div>
      <span className="story-username">{user?.name?.split(' ')[0]}</span>
    </div>
  );
}