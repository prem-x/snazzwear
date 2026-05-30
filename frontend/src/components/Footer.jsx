import { Link } from 'react-router-dom';
export default function Footer() {
  return (
    <footer className="main-footer">
      <div className="footer-container">
        {/* Top section: Left (Brand, Desc, Email) + Right (Nav, Socials) */}
        <div className="footer-top-section">
          {/* Left Block */}
          <div className="footer-left-block">
            <h2 className="footer-brand-title">SNAZZ</h2>
            <p className="footer-brand-desc">
              SNAZZ is a modern, elegant name that reflects premium quality and a strong brand identity.
            </p>
            <form className="footer-subscribe-form" onSubmit={(e) => e.preventDefault()}>
              <input 
                type="email" 
                placeholder="Email address" 
                className="footer-sub-input" 
                required 
              />
              <button type="submit" className="footer-sub-btn">
                Subscribe ↗
              </button>
            </form>
          </div>

          {/* Right Block */}
          <div className="footer-right-block">
            {/* Nav links */}
            <nav className="footer-nav-links">
              <Link to="/">Home</Link>
              <Link to="/shop">Models</Link>
              <Link to="/shop">Features</Link>
              <Link to="/shop">Technology</Link>
              <Link to="/shop">Contact Us</Link>
            </nav>

            {/* Social icons */}
            <div className="footer-social-row">
              <a href="#" className="social-pill-btn" aria-label="X (formerly Twitter)">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4l11.733 16h4.267l-11.733 -16z" /><path d="M4 20l6.768 -6.768m2.46 -2.46l6.772 -6.772" /></svg>
              </a>
              <a href="#" className="social-pill-btn" aria-label="Facebook">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" /></svg>
              </a>
              <a href="#" className="social-pill-btn" aria-label="LinkedIn">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
              </a>
              <a href="#" className="social-pill-btn" aria-label="Instagram">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" x2="17.51" y1="6.5" y2="6.5" /></svg>
              </a>
              <a href="#" className="social-pill-btn" aria-label="YouTube">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33 2.78 2.78 0 0 0 1.94 2C5.12 20 12 20 12 20s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon></svg>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom section (above divider) */}
        <div className="footer-copyright-section">
          <p className="footer-copyright-text">
            &copy; 2026 SNAZZ. Engineered for the void.
          </p>
          <div className="footer-bottom-links">
            <a href="#">Terms</a>
            <a href="#">Privacy</a>
            <a href="#">Support</a>
          </div>
        </div>

        {/* Thin Horizontal Divider */}
        <hr className="footer-divider-line" />

        <div className="footer-graphic-section">
          <h1 className="footer-giant-bg-text">SNAZZ</h1>
        </div>
      </div>
    </footer>
  );
}
