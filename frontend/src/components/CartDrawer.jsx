import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';

export default function CartDrawer() {
  const {
    cart,
    cartDrawerOpen,
    setCartDrawerOpen,
    updateCartQuantity,
    updateCartSize,
    removeFromCart,
    applyCoupon,
  } = useCart();

  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState('');
  const [couponSuccess, setCouponSuccess] = useState('');
  const navigate = useNavigate();

  const subtotal = cart?.subtotal || 0;
  const originalTotal = cart?.original_total || 0;
  const savedAmount = cart?.saved_amount || 0;
  const items = cart?.items || [];
  const discountPercentage = cart?.discount_percentage || 0;
  const activeCoupon = cart?.coupon_code || '';

  const handleApplyCoupon = async (e) => {
    e.preventDefault();
    setCouponError('');
    setCouponSuccess('');
    if (!couponInput.trim()) return;

    const res = await applyCoupon(couponInput.trim());
    if (res.success) {
      setCouponSuccess(`Coupon applied! ${res.discount_percentage}% OFF`);
    } else {
      setCouponError(res.message);
    }
  };

  const handleCheckoutClick = (e) => {
    e.preventDefault();
    setCartDrawerOpen(false);
    navigate('/checkout');
  };

  // Progress Bar Logic
  const maxTier = 9999;
  const progressPct = Math.min((subtotal / maxTier) * 100, 100);

  let progressText = '';
  if (subtotal < 500) {
    progressText = `Add items worth ₹${500 - subtotal} more to unlock 10% off with code SNAZZ10`;
  } else if (subtotal < 5999) {
    progressText = `Add items worth ₹${5999 - subtotal} more to unlock 15% off with code SNAZZ15`;
  } else if (subtotal < 9999) {
    progressText = `Add items worth ₹${9999 - subtotal} more to unlock 20% off with code SNAZZ20`;
  } else {
    progressText = `🎉 You've unlocked the maximum 20% off! Use code SNAZZ20`;
  }

  return (
    <div className={`cart-drawer ${cartDrawerOpen ? 'open' : ''}`}>
      <div id="cartContent">
        {/* HEADER */}
        <div className="cart-drawer-header">
          <h3 className="cart-drawer-title">Your Cart ({items.length} items)</h3>
          <span className="cart-drawer-close" onClick={() => setCartDrawerOpen(false)}>
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </span>
        </div>

        {/* PROMO BANNER */}
        <div className="cart-promo-banner">
          Get 10% off with code EXTRA10
        </div>

        {/* PROGRESS BAR CONTAINER */}
        <div className="cart-progress-container">
          <p className="cart-progress-text" dangerouslySetInnerHTML={{ __html: progressText }}></p>
          <div className="cart-progress-wrapper">
            <div className="cart-progress-bar">
              <div className="cart-progress-fill" style={{ width: `${progressPct}%` }}></div>
            </div>
            <div className="cart-progress-steps">
              <div className="cart-step" style={{ left: '5%' }}>
                <span className="cart-step-value">₹500</span>
                <div className={`cart-step-icon ${subtotal >= 500 ? 'active' : ''}`}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2l2.4 2.4 3.4-.6.6 3.4 2.4 2.4-2.4 2.4-.6 3.4-3.4.6L12 22l-2.4-2.4-3.4.6-.6-3.4-2.4-2.4 2.4-2.4.6-3.4 3.4-.6L12 2z" /><path d="M9 15l6-6" /><circle cx="9" cy="9" r="1" /><circle cx="15" cy="15" r="1" /></svg>
                </div>
                <span className="cart-step-text">10% Off</span>
              </div>
              <div className="cart-step" style={{ left: '55%' }}>
                <span className="cart-step-value">₹5,999</span>
                <div className={`cart-step-icon ${subtotal >= 5999 ? 'active' : ''}`}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2l2.4 2.4 3.4-.6.6 3.4 2.4 2.4-2.4 2.4-.6 3.4-3.4.6L12 22l-2.4-2.4-3.4.6-.6-3.4-2.4-2.4 2.4-2.4.6-3.4 3.4-.6L12 2z" /><path d="M9 15l6-6" /><circle cx="9" cy="9" r="1" /><circle cx="15" cy="15" r="1" /></svg>
                </div>
                <span className="cart-step-text">15% Off</span>
              </div>
              <div className="cart-step" style={{ left: '92%' }}>
                <span className="cart-step-value">₹9,999</span>
                <div className={`cart-step-icon ${subtotal >= 9999 ? 'active' : ''}`}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2l2.4 2.4 3.4-.6.6 3.4 2.4 2.4-2.4 2.4-.6 3.4-3.4.6L12 22l-2.4-2.4-3.4.6-.6-3.4-2.4-2.4 2.4-2.4.6-3.4 3.4-.6L12 2z" /><path d="M9 15l6-6" /><circle cx="9" cy="9" r="1" /><circle cx="15" cy="15" r="1" /></svg>
                </div>
                <span className="cart-step-text">20% Off</span>
              </div>
            </div>
          </div>
        </div>

        {/* ITEMS LIST */}
        <div className="cart-drawer-body">
          <div className="cart-items-container">
            {items.map((item) => (
              <div className="cart-item-card" key={item.id}>
                <div className="cart-item-img-container">
                  <img src={item.image} className="cart-item-img" alt={item.name} />
                </div>

                <div className="cart-item-details">
                  <div className="cart-item-header-info">
                    <h4 className="cart-item-title">{item.name}</h4>
                    <div className="cart-item-prices">
                      <del className="cart-item-old-price">₹{item.price * item.quantity}</del>
                      <span className="cart-item-new-price">₹{item.price * item.quantity}</span>
                    </div>
                  </div>

                  <div className="cart-item-controls">
                    <div className="cart-item-size-wrapper">
                      <select
                        className="cart-item-size-select"
                        value={item.variant_id}
                        onChange={(e) => updateCartSize(item.id, e.target.value)}
                      >
                        {item.variants?.map((v) => (
                          <option key={v.id} value={v.id}>
                            {v.size}
                          </option>
                        ))}
                      </select>
                      <svg className="cart-item-size-chevron" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m6 9 6 6 6-6" /></svg>
                    </div>

                    <div className="cart-item-quantity">
                      <button className="qty-btn" onClick={() => updateCartQuantity(item.id, 'decrease')}>-</button>
                      <span className="qty-val">{item.quantity}</span>
                      <button className="qty-btn" onClick={() => updateCartQuantity(item.id, 'increase')}>+</button>
                    </div>

                    <button className="cart-item-delete" onClick={() => removeFromCart(item.id)}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" /><line x1="10" y1="11" x2="10" y2="17" /><line x1="14" y1="11" x2="14" y2="17" /></svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {items.length === 0 && (
              <div className="cart-empty-state">
                <p>Your cart is empty.</p>
              </div>
            )}
          </div>

          {/* COUPON CARD */}
          <div className="cart-coupon-card">
            <form onSubmit={handleApplyCoupon} className="cart-coupon-input-wrapper">
              <svg className="coupon-icon" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#00b894" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z" /><path d="M9 12h.01" /><path d="M15 12h.01" /></svg>
              <input
                type="text"
                placeholder="Enter Coupon Code"
                className="cart-coupon-input"
                value={couponInput || activeCoupon}
                onChange={(e) => setCouponInput(e.target.value)}
              />
              <button type="submit" className="cart-coupon-apply">Apply</button>
            </form>
            {couponError && <p style={{ color: '#ff4757', fontSize: '11px', marginTop: '-8px', marginBottom: '8px', paddingLeft: '10px' }}>{couponError}</p>}
            {couponSuccess && <p style={{ color: '#00b894', fontSize: '11px', marginTop: '-8px', marginBottom: '8px', paddingLeft: '10px' }}>{couponSuccess}</p>}
            
            <button className="cart-view-offers">
              View All Offers
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6" /></svg>
            </button>
          </div>
        </div>

        {/* STICKY FOOTER */}
        <div className="cart-sticky-footer">
          <div className="cart-saved-bar">₹{savedAmount} Saved so far!</div>

          <div className="cart-totals-row">
            <div className="cart-estimated-wrapper">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#636e72" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><polyline points="10 9 9 9 8 9" /></svg>
              <span className="cart-estimated-label">Estimated Total <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m6 9 6 6 6-6" /></svg></span>
            </div>
            <div className="cart-total-prices">
              <del className="cart-total-old">₹{originalTotal}</del>
              <div className="cart-total-new-row">
                <span className="cart-total-new">₹{subtotal}</span>
                {discountPercentage > 0 && (
                  <span className="cart-total-discount">({discountPercentage}% OFF)</span>
                )}
              </div>
            </div>
          </div>

          <a href="#" onClick={handleCheckoutClick} className="cart-checkout-btn">
            <div className="cart-checkout-left">
              <span className="cart-checkout-text">CHECKOUT</span>
              <span className="cart-checkout-subtext">5% OFF ON PREPAID ORDERS</span>
            </div>
            <div className="cart-checkout-icons">
              <div className="cart-pay-circle">Ptm</div>
              <div className="cart-pay-circle">Pe</div>
              <div className="cart-pay-circle">G</div>
            </div>
          </a>

          <div className="cart-powered-by">
            Powered by <strong style={{ color: '#0047b3' }}>Gokwik</strong>
          </div>
        </div>
      </div>
    </div>
  );
}
