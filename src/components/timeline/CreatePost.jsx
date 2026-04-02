import React, { useState } from 'react';
import './CreatePost.css';

export default function CreatePost({ onPostCreated, user }) {
  const [content, setContent] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!content.trim()) return;

    const newPost = {
      id: Date.now(),
      user: {
        name: user?.name || 'Current User',
        avatar: user?.avatar || '/default-avatar.jpg',
        isSuperhost: user?.isSuperhost || false
      },
      content,
      createdAt: new Date().toISOString(),
      likesCount: 0,
      commentsCount: 0,
      isLiked: false,
      isSaved: false,
      comments: []
    };

    onPostCreated(newPost);
    setContent('');
    setIsOpen(false);
  };

  return (
    <div className="create-post-section">
      <div className="create-post-input" onClick={() => setIsOpen(true)}>
        <img 
          src={user?.avatar || '/default-avatar.jpg'} 
          alt={user?.name}
          className="create-post-avatar"
        />
        <input 
          type="text" 
          placeholder="Share a property or experience..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onFocus={() => setIsOpen(true)}
        />
      </div>

      {isOpen && (
        <form onSubmit={handleSubmit} className="create-post-form">
          <textarea
            placeholder="Tell us about this property..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows="3"
          />
          <div className="form-actions">
            <button type="button" onClick={() => setIsOpen(false)}>Cancel</button>
            <button type="submit" disabled={!content.trim()}>Post</button>
          </div>
        </form>
      )}
    </div>
  );
}