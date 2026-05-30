import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

export default function AuthModal({ isOpen, onClose }) {
  const { login, signup } = useAuth();
  const [step, setStep] = useState(1); // 1 = Phone, 2 = OTP
  const [phoneNumber, setPhoneNumber] = useState('');
  const [phonePrefix, setPhonePrefix] = useState('+91');
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handlePhoneSubmit = (e) => {
    e.preventDefault();
    setError('');
    if (phoneNumber.length < 8) {
      setError('Please enter a valid mobile number');
      return;
    }
    setLoading(true);
    // Mock sending OTP
    setTimeout(() => {
      setLoading(false);
      setStep(2);
    }, 800);
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (otp.length < 4) {
      setError('Please enter a valid OTP');
      setLoading(false);
      return;
    }

    const username = phonePrefix + phoneNumber;
    const dummyPassword = 'defaultOTPPass123!';
    
    // Attempt login
    let res = await login(username, dummyPassword);
    
    if (!res.success) {
      // If user does not exist, sign them up
      const email = `${username}@gmail.com`;
      const signupRes = await signup(username, email, dummyPassword);
      if (signupRes.success) {
        res = { success: true };
      } else {
        res = signupRes;
      }
    }

    setLoading(false);
    if (res.success) {
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        setPhoneNumber('');
        setOtp('');
        setStep(1);
        onClose();
      }, 2000);
    } else {
      setError(res.message || 'Authentication failed');
    }
  };

  return (
    <div 
      className={`auth-modal-overlay ${isOpen ? 'open' : ''}`} 
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="auth-modal">
        <button className="auth-close-btn" onClick={onClose}>
          &times;
        </button>

        {/* Left Side: Brand Pane */}
        <div className="auth-left-brand-pane">
          <div className="auth-brand-grid-animated"></div>
          <div className="auth-logo-glow-ring"></div>
          
          <div style={{ zIndex: 2, width: '100%' }}>
            {/* SNAZZ WEAR Logo */}
            <div className="auth-brand-logo-container">
              <img src="/logo.png" alt="SNAZZ WEAR" className="auth-brand-logo-animated" style={{ height: '150px', width: 'auto', objectFit: 'contain' }} />
            </div>

            {/* Welcoming Text */}
            <h2 className="auth-brand-welcome-title">Welcome!</h2>
            <p className="auth-brand-welcome-subtitle">Register to avail the best deals!</p>
          </div>
        </div>

        {/* Right Side: Form Card Container */}
        <div className="auth-right-form-pane">
          <div className="auth-white-form-card">
            
            {success ? (
              <div className="auth-form-step-fade" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100%', textAlign: 'center' }}>
                <div style={{ marginBottom: '20px' }}>
                  <svg className="auth-success-icon-spin" xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                    <polyline points="22 4 12 14.01 9 11.01"></polyline>
                  </svg>
                </div>
                <h3 style={{ fontSize: '22px', fontWeight: '800', lineHeight: '1.4', marginBottom: '15px', color: 'var(--text-primary)', fontFamily: "var(--font-heading)" }}>
                  🎉 CONGRATULATIONS!<br />YOU ARE LOGGED IN!
                </h3>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'center' }}>
                
                <h3 className="auth-card-title-main">Login/Signup</h3>
                
                {step === 1 ? (
                  <div className="auth-form-step-fade">
                    <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '25px', textAlign: 'center', fontWeight: '500' }}>Enter Mobile Number</p>

                    {error && (
                      <div className="auth-error-container">
                        {error}
                      </div>
                    )}

                    <form onSubmit={handlePhoneSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                      <div className="auth-input-container">
                        <div style={{ display: 'flex', alignItems: 'center', position: 'relative', borderRight: '1px solid var(--border-color)', background: 'transparent' }}>
                          <select 
                            value={phonePrefix}
                            onChange={(e) => setPhonePrefix(e.target.value)}
                            className="auth-select-prefix"
                          >
                            <option value="+91" style={{ background: 'var(--bg-tertiary)', color: 'var(--text-primary)' }}>IN +91</option>
                            <option value="+1" style={{ background: 'var(--bg-tertiary)', color: 'var(--text-primary)' }}>US +1</option>
                            <option value="+44" style={{ background: 'var(--bg-tertiary)', color: 'var(--text-primary)' }}>GB +44</option>
                          </select>
                          <span className="auth-select-arrow-icon">
                            <svg width="10" height="6" viewBox="0 0 10 6" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                              <path d="m1 1 4 4 4-4"/>
                            </svg>
                          </span>
                        </div>
                        <input 
                          type="tel" 
                          placeholder="Enter Mobile Number" 
                          value={phoneNumber}
                          onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
                          className="auth-input-field"
                          required
                        />
                      </div>

                      <button 
                        type="submit" 
                        disabled={loading}
                        className="auth-submit-btn-animated"
                      >
                        {loading ? 'Please wait...' : 'PROCEED'}
                      </button>
                    </form>
                  </div>
                ) : (
                  <div className="auth-form-step-fade">
                    <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '20px', textAlign: 'center', fontWeight: '500' }}>
                      Enter OTP sent to {phonePrefix} {phoneNumber}
                    </p>

                    {error && (
                      <div className="auth-error-container">
                        {error}
                      </div>
                    )}

                    <form onSubmit={handleVerifyOtp} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                      <input 
                        type="text" 
                        maxLength="6"
                        placeholder="• • • • • •" 
                        value={otp}
                        onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                        className="auth-otp-input-field"
                        required
                      />

                      <button 
                        type="submit" 
                        disabled={loading}
                        className="auth-submit-btn-animated"
                      >
                        {loading ? 'Verifying...' : 'VERIFY & PROCEED'}
                      </button>
                    </form>
                    
                    <button 
                      onClick={() => { setStep(1); setOtp(''); setError(''); }}
                      className="auth-change-number-btn"
                    >
                      Change Phone Number
                    </button>
                  </div>
                )}

                <div style={{ fontSize: '11px', color: 'var(--text-muted)', textAlign: 'center', marginTop: '25px', lineHeight: '1.4' }}>
                  By logging in, you're agreeing to our <br />
                  <a href="#" className="auth-link-animated">Privacy Policy</a> <a href="#" className="auth-link-animated" style={{ marginLeft: '5px' }}>Terms of Service</a>
                </div>

                <div className="auth-trouble-container">
                  <a href="#" className="auth-link-animated">Trouble logging in?</a>
                </div>

              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        /* --- Modal Backdrop --- */
        .auth-modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background: rgba(0, 0, 0, 0.85);
          backdrop-filter: blur(10px);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 9999;
          opacity: 0;
          visibility: hidden;
          transition: opacity 0.4s ease, visibility 0.4s ease;
        }
        .auth-modal-overlay.open {
          opacity: 1;
          visibility: visible;
        }

        /* --- Modal Container --- */
        .auth-modal {
          display: flex;
          flex-direction: row;
          width: 100%;
          max-width: 920px;
          min-height: 480px;
          background: #000000;
          border-radius: 24px;
          overflow: hidden;
          box-shadow: 0 30px 60px rgba(0,0,0,0.85), 0 0 40px rgba(168, 240, 70, 0.08);
          border: 1px solid rgba(255, 255, 255, 0.1);
          position: relative;
          transform: scale(0.92) translateY(20px);
          opacity: 0;
          transition: transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.4s ease;
          font-family: var(--font-body);
        }
        .auth-modal-overlay.open .auth-modal {
          transform: scale(1) translateY(0);
          opacity: 1;
        }

        /* --- Close Button --- */
        .auth-close-btn {
          position: absolute;
          top: 20px;
          right: 25px;
          background: none;
          border: none;
          color: #ffffff;
          font-size: 28px;
          cursor: pointer;
          z-index: 99;
          opacity: 0.7;
          transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
          line-height: 1;
          outline: none;
        }
        .auth-close-btn:hover {
          opacity: 1;
          transform: rotate(90deg) scale(1.15);
          color: var(--accent);
        }

        /* --- Left Side: Brand Panel --- */
        .auth-left-brand-pane {
          flex: 1.1;
          padding: 45px 40px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          text-align: center;
          position: relative;
          overflow: hidden;
          border-right: 1px solid var(--border-color);
          background: #000000;
        }

        /* Moving Cyber Grid */
        .auth-brand-grid-animated {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          opacity: 0.15;
          pointer-events: none;
          background-image: 
            linear-gradient(rgba(168, 240, 70, 0.15) 1px, transparent 1px),
            linear-gradient(90deg, rgba(168, 240, 70, 0.15) 1px, transparent 1px);
          background-size: 30px 30px;
          animation: scrollGrid 10s linear infinite;
        }

        /* Pulsating glow behind logo */
        .auth-logo-glow-ring {
          position: absolute;
          width: 250px;
          height: 250px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(168, 240, 70, 0.08) 0%, rgba(168, 240, 70, 0) 70%);
          z-index: 1;
          pointer-events: none;
          animation: pulseGlow 4s ease-in-out infinite;
        }

        .auth-brand-logo-container {
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 35px;
          z-index: 2;
        }

        .auth-brand-logo-animated {
          animation: logoFloat 4s ease-in-out infinite;
          filter: drop-shadow(0 5px 15px rgba(0,0,0,0.6));
          transition: transform 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
        }
        .auth-brand-logo-animated:hover {
          transform: scale(1.06) translateY(-4px);
        }

        .auth-brand-welcome-title {
          font-size: 26px;
          font-weight: 800;
          margin-bottom: 12px;
          font-family: var(--font-heading);
          color: #ffffff;
          z-index: 2;
          position: relative;
        }
        .auth-brand-welcome-subtitle {
          font-size: 15px;
          font-weight: 600;
          color: var(--text-muted);
          font-family: var(--font-body);
          margin: 0;
          z-index: 2;
          position: relative;
        }

        /* --- Right Side: Form Container --- */
        .auth-right-form-pane {
          flex: 1.2;
          display: flex;
          background: #0E120F;
          position: relative;
          padding: 15px;
        }

        .auth-white-form-card {
          flex: 1;
          background: var(--bg-secondary);
          border-radius: 18px;
          padding: 40px 35px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          color: var(--text-primary);
          border: 1px solid var(--border-color);
          box-shadow: var(--glass-shadow);
          overflow-y: auto;
        }

        .auth-card-title-main {
          font-size: 24px;
          font-weight: 800;
          margin-bottom: 5px;
          font-family: var(--font-heading);
          color: var(--text-primary);
          text-align: center;
        }

        /* Error Alert Container */
        .auth-error-container {
          color: #d92b2b;
          background: rgba(217, 43, 43, 0.08);
          padding: 10px 14px;
          border-radius: 8px;
          font-size: 12px;
          font-weight: 600;
          margin-bottom: 15px;
          border: 1px solid rgba(217, 43, 43, 0.15);
          animation: shakeError 0.4s ease-in-out;
        }

        /* Input Elements */
        .auth-input-container {
          display: flex;
          align-items: center;
          border: 1px solid var(--border-color);
          border-radius: 8px;
          background: var(--bg-tertiary);
          overflow: hidden;
          transition: border-color 0.3s ease, box-shadow 0.3s ease;
        }
        .auth-input-container:focus-within {
          border-color: var(--accent);
          box-shadow: 0 0 12px rgba(168, 240, 70, 0.2);
        }

        .auth-select-prefix {
          appearance: none;
          WebkitAppearance: none;
          border: none; 
          background: transparent; 
          outline: none; 
          padding: 13px 28px 13px 16px; 
          font-size: 15px; 
          font-weight: 700; 
          color: var(--text-primary); 
          cursor: pointer;
          font-family: var(--font-body);
        }

        .auth-select-arrow-icon {
          position: absolute;
          right: 10px;
          top: 50%;
          transform: translateY(-50%);
          pointer-events: none;
          display: flex;
          align-items: center;
          color: var(--text-primary);
        }

        .auth-input-field {
          flex: 1;
          border: none;
          padding: 13px 16px;
          font-size: 15px;
          outline: none;
          background: transparent;
          color: var(--text-primary);
          font-family: var(--font-body);
        }

        .auth-otp-input-field {
          width: 100%;
          padding: 13px 15px;
          border-radius: 8px;
          border: 1px solid var(--border-color);
          font-size: 20px;
          text-align: center;
          letter-spacing: 0.5em;
          outline: none;
          background: var(--bg-tertiary);
          color: var(--text-primary);
          transition: border-color 0.3s ease, box-shadow 0.3s ease;
          font-family: var(--font-body);
        }
        .auth-otp-input-field:focus {
          border-color: var(--accent);
          box-shadow: 0 0 12px rgba(168, 240, 70, 0.25);
        }

        /* --- Buttons --- */
        .auth-submit-btn-animated {
          width: 100%;
          padding: 14px;
          background: var(--accent);
          color: #000000;
          border: none;
          border-radius: 8px;
          font-weight: 800;
          font-size: 14px;
          cursor: pointer;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
          font-family: var(--font-heading);
          position: relative;
          overflow: hidden;
          box-shadow: 0 4px 15px rgba(168, 240, 70, 0.2);
        }
        .auth-submit-btn-animated:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(168, 240, 70, 0.4);
          background: #bbf861;
        }
        .auth-submit-btn-animated:active:not(:disabled) {
          transform: translateY(1px);
        }
        .auth-submit-btn-animated:disabled {
          background: var(--text-muted);
          cursor: not-allowed;
          box-shadow: none;
        }
        .auth-submit-btn-animated::after {
          content: '';
          position: absolute;
          top: 0;
          left: -50%;
          width: 200%;
          height: 100%;
          background: linear-gradient(
            to right,
            rgba(255, 255, 255, 0) 0%,
            rgba(255, 255, 255, 0.25) 50%,
            rgba(255, 255, 255, 0) 100%
          );
          transform: skewX(-25deg);
          transition: 0.75s;
          opacity: 0;
        }
        .auth-submit-btn-animated:hover::after {
          left: 125%;
          opacity: 1;
          transition: all 0.75s ease;
        }

        .auth-change-number-btn {
          background: none;
          border: none;
          color: var(--text-secondary);
          font-size: 13px;
          font-weight: 700;
          text-decoration: underline;
          margin-top: 15px;
          cursor: pointer;
          outline: none;
          transition: color 0.3s ease;
        }
        .auth-change-number-btn:hover {
          color: var(--accent);
        }

        /* --- Custom Links --- */
        .auth-link-animated {
          color: var(--accent);
          font-weight: 600;
          text-decoration: none;
          position: relative;
          transition: color 0.3s ease;
        }
        .auth-link-animated::after {
          content: '';
          position: absolute;
          width: 100%;
          transform: scaleX(0);
          height: 1.5px;
          bottom: -2px;
          left: 0;
          background-color: var(--accent);
          transform-origin: bottom right;
          transition: transform 0.25s ease-out;
        }
        .auth-link-animated:hover {
          color: #ffffff;
          text-shadow: 0 0 8px rgba(168, 240, 70, 0.3);
        }
        .auth-link-animated:hover::after {
          transform: scaleX(1);
          transform-origin: bottom left;
          background-color: #ffffff;
        }

        .auth-trouble-container {
          text-align: center;
          margin-top: 20px;
          font-size: 13px;
          color: var(--text-muted);
          border-top: 1px solid var(--border-color);
          padding-top: 15px;
        }

        /* --- Animations --- */
        @keyframes scrollGrid {
          0% { background-position: 0 0; }
          100% { background-position: 60px 60px; }
        }

        @keyframes pulseGlow {
          0%, 100% { transform: scale(1); opacity: 0.6; }
          50% { transform: scale(1.15); opacity: 0.9; }
        }

        @keyframes logoFloat {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }

        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(15px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes shakeError {
          0%, 100% { transform: translateX(0); }
          20%, 60% { transform: translateX(-6px); }
          40%, 80% { transform: translateX(6px); }
        }

        .auth-form-step-fade {
          animation: slideInUp 0.4s cubic-bezier(0.25, 1, 0.5, 1) forwards;
        }

        .auth-success-icon-spin {
          stroke-dasharray: 100;
          stroke-dashoffset: 100;
          animation: strokeSuccess 0.6s cubic-bezier(0.65, 0, 0.45, 1) forwards 0.2s;
        }

        @keyframes strokeSuccess {
          100% { stroke-dashoffset: 0; }
        }

        /* --- Responsive Styles --- */
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
            padding: 30px 20px !important;
          }
        }
      `}</style>
    </div>
  );
}
