import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import LiquidEther from '../components/LiquidEther';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const res = await login(username, password);
    setLoading(false);
    if (res.success) {
      navigate('/');
    } else {
      setError(res.message || 'Invalid username or password');
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
        <div style={{ display: 'flex', flexDirection: 'row', width: '100%', maxWidth: '900px', minHeight: '520px', background: '#000000', borderRadius: '24px', overflow: 'hidden', boxShadow: '0 30px 60px rgba(0,0,0,0.6)', border: '1px solid rgba(255, 255, 255, 0.1)', transition: 'all 0.3s ease' }} className="auth-split-card">
          
          {/* Left Brand Pane */}
          <div style={{ flex: 1.2, padding: '45px 50px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center', position: 'relative', overflow: 'hidden', borderRight: '1px solid rgba(255,255,255,0.05)' }} className="auth-left-brand-pane">
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
          <div style={{ flex: 1, display: 'flex', background: '#000000', position: 'relative' }} className="auth-right-form-pane">
            
            {/* Inset White Form Card */}
            <div style={{ flex: 1, background: '#ffffff', margin: '15px', borderRadius: '18px', padding: '40px 35px', display: 'flex', flexDirection: 'column', justifyContent: 'center', color: '#0c0d12', boxShadow: 'inset 0 0 1px rgba(0,0,0,0.1)' }} className="auth-white-form-card">
              
              <h3 style={{ fontSize: '24px', fontWeight: '800', marginBottom: '5px', fontFamily: "'Outfit', sans-serif", color: '#0c0d12', textAlign: 'center' }}>Login/Signup</h3>
              <p style={{ fontSize: '14px', color: '#686a73', marginBottom: '25px', textAlign: 'center', fontWeight: '500' }}>Enter your Snazz Wear account credentials</p>

              {error && (
                <div style={{ color: '#d92b2b', background: 'rgba(217, 43, 43, 0.08)', padding: '12px 16px', borderRadius: '10px', fontSize: '13px', fontWeight: '600', marginBottom: '20px', border: '1px solid rgba(217, 43, 43, 0.15)' }}>
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                
                {/* Username Input */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '12px', fontWeight: '700', color: '#686a73', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Username</label>
                  <input 
                    type="text" 
                    placeholder="Enter username" 
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    style={{ width: '100%', padding: '13px 15px', borderRadius: '10px', border: '1px solid #dcdde2', fontSize: '15px', outline: 'none', background: '#ffffff', color: '#0c0d12', transition: 'all 0.3s ease' }}
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

                {/* Password Input */}
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
                    style={{ width: '100%', padding: '13px 15px', borderRadius: '10px', border: '1px solid #dcdde2', fontSize: '15px', outline: 'none', background: '#ffffff', color: '#0c0d12', transition: 'all 0.3s ease' }}
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

                {/* Keep Logged In checkbox */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '3px' }}>
                  <input 
                    type="checkbox" 
                    id="rememberMe"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    style={{ width: '16px', height: '16px', accentColor: '#0c0d12', cursor: 'pointer', border: '1px solid #dcdde2' }}
                  />
                  <label htmlFor="rememberMe" style={{ fontSize: '13px', color: '#686a73', cursor: 'pointer', fontWeight: '600', userSelect: 'none' }}>
                    Keep me logged in
                  </label>
                </div>

                {/* Log In Button */}
                <button 
                  type="submit" 
                  disabled={loading}
                  style={{ width: '100%', padding: '14px', background: loading ? '#b1b4be' : '#000000', color: '#ffffff', border: 'none', borderRadius: '30px', fontWeight: '800', fontSize: '14px', cursor: loading ? 'not-allowed' : 'pointer', textTransform: 'uppercase', letterSpacing: '0.5px', marginTop: '8px', transition: 'all 0.3s ease' }}
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
                  {loading ? 'Logging in...' : 'Log in'}
                </button>
              </form>

              {/* T&C Notice */}
              <div style={{ fontSize: '11px', color: '#8c8f9a', textAlign: 'center', marginTop: '20px', lineHeight: '1.4' }}>
                By logging in, you're agreeing to our <br />
                <a href="#" style={{ color: '#0c0d12', fontWeight: '600', textDecoration: 'underline' }}>Privacy Policy</a> and <a href="#" style={{ color: '#0c0d12', fontWeight: '600', textDecoration: 'underline' }}>Terms of Service</a>
              </div>

              {/* Redirect Footer */}
              <div style={{ textAlign: 'center', marginTop: '22px', fontSize: '13px', color: '#686a73', borderTop: '1px solid #f0f1f4', paddingTop: '15px' }}>
                Don't have an account? <Link to="/signup" style={{ color: '#000000', fontWeight: '700', textDecoration: 'underline' }}>Sign up</Link>
              </div>

            </div>
          </div>
          
        </div>
      </div>

      {/* Responsive Style Tag */}
      <style>{`
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
          }
        }
      `}</style>

    </div>
  );
}
