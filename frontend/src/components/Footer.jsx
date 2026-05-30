import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="main-footer">
      <div className="footer-container">
        {/* Top Section: Brand + Tagline */}
        <div className="footer-top-row">
          <div className="footer-brand-logo">
            <span className="brand-text">SNAZZWEAR</span><span className="brand-badge">S</span>
          </div>
          <div className="footer-tagline">
            WE DEFINE MODERN STREETWEAR FOR THE NEXT GENERATION
          </div>
        </div>

        <hr className="footer-divider" />

        {/* Middle Section */}
        <div className="footer-middle-row">
          {/* Left Side: Subscription */}
          <div className="footer-sub-col">
            <h4 className="footer-sub-title">Subscribe to our newsletter</h4>
            <form className="footer-sub-form" onSubmit={(e) => e.preventDefault()}>
              <div className="footer-sub-input-wrapper">
                <input type="email" placeholder="Email*" className="footer-sub-input" required />
                <button type="submit" className="footer-sub-btn">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
                </button>
              </div>
            </form>
            <p className="footer-sub-desc">
              By subscribing you agree to our <a href="#">privacy policy</a> and it's terms.
            </p>
          </div>

          {/* Right Side: Links columns */}
          <div className="footer-links-wrapper">
            <div className="footer-links-col">
              <Link to="/">ABOUT US</Link>
              <Link to="/shop">COLLECTIONS</Link>
              <Link to="/shop">LOOKBOOKS</Link>
              <Link to="/shop">STORES</Link>
            </div>
            <div className="footer-links-col">
              <a href="#">SIZING GUIDE</a>
              <a href="#">SHIPPING & RETURNS</a>
              <a href="#">JOURNAL</a>
              <a href="#">CAREERS</a>
            </div>
            <div className="footer-links-col">
              <a href="#">CONTACT</a>
              <a href="#">PRIVACY POLICY</a>
              <a href="#">TERMS OF SERVICE</a>
            </div>
          </div>
        </div>

        <hr className="footer-divider" />

        {/* Bottom Section */}
        <div className="footer-bottom-row">
          <div className="footer-copy">
            © Snazz Wear 2026
          </div>
          <div className="footer-socials">
            <a href="#" aria-label="Instagram">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
            </a>
            <a href="#" aria-label="LinkedIn">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>
            </a>
          </div>
          <div className="footer-by">
            Website by Antigravity
          </div>
        </div>
      </div>
    </footer>
  );
}
