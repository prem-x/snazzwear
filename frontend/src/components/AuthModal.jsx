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
      style={{ display: 'flex', transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)' }}
    >
      <div 
        className="auth-modal" 
        style={{ 
          border: '1px solid rgba(255, 255, 255, 0.15)', 
          boxShadow: '0 25px 60px rgba(0,0,0,0.85), 0 0 20px rgba(255, 95, 54, 0.15)',
          overflow: 'hidden'
        }}
      >
        <button className="auth-close-btn" onClick={onClose} style={{ zIndex: 99 }}>&times;</button>
        
        {/* Left Side: Animated shifting cyber-gradient */}
        <div className="auth-left auth-left-animated" style={{ position: 'relative', overflow: 'hidden' }}>
          
          <div className="auth-brand" style={{ zIndex: 2 }}>
            <h1 style={{ fontFamily: 'Orbitron, sans-serif', letterSpacing: '2px', textShadow: '0 0 10px rgba(255,255,255,0.3)' }}>SNAZZ<br />WEAR</h1>
            <div className="kwikpass-logo" style={{ fontSize: '18px', fontWeight: '800' }}>
              Kwik<span className="kwikpass-flash" style={{ color: '#ffcc00', margin: '0 4px', fontWeight: 'bold' }}>⚡</span>Pass
            </div>
          </div>
          <div className="auth-welcome" style={{ zIndex: 2 }}>
            <h2 style={{ fontSize: '26px', letterSpacing: '1px', textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}>Welcome!</h2>
            <p style={{ color: 'rgba(255, 255, 255, 0.7)' }}>Register to avail the best deals!</p>
          </div>
        </div>

        {/* Right Side: Tab Sliding Viewports */}
        <div className="auth-right" style={{ padding: '30px 40px 40px', overflow: 'hidden' }}>
          {success ? (
            <div className="auth-step active" style={{ display: 'flex', height: '100%', opacity: 1, transition: 'all 0.5s ease' }}>
              <div className="success-content" style={{ margin: 'auto' }}>
                <div style={{ marginBottom: '20px', animation: 'scaleUp 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)' }}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ filter: 'drop-shadow(0 0 10px var(--accent-glow))' }}>
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                    <polyline points="22 4 12 14.01 9 11.01"></polyline>
                  </svg>
                </div>
                <h3 style={{ fontSize: '20px', lineHeight: '1.4', marginBottom: '15px', color: 'var(--text-primary)' }}>
                  🎉 CONGRATULATIONS!<br />YOU ARE LOGGED IN!
                </h3>
                <div className="loading-spinner" style={{ justifyContent: 'center' }}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="spin-icon"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
                  <span>Loading dashboard...</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="auth-step active" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
              
              {/* Animated Tab Switcher */}
              <div style={{ display: 'flex', gap: '30px', marginBottom: '25px', justifyContent: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>
                <button 
                  onClick={() => { setIsLoginTab(true); setError(''); }}
                  className={`auth-tab-btn ${isLoginTab ? 'active' : ''}`}
                  style={{
                    color: isLoginTab ? 'var(--text-primary)' : 'var(--text-secondary)'
                  }}
                >
                  Login
                </button>
                <button 
                  onClick={() => { setIsLoginTab(false); setError(''); }}
                  className={`auth-tab-btn ${!isLoginTab ? 'active' : ''}`}
                  style={{
                    color: !isLoginTab ? 'var(--text-primary)' : 'var(--text-secondary)'
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
                    <h3 style={{ textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '5px', fontSize: '18px' }}>Login to Account</h3>
                    <p className="auth-subtitle" style={{ marginBottom: '20px' }}>Enter your credentials</p>

                    {error && isLoginTab && (
                      <div style={{ color: '#ff4757', fontSize: '12px', textAlign: 'center', marginBottom: '15px', fontWeight: 'bold' }}>
                        {error}
                      </div>
                    )}

                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                      <div className="auth-input-group-animated">
                        <input 
                          type="text" 
                          placeholder="Username" 
                          value={username}
                          onChange={(e) => setUsername(e.target.value)}
                          required
                        />
                      </div>

                      <div className="auth-input-group-animated">
                        <input 
                          type="password" 
                          placeholder="Password" 
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                        />
                      </div>

                      <button 
                        type="submit" 
                        className="auth-glow-btn" 
                        disabled={loading}
                        style={{ marginTop: '10px' }}
                      >
                        {loading ? 'Please wait...' : 'LOGIN'}
                      </button>
                    </form>
                  </div>

                  {/* Pane 2: SIGNUP */}
                  <div style={{ width: '50%', height: '100%', display: 'flex', flexDirection: 'column', paddingLeft: '15px' }}>
                    <h3 style={{ textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '5px', fontSize: '18px' }}>Create Account</h3>
                    <p className="auth-subtitle" style={{ marginBottom: '20px' }}>Register your email & password</p>

                    {error && !isLoginTab && (
                      <div style={{ color: '#ff4757', fontSize: '12px', textAlign: 'center', marginBottom: '15px', fontWeight: 'bold' }}>
                        {error}
                      </div>
                    )}

                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      <div className="auth-input-group-animated">
                        <input 
                          type="text" 
                          placeholder="Username" 
                          value={username}
                          onChange={(e) => setUsername(e.target.value)}
                          required
                        />
                      </div>

                      <div className="auth-input-group-animated">
                        <input 
                          type="email" 
                          placeholder="Email Address" 
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                        />
                      </div>

                      <div className="auth-input-group-animated">
                        <input 
                          type="password" 
                          placeholder="Password" 
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                        />
                      </div>

                      <button 
                        type="submit" 
                        className="auth-glow-btn" 
                        disabled={loading}
                        style={{ marginTop: '10px' }}
                      >
                        {loading ? 'Creating...' : 'SIGNUP'}
                      </button>
                    </form>
                  </div>
                </div>
              </div>

              <p className="auth-terms" style={{ marginTop: '15px', marginBottom: '0px' }}>
                By logging in, you're agreeing to our<br />
                <a href="#" style={{ color: 'var(--text-primary)', textDecoration: 'underline' }}>Privacy Policy</a> and <a href="#" style={{ color: 'var(--text-primary)', textDecoration: 'underline' }}>Terms of Service</a>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
