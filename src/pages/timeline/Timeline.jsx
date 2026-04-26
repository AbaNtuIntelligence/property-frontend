import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import LeftSidebar from '../../components/timeline/LeftSidebar';
import RightSidebar from '../../components/timeline/RightSidebar';
import ImageSlider from '../../components/timeline/ImageSlider';
import StoryCircle from '../../components/timeline/StoryCircle';
import CreatePost from '../../components/timeline/CreatePost';
import './Timeline.css';

const formatZAR = (amount) => {
    return new Intl.NumberFormat('en-ZA', {
        style: 'currency',
        currency: 'ZAR',
        minimumFractionDigits: 0,
    }).format(amount);
};

export default function Timeline() {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('all');
  const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

  useEffect(() => {
    fetchUsers();
    fetchProperties();
  }, []);

  const fetchUsers = async () => {
    try {
        const response = await fetch(`${API_URL}/api/accounts/users/`);
        if (response.ok) {
            const data = await response.json();
            setUsers(data);
        }
    } catch (error) {
        console.error('Error fetching users:', error);
    }
  };

  const fetchProperties = async () => {
    try {
        const response = await fetch(`${API_URL}/api/properties/`);
        if (response.ok) {
            const propertiesData = await response.json();
            
            const socialPosts = propertiesData.map((property) => ({
                id: property.id,
                title: property.title,
                description: property.description,
                price: property.monthly_rent,
                formattedPrice: formatZAR(property.monthly_rent),
                bedrooms: property.bedrooms || 2,
                bathrooms: property.bathrooms || 2,
                location: property.city,
                images: property.images || [],
                hasImages: property.images && property.images.length > 0,
                hasInverter: property.has_inverter || false,
                hasJojo: property.has_jojo_tank || false,
                petFriendly: property.pet_friendly || false,
                owner: {
                    name: property.owner_username || 'Property Owner',
                    avatar: property.owner_avatar || null,
                },
                createdAt: property.created_at,
                likesCount: Math.floor(Math.random() * 50),
                commentsCount: Math.floor(Math.random() * 10),
                sharesCount: Math.floor(Math.random() * 5),
                isLiked: false,
                isSaved: false
            }));
            
            setPosts(socialPosts);
        }
    } catch (error) {
        console.error('Error fetching properties:', error);
    } finally {
        setLoading(false);
    }
  };

  // Helper function to get image URL - ADD THIS FUNCTION
  const getImageUrl = (image) => {
    if (!image) return null;
    
    // Get the image URL string (handles both object and string)
    let imgUrl = typeof image === 'string' ? image : (image.image || image.url);
    if (!imgUrl) return null;
    
    // If it's already an absolute URL, return as is
    if (imgUrl.startsWith('http')) {
        return imgUrl;
    }
    
    // Otherwise, prepend the API URL
    return `${API_URL}${imgUrl}`;
  };

  const getAvatar = (userData) => {
    if (!userData) {
        return `https://ui-avatars.com/api/?background=1877f2&color=fff&name=User`;
    }
    
    if (userData.avatar && userData.avatar !== null) {
        if (userData.avatar.startsWith('http')) {
            return userData.avatar;
        }
        return `${API_URL}${userData.avatar}`;
    }
    
    const name = userData.name || userData.username || 'User';
    return `https://ui-avatars.com/api/?background=1877f2&color=fff&bold=true&name=${encodeURIComponent(name)}`;
  };

  const filteredPosts = posts.filter(post => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'under10k') return post.price < 10000;
    if (activeFilter === '10k-20k') return post.price >= 10000 && post.price <= 20000;
    if (activeFilter === '20kplus') return post.price > 20000;
    if (activeFilter === 'inverter') return post.hasInverter;
    return true;
  });

  const handleLike = (postId) => {
    setPosts(prev => prev.map(post => 
      post.id === postId 
        ? { ...post, isLiked: !post.isLiked, likesCount: post.isLiked ? post.likesCount - 1 : post.likesCount + 1 }
        : post
    ));
  };

  const handleSave = (postId) => {
    setPosts(prev => prev.map(post => 
      post.id === postId 
        ? { ...post, isSaved: !post.isSaved }
        : post
    ));
  };

  const handleShare = (postId) => {
    navigator.clipboard.writeText(`${window.location.origin}/property/${postId}`);
    alert('🔗 Property link copied to clipboard!');
  };

  if (loading) {
    return (
      <div className="timeline-loading">
        <div className="loading-spinner"></div>
        <p>Loading your feed...</p>
      </div>
    );
  }

  return (
    <div className="timeline-three-column">
      {/* LEFT SIDEBAR */}
      <div className="timeline-left-col">
        <LeftSidebar user={user} />
      </div>

      {/* MAIN FEED - CENTER */}
      <div className="timeline-center-col">
        {/* Create Post - Only for Owners */}
        {user?.user_type === 'owner' && (
          <div className="create-post-card">
            <div className="create-post-header">
              <img src={getAvatar(user)} alt="Avatar" className="create-post-avatar" />
              <div className="create-post-input" onClick={() => window.location.href = '/property/new'}>
                List your property, {user?.username?.split(' ')[0] || 'Owner'}?
              </div>
            </div>
            <div className="create-post-actions">
              <button className="create-action" onClick={() => window.location.href = '/property/new'}>📸 Add Photos</button>
              <button className="create-action" onClick={() => window.location.href = '/property/new'}>📍 Add Location</button>
            </div>
          </div>
        )}

        {/* Stories Section */}
        <div className="stories-section">
          <div className="stories-wrapper">
            <StoryCircle 
              user={user} 
              isCreate={true}
              onCreateClick={() => alert('Create story feature coming soon!')}
            />
            {users.filter(u => u.id !== user?.id).slice(0, 12).map((u) => (
              <StoryCircle 
                key={u.id}
                user={{ name: u.username, username: u.username, avatar: u.avatar }}
                hasStory={true}
                onClick={() => alert(`View ${u.username}'s story coming soon!`)}
              />
            ))}
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="filter-tabs">
          <button className={`filter-tab ${activeFilter === 'all' ? 'active' : ''}`} onClick={() => setActiveFilter('all')}>🔥 All</button>
          <button className={`filter-tab ${activeFilter === 'under10k' ? 'active' : ''}`} onClick={() => setActiveFilter('under10k')}>💰 Under R10k</button>
          <button className={`filter-tab ${activeFilter === '10k-20k' ? 'active' : ''}`} onClick={() => setActiveFilter('10k-20k')}>💰 R10k - R20k</button>
          <button className={`filter-tab ${activeFilter === '20kplus' ? 'active' : ''}`} onClick={() => setActiveFilter('20kplus')}>💰 R20k+</button>
          <button className={`filter-tab ${activeFilter === 'inverter' ? 'active' : ''}`} onClick={() => setActiveFilter('inverter')}>🔋 Inverter</button>
        </div>

        {/* Posts Feed */}
        <div className="posts-feed">
          {filteredPosts.length === 0 ? (
            <div className="empty-feed">
              <div className="empty-icon">🏠</div>
              <h3>No properties yet</h3>
              <p>Be the first to list a property!</p>
              {user?.user_type === 'owner' && (
                <button className="empty-list-btn" onClick={() => window.location.href = '/property/new'}>
                  List Your Property
                </button>
              )}
            </div>
          ) : (
            filteredPosts.map((post) => (
              <div key={post.id} className="post-card">
                <div className="post-header">
                  <img 
                    src={getAvatar(post.owner)} 
                    alt={post.owner.name} 
                    className="post-avatar"
                  />
                  <div className="post-info">
                    <div className="post-name">{post.owner.name}</div>
                    <div className="post-meta">
                      <span>📍 {post.location}</span>
                      <span>•</span>
                      <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <button className="post-menu">⋯</button>
                </div>

                <div className="post-content">
                  <h3 className="post-title">{post.title}</h3>
                  <p className="post-text">{post.description?.substring(0, 150)}...</p>
                  <div className="post-price">{post.formattedPrice}<span>/month</span></div>
                  <div className="post-details">
                    <span>🛏️ {post.bedrooms} beds</span>
                    <span>🛁 {post.bathrooms} baths</span>
                  </div>
                  {post.hasInverter && (
                    <div className="post-badge">
                      <span className="badge">🔋 Inverter Backup</span>
                    </div>
                  )}
                </div>

                {/* Image Slider - USING THE getImageUrl FUNCTION */}
                {post.hasImages && post.images.length > 0 && (
                  <ImageSlider images={post.images} title={post.title} />
                )}

                <div className="post-stats">
                  <div className="stats-left">❤️ {post.likesCount}</div>
                  <div className="stats-right">
                    <span>{post.commentsCount} comments</span>
                    <span>•</span>
                    <span>{post.sharesCount} shares</span>
                  </div>
                </div>

                <div className="post-actions">
                  <button className={`action ${post.isLiked ? 'liked' : ''}`} onClick={() => handleLike(post.id)}>
                    {post.isLiked ? '❤️ Liked' : '🤍 Like'}
                  </button>
                  <button className="action">💬 Comment</button>
                  <button className="action" onClick={() => handleShare(post.id)}>🔗 Share</button>
                  <button className={`action ${post.isSaved ? 'saved' : ''}`} onClick={() => handleSave(post.id)}>
                    {post.isSaved ? '📕 Saved' : '📖 Save'}
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* RIGHT SIDEBAR */}
      <div className="timeline-right-col">
        <RightSidebar user={user} />
      </div>
    </div>
  );
}