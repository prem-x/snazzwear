import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';

export default function Checkout() {
  const { cart, clearCartState, fetchCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [address, setAddress] = useState('');
  const [apartment, setApartment] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [pincode, setPincode] = useState('');
  const [phone, setPhone] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('razorpay');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Prefill email if logged in
  useEffect(() => {
    if (user) {
      setEmail(user.email || '');
      // Try to split username into first/last name
      const parts = user.username ? user.username.split(' ') : [];
      if (parts.length > 0) {
        setFirstName(parts[0]);
        if (parts.length > 1) {
          setLastName(parts.slice(1).join(' '));
        }
      }
    }
  }, [user]);

  const items = cart?.items || [];
  const subtotal = cart?.subtotal || 0;
  const shipping = cart?.shipping || 0;
  const finalTotal = cart?.final_total || 0;

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const payload = {
      email,
      first_name: firstName,
      last_name: lastName,
      address,
      apartment,
      city,
      state,
      pincode,
      phone,
      payment_method: paymentMethod,
      coupon: cart?.coupon_code || '',
    };

    try {
      const response = await fetch('/api/checkout/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to place order');
      }

      const data = await response.json();

      if (data.success) {
        if (data.payment_method === 'cod') {
          // Cash on Delivery success
          clearCartState();
          navigate(`/success?order_id=${data.order_id}`);
        } else if (data.payment_method === 'razorpay') {
          // Razorpay payment flow
          const resScript = await loadRazorpayScript();
          if (!resScript) {
            setError('Razorpay SDK failed to load. Are you online?');
            setLoading(false);
            return;
          }

          const options = {
            key: data.razorpay_key,
            amount: Math.round(data.amount * 100),
            currency: 'INR',
            name: 'Snazz Wear',
            description: `Order #${data.order_id} Payment`,
            order_id: data.razorpay_order_id,
            handler: async function (paymentRes) {
              clearCartState();
              navigate(`/success?order_id=${data.order_id}&payment_id=${paymentRes.razorpay_payment_id}`);
            },
            prefill: {
              name: `${firstName} ${lastName}`,
              email: email,
              contact: phone,
            },
            theme: {
              color: '#A8F046',
            },
            modal: {
              ondismiss: function () {
                setLoading(false);
                setError('Payment was cancelled. You can try again.');
              },
            },
          };

          const rzp = new window.Razorpay(options);
          rzp.open();
        }
      }
    } catch (err) {
      setError(err.message || 'An error occurred during checkout.');
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div style={{ padding: '100px 8%', textAlign: 'center', color: 'var(--text-primary)', minHeight: '60vh' }}>
        <h2 style={{ fontFamily: 'var(--font-heading)' }}>Your Cart is Empty</h2>
        <p style={{ margin: '20px 0', color: 'var(--text-secondary)' }}>You must add items to your cart before you can check out.</p>
        <Link to="/shop" className="btn-primary">Go Shopping</Link>
      </div>
    );
  }

  return (
    <section className="checkout-page" style={{ minHeight: '80vh' }}>
      <div className="checkout-container">
        {/* LEFT SIDE FORM */}
        <div className="checkout-left">
          <form onSubmit={handlePlaceOrder}>
            <h2>Contact</h2>
            <input
              type="email"
              placeholder="Email address"
              className="input-box"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <h2>Delivery</h2>
            <input
              type="text"
              placeholder="Country/Region"
              className="input-box"
              value="India"
              disabled
              required
            />

            <div className="two-col">
              <input
                type="text"
                placeholder="First name"
                className="input-box"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
              />
              <input
                type="text"
                placeholder="Last name"
                className="input-box"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
              />
            </div>

            <input
              type="text"
              placeholder="Address"
              className="input-box"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
            />
            <input
              type="text"
              placeholder="Apartment, suite, etc. (optional)"
              className="input-box"
              value={apartment}
              onChange={(e) => setApartment(e.target.value)}
            />

            <div className="three-col">
              <input
                type="text"
                placeholder="City"
                className="input-box"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                required
              />
              <input
                type="text"
                placeholder="State"
                className="input-box"
                value={state}
                onChange={(e) => setState(e.target.value)}
                required
              />
              <input
                type="text"
                placeholder="PIN code"
                className="input-box"
                value={pincode}
                onChange={(e) => setPincode(e.target.value)}
                required
              />
            </div>

            <input
              type="tel"
              placeholder="Phone"
              className="input-box"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />

            <h2>Payment</h2>
            <div className="payment-options">
              <label
                className={`payment-box ${paymentMethod === 'razorpay' ? 'active' : ''}`}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '15px',
                  border: '1px solid var(--border-color)',
                  borderRadius: '8px',
                  marginBottom: '10px',
                  cursor: 'pointer',
                  background: 'var(--bg-secondary)',
                  color: 'var(--text-primary)',
                }}
              >
                <input
                  type="radio"
                  name="payment_method"
                  value="razorpay"
                  checked={paymentMethod === 'razorpay'}
                  onChange={() => setPaymentMethod('razorpay')}
                />
                <span>Razorpay Secure (UPI, Cards, Wallets)</span>
              </label>

              <label
                className={`payment-box ${paymentMethod === 'cod' ? 'active' : ''}`}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '15px',
                  border: '1px solid var(--border-color)',
                  borderRadius: '8px',
                  marginBottom: '20px',
                  cursor: 'pointer',
                  background: 'var(--bg-secondary)',
                  color: 'var(--text-primary)',
                }}
              >
                <input
                  type="radio"
                  name="payment_method"
                  value="cod"
                  checked={paymentMethod === 'cod'}
                  onChange={() => setPaymentMethod('cod')}
                />
                <span>Cash on Delivery (COD)</span>
              </label>
            </div>

            {error && (
              <p style={{ color: '#ff4757', fontWeight: 'bold', fontSize: '13px', marginBottom: '15px' }}>
                {error}
              </p>
            )}

            <button type="submit" className="pay-btn" disabled={loading}>
              {loading ? 'Processing Order...' : 'Place Order'}
            </button>
          </form>
        </div>

        {/* RIGHT SIDE SUMMARY */}
        <div className="checkout-right" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', padding: '30px', borderRadius: '12px' }}>
          {items.map((item) => (
            <div className="summary-item" key={item.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
              <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                <div style={{ width: '60px', height: '80px', borderRadius: '8px', overflow: 'hidden', border: '1px solid var(--border-color)' }}>
                  <img src={item.image} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt={item.name} />
                </div>
                <div>
                  <p style={{ fontWeight: '700', color: 'var(--text-primary)', fontSize: '14px', margin: 0 }}>{item.name}</p>
                  <small style={{ color: 'var(--text-secondary)' }}>Size: {item.size} | Qty: {item.quantity}</small>
                </div>
              </div>
              <span style={{ fontWeight: '700', color: 'var(--text-primary)' }}>₹{item.price * item.quantity}</span>
            </div>
          ))}

          <hr style={{ borderColor: 'var(--border-color)', margin: '20px 0' }} />

          <div className="summary-row" style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)', marginBottom: '10px' }}>
            <span>Subtotal</span>
            <span>₹{subtotal}</span>
          </div>

          <div className="summary-row" style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)', marginBottom: '10px' }}>
            <span>Shipping</span>
            <span>{shipping === 0 ? 'FREE' : `₹${shipping}`}</span>
          </div>

          <hr style={{ borderColor: 'var(--border-color)', margin: '20px 0' }} />

          <div className="summary-row total" style={{ display: 'flex', justifyContent: 'space-between', fontWeight: '800', fontSize: '18px', color: 'var(--text-primary)' }}>
            <span>Total</span>
            <span>₹{finalTotal}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
