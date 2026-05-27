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
        }, 1500);
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
        }, 1500);
      } else {
        setError(res.message);
      }
    }
  };

  return (
    <div className={`auth-modal-overlay ${isOpen ? 'open' : ''}`} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="auth-modal">
        <button className="auth-close-btn" onClick={onClose}>&times;</button>
        
        <div className="auth-left">
          <div className="auth-brand">
            <h1 style={{ fontFamily: 'Orbitron, sans-serif' }}>SNAZZ<br />WEAR</h1>
            <div className="kwikpass-logo">Kwik<span>⚡</span>Pass</div>
          </div>
          <div className="auth-welcome">
            <h2>Welcome!</h2>
            <p>Register to avail the best deals!</p>
          </div>
        </div>

        <div className="auth-right">
          {success ? (
            <div className="auth-step active">
              <div className="success-content">
                <h3>🎉 Congratulations!<br />You are Successfully<br />Logged in!</h3>
                <div className="loading-spinner">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="spin-icon"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
                  <span>Loading dashboard...</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="auth-step active" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
              
              {/* Tab selector */}
              <div style={{ display: 'flex', gap: '20px', marginBottom: '20px', justifyContent: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: '10px' }}>
                <button 
                  onClick={() => { setIsLoginTab(true); setError(''); }}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: isLoginTab ? 'var(--accent)' : 'var(--text-secondary)',
                    fontFamily: 'var(--font-heading)',
                    fontSize: '14px',
                    fontWeight: '800',
                    cursor: 'pointer',
                    textTransform: 'uppercase',
                    letterSpacing: '1px',
                    paddingBottom: '5px',
                    borderBottom: isLoginTab ? '2px solid var(--accent)' : 'none'
                  }}
                >
                  Login
                </button>
                <button 
                  onClick={() => { setIsLoginTab(false); setError(''); }}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: !isLoginTab ? 'var(--accent)' : 'var(--text-secondary)',
                    fontFamily: 'var(--font-heading)',
                    fontSize: '14px',
                    fontWeight: '800',
                    cursor: 'pointer',
                    textTransform: 'uppercase',
                    letterSpacing: '1px',
                    paddingBottom: '5px',
                    borderBottom: !isLoginTab ? '2px solid var(--accent)' : 'none'
                  }}
                >
                  Signup
                </button>
              </div>

              <h3>{isLoginTab ? 'Login to Account' : 'Create Account'}</h3>
              <p className="auth-subtitle">{isLoginTab ? 'Enter your credentials' : 'Register your email & password'}</p>

              {error && (
                <div style={{ color: '#ff4757', fontSize: '12px', textAlign: 'center', marginBottom: '15px', fontWeight: 'bold' }}>
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <div className="auth-input-group" style={{ marginBottom: '0px', padding: '10px 15px' }}>
                  <input 
                    type="text" 
                    placeholder="Username" 
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                </div>

                {!isLoginTab && (
                  <div className="auth-input-group" style={{ marginBottom: '0px', padding: '10px 15px' }}>
                    <input 
                      type="email" 
                      placeholder="Email Address" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                )}

                <div className="auth-input-group" style={{ marginBottom: '0px', padding: '10px 15px' }}>
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
                  className="verify-btn active" 
                  disabled={loading}
                  style={{ marginTop: '10px' }}
                >
                  {loading ? 'Please wait...' : isLoginTab ? 'LOGIN' : 'SIGNUP'}
                </button>
              </form>

              <p className="auth-terms">By logging in, you're agreeing to our<br /><a href="#">Privacy Policy</a> <a href="#">Terms of Service</a></p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
