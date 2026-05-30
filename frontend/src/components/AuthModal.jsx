import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

export default function AuthModal({ isOpen, onClose }) {
  const { login, signup } = useAuth();
  const [step, setStep] = useState(1); // 1 = Phone, 2 = OTP, 3 = Success
  const [phonePrefix, setPhonePrefix] = useState('+91');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState(['', '', '', '']);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isExistingUser, setIsExistingUser] = useState(true);

  if (!isOpen) return null;

  const handlePhoneSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!/^\d{10}$/.test(phoneNumber)) {
      setError('Please enter a valid 10-digit mobile number.');
      return;
    }
    
    setLoading(true);
    const username = `${phonePrefix}${phoneNumber}`;
    
    try {
      const response = await fetch('/api/auth/check-phone/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username }),
      });
      
      const data = await response.json();
      setLoading(false);
      
      if (response.ok) {
        setIsExistingUser(data.exists);
        setStep(2);
      } else {
        setError(data.message || 'Verification failed. Please try again.');
      }
    } catch (err) {
      setLoading(false);
      setError('An error occurred. Please try again.');
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    const otpCode = otp.join('');
    if (otpCode.length !== 4) {
      setError('Please enter all 4 digits of the OTP.');
      return;
    }
    
    setLoading(true);
    const username = `${phonePrefix}${phoneNumber}`;
    const password = 'defaultOTPPass123!';
    
    let res;
    if (isExistingUser) {
      res = await login(username, password);
    } else {
      const email = `${phonePrefix.replace('+', '')}${phoneNumber}@snazzwear.com`;
      res = await signup(username, email, password);
    }
    
    setLoading(false);
    if (res && res.success) {
      setStep(3);
      setTimeout(() => {
        setStep(1);
        setPhoneNumber('');
        setOtp(['', '', '', '']);
        onClose();
        window.location.reload();
      }, 1500);
    } else {
      setError(res?.message || 'Invalid OTP code. Please try again.');
    }
  };

  const handleOtpChange = (element, index) => {
    if (isNaN(element.value)) return false;

    const newOtp = [...otp];
    newOtp[index] = element.value;
    setOtp(newOtp);

    // Auto-focus next input
    if (element.value !== '' && element.nextSibling) {
      element.nextSibling.focus();
    }
  };

  const handleOtpKeyDown = (e, index) => {
    if (e.key === 'Backspace') {
      if (otp[index] === '' && e.target.previousSibling) {
        e.target.previousSibling.focus();
      }
    }
  };

  return (
    <div 
      className={`auth-modal-overlay ${isOpen ? 'open' : ''}`} 
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="auth-modal">
        <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
          {step === 3 ? (
            <div className="auth-form-step-fade" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center', padding: '20px 0' }}>
              <div style={{ marginBottom: '20px' }}>
                <svg className="auth-success-icon-spin" xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                  <polyline points="22 4 12 14.01 9 11.01"></polyline>
                </svg>
              </div>
              <h3 style={{ fontSize: '22px', fontWeight: '800', lineHeight: '1.4', marginBottom: '15px', color: 'var(--text-primary)', fontFamily: "var(--font-heading)" }}>
                🎉 CONGRATULATIONS!<br />SUCCESSFULLY AUTHENTICATED!
              </h3>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
              
              {step === 1 ? (
                <div key="phone-entry" className="auth-form-step-fade">
                  <h3 className="auth-card-title-main">Login or Sign Up</h3>
                  <p className="auth-card-subtitle-sub">
                    Enter your mobile number to proceed
                  </p>

                  {error && (
                    <div className="auth-error-container">
                      {error}
                    </div>
                  )}

                  <form onSubmit={handlePhoneSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div className="auth-input-group-stacked">
                      <label className="auth-input-label-caps">Mobile Number</label>
                      <div className="auth-phone-input-row">
                        <span className="auth-phone-prefix">+91</span>
                        <div className="auth-phone-divider"></div>
                        <input 
                          type="tel" 
                          placeholder="Enter Mobile Number" 
                          value={phoneNumber}
                          onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, '').slice(0, 10))}
                          className="auth-phone-number-field"
                          required
                        />
                      </div>
                    </div>

                    <button 
                      type="submit" 
                      disabled={loading}
                      className="auth-submit-btn-animated"
                    >
                      {loading ? 'Proceeding...' : 'PROCEED'}
                    </button>
                  </form>
                </div>
              ) : (
                <div key="otp" className="auth-form-step-fade">
                  <h3 className="auth-card-title-main">Verify OTP</h3>
                  <p className="auth-card-subtitle-sub">
                    Sent to <span style={{ color: 'var(--text-primary)', fontWeight: '700' }}>{phonePrefix} {phoneNumber}</span>
                    <button 
                      type="button" 
                      onClick={() => { setStep(1); setError(''); setOtp(['', '', '', '']); }}
                      className="auth-edit-phone-btn"
                    >
                      Edit
                    </button>
                  </p>

                  {error && (
                    <div className="auth-error-container">
                      {error}
                    </div>
                  )}

                  <form onSubmit={handleOtpSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div className="auth-input-group-stacked">
                      <label className="auth-input-label-caps" style={{ textAlign: 'center', marginBottom: '12px' }}>Enter 4-digit code</label>
                      <div className="auth-otp-inputs-row">
                        {otp.map((data, index) => (
                          <input
                            key={index}
                            type="text"
                            maxLength="1"
                            value={data}
                            onChange={(e) => handleOtpChange(e.target, index)}
                            onKeyDown={(e) => handleOtpKeyDown(e, index)}
                            className="auth-otp-box"
                          />
                        ))}
                      </div>
                    </div>

                    <button 
                      type="submit" 
                      disabled={loading}
                      className="auth-submit-btn-animated"
                    >
                      {loading ? 'Verifying...' : 'VERIFY & PROCEED'}
                    </button>
                  </form>

                  <div style={{ textAlign: 'center', marginTop: '20px', fontSize: '13px', color: 'var(--text-muted)' }}>
                    Didn't receive code?{' '}
                    <button 
                      type="button" 
                      onClick={() => { setError(''); alert('OTP resent successfully!'); }}
                      className="auth-change-number-btn"
                      style={{ display: 'inline', margin: 0, padding: 0 }}
                    >
                      Resend
                    </button>
                  </div>
                </div>
              )}

              <div className="auth-footer-agreement-text">
                By logging in, you're agreeing to our <br />
                <a href="#" className="auth-link-animated">Privacy Policy</a> <a href="#" className="auth-link-animated" style={{ marginLeft: '5px' }}>Terms of Service</a>
              </div>

            </div>
          )}
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
          align-items: flex-start;
          overflow-y: auto;
          padding: 40px 20px;
          box-sizing: border-box;
          z-index: 9999;
          opacity: 0;
          visibility: hidden;
          transition: opacity 0.4s ease, visibility 0.4s ease;
        }
        .auth-modal-overlay.open {
          opacity: 1;
          visibility: visible;
        }

        /* --- Phone & OTP Custom Layout Elements --- */
        .auth-phone-input-row {
          display: flex;
          align-items: center;
          background: #000000;
          border: 1px solid rgba(255, 255, 255, 0.15);
          border-radius: 12px;
          padding: 2px 14px;
          transition: border-color 0.3s ease, box-shadow 0.3s ease;
          width: 100%;
          box-sizing: border-box;
        }
        .auth-phone-input-row:focus-within {
          border-color: var(--accent);
          box-shadow: 0 0 12px rgba(168, 240, 70, 0.2);
        }
        .auth-phone-prefix {
          background: transparent;
          border: none;
          color: var(--text-primary);
          font-size: 16px;
          font-weight: 700;
          outline: none;
          padding: 10px 0;
          font-family: var(--font-body);
        }
        .auth-phone-divider {
          width: 1px;
          height: 24px;
          background: rgba(255, 255, 255, 0.15);
          margin: 0 14px;
        }
        .auth-phone-number-field {
          flex: 1;
          background: transparent !important;
          border: none !important;
          color: var(--text-primary) !important;
          font-size: 16px !important;
          outline: none !important;
          padding: 10px 0 !important;
          box-shadow: none !important;
          font-family: var(--font-body);
        }
        .auth-otp-inputs-row {
          display: flex;
          justify-content: center;
          gap: 15px;
          margin-bottom: 10px;
        }
        .auth-otp-box {
          width: 50px;
          height: 50px;
          border: 1px solid rgba(255, 255, 255, 0.15);
          background: #000000;
          color: var(--text-primary);
          border-radius: 12px;
          text-align: center;
          font-size: 20px;
          font-weight: 700;
          outline: none;
          transition: all 0.3s ease;
          font-family: var(--font-body);
        }
        .auth-otp-box:focus {
          border-color: var(--accent);
          box-shadow: 0 0 12px rgba(168, 240, 70, 0.25);
        }
        .auth-edit-phone-btn {
          color: var(--accent);
          text-decoration: none;
          font-size: 11px;
          font-weight: 700;
          border: 1px solid var(--accent);
          border-radius: 10px;
          padding: 1px 8px;
          margin-left: 6px;
          transition: all 0.2s ease;
          background: transparent;
          cursor: pointer;
          font-family: var(--font-body);
          outline: none;
        }
        .auth-edit-phone-btn:hover {
          background: var(--accent);
          color: #000000;
        }

        /* --- Modal Container --- */
        .auth-modal {
          display: flex;
          flex-direction: column;
          width: 90%;
          max-width: 440px;
          background: #0A0E0B;
          border-radius: 20px;
          padding: 40px 30px;
          box-shadow: 0 30px 60px rgba(0,0,0,0.85), 0 0 40px rgba(168, 240, 70, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.08);
          position: relative;
          margin: auto;
          transform: scale(0.92) translateY(20px);
          opacity: 0;
          transition: transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.4s ease;
          font-family: var(--font-body);
          box-sizing: border-box;
        }
        .auth-modal-overlay.open .auth-modal {
          transform: scale(1) translateY(0);
          opacity: 1;
        }

        /* --- Close Button --- */
        .auth-close-btn {
          position: absolute;
          top: 15px;
          right: 20px;
          background: none;
          border: none;
          color: #ffffff;
          font-size: 24px;
          cursor: pointer;
          z-index: 99;
          opacity: 0.6;
          transition: all 0.3s ease;
          line-height: 1;
          outline: none;
        }
        .auth-close-btn:hover {
          opacity: 1;
          transform: scale(1.1);
        }

        .auth-card-title-main {
          font-size: 28px;
          font-weight: 800;
          margin-bottom: 8px;
          font-family: var(--font-heading);
          color: var(--text-primary);
          text-align: center;
          letter-spacing: -0.5px;
        }

        .auth-card-subtitle-sub {
          font-size: 14px;
          color: #8A8E8C;
          margin-bottom: 28px;
          text-align: center;
          font-weight: 500;
          font-family: var(--font-body);
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

        /* Stacked Input Stack styling */
        .auth-input-group-stacked {
          display: flex;
          flex-direction: column;
          align-items: stretch;
        }
        
        .auth-input-label-caps {
          font-size: 11px;
          font-weight: 700;
          color: #6C706E;
          text-transform: uppercase;
          letter-spacing: 0.8px;
          margin-bottom: 8px;
          text-align: left;
        }

        /* --- Buttons --- */
        .auth-submit-btn-animated {
          width: 100%;
          padding: 16px;
          background: var(--accent);
          color: #000000;
          border: none;
          border-radius: 12px;
          font-weight: 800;
          font-size: 14px;
          cursor: pointer;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
          font-family: var(--font-heading);
          position: relative;
          overflow: hidden;
          box-shadow: 0 0 15px rgba(168, 240, 70, 0.3);
        }
        .auth-submit-btn-animated:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 0 25px rgba(168, 240, 70, 0.5);
          background: #bbf861;
        }
        .auth-submit-btn-animated:active:not(:disabled) {
          transform: translateY(1px);
        }
        .auth-submit-btn-animated:disabled {
          background: rgba(255, 255, 255, 0.1);
          color: rgba(255, 255, 255, 0.3);
          cursor: not-allowed;
          box-shadow: none;
        }

        .auth-change-number-btn {
          background: none;
          border: none;
          color: var(--accent);
          font-size: 13px;
          font-weight: 700;
          text-decoration: underline;
          cursor: pointer;
          outline: none;
        }
        .auth-change-number-btn:hover {
          color: #bbf861;
        }

        /* --- Custom Links --- */
        .auth-link-animated {
          color: var(--accent);
          font-weight: 700;
          text-decoration: none;
        }
        .auth-link-animated:hover {
          text-decoration: underline;
        }

        .auth-footer-agreement-text {
          font-size: 11px;
          color: #5A5E5C;
          text-align: center;
          margin-top: 25px;
          line-height: 1.5;
        }

        /* --- Animations --- */
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
        @media (max-width: 480px) {
          .auth-modal {
            max-width: 90% !important;
            height: auto !important;
            border-radius: 20px !important;
            margin: auto !important;
          }
        }
      `}</style>
    </div>
  );
}
