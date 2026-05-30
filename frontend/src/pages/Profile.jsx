import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import { 
  FileText, 
  MapPin, 
  Wallet, 
  Gift, 
  User, 
  LogOut, 
  Package, 
  CheckCircle2, 
  Clock, 
  RefreshCw, 
  Navigation, 
  Copy, 
  Plus,
  Trash2,
  Calendar,
  Sparkles
} from 'lucide-react';

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
  const { clearCartState } = useCart();
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
            <FileText size={16} />
            Order history
          </button>

          <button
            className={`account-sidebar-btn ${activeTab === 'address' ? 'active' : ''}`}
            onClick={() => setActiveTab('address')}
          >
            <MapPin size={16} />
            Shipping Address
          </button>

          <button
            className={`account-sidebar-btn ${activeTab === 'wallet' ? 'active' : ''}`}
            onClick={() => setActiveTab('wallet')}
          >
            <Wallet size={16} />
            Wallet Details
          </button>

          <button
            className={`account-sidebar-btn ${activeTab === 'loyalty' ? 'active' : ''}`}
            onClick={() => setActiveTab('loyalty')}
          >
            <Gift size={16} />
            Loyalty Rewards
          </button>

          <button
            className={`account-sidebar-btn ${activeTab === 'edit' ? 'active' : ''}`}
            onClick={() => setActiveTab('edit')}
          >
            <User size={16} />
            Account details
          </button>

          <button
            className="account-sidebar-btn account-sidebar-btn-logout"
            onClick={handleLogout}
          >
            <LogOut size={16} />
            Log out
          </button>
        </div>

        {/* RIGHT DETAILS PANEL */}
        <div className="account-content-pane">
          {/* TAB 1: ORDER HISTORY */}
          {activeTab === 'orders' && (
            <div className="order-history-tab">
              <h2 className="pane-title">Order History</h2>
              {orders.length === 0 ? (
                <div className="empty-state">
                  <Package size={48} className="empty-icon" />
                  <p>You haven't placed any orders yet.</p>
                </div>
              ) : (
                orders.map((order) => (
                  <div className="account-order-card" key={order.id}>
                    
                    {/* ORDER HEADER */}
                    <div className="account-order-header">
                      <div className="order-header-left">
                        <Package size={16} className="text-accent" />
                        <span className="account-order-id">ORDER ID: {order.id}</span>
                      </div>
                      <div className="order-header-right">
                        <Calendar size={14} />
                        <span className="account-order-date">{order.date}</span>
                      </div>
                    </div>

                    {/* PRODUCT ROW */}
                    <div className="account-order-item-row">
                      <div className="item-img-wrapper">
                        <img className="account-order-item-img" src={order.image} alt={order.productName} />
                      </div>
                      <div className="account-order-item-info">
                        <span className="account-order-item-name">{order.productName}</span>
                        <div className="item-meta-badges">
                          <span className="item-meta-badge">{order.details}</span>
                          <span className="account-order-item-price">{order.price}</span>
                        </div>
                      </div>
                      <div className="account-order-total-block">
                        <span className="total-label">ORDER TOTAL</span>
                        <span className="account-order-total">{order.total}</span>
                        <span className="account-order-tax-notice">INCL. ALL TAXES</span>
                      </div>
                    </div>

                    {/* STATUS PILLS & ADDRESS & ACTIONS */}
                    <div className="account-order-footer-row">
                      <div className="footer-details-col">
                        
                        {/* Glowing cyber statuses */}
                        <div className="account-order-status-row">
                          <div className="status-badge-container">
                            <span className="status-label">PAYMENT:</span>
                            <span className={`status-badge badge-${order.paymentStatus.toLowerCase()}`}>
                              {order.paymentStatus === 'PAID' ? <CheckCircle2 size={12} /> : <Clock size={12} />}
                              {order.paymentStatus}
                            </span>
                          </div>
                          <div className="status-badge-container">
                            <span className="status-label">DELIVERY:</span>
                            <span className={`status-badge badge-${order.deliveryStatus.toLowerCase()}`}>
                              <CheckCircle2 size={12} />
                              {order.deliveryStatus}
                            </span>
                          </div>
                        </div>

                        {/* Address Technical Box */}
                        <div className="account-order-address-box">
                          <div className="address-header">
                            <MapPin size={12} />
                            <span>DELIVERY ADDRESS</span>
                          </div>
                          <p className="address-text">{order.address}</p>
                        </div>
                      </div>

                      {/* Action buttons */}
                      <div className="account-order-footer-actions">
                        <button className="account-order-btn-outline" type="button">
                          <RefreshCw size={13} />
                          RETURN / EXCHANGE
                        </button>
                        <button className="account-order-btn-primary" type="button">
                          <Navigation size={13} />
                          TRACK ORDER
                        </button>
                      </div>
                    </div>

                  </div>
                ))
              )}
            </div>
          )}

          {/* TAB 2: SHIPPING ADDRESSES */}
          {activeTab === 'address' && (
            <div className="shipping-address-tab">
              <h3 className="pane-title">Shipping Addresses</h3>

              {addressSuccess && (
                <div className="alert-success-banner">
                  <CheckCircle2 size={16} />
                  <span>{addressSuccess}</span>
                </div>
              )}

              <div className="addresses-grid">
                {addresses.map((addr) => (
                  <div className="address-item-box" key={addr.id}>
                    <div className="address-item-header">
                      <span className="address-item-tag">
                        <MapPin size={11} />
                        {addr.tag}
                      </span>
                      <button type="button" className="address-delete-btn" onClick={() => handleDeleteAddress(addr.id)}>
                        <Trash2 size={13} />
                        Remove
                      </button>
                    </div>
                    <div className="address-item-details">{addr.details}</div>
                  </div>
                ))}
              </div>

              <hr className="pane-divider" />
              <h4 className="subpane-title">Add New Address</h4>
              <form onSubmit={handleAddAddress} className="technical-form">
                <div className="form-group">
                  <label className="form-label-caps">Address Tag</label>
                  <select className="input-box" value={addressTag} onChange={(e) => setAddressTag(e.target.value)}>
                    <option value="Home">Home</option>
                    <option value="Office">Office</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                
                <div className="form-group">
                  <label className="form-label-caps">Street Address</label>
                  <input type="text" required className="input-box" placeholder="Street Address" value={street} onChange={(e) => setStreet(e.target.value)} />
                </div>
                
                <div className="form-row-2">
                  <div className="form-group">
                    <label className="form-label-caps">City</label>
                    <input type="text" required className="input-box" placeholder="City" value={city} onChange={(e) => setCity(e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label className="form-label-caps">State</label>
                    <input type="text" required className="input-box" placeholder="State" value={stateName} onChange={(e) => setStateName(e.target.value)} />
                  </div>
                </div>

                <div className="form-row-2">
                  <div className="form-group">
                    <label className="form-label-caps">ZIP Code</label>
                    <input type="text" required className="input-box" placeholder="ZIP Code" value={zip} onChange={(e) => setZip(e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label className="form-label-caps">Country</label>
                    <input type="text" required className="input-box" placeholder="Country" value={country} onChange={(e) => setCountry(e.target.value)} />
                  </div>
                </div>

                <button type="submit" className="form-submit-btn-accent">
                  <Plus size={16} />
                  SAVE SHIPPING ADDRESS
                </button>
              </form>
            </div>
          )}

          {/* TAB 3: WALLET DETAILS */}
          {activeTab === 'wallet' && (
            <div className="wallet-details-tab">
              <h3 className="pane-title">Wallet Details</h3>
              
              <div className="wallet-balance-card">
                <div className="wallet-card-bg-glow"></div>
                <div className="wallet-card-chip">
                  <div className="chip-line"></div>
                  <div className="chip-line"></div>
                  <div className="chip-line"></div>
                </div>
                
                <div className="wallet-balance-details">
                  <span className="wallet-label">SNAZZ CASH BALANCE</span>
                  <span className="wallet-val">{walletBalance}</span>
                </div>
                
                <button className="wallet-redeem-btn" onClick={() => alert('Gift card features are currently mocked.')}>
                  <Plus size={14} />
                  Redeem Gift Card
                </button>
              </div>

              <h4 className="subpane-title">Recent Wallet Transactions</h4>
              <div className="transactions-list">
                {transactions.map((tx) => (
                  <div key={tx.id} className="transaction-item">
                    <div className="tx-details">
                      <span className="tx-desc">{tx.desc}</span>
                      <small className="tx-meta">{tx.date} | ID: {tx.id}</small>
                    </div>
                    <span className="tx-amount-plus">+{tx.amount}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: LOYALTY REWARDS */}
          {activeTab === 'loyalty' && (
            <div className="loyalty-rewards-tab">
              <h3 className="pane-title">Loyalty Rewards</h3>
              
              <div className="loyalty-points-card">
                <div className="loyalty-card-bg-glow"></div>
                <div>
                  <span className="loyalty-label">LOYALTY POINTS</span>
                  <span className="points-value">{loyaltyPoints} <span className="pts-suffix">PTS</span></span>
                </div>
              </div>

              <div className="loyalty-progress-container">
                <div className="progress-header">
                  <span>Progress to Next Reward (500 pts)</span>
                  <span className="text-accent">90% Completed</span>
                </div>
                <div className="progress-bar-track">
                  <div className="progress-bar-fill" style={{ width: '90%' }} />
                </div>
              </div>

              <h4 className="subpane-title">Active Promo Coupons</h4>
              <div className="coupons-grid">
                {activeCoupons.map((code) => (
                  <div key={code} className="coupon-ticket">
                    <div className="coupon-ticket-border-cut"></div>
                    <div className="coupon-ticket-content">
                      <span className="coupon-code-text">{code}</span>
                      <button 
                        className="coupon-copy-btn"
                        onClick={() => { navigator.clipboard.writeText(code); alert('Coupon copied!'); }}
                      >
                        <Copy size={12} />
                        COPY
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: ACCOUNT DETAILS */}
          {activeTab === 'edit' && (
            <div className="account-details-tab">
              <h3 className="pane-title">Account details</h3>
              
              <div className="profile-card-center-align">
                <div className="profile-card-container" onClick={() => setIsFlipped(!isFlipped)}>
                  <div className={`profile-card-inner ${isFlipped ? 'is-flipped' : ''}`}>
                    
                    {/* CARD FRONT */}
                    <div className="profile-card-front" style={{ borderColor: currentGradientInfo.borderColor, boxShadow: `0 25px 60px rgba(0, 0, 0, 0.85), 0 0 35px ${currentGradientInfo.glowColor}` }}>
                      <div className="profile-card-chip"></div>
                      <div className="profile-card-core-info">
                        <div className="profile-avatar-circle" style={{ background: avatarColor, color: currentGradientInfo.textColor }}>
                          {getInitials()}
                        </div>
                        <h2 className="profile-username">{displayName}</h2>
                        <p className="profile-email">{user.email}</p>
                      </div>
                      <div className="profile-badge-pill">
                        <Sparkles size={11} style={{ marginRight: '6px' }} />
                        PREMIUM USER
                      </div>
                    </div>

                    {/* CARD BACK */}
                    <div className="profile-card-back">
                       <h3 className="profile-stats-title">Dashboard Overview</h3>
                       <div className="profile-stats-list">
                         <div className="profile-stat-item">
                           <span className="profile-stat-label">
                             <FileText size={13} /> Active Orders
                           </span>
                           <span className="profile-stat-value">{orders.length}</span>
                         </div>
                         <div className="profile-stat-item">
                           <span className="profile-stat-label">
                             <MapPin size={13} /> Addresses
                           </span>
                           <span className="profile-stat-value">{addresses.length}</span>
                         </div>
                         <div className="profile-stat-item">
                           <span className="profile-stat-label">
                             <Wallet size={13} /> Balance
                           </span>
                           <span className="profile-stat-value">{walletBalance}</span>
                         </div>
                       </div>
                       <button type="button" className="profile-flip-back-btn" onClick={(e) => { e.stopPropagation(); setIsFlipped(false); }}>
                         <RefreshCw size={12} />
                         Flip Back
                       </button>
                    </div>

                  </div>
                </div>
              </div>

              {/* Color dot picker */}
              <div className="avatar-color-picker-box">
                <span className="avatar-color-picker-label">Select Card Theme</span>
                <div className="avatar-color-picker-row">
                  {GRADIENTS.map((gradient) => (
                    <div 
                      key={gradient}
                      className={`avatar-color-picker-dot ${avatarColor === gradient ? 'selected' : ''}`}
                      style={{ background: gradient }}
                      onClick={() => setAvatarColor(gradient)}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
