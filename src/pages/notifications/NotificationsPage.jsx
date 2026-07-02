import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import './NotificationsPage.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

export default function NotificationsPage() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { state: { returnTo: '/notifications' } });
      return;
    }
    fetchNotifications();
  }, [isAuthenticated]);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('access_token');
      
      if (!token) {
        setError('Please login to view notifications');
        setLoading(false);
        return;
      }

      // For now, let's use mock data since the backend endpoint might not exist yet
      const mockNotifications = [
        {
          id: 1,
          type: 'like',
          message: 'John Doe liked your property "Luxury Beachfront Villa"',
          timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
          read: false,
          propertyId: 1,  // Make sure these IDs exist in your database
          userId: 101,
          userAvatar: 'https://ui-avatars.com/api/?name=John+Doe&background=ff385c&color=fff'
        },
        {
          id: 2,
          type: 'comment',
          message: 'Jane Smith commented on your property "Cozy Mountain Cabin"',
          timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
          read: false,
          propertyId: 2,
          userId: 102,
          userAvatar: 'https://ui-avatars.com/api/?name=Jane+Smith&background=1877f2&color=fff'
        },
        {
          id: 3,
          type: 'save',
          message: 'Mike Johnson saved your property "Modern Downtown Loft"',
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
          read: true,
          propertyId: 3,
          userId: 103,
          userAvatar: 'https://ui-avatars.com/api/?name=Mike+Johnson&background=22c55e&color=fff'
        },
        {
          id: 4,
          type: 'share',
          message: 'Sarah Williams shared your property "Beachfront Apartment"',
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
          read: true,
          propertyId: 4,
          userId: 104,
          userAvatar: 'https://ui-avatars.com/api/?name=Sarah+Williams&background=f59e0b&color=fff'
        },
        {
          id: 5,
          type: 'new_property',
          message: 'New property listed: "Luxury Penthouse in Cape Town" by Thando Ndlovu',
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
          read: true,
          propertyId: 5,
          userId: 105,
          userAvatar: 'https://ui-avatars.com/api/?name=Thando+Ndlovu&background=8b5cf6&color=fff'
        }
      ];

      setNotifications(mockNotifications);
    } catch (err) {
      console.error('Error fetching notifications:', err);
      setError('Unable to load notifications');
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      setNotifications(prev => 
        prev.map(n => 
          n.id === notificationId ? { ...n, read: true } : n
        )
      );
    } catch (err) {
      console.error('Error marking notification as read:', err);
    }
  };

  const markAllAsRead = async () => {
    try {
      setNotifications(prev => 
        prev.map(n => ({ ...n, read: true }))
      );
    } catch (err) {
      console.error('Error marking all as read:', err);
    }
  };

  const deleteNotification = async (notificationId) => {
    try {
      setNotifications(prev => 
        prev.filter(n => n.id !== notificationId)
      );
    } catch (err) {
      console.error('Error deleting notification:', err);
    }
  };

  const getNotificationIcon = (type) => {
    const icons = {
      like: '❤️',
      comment: '💬',
      save: '⭐',
      share: '↗️',
      new_property: '🏠'
    };
    return icons[type] || '📢';
  };

  const getNotificationColor = (type) => {
    const colors = {
      like: '#ff385c',
      comment: '#1877f2',
      save: '#f59e0b',
      share: '#22c55e',
      new_property: '#8b5cf6'
    };
    return colors[type] || '#6b7280';
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;
    
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString('en-ZA', { month: 'short', day: 'numeric' });
  };

  const handleNotificationClick = (notification) => {
    markAsRead(notification.id);
    
    // Check if propertyId exists
    if (notification.propertyId) {
      // Navigate to property detail page
      navigate(`/property/${notification.propertyId}`);
    } else {
      // If no propertyId, show a message or navigate to timeline
      console.log('No property associated with this notification');
      // Optionally navigate to timeline
      // navigate('/timeline');
    }
  };

  const filteredNotifications = notifications.filter(n => {
    if (activeFilter === 'unread') return !n.read;
    if (activeFilter === 'read') return n.read;
    return true;
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  if (loading) {
    return (
      <div className="notifications-loading">
        <div className="loading-spinner"></div>
        <p>Loading notifications...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="notifications-error">
        <p>{error}</p>
        <button onClick={fetchNotifications} className="retry-btn">Retry</button>
      </div>
    );
  }

  return (
    <div className="notifications-page">
      <div className="notifications-header">
        <div className="header-left">
          <h1>Notifications</h1>
          {unreadCount > 0 && (
            <span className="unread-badge">{unreadCount} unread</span>
          )}
        </div>
        <div className="header-right">
          <button 
            className="mark-all-btn" 
            onClick={markAllAsRead}
            disabled={unreadCount === 0}
          >
            Mark all as read
          </button>
        </div>
      </div>

      <div className="notifications-filters">
        <button 
          className={`filter-btn ${activeFilter === 'all' ? 'active' : ''}`}
          onClick={() => setActiveFilter('all')}
        >
          All
        </button>
        <button 
          className={`filter-btn ${activeFilter === 'unread' ? 'active' : ''}`}
          onClick={() => setActiveFilter('unread')}
        >
          Unread
        </button>
        <button 
          className={`filter-btn ${activeFilter === 'read' ? 'active' : ''}`}
          onClick={() => setActiveFilter('read')}
        >
          Read
        </button>
      </div>

      {filteredNotifications.length === 0 ? (
        <div className="empty-notifications">
          <div className="empty-icon">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.73 21a2 2 0 01-3.46 0" />
            </svg>
          </div>
          <h3>No notifications</h3>
          <p>You're all caught up!</p>
        </div>
      ) : (
        <div className="notifications-list">
          {filteredNotifications.map((notification) => (
            <div 
              key={notification.id} 
              className={`notification-item ${!notification.read ? 'unread' : ''}`}
              onClick={() => handleNotificationClick(notification)}
            >
              <div className="notification-avatar">
                <img src={notification.userAvatar} alt="User avatar" />
                <span className="notification-icon" style={{ background: getNotificationColor(notification.type) }}>
                  {getNotificationIcon(notification.type)}
                </span>
              </div>
              <div className="notification-content">
                <div className="notification-message">
                  {notification.message}
                </div>
                <div className="notification-meta">
                  <span className="notification-time">{formatTime(notification.timestamp)}</span>
                  {!notification.read && (
                    <span className="notification-dot">●</span>
                  )}
                </div>
              </div>
              <button 
                className="notification-delete"
                onClick={(e) => {
                  e.stopPropagation();
                  deleteNotification(notification.id);
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const handleNotificationClick = (notification) => {
  markAsRead(notification.id);
  
  if (notification.propertyId) {
    // First check if property exists by trying to fetch it
    const token = localStorage.getItem('access_token');
    fetch(`${API_URL}/api/properties/${notification.propertyId}/`)
      .then(res => {
        if (res.ok) {
          navigate(`/property/${notification.propertyId}`);
        } else {
          // Property doesn't exist, show message
          alert('This property may have been removed or is no longer available.');
          // Optionally remove the notification
          deleteNotification(notification.id);
        }
      })
      .catch(() => {
        alert('Unable to load property details.');
      });
  } else {
    navigate('/timeline');
  }
};