import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="main-footer">
      {/* Top section: Brand + Social + Link Columns */}
      <div className="footer-top">
        {/* Left: Brand + Social Icons */}
        <div className="footer-brand-col">
          <h1 className="footer-logo">SNAZZ<br />WEAR</h1>
          <div className="footer-socials">
            {/* Facebook */}
            <a href="#" className="social-icon" title="Facebook">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" /></svg>
            </a>
            {/* X / Twitter */}
            <a href="#" className="social-icon" title="X">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
            </a>
            {/* Instagram */}
            <a href="#" className="social-icon" title="Instagram">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" x2="17.51" y1="6.5" y2="6.5" /></svg>
            </a>
            {/* Pinterest */}
            <a href="#" class="social-icon" title="Pinterest">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.373 0 0 5.373 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 0 1 .083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.632-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0z" /></svg>
            </a>
          </div>
        </div>

        {/* Center: SHOP Column */}
        <div className="footer-col">
          <h4 className="footer-col-heading">SHOP</h4>
          <Link to="/shop" className="footer-link footer-link-highlight">BEST SELLERS</Link>
          <Link to="/shop" className="footer-link">Special Prices</Link>
          <Link to="/shop" className="footer-link">T-Shirts</Link>
          <Link to="/shop" className="footer-link">Oversized T-shirt</Link>
          <Link to="/shop" className="footer-link">Oversized Shirt</Link>
          <Link to="/shop" className="footer-link footer-link-highlight">NEW ARRIVALS</Link>
          <Link to="/shop" className="footer-link">Signature</Link>
        </div>

        {/* Center: TRENDING Column */}
        <div class="footer-col">
          <h4 className="footer-col-heading">TRENDING</h4>
          <Link to="/shop" className="footer-link">Premium Collection</Link>
          <Link to="/shop" className="footer-link">Anime Collection</Link>
          <Link to="/shop" className="footer-link footer-link-highlight">Oversized T-shirt</Link>
          <Link to="/shop" className="footer-link footer-link-highlight">Oversized Shirt</Link>
          <Link to="/shop" className="footer-link">Bottoms for Women</Link>
          <Link to="/shop" className="footer-link">Bottoms for Men</Link>
          <Link to="/shop" className="footer-link">Sweatshirts &amp; Hoodies</Link>
          <Link to="/shop" className="footer-link">Jacket</Link>
        </div>

        {/* Right: INFO Column */}
        <div className="footer-col">
          <h4 className="footer-col-heading">INFO</h4>
          <a href="#" className="footer-link">Terms &amp; Conditions</a>
          <a href="#" className="footer-link">Stores Near Me</a>
          <a href="#" className="footer-link">Blogs</a>
          <a href="#" className="footer-link">FAQs</a>
          <a href="#" className="footer-link">Contact</a>
          <a href="#" className="footer-link">Privacy Policy</a>
          <a href="#" className="footer-link">Returns and Exchange Policy</a>
          <a href="#" className="footer-link footer-link-highlight">Offers and Deals</a>
        </div>
      </div>

      {/* Middle section: Explore + Newsletter */}
      <div className="footer-middle">
        {/* Explore */}
        <div className="footer-explore">
          <h4 className="footer-col-heading">Explore</h4>
          <Link to="/shop" className="footer-link">Search</Link>
          <a href="#" className="footer-link">Return</a>
          <Link to="/" className="footer-link">About Us</Link>
        </div>

        {/* Newsletter */}
        <div className="footer-newsletter">
          <h4 className="footer-newsletter-title">WE'VE GOT YOU COVERED:</h4>
          <p className="footer-newsletter-sub">Beyond the Outfit: Be the first to know about new arrivals,<br />sales &amp; exclusive drops.</p>
          <div className="footer-email-row">
            <input type="email" placeholder="Email" className="footer-email-input" />
            <button className="footer-email-btn">→</button>
          </div>
        </div>
      </div>

      {/* App Store Section */}
      <div className="footer-app-section">
        <p className="footer-app-label">📱 EXPERIENCE THE SNAZZ WEAR APP</p>
        <div className="footer-app-btns">
          <a href="#" className="app-store-btn">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 512 512" fill="currentColor"><path d="M325.3 234.3L104.6 13l280.8 161.2-60.1 60.1zM47 0C34 6.8 25.3 19.2 25.3 35.3v441.3c0 16.1 8.7 28.5 21.7 35.3l2.7 1.5 247.2-247v-5.8L47 0zm425.2 225L381.7 173 325.3 229.4l56.5 56.5 90.8-52.2c25.9-14.9 25.9-39.1-.4-48.7zM104.6 499l280.8-161.2-60.1-60.1L104.6 499z" /></svg>
            GET IT ON<br /><strong>Google Play</strong>
          </a>
          <a href="#" className="app-store-btn">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 384 512" fill="currentColor"><path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z" /></svg>
            Download on the<br /><strong>App Store</strong>
          </a>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="footer-bottom">
        <p>© 2025 SNAZZ WEAR®. All rights reserved. Designed by Prem</p>
        <div className="payment-icons">
          <div className="pay-pill">VISA</div>
          <div className="pay-pill">Mastercard</div>
          <div className="pay-pill">PayPal</div>
          <div className="pay-pill">GPay</div>
        </div>
      </div>
    </footer>
  );
}
