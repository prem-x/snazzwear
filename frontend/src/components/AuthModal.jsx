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
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        background: 'rgba(0, 0, 0, 0.8)',
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
          maxWidth: '920px',
          minHeight: '480px',
          background: '#000000',
          borderRadius: '24px',
          overflow: 'hidden',
          boxShadow: '0 30px 60px rgba(0,0,0,0.85)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
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

        {/* Left Side: Brand Pane */}
        <div style={{ flex: 1.1, padding: '45px 40px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center', position: 'relative', overflow: 'hidden', borderRight: '1px solid rgba(255,255,255,0.05)', background: '#000000' }} className="auth-left-brand-pane">
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, opacity: 0.03, pointerEvents: 'none', backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
          
          <div style={{ zIndex: 2, width: '100%' }}>
            {/* BONKERS CORNER and Kwik Pass Badge Row */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '15px', marginBottom: '35px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', textAlign: 'left', fontFamily: "'Syne', 'Outfit', 'Arial Black', sans-serif", fontWeight: '900', color: '#ffffff', letterSpacing: '-1.5px', lineHeight: '0.85' }}>
                <span style={{ fontSize: '30px' }}>BONKERS</span>
                <span style={{ fontSize: '30px' }}>CORNER</span>
              </div>
              
              {/* Kwik Pass Badge */}
              <div style={{ display: 'flex', alignItems: 'center', fontFamily: "'Outfit', sans-serif", fontSize: '15px', fontWeight: '800', color: '#ffffff', gap: '2px' }}>
                <span>Kwik</span>
                <span style={{ color: '#ffb800', display: 'flex', alignItems: 'center', margin: '0 2px' }}>
                  <svg width="14" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19 9h-6l3-7L5 15h6l-3 7z"/>
                  </svg>
                </span>
                <span>Pass</span>
              </div>
            </div>

            {/* Welcoming Text */}
            <h2 style={{ fontSize: '26px', fontWeight: '800', marginBottom: '12px', fontFamily: "'Outfit', sans-serif", color: '#ffffff' }}>Welcome!</h2>
            <p style={{ fontSize: '15px', fontWeight: '600', color: '#c1c3c9', fontFamily: "'Plus Jakarta Sans', sans-serif", margin: 0 }}>Register to avail the best deals!</p>
          </div>
        </div>

        {/* Right Side: Form Card Container */}
        <div style={{ flex: 1.2, display: 'flex', background: '#000000', position: 'relative', padding: '15px' }} className="auth-right-form-pane">
          <div style={{ flex: 1, background: '#ffffff', borderRadius: '18px', padding: '40px 35px', display: 'flex', flexDirection: 'column', justifyContent: 'center', color: '#0c0d12', boxShadow: 'inset 0 0 1px rgba(0,0,0,0.1)', overflowY: 'auto' }} className="auth-white-form-card">
            
            {success ? (
              <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100%', textAlign: 'center' }}>
                <div style={{ marginBottom: '20px' }}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="#0c0d12" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                    <polyline points="22 4 12 14.01 9 11.01"></polyline>
                  </svg>
                </div>
                <h3 style={{ fontSize: '22px', fontWeight: '800', lineHeight: '1.4', marginBottom: '15px', color: '#0c0d12', fontFamily: "'Outfit', sans-serif" }}>
                  🎉 CONGRATULATIONS!<br />YOU ARE LOGGED IN!
                </h3>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'center' }}>
                
                <h3 style={{ fontSize: '24px', fontWeight: '800', marginBottom: '5px', fontFamily: "'Outfit', sans-serif", color: '#0c0d12', textAlign: 'center' }}>Login/Signup</h3>
                
                {step === 1 ? (
                  <>
                    <p style={{ fontSize: '14px', color: '#686a73', marginBottom: '25px', textAlign: 'center', fontWeight: '500' }}>Enter Mobile Number</p>

                    {error && (
                      <div style={{ color: '#d92b2b', background: 'rgba(217, 43, 43, 0.08)', padding: '10px 14px', borderRadius: '8px', fontSize: '12px', fontWeight: '600', marginBottom: '15px', border: '1px solid rgba(217, 43, 43, 0.15)' }}>
                        {error}
                      </div>
                    )}

                    <form onSubmit={handlePhoneSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #cbd5e1', borderRadius: '8px', background: '#ffffff', overflow: 'hidden' }}>
                        <div style={{ display: 'flex', alignItems: 'center', position: 'relative', borderRight: '1px solid #e2e8f0', background: 'transparent' }}>
                          <select 
                            value={phonePrefix}
                            onChange={(e) => setPhonePrefix(e.target.value)}
                            style={{ 
                              appearance: 'none',
                              WebkitAppearance: 'none',
                              border: 'none', 
                              background: 'transparent', 
                              outline: 'none', 
                              padding: '13px 28px 13px 16px', 
                              fontSize: '15px', 
                              fontWeight: '700', 
                              color: '#000000', 
                              cursor: 'pointer' 
                            }}
                          >
                            <option value="+91">IN +91</option>
                            <option value="+1">US +1</option>
                            <option value="+44">GB +44</option>
                          </select>
                          <span style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', display: 'flex', alignItems: 'center', color: '#000000' }}>
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
                          style={{ flex: 1, border: 'none', padding: '13px 16px', fontSize: '15px', outline: 'none', background: 'transparent', color: '#000000' }}
                          required
                        />
                      </div>

                      <button 
                        type="submit" 
                        disabled={loading}
                        style={{ width: '100%', padding: '14px', background: loading ? '#b1b4be' : '#000000', color: '#ffffff', border: 'none', borderRadius: '8px', fontWeight: '800', fontSize: '14px', cursor: loading ? 'not-allowed' : 'pointer', textTransform: 'uppercase', letterSpacing: '0.5px', transition: 'all 0.3s ease' }}
                      >
                        {loading ? 'Please wait...' : 'PROCEED'}
                      </button>
                    </form>
                  </>
                ) : (
                  <>
                    <p style={{ fontSize: '13px', color: '#686a73', marginBottom: '20px', textAlign: 'center', fontWeight: '500' }}>
                      Enter OTP sent to {phonePrefix} {phoneNumber}
                    </p>

                    {error && (
                      <div style={{ color: '#d92b2b', background: 'rgba(217, 43, 43, 0.08)', padding: '10px 14px', borderRadius: '8px', fontSize: '12px', fontWeight: '600', marginBottom: '15px', border: '1px solid rgba(217, 43, 43, 0.15)' }}>
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
                        style={{ width: '100%', padding: '13px 15px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '20px', textAlign: 'center', letterSpacing: '0.5em', outline: 'none', background: '#ffffff', color: '#0f172a' }}
                        required
                      />

                      <button 
                        type="submit" 
                        disabled={loading}
                        style={{ width: '100%', padding: '14px', background: loading ? '#b1b4be' : '#000000', color: '#ffffff', border: 'none', borderRadius: '8px', fontWeight: '800', fontSize: '14px', cursor: loading ? 'not-allowed' : 'pointer', textTransform: 'uppercase', letterSpacing: '0.5px', transition: 'all 0.3s ease' }}
                      >
                        {loading ? 'Verifying...' : 'VERIFY & PROCEED'}
                      </button>
                    </form>
                    
                    <button 
                      onClick={() => { setStep(1); setOtp(''); setError(''); }}
                      style={{ background: 'none', border: 'none', color: '#686a73', fontSize: '13px', fontWeight: '700', textDecoration: 'underline', marginTop: '15px', cursor: 'pointer', outline: 'none' }}
                    >
                      Change Phone Number
                    </button>
                  </>
                )}

                <div style={{ fontSize: '11px', color: '#8c8f9a', textAlign: 'center', marginTop: '25px', lineHeight: '1.4' }}>
                  By logging in, you're agreeing to our <br />
                  <a href="#" style={{ color: '#5f768b', fontWeight: '600', textDecoration: 'underline' }}>Privacy Policy</a> <a href="#" style={{ color: '#5f768b', fontWeight: '600', textDecoration: 'underline', marginLeft: '5px' }}>Terms of Service</a>
                </div>

                <div style={{ textAlign: 'center', marginTop: '20px', fontSize: '13px', color: '#686a73', borderTop: '1px solid #f0f1f4', paddingTop: '15px' }}>
                  <a href="#" style={{ color: '#5f768b', fontWeight: '700', textDecoration: 'underline' }}>Trouble logging in?</a>
                </div>

              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
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
