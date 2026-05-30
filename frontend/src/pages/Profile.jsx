import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';

const GRADIENT_INFOS = [
  {
    gradient: 'linear-gradient(135deg, #dafb2e 0%, #89a700 100%)', // Neon Yellow-Green (Snazzwear)
    glowColor: 'rgba(218, 251, 46, 0.12)',
    borderColor: 'rgba(218, 251, 46, 0.25)',
    textColor: '#070709'
  },
  {
    gradient: 'linear-gradient(135deg, #A8F046 0%, #3E4B3A 100%)', // Atlantis-Cabbage Pont (SNAZZWEAR)
    glowColor: 'rgba(168, 240, 70, 0.12)',
    borderColor: 'rgba(168, 240, 70, 0.25)',
    textColor: '#ffffff'
  },
  {
    gradient: 'linear-gradient(135deg, #00c6ff 0%, #0072ff 100%)', // Electric Blue
    glowColor: 'rgba(0, 114, 255, 0.12)',
    borderColor: 'rgba(0, 114, 255, 0.25)',
    textColor: '#ffffff'
  },
  {
    gradient: 'linear-gradient(135deg, #b336ff 0%, #dd36ff 100%)', // Cyber Purple
    glowColor: 'rgba(221, 54, 255, 0.12)',
    borderColor: 'rgba(221, 54, 255, 0.25)',
    textColor: '#ffffff'
  },
  {
    gradient: 'linear-gradient(135deg, #111115 0%, #2a2b36 100%)', // Stealth Dark
    glowColor: 'rgba(255, 255, 255, 0.05)',
    borderColor: 'rgba(255, 255, 255, 0.12)',
    textColor: '#ffffff'
  }
];

const GRADIENTS = GRADIENT_INFOS.map(g => g.gradient);

