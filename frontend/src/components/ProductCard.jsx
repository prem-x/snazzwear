import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';

export default function ProductCard({ product }) {
  const { wishlistIds, toggleWishlist } = useCart();
  const isWishlisted = wishlistIds.includes(product.id);

  const handleHeartClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product.id);
  };

  const oldPrice = product.price + 200;

  return (
    <div className="premium-card">
      <div className="premium-image-wrapper">
        <div className="premium-badge">SAVE 15%</div>
        <div className="premium-heart" onClick={handleHeartClick}>
          <svg
            className={isWishlisted ? 'active' : ''}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
          </svg>
        </div>
        <Link to={`/product/${product.slug}`}>
          <img src={product.image || '/static/images/sample1.png'} alt={product.name} />
          <div className="premium-add-cart-overlay">ADD TO CART</div>
        </Link>
      </div>
      <div className="premium-info">
        <Link to={`/product/${product.slug}`} style={{ textDecoration: 'none' }}>
          <h4 className="premium-title">{product.name}</h4>
        </Link>
        <div className="premium-prices">
          <span className="premium-old-price">Rs.{oldPrice}</span>
          <span className="premium-new-price">Rs.{product.price}</span>
        </div>
      </div>
    </div>
  );
}
