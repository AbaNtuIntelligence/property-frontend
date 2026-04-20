import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import TimelinePost from '../../components/timeline/TimelinePost';
import CreatePost from '../../components/timeline/CreatePost';
import StoryCircle from '../../components/timeline/StoryCircle';
import { mockPosts, mockStories } from '../../data/mockTimelineData';
import './Timeline.css';

export default function Timeline() {
  const { user } = useAuth(); // This will now work with AuthProvider
  const [posts, setPosts] = useState([]);
  const [stories, setStories] = useState([]);

  useEffect(() => {
    setPosts(mockPosts);
    setStories(mockStories);
  }, []);

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
        name: user?.name || user?.username || 'Current User',
        avatar: user?.avatar || '/default-avatar.jpg'
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
  };

  return (
    <div className="timeline-container">
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

      <CreatePost onPostCreated={handleNewPost} user={user} />

      <div className="posts-feed">
        {posts.map((post) => (
          <TimelinePost 
            key={post.id}
            post={post}
            onLike={() => handleLike(post.id)}
            onComment={(comment) => handleComment(post.id, comment)}
            onShare={() => handleShare(post.id)}
            onSave={() => handleSave(post.id)}
            currentUser={user}
          />
        ))}
      </div>
    </div>
  );
}