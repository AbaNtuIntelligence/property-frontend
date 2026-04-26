import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import Navbar from '../../components/layout/Navbar';
import LeftSidebar from '../../components/timeline/LeftSidebar';
import RightSidebar from '../../components/timeline/RightSidebar';
import ImageSlider from '../../components/timeline/ImageSlider';
import './Timeline.css';

const formatZAR = (amount) =>
  new Intl.NumberFormat('en-ZA', {
    style: 'currency',
    currency: 'ZAR',
    minimumFractionDigits: 0,
  }).format(amount);

export default function Timeline() {
  const { user } = useAuth();

  const [posts, setPosts] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('all');

  const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

  /* ---------------- FETCH ---------------- */

  useEffect(() => {
    fetchUsers();
    fetchProperties();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await fetch(`${API_URL}/api/accounts/users/`);
      if (!res.ok) return;
      setUsers(await res.json());
    } catch (err) {
      console.error(err);
    }
  };

  const fetchProperties = async () => {
    try {
      const res = await fetch(`${API_URL}/api/properties/`);
      if (!res.ok) return;

      const data = await res.json();

      const mapped = data.map((p) => ({
        id: p.id,
        title: p.title,
        description: p.description,
        price: p.monthly_rent,
        formattedPrice: formatZAR(p.monthly_rent),
        bedrooms: p.bedrooms || 1,
        bathrooms: p.bathrooms || 1,
        location: p.city,
        images: p.images || [],
        hasImages: (p.images || []).length > 0,
        hasInverter: p.has_inverter || false,
        createdAt: p.created_at,

        owner: {
          name: p.owner_username || 'Owner',
          avatar: p.owner_avatar || null,
        },

        likesCount: Math.floor(Math.random() * 50),
        commentsCount: Math.floor(Math.random() * 10),
        sharesCount: Math.floor(Math.random() * 5),
        isLiked: false,
        isSaved: false,
      }));

      setPosts(mapped);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- HELPERS ---------------- */

  const getAvatar = (u) => {
    if (!u) return `https://ui-avatars.com/api/?name=User`;

    if (u.avatar) {
      return u.avatar.startsWith('http') ? u.avatar : `${API_URL}${u.avatar}`;
    }

    return `https://ui-avatars.com/api/?name=${encodeURIComponent(
      u.name || u.username || 'User'
    )}`;
  };

  /* ---------------- FILTERS ---------------- */

  const filteredPosts = posts.filter((p) => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'under10k') return p.price < 10000;
    if (activeFilter === '10k-20k') return p.price <= 20000;
    if (activeFilter === '20kplus') return p.price > 20000;
    if (activeFilter === 'inverter') return p.hasInverter;
    return true;
  });

  /* ---------------- ACTIONS ---------------- */

  const handleLike = (id) => {
    setPosts((prev) =>
      prev.map((p) =>
        p.id === id
          ? {
              ...p,
              isLiked: !p.isLiked,
              likesCount: p.isLiked ? p.likesCount - 1 : p.likesCount + 1,
            }
          : p
      )
    );
  };

  const handleSave = (id) => {
    setPosts((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, isSaved: !p.isSaved } : p
      )
    );
  };

  const handleShare = (id) => {
    navigator.clipboard.writeText(`${window.location.origin}/property/${id}`);
  };

  /* ---------------- LOADING ---------------- */

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="timeline-loading">
          <div className="spinner" />
          <p>Loading feed...</p>
        </div>
      </>
    );
  }

  /* ---------------- UI ---------------- */

  return (
    <>
      <Navbar />

      {/* APPIC WRAPPER (CENTERS EVERYTHING) */}
      <div className="timeline-shell">

        {/* LEFT SIDEBAR (desktop only via CSS) */}
        <aside className="sidebar left">
          <LeftSidebar user={user} />
        </aside>

        {/* MAIN FEED */}
        <main className="feed">

          {/* CREATE POST (mobile-first top card) */}
          {user?.user_type === 'owner' && (
            <div className="create-card">
              <img src={getAvatar(user)} alt="" />
              <input
                placeholder={`List your property, ${user?.username || 'Owner'}?`}
                readOnly
              />
            </div>
          )}

          {/* FILTERS */}
          <div className="filters">
            {['all', 'under10k', '10k-20k', '20kplus', 'inverter'].map((f) => (
              <button
                key={f}
                className={activeFilter === f ? 'active' : ''}
                onClick={() => setActiveFilter(f)}
              >
                {f}
              </button>
            ))}
          </div>

          {/* FEED */}
          <div className="posts">
            {filteredPosts.map((p) => (
              <article key={p.id} className="post">

                <header className="post-header">
                  <img src={getAvatar(p.owner)} alt="" />
                  <div>
                    <strong>{p.owner.name}</strong>
                    <small>{p.location}</small>
                  </div>
                </header>

                <div className="post-body">
                  <h3>{p.title}</h3>
                  <p>{p.description?.slice(0, 140)}...</p>

                  <div className="price">{p.formattedPrice}/month</div>
                </div>

                {p.hasImages && (
                  <ImageSlider images={p.images} />
                )}

                <footer className="post-actions">
                  <button onClick={() => handleLike(p.id)}>Like</button>
                  <button>Comment</button>
                  <button onClick={() => handleShare(p.id)}>Share</button>
                  <button onClick={() => handleSave(p.id)}>Save</button>
                </footer>

              </article>
            ))}
          </div>
        </main>

        {/* RIGHT SIDEBAR */}
        <aside className="sidebar right">
          <RightSidebar user={user} />
        </aside>

      </div>
    </>
  );
}