import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import LiquidEther from '../components/LiquidEther';

export default function Signup() {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phonePrefix, setPhonePrefix] = useState('+91');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [agreeNewsletter, setAgreeNewsletter] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!agreeTerms) {
      setError('You must agree to the Terms of Service and Privacy Policy.');
      return;
    }
    setError('');
    setLoading(true);

    // Using email as username to satisfy Django's unique username requirement
    const res = await signup(email, email, password);
    setLoading(false);
    if (res.success) {
      navigate('/');
    } else {
      setError(res.message || 'Registration failed. Try a different email.');
    }
  };

  return (
    <div className="auth-page-container" style={{ background: '#070709', minHeight: '100vh', display: 'flex', flexDirection: 'column', fontFamily: "'Plus Jakarta Sans', system-ui, -apple-system, sans-serif", color: '#ffffff', overflow: 'hidden', position: 'relative' }}>
      
      {/* Decorative Blur Blobs for Glass Depth */}
      <div style={{ position: 'absolute', width: '350px', height: '350px', background: 'radial-gradient(circle, rgba(255, 95, 54, 0.25) 0%, rgba(255, 95, 54, 0) 70%)', filter: 'blur(60px)', top: '-50px', right: '10%', zIndex: 0, pointerEvents: 'none' }}></div>
      <div style={{ position: 'absolute', width: '400px', height: '400px', background: 'radial-gradient(circle, rgba(255, 0, 127, 0.2) 0%, rgba(255, 0, 127, 0) 75%)', filter: 'blur(80px)', bottom: '50px', left: '35%', zIndex: 0, pointerEvents: 'none' }}></div>

      {/* LiquidEther Interactive Fluid Background covering full viewport */}
      <LiquidEther
        colors={[ '#ff5f36', '#ff007f', '#121212' ]}
        mouseForce={25}
        cursorSize={80}
        isViscous={true}
        viscous={40}
        iterationsViscous={16}
        iterationsPoisson={16}
        resolution={0.4}
        isBounce={false}
        autoDemo={true}
        autoSpeed={0.4}
        autoIntensity={2.0}
        takeoverDuration={0.25}
        autoResumeDelay={2000}
        autoRampDuration={0.6}
        style={{ opacity: 0.65, position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 1 }}
      />

      {/* Center-aligned container for the split card */}
      <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '40px 20px', minHeight: '100vh', position: 'relative', zIndex: 5 }} className="auth-center-container">
        
        {/* Split Card Layout */}
        <div style={{ display: 'flex', flexDirection: 'row', width: '100%', maxWidth: '980px', minHeight: '620px', background: '#000000', borderRadius: '24px', overflow: 'hidden', boxShadow: '0 30px 60px rgba(0,0,0,0.6)', border: '1px solid rgba(255, 255, 255, 0.1)', transition: 'all 0.3s ease' }} className="auth-split-card">
          
          {/* Left Brand Pane */}
          <div style={{ flex: 1.1, padding: '45px 50px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center', position: 'relative', overflow: 'hidden', borderRight: '1px solid rgba(255,255,255,0.05)' }} className="auth-left-brand-pane">
            {/* Subtle background grid pattern */}
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, opacity: 0.05, pointerEvents: 'none', backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
            
            {/* Centered Logo container */}
            <div style={{ zIndex: 2 }}>
              <Link to="/" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <img src="/logo.png" alt="SNAZZ WEAR" style={{ height: '160px', width: 'auto', objectFit: 'contain' }} />
              </Link>
            </div>
          </div>
          
          {/* Right Form Card Container */}
          <div style={{ flex: 1.2, display: 'flex', background: '#000000', position: 'relative' }} className="auth-right-form-pane">
            
            {/* Inset White Form Card with Scrollable body for more fields */}
            <div style={{ flex: 1, background: '#ffffff', margin: '15px', borderRadius: '18px', padding: '35px 30px', display: 'flex', flexDirection: 'column', justifyContent: 'center', color: '#0c0d12', maxHeight: 'calc(100% - 30px)', overflowY: 'auto', boxShadow: 'inset 0 0 1px rgba(0,0,0,0.1)' }} className="auth-white-form-card">
              
              <h3 style={{ fontSize: '24px', fontWeight: '800', marginBottom: '5px', fontFamily: "'Outfit', sans-serif", color: '#0c0d12', textAlign: 'center' }}>Login/Signup</h3>
              <p style={{ fontSize: '14px', color: '#686a73', marginBottom: '20px', textAlign: 'center', fontWeight: '500' }}>Create your Snazz Wear account</p>

              {error && (
                <div style={{ color: '#d92b2b', background: 'rgba(217, 43, 43, 0.08)', padding: '12px 16px', borderRadius: '10px', fontSize: '13px', fontWeight: '600', marginBottom: '18px', border: '1px solid rgba(217, 43, 43, 0.15)' }}>
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                {/* Name Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: '12px', fontWeight: '700', color: '#686a73', textTransform: 'uppercase', letterSpacing: '0.5px' }}>First name</label>
                    <input 
                      type="text" 
                      placeholder="First name" 
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      style={{ width: '100%', padding: '11px 13px', borderRadius: '10px', border: '1px solid #dcdde2', fontSize: '15px', outline: 'none', background: '#ffffff', color: '#0c0d12', transition: 'all 0.3s ease' }}
                      onFocus={(e) => {
                        e.target.style.borderColor = '#0c0d12';
                        e.target.style.boxShadow = '0 0 0 3px rgba(12, 13, 18, 0.06)';
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = '#dcdde2';
                        e.target.style.boxShadow = 'none';
                      }}
                      required
                    />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: '12px', fontWeight: '700', color: '#686a73', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Last name</label>
                    <input 
                      type="text" 
                      placeholder="Last name" 
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      style={{ width: '100%', padding: '11px 13px', borderRadius: '10px', border: '1px solid #dcdde2', fontSize: '15px', outline: 'none', background: '#ffffff', color: '#0c0d12', transition: 'all 0.3s ease' }}
                      onFocus={(e) => {
                        e.target.style.borderColor = '#0c0d12';
                        e.target.style.boxShadow = '0 0 0 3px rgba(12, 13, 18, 0.06)';
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = '#dcdde2';
                        e.target.style.boxShadow = 'none';
                      }}
                      required
                    />
                  </div>
                </div>

                {/* Email Address */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '12px', fontWeight: '700', color: '#686a73', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Email address</label>
                  <input 
                    type="email" 
                    placeholder="Enter email address" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={{ width: '100%', padding: '11px 13px', borderRadius: '10px', border: '1px solid #dcdde2', fontSize: '15px', outline: 'none', background: '#ffffff', color: '#0c0d12', transition: 'all 0.3s ease' }}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#0c0d12';
                      e.target.style.boxShadow = '0 0 0 3px rgba(12, 13, 18, 0.06)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = '#dcdde2';
                      e.target.style.boxShadow = 'none';
                    }}
                    required
                  />
                </div>

                {/* Phone Number Group */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '12px', fontWeight: '700', color: '#686a73', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Phone number</label>
                  <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #dcdde2', borderRadius: '10px', background: '#ffffff', transition: 'all 0.3s ease' }} className="auth-phone-container">
                    <select 
                      value={phonePrefix}
                      onChange={(e) => setPhonePrefix(e.target.value)}
                      style={{ border: 'none', background: 'transparent', outline: 'none', padding: '11px 8px', fontSize: '15px', color: '#0c0d12', cursor: 'pointer', borderRight: '1px solid #dcdde2', borderRadius: '10px 0 0 10px' }}
                    >
                      <option value="+91">🇮🇳 +91</option>
                      <option value="+1">🇺🇸 +1</option>
                      <option value="+44">🇬🇧 +44</option>
                      <option value="+61">🇦🇺 +61</option>
                    </select>
                    <input 
                      type="tel" 
                      placeholder="Enter Mobile Number" 
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      style={{ flex: 1, border: 'none', padding: '11px 13px', fontSize: '15px', outline: 'none', background: 'transparent', color: '#0c0d12', borderRadius: '0 10px 10px 0' }}
                      required
                    />
                  </div>
                </div>

                {/* Password */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <label style={{ fontSize: '12px', fontWeight: '700', color: '#686a73', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Password</label>
                    <button 
                      type="button" 
                      onClick={() => setShowPassword(!showPassword)}
                      style={{ background: 'none', border: 'none', fontSize: '12px', color: '#686a73', display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer', outline: 'none', fontWeight: '700' }}
                      onMouseEnter={(e) => e.target.style.color = '#0c0d12'}
                      onMouseLeave={(e) => e.target.style.color = '#686a73'}
                    >
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                      {showPassword ? 'HIDE' : 'SHOW'}
                    </button>
                  </div>
                  <input 
                    type={showPassword ? 'text' : 'password'} 
                    placeholder="Enter password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={{ width: '100%', padding: '11px 13px', borderRadius: '10px', border: '1px solid #dcdde2', fontSize: '15px', outline: 'none', background: '#ffffff', color: '#0c0d12', transition: 'all 0.3s ease' }}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#0c0d12';
                      e.target.style.boxShadow = '0 0 0 3px rgba(12, 13, 18, 0.06)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = '#dcdde2';
                      e.target.style.boxShadow = 'none';
                    }}
                    required
                  />
                </div>

                {/* Checkboxes */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '3px' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                    <input 
                      type="checkbox" 
                      id="agreeTerms"
                      checked={agreeTerms}
                      onChange={(e) => setAgreeTerms(e.target.checked)}
                      style={{ width: '16px', height: '16px', marginTop: '2px', accentColor: '#0c0d12', cursor: 'pointer', border: '1px solid #dcdde2' }}
                      required
                    />
                    <label htmlFor="agreeTerms" style={{ fontSize: '12px', color: '#686a73', cursor: 'pointer', lineHeight: '1.4', fontWeight: '500', userSelect: 'none' }}>
                      I agree to the <a href="#" style={{ color: '#000000', fontWeight: '700', textDecoration: 'underline' }}>Terms of Service</a> and <a href="#" style={{ color: '#000000', fontWeight: '700', textDecoration: 'underline' }}>Privacy Policy</a>.
                    </label>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                    <input 
                      type="checkbox" 
                      id="agreeNewsletter"
                      checked={agreeNewsletter}
                      onChange={(e) => setAgreeNewsletter(e.target.checked)}
                      style={{ width: '16px', height: '16px', marginTop: '2px', accentColor: '#0c0d12', cursor: 'pointer', border: '1px solid #dcdde2' }}
                    />
                    <label htmlFor="agreeNewsletter" style={{ fontSize: '12px', color: '#686a73', cursor: 'pointer', lineHeight: '1.4', fontWeight: '500', userSelect: 'none' }}>
                      Keep me updated with news, sales, and exclusive drops.
                    </label>
                  </div>
                </div>

                {/* Submit Button */}
                <button 
                  type="submit" 
                  disabled={loading}
                  style={{ width: '100%', padding: '13px', background: loading ? '#b1b4be' : '#000000', color: '#ffffff', border: 'none', borderRadius: '30px', fontWeight: '800', fontSize: '14px', cursor: loading ? 'not-allowed' : 'pointer', textTransform: 'uppercase', letterSpacing: '0.5px', marginTop: '5px', transition: 'all 0.3s ease' }}
                  onMouseEnter={(e) => {
                    if (!loading) {
                      e.target.style.background = '#23252f';
                      e.target.style.transform = 'translateY(-1px)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!loading) {
                      e.target.style.background = '#000000';
                      e.target.style.transform = 'none';
                    }
                  }}
                >
                  {loading ? 'Creating Account...' : 'Sign up'}
                </button>
              </form>

              {/* Redirect Footer */}
              <div style={{ textAlign: 'center', marginTop: '18px', fontSize: '13px', color: '#686a73', borderTop: '1px solid #f0f1f4', paddingTop: '12px' }}>
                Already have an account? <Link to="/login" style={{ color: '#000000', fontWeight: '700', textDecoration: 'underline' }}>Log in</Link>
              </div>

            </div>
          </div>
          
        </div>
      </div>

      {/* Responsive Style Tag */}
      <style>{`
        .auth-phone-container:focus-within {
          border-color: #0c0d12 !important;
          box-shadow: 0 0 0 3px rgba(12, 13, 18, 0.06) !important;
        }
        @media (max-width: 768px) {
          .auth-split-card {
            flex-direction: column !important;
            min-height: auto !important;
            max-width: 480px !important;
          }
          .auth-left-brand-pane {
            padding: 30px 20px !important;
            border-right: none !important;
            border-bottom: 1px solid rgba(255, 255, 255, 0.05) !important;
          }
          .auth-right-form-pane {
            min-height: auto !important;
          }
          .auth-white-form-card {
            margin: 10px !important;
            padding: 30px 20px !important;
            max-height: none !important;
            overflow-y: visible !important;
          }
        }
      `}</style>

    </div>
  );
}
