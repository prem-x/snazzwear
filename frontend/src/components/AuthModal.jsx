import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

export default function AuthModal({ isOpen, onClose }) {
  const { login, signup } = useAuth();
  const [isLoginTab, setIsLoginTab] = useState(true);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (isLoginTab) {
      const res = await login(username, password);
      setLoading(false);
      if (res.success) {
        setSuccess(true);
        setTimeout(() => {
          setSuccess(false);
          setUsername('');
          setPassword('');
          onClose();
        }, 2200);
      } else {
        setError(res.message);
      }
    } else {
      if (!email) {
        setError('Email is required');
        setLoading(false);
        return;
      }
      const res = await signup(username, email, password);
      setLoading(false);
      if (res.success) {
        setSuccess(true);
        setTimeout(() => {
          setSuccess(false);
          setUsername('');
          setEmail('');
          setPassword('');
          onClose();
        }, 2200);
      } else {
        setError(res.message);
      }
    }
  };

  return (
    <div 
      className={`auth-modal-overlay ${isOpen ? 'open' : ''}`} 
      onClick={(e) => e.target === e.currentTarget && onClose()}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        background: 'rgba(0, 0, 0, 0.85)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 9999,
        opacity: isOpen ? 1 : 0,
        visibility: isOpen ? 'visible' : 'hidden',
        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
      }}
    >
      <div 
        className="auth-modal" 
        style={{ 
          display: 'flex',
          flexDirection: 'row',
          width: '100%',
          maxWidth: '900px',
          minHeight: '520px',
          background: '#000000',
          borderRadius: '24px',
          overflow: 'hidden',
          boxShadow: '0 30px 60px rgba(0,0,0,0.85), 0 0 20px rgba(255, 95, 54, 0.15)',
          border: '1px solid rgba(255, 255, 255, 0.15)',
          position: 'relative',
          transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
          fontFamily: "'Plus Jakarta Sans', system-ui, -apple-system, sans-serif"
        }}
      >
        <button 
          className="auth-close-btn" 
          onClick={onClose} 
          style={{ 
            position: 'absolute',
            top: '20px',
            right: '25px',
            background: 'none',
            border: 'none',
            color: '#ffffff',
            fontSize: '28px',
            cursor: 'pointer',
            zIndex: 99,
            opacity: 0.7,
            transition: 'opacity 0.2s ease',
            lineHeight: 1
          }}
          onMouseEnter={(e) => e.target.style.opacity = 1}
          onMouseLeave={(e) => e.target.style.opacity = 0.7}
        >
          &times;
        </button>

        {/* Left Side: Solid Black Brand Pane */}
        <div style={{ flex: 1.1, padding: '45px 50px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center', position: 'relative', overflow: 'hidden', borderRight: '1px solid rgba(255,255,255,0.05)', background: '#000000' }} className="auth-left-brand-pane">
          {/* Subtle background grid pattern */}
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, opacity: 0.05, pointerEvents: 'none', backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
          
          {/* Centered Logo container */}
          <div style={{ zIndex: 2, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <img src="/logo.png" alt="SNAZZ WEAR" style={{ height: '160px', width: 'auto', objectFit: 'contain' }} />
          </div>
        </div>

        {/* Right Side: Tab Sliding Viewports inside Inset White Card */}
        <div style={{ flex: 1.2, display: 'flex', background: '#000000', position: 'relative' }} className="auth-right-form-pane">
          
          {/* Inset White Form Card */}
          <div style={{ flex: 1, background: '#ffffff', margin: '15px', borderRadius: '18px', padding: '35px 30px', display: 'flex', flexDirection: 'column', justifyContent: 'center', color: '#0c0d12', boxShadow: 'inset 0 0 1px rgba(0,0,0,0.1)', overflowY: 'auto' }} className="auth-white-form-card">
            
            {success ? (
              <div className="auth-step active" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100%', opacity: 1, transition: 'all 0.5s ease', textAlign: 'center' }}>
                <div style={{ marginBottom: '20px', animation: 'scaleUp 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)' }}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="#0c0d12" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ filter: 'drop-shadow(0 0 8px rgba(0,0,0,0.1))' }}>
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                    <polyline points="22 4 12 14.01 9 11.01"></polyline>
                  </svg>
                </div>
                <h3 style={{ fontSize: '22px', fontWeight: '800', lineHeight: '1.4', marginBottom: '15px', color: '#0c0d12', fontFamily: "'Outfit', sans-serif" }}>
                  🎉 CONGRATULATIONS!<br />YOU ARE LOGGED IN!
                </h3>
                <div className="loading-spinner" style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center', color: '#686a73', fontSize: '14px' }}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="spin-icon" style={{ animation: 'spin 1s linear infinite' }}><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
                  <span>Loading dashboard...</span>
                </div>
              </div>
            ) : (
              <div className="auth-step active" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                
                {/* Tab Switcher */}
                <div style={{ display: 'flex', gap: '30px', marginBottom: '22px', justifyContent: 'center', borderBottom: '1px solid #e2e8f0', paddingBottom: '12px' }}>
                  <button 
                    onClick={() => { setIsLoginTab(true); setError(''); }}
                    className={`auth-tab-btn ${isLoginTab ? 'active' : ''}`}
                    style={{
                      border: 'none',
                      background: 'none',
                      fontSize: '16px',
                      fontWeight: '800',
                      cursor: 'pointer',
                      padding: '0 5px 4px',
                      fontFamily: "'Outfit', sans-serif",
                      textTransform: 'uppercase',
                      color: isLoginTab ? '#0c0d12' : '#8c8f9a',
                      borderBottom: isLoginTab ? '2px solid #0c0d12' : '2px solid transparent',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    Login
                  </button>
                  <button 
                    onClick={() => { setIsLoginTab(false); setError(''); }}
                    className={`auth-tab-btn ${!isLoginTab ? 'active' : ''}`}
                    style={{
                      border: 'none',
                      background: 'none',
                      fontSize: '16px',
                      fontWeight: '800',
                      cursor: 'pointer',
                      padding: '0 5px 4px',
                      fontFamily: "'Outfit', sans-serif",
                      textTransform: 'uppercase',
                      color: !isLoginTab ? '#0c0d12' : '#8c8f9a',
                      borderBottom: !isLoginTab ? '2px solid #0c0d12' : '2px solid transparent',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    Signup
                  </button>
                </div>

                {/* Viewport for Sliding Panel Form Transition */}
                <div style={{ overflow: 'hidden', flexGrow: 1, position: 'relative', width: '100%' }}>
                  <div 
                    style={{ 
                      display: 'flex', 
                      width: '200%', 
                      height: '100%',
                      transform: isLoginTab ? 'translateX(0%)' : 'translateX(-50%)', 
                      transition: 'transform 0.5s cubic-bezier(0.77, 0, 0.175, 1)' 
                    }}
                  >
                    {/* Pane 1: LOGIN */}
                    <div style={{ width: '50%', height: '100%', display: 'flex', flexDirection: 'column', paddingRight: '15px' }}>
                      <h4 style={{ fontSize: '18px', fontWeight: '800', margin: '0 0 5px 0', color: '#0c0d12', fontFamily: "'Outfit', sans-serif" }}>Login to Account</h4>
                      <p className="auth-subtitle" style={{ fontSize: '13px', color: '#686a73', margin: '0 0 15px 0', fontWeight: '500' }}>Enter your credentials</p>

                      {error && isLoginTab && (
                        <div style={{ color: '#d92b2b', background: 'rgba(217, 43, 43, 0.08)', padding: '10px 14px', borderRadius: '8px', fontSize: '12px', fontWeight: '600', marginBottom: '15px', border: '1px solid rgba(217, 43, 43, 0.15)' }}>
                          {error}
                        </div>
                      )}

                      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                          <input 
                            type="text" 
                            placeholder="Username" 
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            style={{ width: '100%', padding: '11px 13px', borderRadius: '10px', border: '1px solid #dcdde2', fontSize: '14px', outline: 'none', background: '#ffffff', color: '#0c0d12', transition: 'all 0.3s ease' }}
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

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                          <input 
                            type="password" 
                            placeholder="Password" 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            style={{ width: '100%', padding: '11px 13px', borderRadius: '10px', border: '1px solid #dcdde2', fontSize: '14px', outline: 'none', background: '#ffffff', color: '#0c0d12', transition: 'all 0.3s ease' }}
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

                        <button 
                          type="submit" 
                          disabled={loading}
                          style={{ width: '100%', padding: '12px', background: loading ? '#b1b4be' : '#000000', color: '#ffffff', border: 'none', borderRadius: '30px', fontWeight: '800', fontSize: '13px', cursor: loading ? 'not-allowed' : 'pointer', textTransform: 'uppercase', letterSpacing: '0.5px', marginTop: '5px', transition: 'all 0.3s ease' }}
                          onMouseEnter={(e) => {
                            if (!loading) e.target.style.background = '#23252f';
                          }}
                          onMouseLeave={(e) => {
                            if (!loading) e.target.style.background = '#000000';
                          }}
                        >
                          {loading ? 'Please wait...' : 'LOGIN'}
                        </button>
                      </form>
                    </div>

                    {/* Pane 2: SIGNUP */}
                    <div style={{ width: '50%', height: '100%', display: 'flex', flexDirection: 'column', paddingLeft: '15px' }}>
                      <h4 style={{ fontSize: '18px', fontWeight: '800', margin: '0 0 5px 0', color: '#0c0d12', fontFamily: "'Outfit', sans-serif" }}>Create Account</h4>
                      <p className="auth-subtitle" style={{ fontSize: '13px', color: '#686a73', margin: '0 0 15px 0', fontWeight: '500' }}>Register your email & password</p>

                      {error && !isLoginTab && (
                        <div style={{ color: '#d92b2b', background: 'rgba(217, 43, 43, 0.08)', padding: '10px 14px', borderRadius: '8px', fontSize: '12px', fontWeight: '600', marginBottom: '15px', border: '1px solid rgba(217, 43, 43, 0.15)' }}>
                          {error}
                        </div>
                      )}

                      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                          <input 
                            type="text" 
                            placeholder="Username" 
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1px solid #dcdde2', fontSize: '14px', outline: 'none', background: '#ffffff', color: '#0c0d12', transition: 'all 0.3s ease' }}
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

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                          <input 
                            type="email" 
                            placeholder="Email Address" 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1px solid #dcdde2', fontSize: '14px', outline: 'none', background: '#ffffff', color: '#0c0d12', transition: 'all 0.3s ease' }}
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

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                          <input 
                            type="password" 
                            placeholder="Password" 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1px solid #dcdde2', fontSize: '14px', outline: 'none', background: '#ffffff', color: '#0c0d12', transition: 'all 0.3s ease' }}
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

                        <button 
                          type="submit" 
                          disabled={loading}
                          style={{ width: '100%', padding: '11px', background: loading ? '#b1b4be' : '#000000', color: '#ffffff', border: 'none', borderRadius: '30px', fontWeight: '800', fontSize: '13px', cursor: loading ? 'not-allowed' : 'pointer', textTransform: 'uppercase', letterSpacing: '0.5px', marginTop: '5px', transition: 'all 0.3s ease' }}
                          onMouseEnter={(e) => {
                            if (!loading) e.target.style.background = '#23252f';
                          }}
                          onMouseLeave={(e) => {
                            if (!loading) e.target.style.background = '#000000';
                          }}
                        >
                          {loading ? 'Creating...' : 'SIGNUP'}
                        </button>
                      </form>
                    </div>
                  </div>
                </div>

                <p className="auth-terms" style={{ marginTop: '15px', marginBottom: '0px', fontSize: '11px', color: '#8c8f9a', textAlign: 'center', lineHeight: '1.4' }}>
                  By logging in, you're agreeing to our<br />
                  <a href="#" style={{ color: '#0c0d12', fontWeight: '600', textDecoration: 'underline' }}>Privacy Policy</a> and <a href="#" style={{ color: '#0c0d12', fontWeight: '600', textDecoration: 'underline' }}>Terms of Service</a>
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Style tag for responsiveness inside overlay */}
      <style>{`
        @keyframes spin {
          100% { transform: rotate(360deg); }
        }
        @media (max-width: 768px) {
          .auth-modal {
            flex-direction: column !important;
            min-height: auto !important;
            max-width: 480px !important;
            height: auto !important;
          }
          .auth-left-brand-pane {
            padding: 35px 20px !important;
            border-right: none !important;
            border-bottom: 1px solid rgba(255, 255, 255, 0.05) !important;
            background: #000000 !important;
          }
          .auth-right-form-pane {
            min-height: auto !important;
            background: #000000 !important;
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
