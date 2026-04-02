import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useAuth } from '../../hooks/useAuth';
import TimelinePost from '../../components/timeline/TimelinePost';
import LeftSidebar from '../../components/timeline/LeftSidebar';
import RightSidebar from '../../components/timeline/RightSidebar';
import CreatePost from '../../components/timeline/CreatePost';
import StoryCircle from '../../components/timeline/StoryCircle';
import API from '../../api/axios';
import './Timeline.css';

export default function Timeline() {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [stories, setStories] = useState([]);
  const [trendingProperties, setTrendingProperties] = useState([]);
  const [suggestedUsers, setSuggestedUsers] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState('all'); // all, following, trending, recent
  const observerRef = useRef();
  const lastPostRef = useRef();

  useEffect(() => {
    fetchInitialData();
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [page, selectedFilter]);

  const fetchInitialData = async () => {
    try {
      const [storiesRes, trendingRes, suggestedRes] = await Promise.all([
        API.get('/stories/'),
        API.get('/properties/trending/'),
        API.get('/users/suggested/')
      ]);
      setStories(storiesRes.data);
      setTrendingProperties(trendingRes.data);
      setSuggestedUsers(suggestedRes.data);
    } catch (error) {
      console.error('Error fetching initial data:', error);
    }
  };

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const response = await API.get('/timeline/posts/', {
        params: {
          page,
          filter: selectedFilter,
          limit: 10
        }
      });

      const newPosts = response.data.results;
      setPosts(prev => page === 1 ? newPosts : [...prev, ...newPosts]);
      setHasMore(!!response.data.next);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const lastPostElementRef = useCallback(node => {
    if (loading) return;
    if (observerRef.current) observerRef.current.disconnect();
    
    observerRef.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        setPage(prev => prev + 1);
      }
    });

    if (node) observerRef.current.observe(node);
  }, [loading, hasMore]);

  const handleLike = async (postId) => {
    try {
      await API.post(`/timeline/posts/${postId}/like/`);
      setPosts(prev => prev.map(post => 
        post.id === postId 
          ? { ...post, isLiked: !post.isLiked, likesCount: post.isLiked ? post.likesCount - 1 : post.likesCount + 1 }
          : post
      ));
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  const handleComment = async (postId, comment) => {
    try {
      const response = await API.post(`/timeline/posts/${postId}/comment/`, { comment });
      setPosts(prev => prev.map(post => 
        post.id === postId 
          ? { ...post, comments: [response.data, ...post.comments], commentsCount: post.commentsCount + 1 }
          : post
      ));
    } catch (error) {
      console.error('Error commenting:', error);
    }
  };

  const handleShare = async (postId) => {
    try {
      await API.post(`/timeline/posts/${postId}/share/`);
      // Show share modal or copy link
      navigator.clipboard.writeText(`${window.location.origin}/property/${postId}`);
      alert('Link copied to clipboard!');
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const handleSave = async (postId) => {
    try {
      await API.post(`/timeline/posts/${postId}/save/`);
      setPosts(prev => prev.map(post => 
        post.id === postId 
          ? { ...post, isSaved: !post.isSaved }
          : post
      ));
    } catch (error) {
      console.error('Error saving post:', error);
    }
  };

  const handleFollow = async (userId) => {
    try {
      await API.post(`/users/${userId}/follow/`);
      setSuggestedUsers(prev => prev.filter(user => user.id !== userId));
    } catch (error) {
      console.error('Error following user:', error);
    }
  };

  const handleNewPost = (newPost) => {
    setPosts(prev => [newPost, ...prev]);
  };

  const filterOptions = [
    { value: 'all', label: 'All Properties', icon: '🌍' },
    { value: 'following', label: 'Following', icon: '👥' },
    { value: 'trending', label: 'Trending', icon: '🔥' },
    { value: 'recent', label: 'Recent', icon: '⏱️' }
  ];

  return (
    <div className="timeline-container">
      <LeftSidebar>
        <div className="filter-menu">
          <h3>Feed Filters</h3>
          {filterOptions.map(option => (
            <button
              key={option.value}
              className={`filter-btn ${selectedFilter === option.value ? 'active' : ''}`}
              onClick={() => {
                setSelectedFilter(option.value);
                setPage(1);
              }}
            >
              <span className="filter-icon">{option.icon}</span>
              <span className="filter-label">{option.label}</span>
            </button>
          ))}
        </div>

        <div className="trending-section">
          <h3>🔥 Trending Properties</h3>
          <div className="trending-list">
            {trendingProperties.map(property => (
              <a 
                key={property.id} 
                href={`/property/${property.id}`}
                className="trending-item"
              >
                <img src={property.images?.[0]} alt={property.title} />
                <div className="trending-info">
                  <h4>{property.title}</h4>
                  <p>{property.city}, {property.country}</p>
                  <span className="trending-score">🔥 {property.trendingScore}</span>
                </div>
              </a>
            ))}
          </div>
        </div>

        <div className="suggested-users">
          <h3>👥 Suggested Hosts</h3>
          {suggestedUsers.map(suggested => (
            <div key={suggested.id} className="suggested-user">
              <img src={suggested.avatar} alt={suggested.name} />
              <div className="user-info">
                <h4>{suggested.name}</h4>
                <p>{suggested.followers} followers</p>
              </div>
              <button 
                className="follow-btn"
                onClick={() => handleFollow(suggested.id)}
              >
                Follow
              </button>
            </div>
          ))}
        </div>
      </LeftSidebar>

      <div className="timeline-main">
        <div className="stories-section">
          <div className="stories-wrapper">
            <StoryCircle 
              user={user} 
              isCreate={true}
              onCreateClick={() => {/* Open story creator */}}
            />
            {stories.map(story => (
              <StoryCircle 
                key={story.id} 
                user={story.user} 
                hasStory={true}
                onClick={() => {/* Open story viewer */}}
              />
            ))}
          </div>
        </div>

        <CreatePost onPostCreated={handleNewPost} />

        <div className="posts-feed">
          {posts.map((post, index) => (
            <div
              key={post.id}
              ref={index === posts.length - 1 ? lastPostElementRef : null}
            >
              <TimelinePost 
                post={post}
                onLike={() => handleLike(post.id)}
                onComment={(comment) => handleComment(post.id, comment)}
                onShare={() => handleShare(post.id)}
                onSave={() => handleSave(post.id)}
                currentUser={user}
              />
            </div>
          ))}
          
          {loading && (
            <div className="loading-indicator">
              <div className="spinner"></div>
              <p>Loading more properties...</p>
            </div>
          )}

          {!hasMore && posts.length > 0 && (
            <div className="end-message">
              <p>You've reached the end! 🎉</p>
            </div>
          )}

          {!loading && posts.length === 0 && (
            <div className="empty-feed">
              <div className="empty-icon">🏠</div>
              <h3>No properties to show</h3>
              <p>Follow more hosts or check back later for new listings</p>
              <button className="explore-btn">Explore Properties</button>
            </div>
          )}
        </div>
      </div>

      <RightSidebar>
        <div className="ad-space">
          <div className="ad-container">
            <span className="ad-label">Advertisement</span>
            <img src="/ads/premium-hosting.jpg" alt="Premium Hosting" />
            <div className="ad-content">
              <h4>List your property</h4>
              <p>Reach millions of travelers</p>
              <button className="ad-cta">Become a Host</button>
            </div>
          </div>
        </div>

        <div className="property-links">
          <h3>📌 Popular Destinations</h3>
          <div className="links-grid">
            <a href="/search?location=paris" className="destination-link">
              <span className="flag">🇫🇷</span>
              <span>Paris</span>
              <span className="count">234 properties</span>
            </a>
            <a href="/search?location=tokyo" className="destination-link">
              <span className="flag">🇯🇵</span>
              <span>Tokyo</span>
              <span className="count">189 properties</span>
            </a>
            <a href="/search?location=nyc" className="destination-link">
              <span className="flag">🇺🇸</span>
              <span>New York</span>
              <span className="count">456 properties</span>
            </a>
            <a href="/search?location=bali" className="destination-link">
              <span className="flag">🇮🇩</span>
              <span>Bali</span>
              <span className="count">167 properties</span>
            </a>
          </div>
        </div>

        <div className="ad-space">
          <div className="ad-container vertical-ad">
            <span className="ad-label">Sponsored</span>
            <img src="/ads/travel-insurance.jpg" alt="Travel Insurance" />
            <div className="ad-content">
              <h4>Travel Insurance</h4>
              <p>Protect your booking</p>
              <button className="ad-cta-small">Learn More</button>
            </div>
          </div>
        </div>

        <div className="quick-links">
          <h3>🔗 Quick Links</h3>
          <ul>
            <li><a href="/properties/luxury">Luxury Rentals</a></li>
            <li><a href="/properties/beachfront">Beachfront</a></li>
            <li><a href="/properties/pet-friendly">Pet Friendly</a></li>
            <li><a href="/properties/family">Family Stays</a></li>
            <li><a href="/properties/business">Business Travel</a></li>
          </ul>
        </div>

        <div className="ad-space">
          <div className="ad-container banner-ad">
            <span className="ad-label">Ad</span>
            <p>🏨 Book your next stay with 20% off</p>
            <button className="ad-cta-small">Get Deal</button>
          </div>
        </div>
      </RightSidebar>
    </div>
  );
}