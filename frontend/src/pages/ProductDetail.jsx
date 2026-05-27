import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import ProductCard from '../components/ProductCard';

export default function ProductDetail() {
  const { slug } = useParams();
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [selectedSizeName, setSelectedSizeName] = useState('—');
  const [quantity, setQuantity] = useState(1);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [openAccordion, setOpenAccordion] = useState(null);

  // Pincode state
  const [pincode, setPincode] = useState('');
  const [pincodeMessage, setPincodeMessage] = useState('');

  // Fetch product detail
  useEffect(() => {
    const fetchProductDetail = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/products/${slug}/`);
        if (response.ok) {
          const result = await response.json();
          setData(result);
          // Reset local selections
          setSelectedVariant(null);
          setSelectedSizeName('—');
          setQuantity(1);
          setActiveImageIndex(0);
        }
      } catch (error) {
        console.error('Error fetching product details:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProductDetail();
  }, [slug]);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh', color: 'var(--text-primary)' }}>
        <div className="loading-spinner">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="spin-icon"><path d="M21 12a9 9 0 1 1-6.219-8.56" /></svg>
          <span>RETRIEVING PRODUCT INFORMATION...</span>
        </div>
      </div>
    );
  }

  if (!data || !data.product) {
    return (
      <div style={{ padding: '80px 8%', textAlign: 'center', color: 'var(--text-primary)' }}>
        <h2>Product Not Found</h2>
        <Link to="/shop" className="btn-primary" style={{ marginTop: '20px' }}>Back to Shop</Link>
      </div>
    );
  }

  const { product, similar_products } = data;
  const images = product.images || [];
  const mainImageSrc = images[activeImageIndex] || '/static/images/sample1.png';
  const oldPrice = product.price + 200;

  const handleQtyMinus = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };

  const handleQtyPlus = () => {
    setQuantity(quantity + 1);
  };

  const handleSizeClick = (variant) => {
    if (variant.stock === 0) return;
    setSelectedVariant(variant.id);
    setSelectedSizeName(variant.size);
  };

  const handleAddToCart = async () => {
    if (!selectedVariant) return;
    await addToCart(selectedVariant, quantity);
  };

  const handleBuyNow = async () => {
    if (!selectedVariant) return;
    const res = await addToCart(selectedVariant, quantity);
    if (res.success) {
      navigate('/checkout');
    }
  };

  const handleCheckPincode = (e) => {
    e.preventDefault();
    if (!pincode.trim() || pincode.trim().length !== 6 || isNaN(pincode)) {
      setPincodeMessage('❌ Please enter a valid 6-digit Pincode.');
      return;
    }
    // Simulate delivery calculation
    const days = 3 + (parseInt(pincode.trim()) % 4);
    const date = new Date();
    date.setDate(date.getDate() + days);
    const dateString = date.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'short' });
    setPincodeMessage(`🚚 Delivery available! Expected by ${dateString}.`);
  };

  const toggleAccordion = (name) => {
    setOpenAccordion(openAccordion === name ? null : name);
  };

  return (
    <div className="page-wrapper">
      <section className="product-page">
        <div className="product-container">
          {/* LEFT SIDE: IMAGES */}
          <div className="product-left">
            <div className="main-product-image" id="mainImageContainer">
              <img src={mainImageSrc} id="mainImage" alt={product.name} />

              <div className="carousel-dots" id="carouselDots">
                {images.map((_, idx) => (
                  <span
                    key={idx}
                    className={`dot ${idx === activeImageIndex ? 'active' : ''}`}
                    onClick={() => setActiveImageIndex(idx)}
                  ></span>
                ))}
              </div>
            </div>

            {/* Thumbnail row */}
            <div className="thumbnail-row">
              {images.slice(0, 4).map((img, idx) => (
                <img
                  key={idx}
                  src={img}
                  className={`thumb ${idx === activeImageIndex ? 'active' : ''}`}
                  onClick={() => setActiveImageIndex(idx)}
                  alt={`${product.name} - Thumbnail ${idx}`}
                />
              ))}
              {Array.from({ length: Math.max(0, 4 - images.length) }).map((_, idx) => (
                <div className="thumb-placeholder" key={idx}>
                  <span></span>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT SIDE: PRODUCT DETAILS */}
          <div className="product-right">
            <h2 className="pd-title">{product.name}</h2>

            {/* Prices */}
            <div className="pd-price-row">
              <span className="pd-old-price">Rs.{oldPrice}</span>
              <span className="pd-new-price">Rs.{product.price}</span>
              <span className="pd-save-badge">SAVE 15%</span>
            </div>
            <p className="pd-shipping"><u>Shipping</u> calculated at checkout.</p>

            {/* Sizes Selector */}
            <div className="pd-size-box">
              <div className="pd-size-header">
                <span className="pd-size-label">SIZE: <span id="selectedSizeLabel">{selectedSizeName}</span></span>
                <a href="#" className="pd-sizing-guide" onClick={(e) => e.preventDefault()}>✏ Sizing guide</a>
              </div>

              <div className="pd-size-options">
                {product.variants?.map((v) => {
                  const isOutOfStock = v.stock === 0;
                  return (
                    <button
                      key={v.id}
                      type="button"
                      className={`pd-size-btn ${isOutOfStock ? 'pd-disabled' : ''} ${selectedVariant === v.id ? 'active' : ''}`}
                      onClick={() => handleSizeClick(v)}
                      disabled={isOutOfStock}
                    >
                      {v.size}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quantity and Actions */}
            <div className="pd-action-row">
              <div className="pd-qty">
                <button type="button" className="pd-qty-btn" onClick={handleQtyMinus}>−</button>
                <span id="qtyValue">{quantity}</span>
                <button type="button" className="pd-qty-btn" onClick={handleQtyPlus}>+</button>
              </div>
              <button
                id="addToCartBtn"
                className={`pd-add-btn ${selectedVariant ? 'enabled' : ''}`}
                onClick={handleAddToCart}
                disabled={!selectedVariant}
              >
                ADD TO CART
              </button>
            </div>

            <button
              className="pd-buy-btn"
              onClick={handleBuyNow}
              disabled={!selectedVariant}
              style={{ opacity: selectedVariant ? 1 : 0.6, cursor: selectedVariant ? 'pointer' : 'not-allowed' }}
            >
              BUY IT NOW
            </button>

            {/* Special Offers */}
            <div className="pd-offers-card">
              <p className="pd-offers-title">Special Offers</p>
              <div className="pd-offer-item">
                <span className="pd-offer-pill">Prepaid Discounts</span>
                <div className="pd-offer-text">
                  <strong>Get ₹40 Off on UPI</strong>
                  <p>5+ Discounts Available</p>
                </div>
              </div>
            </div>

            {/* Delivery Checker */}
            <div className="pd-delivery-card">
              <p className="pd-delivery-title">Check Delivery and Pickup:</p>
              <form onSubmit={handleCheckPincode} className="pd-delivery-row">
                <input
                  type="text"
                  className="pd-pincode-input"
                  placeholder="📍 Enter Pincode"
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                  maxLength={6}
                />
                <button type="submit" className="pd-check-btn">CHECK</button>
              </form>
              {pincodeMessage && (
                <p style={{ fontSize: '13px', fontWeight: '600', color: pincodeMessage.startsWith('❌') ? '#ff4757' : '#00b894', marginTop: '10px' }}>
                  {pincodeMessage}
                </p>
              )}
              <p className="pd-delivery-hint" style={{ marginTop: '10px' }}>
                Enter your pincode to <strong>check delivery date</strong> and <strong>nearby store availability</strong>
              </p>
            </div>

            {/* View Similar */}
            <div className="view-similar">
              <h4>VIEW SIMILAR</h4>
              <div className="similar-row">
                {similar_products?.slice(0, 4).map((p) => (
                  <Link key={p.id} to={`/product/${p.slug}`}>
                    <img src={p.image || '/static/images/sample1.png'} alt={p.name} />
                  </Link>
                ))}
              </div>
            </div>

            {/* Core Features */}
            <div className="core-features">
              <h4>CORE FEATURES</h4>
              <ul>
                <li>100% cotton</li>
                <li>220 gsm</li>
                <li>oversized fit</li>
                <li>round neck</li>
                <li>half sleeves</li>
              </ul>
            </div>

            {/* Accordion */}
            <div className="accordion">
              {/* Description */}
              <div className={`accordion-item ${openAccordion === 'desc' ? 'open' : ''}`}>
                <button className="accordion-btn" onClick={() => toggleAccordion('desc')}>
                  <span>DESCRIPTION</span>
                  <span className="acc-icon">{openAccordion === 'desc' ? '−' : '+'}</span>
                </button>
                {openAccordion === 'desc' && (
                  <div className="accordion-content" style={{ display: 'block', maxHeight: 'none' }}>
                    <p style={{ whiteSpace: 'pre-line' }}>{product.description}</p>
                  </div>
                )}
              </div>

              {/* Shipping */}
              <div className={`accordion-item ${openAccordion === 'ship' ? 'open' : ''}`}>
                <button className="accordion-btn" onClick={() => toggleAccordion('ship')}>
                  <span>SHIPPING</span>
                  <span className="acc-icon">{openAccordion === 'ship' ? '−' : '+'}</span>
                </button>
                {openAccordion === 'ship' && (
                  <div className="accordion-content" style={{ display: 'block', maxHeight: 'none' }}>
                    <p>We offer standard shipping across India. Orders are processed within 24-48 hours and typically delivered within 3-7 business days.</p>
                    <p>Free shipping is automatically applied at checkout for all prepaid orders above ₹999.</p>
                  </div>
                )}
              </div>

              {/* Returns */}
              <div className={`accordion-item ${openAccordion === 'return' ? 'open' : ''}`}>
                <button className="accordion-btn" onClick={() => toggleAccordion('return')}>
                  <span>RETURNS</span>
                  <span className="acc-icon">{openAccordion === 'return' ? '−' : '+'}</span>
                </button>
                {openAccordion === 'return' && (
                  <div className="accordion-content" style={{ display: 'block', maxHeight: 'none' }}>
                    <p>We accept size exchanges and returns within 7 days of delivery, provided the tags are intact and the product is unworn and unwashed.</p>
                    <p>To initiate a return, please visit your account dashboard or contact our customer support team.</p>
                  </div>
                )}
              </div>

              {/* Care Guide */}
              <div className={`accordion-item ${openAccordion === 'care' ? 'open' : ''}`}>
                <button className="accordion-btn" onClick={() => toggleAccordion('care')}>
                  <span>CARE GUIDE</span>
                  <span className="acc-icon">{openAccordion === 'care' ? '−' : '+'}</span>
                </button>
                {openAccordion === 'care' && (
                  <div className="accordion-content" style={{ display: 'block', maxHeight: 'none' }}>
                    <ul>
                      <li>Cold machine wash inside out (30°C max)</li>
                      <li>Do not iron directly on prints or graphics</li>
                      <li>Tumble dry low or hang dry in shade</li>
                      <li>Do not bleach or dry clean</li>
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CUSTOMER ALSO LOVED */}
      <section className="related-products">
        <h3>CUSTOMER ALSO LOVED</h3>
        <div className="related-grid">
          {similar_products?.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
          {(!similar_products || similar_products.length === 0) && (
            <p>No related products found.</p>
          )}
        </div>
      </section>
    </div>
  );
}
