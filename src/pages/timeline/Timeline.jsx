import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import LeftSidebar from '../../components/timeline/LeftSidebar';
import RightSidebar from '../../components/timeline/RightSidebar';
import ImageSlider from '../../components/timeline/ImageSlider';
import StoryCircle from '../../components/timeline/StoryCircle';
import {
  HeartIcon,
  ShareIcon,
  BookmarkIcon,
  MapPinIcon,
  BedIcon,
  BathIcon,
  WhatsAppIcon,
  RulerIcon,
  ArrowDownIcon,
  ArrowUpIcon
} from '../../components/icons';
import './Timeline.css';

// ===== FORMAT ZAR CURRENCY =====
const formatZAR = (amount) => {
  return new Intl.NumberFormat('en-ZA', {
    style: 'currency',
    currency: 'ZAR',
    minimumFractionDigits: 0,
  }).format(amount);
};

// ===== ROOM DIMENSIONS COMPONENT =====
const RoomDimensions = ({ dimensions, totalArea }) => {
  const [expanded, setExpanded] = useState(false);
  
  const roomConfig = {
    living_room: { label: 'Living Room' },
    master_bedroom: { label: 'Master Bedroom' },
    bedroom_2: { label: 'Bedroom 2' },
    bedroom_3: { label: 'Bedroom 3' },
    kitchen: { label: 'Kitchen' },
    dining_room: { label: 'Dining Room' },
    study: { label: 'Study / Office' }
  };
  
  if (!dimensions) return null;
  
  const validRooms = Object.entries(dimensions)
    .filter(([key, dim]) => dim?.length && dim?.width && roomConfig[key]);
  
  if (validRooms.length === 0 && !totalArea) return null;
  
  const calculateArea = (length, width) => {
    return (parseFloat(length) * parseFloat(width)).toFixed(1);
  };
  
  return (
    <div className="room-dimensions-wrapper">
      <button 
        className="dimensions-trigger"
        onClick={() => setExpanded(!expanded)}
      >
        <RulerIcon />
        <span className="dimensions-label">Room Dimensions</span>
        {totalArea && <span className="dimensions-total">{totalArea} m² total</span>}
        {expanded ? <ArrowUpIcon /> : <ArrowDownIcon />}
      </button>
      
      {expanded && (
        <div className="dimensions-expanded">
          {validRooms.map(([key, dim]) => {
            const config = roomConfig[key];
            const area = calculateArea(dim.length, dim.width);
            return (
              <div key={key} className="dimension-item">
                <div className="dimension-info">
                  <div className="dimension-label">{config.label}</div>
                  <div className="dimension-size">{dim.length} × {dim.width} m</div>
                </div>
                <div className="dimension-area">{area} m²</div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

// ===== MAIN TIMELINE COMPONENT =====
const Timeline = () => {
  const navigate = useNavigate();
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
          roomDimensions: property.room_dimensions || null,
          totalArea: property.total_area || null,
          whatsapp_number: property.whatsapp_number || null,
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

  const handleWhatsAppContact = (number, title) => {
    const cleanNumber = number.replace(/\D/g, '');
    const message = `Hi, I'm interested in your property: ${title}`;
    window.open(`https://wa.me/${cleanNumber}?text=${encodeURIComponent(message)}`, '_blank');
  };

  const filteredPosts = posts.filter(post => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'under10k') return post.price < 10000;
    if (activeFilter === '10k-20k') return post.price >= 10000 && post.price <= 20000;
    if (activeFilter === '20kplus') return post.price > 20000;
    if (activeFilter === 'inverter') return post.hasInverter;
    if (activeFilter === 'petfriendly') return post.petFriendly;
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
    alert('Property link copied to clipboard!');
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
                user={{ 
                  name: u.username, 
                  username: u.username, 
                  avatar: u.avatar
                }}
                hasStory={true}
                onClick={() => alert(`View ${u.username}'s story coming soon!`)}
              />
            ))}
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="filter-tabs">
          <button 
            className={`filter-tab ${activeFilter === 'all' ? 'active' : ''}`}
            onClick={() => setActiveFilter('all')}
          >
            All
          </button>
          <button 
            className={`filter-tab ${activeFilter === 'under10k' ? 'active' : ''}`}
            onClick={() => setActiveFilter('under10k')}
          >
            Under R10k
          </button>
          <button 
            className={`filter-tab ${activeFilter === '10k-20k' ? 'active' : ''}`}
            onClick={() => setActiveFilter('10k-20k')}
          >
            R10k – R20k
          </button>
          <button 
            className={`filter-tab ${activeFilter === '20kplus' ? 'active' : ''}`}
            onClick={() => setActiveFilter('20kplus')}
          >
            R20k+
          </button>
          <button 
            className={`filter-tab ${activeFilter === 'inverter' ? 'active' : ''}`}
            onClick={() => setActiveFilter('inverter')}
          >
            Inverter
          </button>
          <button 
            className={`filter-tab ${activeFilter === 'petfriendly' ? 'active' : ''}`}
            onClick={() => setActiveFilter('petfriendly')}
          >
            Pet Friendly
          </button>
        </div>

        {/* Posts Feed */}
        <div className="posts-feed">
          {filteredPosts.length === 0 ? (
            <div className="empty-feed">
              <div className="empty-icon">
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <rect x="3" y="4" width="18" height="18" rx="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
              </div>
              <h3>No properties yet</h3>
              <p>Be the first to list a property!</p>
            </div>
          ) : (
            filteredPosts.map((post) => (
              <div 
                key={post.id} 
                className="post-card"
                onClick={() => navigate(`/property/${post.id}`)}
              >
                {/* Post Header */}
                <div className="post-header">
                  <img src={getAvatar(post.owner)} alt={post.owner.name} className="post-avatar" />
                  <div className="post-info">
                    <div className="post-name">{post.owner.name}</div>
                    <div className="post-meta">
                      <MapPinIcon />
                      <span>{post.location}</span>
                    </div>
                  </div>
                </div>

                {/* Post Content */}
                <div className="post-content">
                  <h3 className="post-title">{post.title}</h3>
                  <p className="post-text">{post.description?.substring(0, 150)}</p>
                  <div className="post-price">{post.formattedPrice}<span>/month</span></div>
                  <div className="post-details">
                    <span>
                      <BedIcon />
                      {post.bedrooms} beds
                    </span>
                    <span>
                      <BathIcon />
                      {post.bathrooms} baths
                    </span>
                  </div>
                </div>

                {/* Room Dimensions */}
                {(post.roomDimensions || post.totalArea) && (
                  <RoomDimensions 
                    dimensions={post.roomDimensions} 
                    totalArea={post.totalArea}
                  />
                )}

                {/* Image Slider */}
                {post.hasImages && post.images.length > 0 && (
                  <ImageSlider images={post.images} title={post.title} />
                )}

                {/* WhatsApp Quick Contact */}
                {post.whatsapp_number && (
                  <button 
                    className="whatsapp-quick-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleWhatsAppContact(post.whatsapp_number, post.title);
                    }}
                  >
                    <WhatsAppIcon />
                    Contact Owner
                  </button>
                )}

                {/* Post Stats */}
                <div className="post-stats">
                  <div className="stats-left">
                    <span>
                      <HeartIcon />
                      {post.likesCount}
                    </span>
                  </div>
                  <div className="stats-right">
                    <span>{post.commentsCount} comments</span>
                    <span>{post.sharesCount} shares</span>
                  </div>
                </div>

                {/* Post Actions */}
                <div className="post-actions">
                  <button 
                    className={`action ${post.isLiked ? 'liked' : ''}`} 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleLike(post.id);
                    }}
                  >
                    <HeartIcon />
                    <span>{post.isLiked ? 'Liked' : 'Like'}</span>
                  </button>
                  
                  <button 
                    className="action" 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleShare(post.id);
                    }}
                  >
                    <ShareIcon />
                    <span>Share</span>
                  </button>
                  
                  <button 
                    className={`action ${post.isSaved ? 'saved' : ''}`} 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSave(post.id);
                    }}
                  >
                    <BookmarkIcon />
                    <span>{post.isSaved ? 'Saved' : 'Save'}</span>
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
};

export default Timeline;