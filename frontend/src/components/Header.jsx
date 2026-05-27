import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';

export default function Header({ onOpenAuth }) {
  const { isAuthenticated, logout } = useAuth();
  const { cart, setCartDrawerOpen } = useCart();
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?q=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate('/shop');
    }
  };

  return (
    <>
      {/* TOP STRIP / ANNOUNCEMENT BAR */}
      <div className="announcement-bar">
        <div className="marquee">
          <div className="marquee-content">
            <span>★ [LOOP] ASTRO + MOON FINAL DROP. NOT MANY SERIAL NUMBERS LEFT! ★</span>
            <span>★ [LOOP] ASTRO + MOON FINAL DROP. NOT MANY SERIAL NUMBERS LEFT! ★</span>
            <span>★ [LOOP] ASTRO + MOON FINAL DROP. NOT MANY SERIAL NUMBERS LEFT! ★</span>
            <span>★ [LOOP] ASTRO + MOON FINAL DROP. NOT MANY SERIAL NUMBERS LEFT! ★</span>
          </div>
        </div>
      </div>

      {/* HEADER */}
      <header className="main-header">
        <div className="header-top">
          <Link to="/" className="brand">SNAZZ WEAR®</Link>

          <form onSubmit={handleSearchSubmit} style={{ display: 'flex', flex: 1, maxWidth: '400px' }}>
            <input
              type="text"
              placeholder="SEARCH FOR PRODUCTS"
              className="search-bar"
              style={{ width: '100%' }}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </form>

          <div className="icons">
            {isAuthenticated ? (
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  logout();
                }}
                title="Logout"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                  <polyline points="16 17 21 12 16 7" />
                  <line x1="21" y1="12" x2="9" y2="12" />
                </svg>
              </a>
            ) : (
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  onOpenAuth();
                }}
                title="Login / Signup"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </a>
            )}

            <Link to="/wishlist" title="Wishlist">
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
              </svg>
            </Link>

            <Link to="/shop" title="Shop">
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7" />
                <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
                <path d="M15 22v-4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4" />
                <path d="M2 7h20" />
                <path d="M22 7v3a2 2 0 0 1-2 2v0a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 16 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 12 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 8 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 4 12v0a2 2 0 0 1-2-2V7" />
              </svg>
            </Link>

            <div className="cart-icon-wrapper" onClick={() => setCartDrawerOpen(true)} title="Cart">
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
                <path d="M3 6h18" />
                <path d="M16 10a4 4 0 0 1-8 0" />
              </svg>
              <span className="cart-badge">{cart?.cart_count || 0}</span>
            </div>
          </div>
        </div>

        <div className="header-bottom">
          <Link to="/shop">ALL PRODUCTS</Link>
          <Link to="/shop">CLEARANCE</Link>
          <Link to="/shop">CLOTHING</Link>
          <Link to="/shop">ACCESSORIES</Link>
          <Link to="/">ABOUT US</Link>
        </div>
      </header>
    </>
  );
}
