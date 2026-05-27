import React from 'react';
import { useCart } from '../contexts/CartContext';
import ProductCard from '../components/ProductCard';

export default function Wishlist() {
  const { wishlist } = useCart();

  return (
    <section className="shop-wrapper" style={{ minHeight: '80vh' }}>
      {/* HEADER BAR */}
      <div className="shop-top" style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '20px', marginBottom: '30px' }}>
        <div className="shop-left" style={{ display: 'flex', alignItems: 'center' }}>
          <h2 style={{ fontSize: '24px', fontWeight: 'bold', margin: 0, color: 'var(--text-primary)', fontFamily: 'var(--font-heading)' }}>
            YOUR WISHLIST
          </h2>
          <span className="product-count" style={{ marginLeft: '15px', color: 'var(--text-secondary)' }}>
            {wishlist.length} SAVED ITEMS
          </span>
        </div>
      </div>

      {/* PRODUCT GRID */}
      <div className="shop-grid">
        {wishlist.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {wishlist.length === 0 && (
        <p style={{ padding: '40px 0', fontSize: '16px', color: 'var(--text-muted)', textAlign: 'center', gridColumn: 'span 4' }}>
          Your wishlist is currently empty. Go explore the shop to find your next favorite piece!
        </p>
      )}
    </section>
  );
}
