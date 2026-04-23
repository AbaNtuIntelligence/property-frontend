import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import Navbar from '../../components/layout/Navbar';
import TimelinePost from '../../components/timeline/TimelinePost';
import CreatePost from '../../components/timeline/CreatePost';
import StoryCircle from '../../components/timeline/StoryCircle';
import LeftSidebar from '../../components/timeline/LeftSidebar';
import RightSidebar from '../../components/timeline/RightSidebar';
import { mockStories } from '../../data/mockTimelineData';
import './Timeline.css';

export default function Timeline() {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

  useEffect(() => {
    fetchProperties();
    setStories(mockStories);
  }, []);

  const fetchProperties = async () => {
    try {
      const response = await fetch(`${API_URL}/api/properties/`);
      if (response.ok) {
        const properties = await response.json();
        
        // Convert properties to social media posts
        const propertyPosts = properties.map(property => ({
          id: `prop_${property.id}`,
          type: 'property',
          title: property.title,
          description: property.description,
          price: property.monthly_rent,
          bedrooms: property.bedrooms,
          bathrooms: property.bathrooms,
          squareFeet: property.square_feet,
          location: `${property.city}, ${property.state || ''}`,
          address: property.address,
          images: property.images?.length > 0 ? property.images : [],
          amenities: property.amenities || [],
          petFriendly: property.pet_friendly,
          furnished: property.furnished,
          parking: property.parking,
          owner: {
            id: property.owner,
            name: property.owner_username || 'Property Owner',
            avatar: '/default-avatar.jpg'
          },
          createdAt: property.created_at,
          likesCount: Math.floor(Math.random() * 100),
          commentsCount: Math.floor(Math.random() * 20),
          sharesCount: Math.floor(Math.random() * 10),
          isLiked: false,
          isSaved: false,
          comments: []
        }));
        
        setPosts(propertyPosts);
      }
    } catch (error) {
      console.error('Error fetching properties:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = (postId) => {
    setPosts(prev => prev.map(post => 
      post.id === postId 
        ? { ...post, isLiked: !post.isLiked, likesCount: post.isLiked ? post.likesCount - 1 : post.likesCount + 1 }
        : post
    ));
  };

  const handleComment = (postId, comment) => {
    if (!comment.trim()) return;
    
    const newComment = {
      id: Date.now(),
      user: {
        name: user?.username || 'Current User',
        avatar: '/default-avatar.jpg'
      },
      text: comment,
      timestamp: new Date().toISOString()
    };

    setPosts(prev => prev.map(post => 
      post.id === postId 
        ? { 
            ...post, 
            comments: [newComment, ...(post.comments || [])], 
            commentsCount: (post.commentsCount || 0) + 1 
          }
        : post
    ));
  };

  const handleShare = (postId) => {
    navigator.clipboard.writeText(`${window.location.origin}/property/${postId}`);
    alert('Link copied to clipboard!');
    
    setPosts(prev => prev.map(post => 
      post.id === postId 
        ? { ...post, sharesCount: post.sharesCount + 1 }
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

  const handleNewPost = (newPost) => {
    setPosts(prev => [newPost, ...prev]);
    fetchProperties();
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="timeline-loading">
          <div className="loading-spinner"></div>
          <p>Loading your timeline...</p>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="timeline-layout">
        {/* Left Sidebar */}
        <div className="left-sidebar">
          <LeftSidebar user={user} />
        </div>

        {/* Main Timeline Feed */}
        <div className="timeline-container">
          {/* Stories Section */}
          <div className="stories-section">
            <div className="stories-wrapper">
              <StoryCircle 
                user={user} 
                isCreate={true}
                onCreateClick={() => alert('Create story feature coming soon!')}
              />
              {stories.map(story => (
                <StoryCircle 
                  key={story.id} 
                  user={story.user} 
                  hasStory={true}
                  onClick={() => alert('Story viewer coming soon!')}
                />
              ))}
            </div>
          </div>

          {/* Create Post */}
          <CreatePost onPostCreated={handleNewPost} user={user} />

          {/* Posts Feed */}
          <div className="posts-feed">
            {posts.length === 0 ? (
              <div className="no-posts">
                <p>No properties found. Check back later!</p>
                {user?.user_type === 'owner' && (
                  <button onClick={() => window.location.href = '/property/new'}>
                    List Your First Property
                  </button>
                )}
              </div>
            ) : (
              posts.map((post) => (
                <TimelinePost 
                  key={post.id}
                  post={post}
                  onLike={() => handleLike(post.id)}
                  onComment={(comment) => handleComment(post.id, comment)}
                  onShare={() => handleShare(post.id)}
                  onSave={() => handleSave(post.id)}
                  currentUser={user}
                />
              ))
            )}
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="right-sidebar">
          <RightSidebar user={user} />
        </div>
      </div>
    </>
  );
}