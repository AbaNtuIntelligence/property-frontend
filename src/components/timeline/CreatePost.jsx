import React, { useState } from 'react';
import './CreatePost.css';

export default function CreatePost({ onPostCreated, user }) {
  const [showModal, setShowModal] = useState(false);
  const [postContent, setPostContent] = useState('');

  const handleSubmit = () => {
    if (!postContent.trim()) return;
    // Handle post creation here
    onPostCreated({ content: postContent });
    setPostContent('');
    setShowModal(false);
  };

  return (
    <div className="create-post-card">
      <div className="create-post-header">
        <img src={user?.avatar || '/default-avatar.jpg'} alt="Avatar" className="create-post-avatar" />
        <div className="create-post-input" onClick={() => setShowModal(true)}>
          What's on your mind?
        </div>
      </div>
      
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>Create Post</h3>
            <textarea
              placeholder="Share something..."
              value={postContent}
              onChange={(e) => setPostContent(e.target.value)}
              rows="4"
            />
            <div className="modal-actions">
              <button onClick={() => setShowModal(false)}>Cancel</button>
              <button onClick={handleSubmit}>Post</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}