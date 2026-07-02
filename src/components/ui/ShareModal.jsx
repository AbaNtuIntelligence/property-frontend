import React from 'react';
import './ShareModal.css';

export default function ShareModal({ property, onClose, onCopy }) {
  const { id, title, description, images } = property || {};
  const url = `${window.location.origin}/property/${id}`;
  
  // Get the first image URL or use placeholder
  const imageUrl = images?.[0] ? 
    (images[0].image || images[0]) : 
    'https://placehold.co/600x400/e8e5e1/1a1a1a?text=Property';

  const shareLinks = [
    {
      key: 'whatsapp',
      name: 'WhatsApp',
      icon: '💬',
      url: `https://api.whatsapp.com/send?text=${encodeURIComponent(`${title}\n${url}`)}`,
      color: '#25D366'
    },
    {
      key: 'facebook',
      name: 'Facebook',
      icon: '📘',
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(title)}`,
      color: '#1877F2'
    },
    {
      key: 'twitter',
      name: 'Twitter/X',
      icon: '🐦',
      url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`,
      color: '#000000'
    },
    {
      key: 'linkedin',
      name: 'LinkedIn',
      icon: '💼',
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
      color: '#0A66C2'
    },
    {
      key: 'email',
      name: 'Email',
      icon: '📧',
      url: `mailto:?subject=${encodeURIComponent(`Check out this property: ${title}`)}&body=${encodeURIComponent(`${title}\n${description?.slice(0, 100) || ''}\n\nView property: ${url}`)}`,
      color: '#EA4335'
    },
    {
      key: 'copy',
      name: 'Copy Link',
      icon: '📋',
      url: '#',
      color: '#6B7280'
    }
  ];

  const handleShare = (platform) => {
    // If it's copy action
    if (platform.key === 'copy') {
      onCopy(url);
      onClose();
      return;
    }
    
    // Open share link in new window/tab
    window.open(
      platform.url,
      '_blank',
      'width=600,height=500,scrollbars=yes,menubar=no,location=yes'
    );
    
    onClose();
  };

  return (
    <div className="share-modal-overlay" onClick={onClose}>
      <div className="share-modal" onClick={(e) => e.stopPropagation()}>
        <div className="share-modal-header">
          <h3>Share this property</h3>
          <button className="share-modal-close" onClick={onClose}>✕</button>
        </div>

        <div className="share-modal-preview">
          <img src={imageUrl} alt={title || 'Property'} />
          <div className="share-modal-info">
            <h4>{title || 'Property'}</h4>
            <p>{description?.slice(0, 80) || 'Beautiful property available for rent'}...</p>
          </div>
        </div>

        <div className="share-modal-options">
          {shareLinks.map((platform) => (
            <button
              key={platform.key}
              className="share-option"
              onClick={() => handleShare(platform)}
            >
              <span className="share-option-icon">{platform.icon}</span>
              <span className="share-option-name">{platform.name}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}