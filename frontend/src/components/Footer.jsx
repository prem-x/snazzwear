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