export default function Profile() {
  const { user, logout, isAuthenticated } = useAuth();
  const { cart, wishlist, clearCartState } = useCart();
  const [isFlipped, setIsFlipped] = useState(false);
  const navigate = useNavigate();

  // Active dashboard tab state ('orders' | 'address' | 'wallet' | 'loyalty' | 'edit')
  const [activeTab, setActiveTab] = useState('orders');

  // Helper to format username
  const formatUsername = (name) => {
    if (!name) return 'User';
    if (name.startsWith('+') && name.length > 10) {
      return `${name.slice(0, 3)} ${name.slice(3, 8)} ${name.slice(8)}`;
    }
    return name;
  };

  // Profile fields state
  const [displayName, setDisplayName] = useState('');
  const [avatarColor, setAvatarColor] = useState(GRADIENTS[0]);
  const [saveStatus, setSaveStatus] = useState('');
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Orders state matching screenshot details exactly
  const [orders] = useState([
    {
      id: '1536436_V2',
      date: 'APR 28, 2025',
      productName: 'BLACK EVERYDAY JOGGERS - XS',
      price: 'RS. 1,199',
      details: 'XS QTY: 1',
      total: 'RS. 1,289',
      paymentStatus: 'PENDING',
      deliveryStatus: 'SHIPPED',
      address: 'UNI MALL APARTMENT 41C LOVELY PROFESSIONAL UNIVERSITY (LPU) JALANDHAR-DELHI G.T. ROAD, PHAGWARA, PUNJAB, PAGWARA, PHAGWARA - 144411 KAPURTHALA, PB 144411 PH: 8010792412',
      image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=150&q=80'
    },
    {
      id: '1536263_V2',
      date: 'APR 25, 2025',
      productName: 'OVERSIZED NEON GRAPHIC TEE - M',
      price: 'RS. 999',
      details: 'M QTY: 1',
      total: 'RS. 1,089',
      paymentStatus: 'PAID',
      deliveryStatus: 'DELIVERED',
      address: 'UNI MALL APARTMENT 41C LOVELY PROFESSIONAL UNIVERSITY (LPU) JALANDHAR-DELHI G.T. ROAD, PHAGWARA, PUNJAB, PAGWARA, PHAGWARA - 144411 KAPURTHALA, PB 144411 PH: 8010792412',
      image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=150&q=80'
    }
  ]);

  // Address list state
  const [addresses, setAddresses] = useState([
    {
      id: 1,
      tag: 'Home',
      details: '42, Cyber Link Road, Phase 2, Indiranagar, Bengaluru, Karnataka, 560038'
    },
    {
      id: 2,
      tag: 'Office',
      details: 'Level 5, Tech Park West, Whitefield, Bengaluru, Karnataka, 560066'
    }
  ]);

  // Wallet state
  const [walletBalance] = useState('RS. 1,250');
  const [transactions] = useState([
    { id: 'T-102', type: 'Refund', desc: 'Refund for Order #SZ-89712', amount: 'RS. 999', date: 'May 12, 2026' },
    { id: 'T-101', type: 'Bonus', desc: 'Loyalty Points Conversion Credit', amount: 'RS. 251', date: 'April 20, 2026' }
  ]);

  // Loyalty rewards state
  const [loyaltyPoints] = useState(450);
  const [activeCoupons] = useState(['SNAZZ10', 'LOYALTY50']);

  // New Address form state
  const [addressTag, setAddressTag] = useState('Home');
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [stateName, setStateName] = useState('');
  const [zip, setZip] = useState('');
  const [country, setCountry] = useState('India');
  const [addressSuccess, setAddressSuccess] = useState('');

  // Prefill display name from authenticated user details once loaded
  useEffect(() => {
    if (user) {
      setDisplayName(formatUsername(user.username));
    }
  }, [user]);

  // If not authenticated, redirect to home page and request opening the auth modal
  useEffect(() => {
    if (!isAuthenticated && !isLoggingOut) {
      navigate('/', { state: { openAuth: true }, replace: true });
    }
  }, [isAuthenticated, isLoggingOut, navigate]);

  if (!user) return null;

  const handleLogout = async () => {
    setIsLoggingOut(true);
    await logout();
    clearCartState();
    navigate('/');
  };

  // Get initials or avatar letters based on display name
  const getInitials = () => {
    if (!displayName) return 'U';
    if (displayName.startsWith('+')) {
      return '⚡';
    }
    return displayName.charAt(0).toUpperCase();
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    setSaveStatus('Saving changes...');
    setTimeout(() => {
      setSaveStatus('Profile updated successfully!');
      setTimeout(() => setSaveStatus(''), 3000);
    }, 800);
  };

  const handleAddAddress = (e) => {
    e.preventDefault();
    const fullAddress = `${street}, ${city}, ${stateName}, ${zip}, ${country}`;
    const newAddr = {
      id: Date.now(),
      tag: addressTag,
      details: fullAddress
    };

    setAddresses([...addresses, newAddr]);
    setStreet(''); setCity(''); setStateName(''); setZip(''); setCountry('India'); setAddressTag('Home');
    setAddressSuccess('Address added successfully!');
    setTimeout(() => setAddressSuccess(''), 3000);
  };

  const handleDeleteAddress = (id) => {
    setAddresses(addresses.filter(addr => addr.id !== id));
  };

  // Retrieve matching glow details for selected gradient
  const currentGradientInfo = GRADIENT_INFOS.find(g => g.gradient === avatarColor) || GRADIENT_INFOS[0];

  return (
    <div className="profile-page-wrapper">
      <div className="account-dashboard-box">
        {/* LEFT SIDEBAR NAVIGATION */}
        <div className="account-sidebar">
          <button
            className={`account-sidebar-btn ${activeTab === 'orders' ? 'active' : ''}`}
            onClick={() => setActiveTab('orders')}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
              <polyline points="14 2 14 8 20 8"/>
              <line x1="16" y1="13" x2="8" y2="13"/>
              <line x1="16" y1="17" x2="8" y2="17"/>
              <polyline points="10 9 9 9 8 9"/>
            </svg>
            Order history
          </button>

          <button
            className={`account-sidebar-btn ${activeTab === 'address' ? 'active' : ''}`}
            onClick={() => setActiveTab('address')}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
              <circle cx="12" cy="10" r="3"/>
            </svg>
            Shipping Address
          </button>

          <button
            className={`account-sidebar-btn ${activeTab === 'wallet' ? 'active' : ''}`}
            onClick={() => setActiveTab('wallet')}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="4" width="20" height="16" rx="2" ry="2"/>
              <line x1="12" y1="4" x2="12" y2="20"/>
              <line x1="2" y1="12" x2="22" y2="12"/>
            </svg>
            Wallet Details
          </button>

          <button
            className={`account-sidebar-btn ${activeTab === 'loyalty' ? 'active' : ''}`}
            onClick={() => setActiveTab('loyalty')}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 12 20 22 4 22 4 12"/>
              <rect x="2" y="7" width="20" height="5"/>
              <line x1="12" y1="22" x2="12" y2="7"/>
              <path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"/>
              <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"/>
            </svg>
            Loyalty Rewards
          </button>

          <button
            className={`account-sidebar-btn ${activeTab === 'edit' ? 'active' : ''}`}
            onClick={() => setActiveTab('edit')}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
              <circle cx="12" cy="7" r="4"/>
            </svg>
            Account details
          </button>

          <button
            className="account-sidebar-btn"
            style={{ marginTop: 'auto' }}
            onClick={handleLogout}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
              <polyline points="16 17 21 12 16 7"/>
              <line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
            Log out
          </button>
        </div>

        {/* RIGHT DETAILS PANEL */}
        <div className="account-content-pane">
          {/* TAB 1: ORDER HISTORY */}
          {activeTab === 'orders' && (
            <div>
              {orders.length === 0 ? (
                <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>You haven't placed any orders yet.</p>
              ) : (
                orders.map((order) => (
                  <div className="account-order-card" key={order.id}>
                    <div className="account-order-header">
                      <span className="account-order-id">ORDER ID: {order.id}</span>
                      <span className="account-order-date">{order.date}</span>
                    </div>

                    <div className="account-order-item-row">
                      <img className="account-order-item-img" src={order.image} alt={order.productName} />
                      <div className="account-order-item-info">
                        <span className="account-order-item-name">{order.productName}</span>
                        <span className="account-order-item-price">{order.price}</span>
                        <span className="account-order-item-details">{order.details}</span>
                      </div>
                      <div className="account-order-total-block">
                        <span className="account-order-total">TOTAL: {order.total}</span>
                        <span className="account-order-tax-notice">(MRP INCLUSIVE OF ALL TAXES)</span>
                      </div>
                    </div>

                    <div className="account-order-footer-row">
                      <div className="account-order-footer-details">
                        <span>
                          PAYMENT STATUS: <span style={{ color: order.paymentStatus === 'PAID' ? '#4ade80' : '#ffb800' }}>{order.paymentStatus}</span>
                        </span>
                        <span style={{ display: 'flex', alignItems: 'center' }}>
                          DELIVERY STATUS: <span style={{ textTransform: 'uppercase', marginRight: '6px' }}>{order.deliveryStatus}</span>
                          <span style={{ 
                            display: 'inline-flex', 
                            alignItems: 'center', 
                            justifyContent: 'center',
                            background: '#4ade80', 
                            color: '#000000', 
                            borderRadius: '4px', 
                            width: '18px', 
                            height: '18px', 
                            fontSize: '11px', 
                            fontWeight: '900'
                          }}>✓</span>
                        </span>
                        <span style={{ lineHeight: '1.4' }}>
                          DELIVERY ADDRESS : <span className="address-text">{order.address}</span>
                        </span>
                      </div>
                      <div className="account-order-footer-actions">
                        <button className="account-order-btn" type="button">RETURN / EXCHANGE</button>
                        <button className="account-order-btn" type="button">TRACK ORDER</button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* TAB 2: SHIPPING ADDRESSES */}
          {activeTab === 'address' && (
            <div>
              <h3 style={{ fontSize: '20px', fontWeight: '800', marginBottom: '25px', fontFamily: 'var(--font-heading)', color: 'var(--text-primary)' }}>Shipping Addresses</h3>

              {addressSuccess && (
                <div style={{ color: 'var(--accent)', fontSize: '14px', fontWeight: '700', marginBottom: '15px', padding: '10px 14px', borderRadius: '8px', background: 'rgba(168, 240, 70, 0.05)', border: '1px solid rgba(168, 240, 70, 0.15)' }}>
                  {addressSuccess}
                </div>
              )}

              <div style={{ marginBottom: '25px' }}>
                {addresses.map((addr) => (
                  <div className="address-item-box" key={addr.id} style={{ transition: 'all 0.3s ease' }}>
                    <span className="address-item-tag">{addr.tag}</span>
                    <div className="address-item-details">{addr.details}</div>
                    <div className="address-item-actions">
                      <button type="button" className="address-action-link-btn" onClick={() => handleDeleteAddress(addr.id)}>Remove</button>
                    </div>
                  </div>
                ))}
              </div>

              <hr style={{ borderColor: 'var(--border-color)', margin: '25px 0' }} />
              <h4 style={{ fontSize: '15px', fontWeight: '800', marginBottom: '15px', color: 'var(--text-primary)', fontFamily: 'var(--font-heading)' }}>Add New Address</h4>
              <form onSubmit={handleAddAddress} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <select className="input-box" value={addressTag} onChange={(e) => setAddressTag(e.target.value)}>
                    <option value="Home">Home</option><option value="Office">Office</option><option value="Other">Other</option>
                </select>
                <input type="text" required className="input-box" placeholder="Street Address" value={street} onChange={(e) => setStreet(e.target.value)} />
                <div style={{ display: 'flex', gap: '15px' }}>
                    <input type="text" required className="input-box" placeholder="City" value={city} onChange={(e) => setCity(e.target.value)} />
                    <input type="text" required className="input-box" placeholder="State" value={stateName} onChange={(e) => setStateName(e.target.value)} />
                </div>
                <div style={{ display: 'flex', gap: '15px' }}>
                    <input type="text" required className="input-box" placeholder="ZIP Code" value={zip} onChange={(e) => setZip(e.target.value)} />
                    <input type="text" required className="input-box" placeholder="Country" value={country} onChange={(e) => setCountry(e.target.value)} />
                </div>
                <button type="submit" className="profile-action-btn accent" style={{ background: 'var(--accent)', color: '#000000', borderRadius: '4px', fontWeight: '700' }}>Save Address</button>
              </form>
            </div>
          )}

          {/* TAB 3: WALLET DETAILS */}
          {activeTab === 'wallet' && (
            <div>
              <h3 style={{ fontSize: '20px', fontWeight: '800', marginBottom: '25px', fontFamily: 'var(--font-heading)', color: 'var(--text-primary)' }}>Wallet Details</h3>
              <div className="wallet-balance-card">
                <div>
                  <span style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: '700', display: 'block', textTransform: 'uppercase', marginBottom: '8px' }}>
                    Snazz Cash Wallet Balance
                  </span>
                  <span className="wallet-val">{walletBalance}</span>
                </div>
                <button className="account-order-btn" style={{ padding: '12px 24px', borderRadius: '4px', width: 'auto' }} onClick={() => alert('Gift card features are currently mocked.')}>Redeem Gift Card</button>
              </div>

              <h4 style={{ fontSize: '15px', fontWeight: '800', marginBottom: '15px', color: 'var(--text-primary)', fontFamily: 'var(--font-heading)' }}>Recent Wallet Transactions</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                {transactions.map((tx) => (
                  <div key={tx.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-secondary)', padding: '16px 20px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                    <div>
                      <span style={{ fontSize: '14px', fontWeight: '700', display: 'block', color: 'var(--text-primary)' }}>{tx.desc}</span>
                      <small style={{ color: 'var(--text-muted)' }}>{tx.date} | ID: {tx.id}</small>
                    </div>
                    <span style={{ color: tx.type === 'Refund' ? '#00b894' : 'var(--text-primary)', fontWeight: '800', fontSize: '15px' }}>+{tx.amount}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: LOYALTY REWARDS */}
          {activeTab === 'loyalty' && (
            <div>
              <h3 style={{ fontSize: '20px', fontWeight: '800', marginBottom: '25px', fontFamily: 'var(--font-heading)', color: 'var(--text-primary)' }}>Loyalty Rewards</h3>
              <div className="loyalty-points-card">
                <div>
                  <span style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: '700', display: 'block', textTransform: 'uppercase', marginBottom: '8px' }}>
                    Current Loyalty Points Balance
                  </span>
                  <span className="points-value">{loyaltyPoints} PTS</span>
                </div>
              </div>

              <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', padding: '20px', borderRadius: '16px', marginBottom: '30px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', fontWeight: '700', marginBottom: '10px', color: 'var(--text-secondary)' }}>
                  <span>Progress to Next Reward (500 pts)</span>
                  <span style={{ color: 'var(--text-primary)' }}>90% Completed</span>
                </div>
                <div style={{ width: '100%', height: '8px', background: 'var(--bg-tertiary)', borderRadius: '10px', overflow: 'hidden' }}>
                  <div style={{ width: '90%', height: '100%', background: 'var(--accent)', borderRadius: '10px' }} />
                </div>
              </div>

              <h4 style={{ fontSize: '15px', fontWeight: '800', marginBottom: '15px', color: 'var(--text-primary)', fontFamily: 'var(--font-heading)' }}>Active Promo Coupons</h4>
              <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
                {activeCoupons.map((code) => (
                  <div key={code} style={{ border: '1px dashed var(--border-color)', background: 'var(--bg-tertiary)', padding: '12px 20px', borderRadius: '10px', display: 'inline-flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontFamily: 'monospace', fontWeight: '800', color: 'var(--accent)', fontSize: '15px' }}>{code}</span>
                    <button 
                      style={{ background: 'var(--accent)', border: 'none', color: '#000000', fontSize: '10px', fontWeight: '800', padding: '3px 8px', borderRadius: '4px', cursor: 'pointer' }}
                      onClick={() => { navigator.clipboard.writeText(code); alert('Coupon copied!'); }}
                    >
                      COPY
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: ACCOUNT DETAILS */}
          {activeTab === 'edit' && (
            <div>
              <h3 style={{ fontSize: '20px', fontWeight: '800', marginBottom: '25px', fontFamily: 'var(--font-heading)', color: 'var(--text-primary)' }}>Account details</h3>
              
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px 0' }}>
                <div className="profile-card-container" onClick={() => setIsFlipped(!isFlipped)} style={{ width: '320px', height: '460px' }}>
                  <div className={`profile-card-inner ${isFlipped ? 'is-flipped' : ''}`}>
                    <div className="profile-card-front" style={{ borderColor: currentGradientInfo.borderColor, boxShadow: `0 20px 50px rgba(0, 0, 0, 0.75), 0 0 35px ${currentGradientInfo.glowColor}` }}>
                      <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 2, position: 'relative' }}>
                        <div className="profile-avatar-circle" style={{ background: avatarColor, color: currentGradientInfo.textColor, width: '90px', height: '90px', fontSize: '32px' }}>{getInitials()}</div>
                        <h2 className="profile-username" style={{ fontSize: '20px' }}>{displayName}</h2>
                        <p className="profile-email" style={{ fontSize: '13px' }}>{user.email}</p>
                      </div>
                    </div>
                    <div className="profile-card-back" style={{ borderColor: 'rgba(255, 255, 255, 0.08)' }}>
                       <h3 style={{ fontSize: '18px' }}>My Dashboard</h3>
                       <button type="button" onClick={() => setIsFlipped(false)}>Flip back</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
