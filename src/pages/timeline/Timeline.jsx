import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import Navbar from '../../components/layout/Navbar';
import LeftSidebar from '../../components/timeline/LeftSidebar';
import RightSidebar from '../../components/timeline/RightSidebar';
import ImageSlider from '../../components/timeline/ImageSlider';
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
            console.log('Users with avatars:', data); // Check console
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
            console.log('Properties with owner avatars:', propertiesData.map(p => ({
                title: p.title,
                owner: p.owner_username,
                avatar: p.owner_avatar
            })));
            
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
                    avatar: property.owner_avatar || null,  // ← Make sure this is captured
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

const getAvatar = (userData) => {
    // If userData is null or undefined
    if (!userData) {
        return `https://ui-avatars.com/api/?background=1877f2&color=fff&name=User`;
    }
    
    // If user has an avatar from backend
    if (userData.avatar && userData.avatar !== null) {
        if (userData.avatar.startsWith('http')) {
            return userData.avatar;
        }
        return `${API_URL}${userData.avatar}`;
    }
    
    // If user has avatar_url (alternative field)
    if (userData.avatar_url && userData.avatar_url !== null) {
        if (userData.avatar_url.startsWith('http')) {
            return userData.avatar_url;
        }
        return `${API_URL}${userData.avatar_url}`;
    }
    
    // Fallback to initial avatar
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
      <>
        <Navbar />
        <div className="fb-loading">
          <div className="fb-loading-spinner"></div>
          <p>Loading your feed...</p>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="fb-container">
        {/* LEFT SIDEBAR */}
        <aside className="fb-left-sidebar">
          <LeftSidebar user={user} />
        </aside>

        {/* MAIN FEED */}
        <main className="fb-main-feed">
          {/* CREATE POST */}
          <div className="fb-create-post">
            <div className="create-post-header">
              <img src={getAvatar(user?.username)} alt="Avatar" className="create-post-avatar" />
              <div className="create-post-input" onClick={() => alert('Create post coming soon!')}>
                What's on your mind, {user?.username?.split(' ')[0] || 'Guest'}?
              </div>
            </div>
            <div className="create-post-actions">
              <button className="create-action">📸 Photo</button>
              <button className="create-action">🎥 Video</button>
              <button className="create-action">📍 Location</button>
            </div>
          </div>

{/* STORIES - Show ALL users including current user */}
<div className="fb-stories">
    {/* Other Users Stories (including current user) */}
    {users.slice(0, 10).map((u) => (
        <div key={u.id} className="story-item">
            <div className="story-ring">
                <img 
                    src={getAvatar(u)} 
                    alt={u.username}
                    onError={(e) => {
                        e.target.src = `https://ui-avatars.com/api/?background=1877f2&color=fff&name=${encodeURIComponent(u.username)}`;
                    }}
                />
            </div>
            <span>{u.username === user?.username ? 'Your story' : u.username}</span>
        </div>
    ))}
</div>

          {/* FILTER TABS */}
          <div className="fb-filter-tabs">
            <button className={`filter-tab ${activeFilter === 'all' ? 'active' : ''}`} onClick={() => setActiveFilter('all')}>🔥 All</button>
            <button className={`filter-tab ${activeFilter === 'under10k' ? 'active' : ''}`} onClick={() => setActiveFilter('under10k')}>💰 Under R10k</button>
            <button className={`filter-tab ${activeFilter === '10k-20k' ? 'active' : ''}`} onClick={() => setActiveFilter('10k-20k')}>💰 R10k - R20k</button>
            <button className={`filter-tab ${activeFilter === '20kplus' ? 'active' : ''}`} onClick={() => setActiveFilter('20kplus')}>💰 R20k+</button>
            <button className={`filter-tab ${activeFilter === 'inverter' ? 'active' : ''}`} onClick={() => setActiveFilter('inverter')}>🔋 Inverter</button>
          </div>

          {/* POSTS FEED */}
          <div className="fb-posts-feed">
            {filteredPosts.length === 0 ? (
              <div className="fb-empty-feed">
                <div className="empty-icon">🏠</div>
                <h3>No properties yet</h3>
                <p>Be the first to list a property!</p>
                <button className="empty-list-btn" onClick={() => window.location.href = '/property/new'}>
                  List Your Property
                </button>
              </div>
            ) : (
              filteredPosts.map((post) => (
                <div key={post.id} className="fb-post-card">
                  {/* POST HEADER */}
                  {/* POST HEADER */}
{/* POST HEADER */}
<div className="post-header">
    <img 
        src={getAvatar(post.owner)} 
        alt={post.owner.name} 
        className="post-avatar"
        onError={(e) => {
            e.target.src = `https://ui-avatars.com/api/?background=1877f2&color=fff&name=${encodeURIComponent(post.owner.name)}`;
        }}
    />
    <div className="post-info">
        <div className="post-name">{post.owner.name}</div>
        <div className="post-meta">
            <span className="post-location">📍 {post.location}</span>
            <span className="post-time">• {new Date(post.createdAt).toLocaleDateString()}</span>
        </div>
    </div>
    <button className="post-menu">⋯</button>
</div>

     {/* Create Post - Only for Property Owners */}
{user?.user_type === 'owner' && (
    <div className="fb-create-post">
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

                  {/* POST CONTENT */}
                  <div className="post-content">
                    <h3 className="post-title">{post.title}</h3>
                    <p className="post-text">{post.description?.substring(0, 150)}...</p>
                    <div className="post-price-row">
                      <span className="post-price">{post.formattedPrice}</span>
                      <span className="post-period">/month</span>
                    </div>
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

                  {/* IMAGES SLIDER */}
                  {post.hasImages && post.images.length > 0 && (
                    <ImageSlider images={post.images} title={post.title} />
                  )}

                  {/* STATS */}
                  <div className="post-stats">
                    <div className="stats-left">❤️ {post.likesCount}</div>
                    <div className="stats-right">
                      <span>{post.commentsCount} comments</span>
                      <span>•</span>
                      <span>{post.sharesCount} shares</span>
                    </div>
                  </div>

                  {/* ACTIONS */}
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
        </main>

        {/* RIGHT SIDEBAR */}
        <aside className="fb-right-sidebar">
          <RightSidebar user={user} />
        </aside>
      </div>
    </>
  );
}