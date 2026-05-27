import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';

export default function Shop() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const query = searchParams.get('q') || '';
  const categoryParam = searchParams.get('category') || '';

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const url = `/api/products/?q=${encodeURIComponent(query)}&category=${encodeURIComponent(categoryParam)}`;
        const response = await fetch(url);
        if (response.ok) {
          const data = await response.json();
          setProducts(data.products || []);
          setCategories(data.categories || []);
        }
      } catch (error) {
        console.error('Error fetching shop products:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [query, categoryParam]);

  const handleCategorySelect = (slug) => {
    const newParams = new URLSearchParams(searchParams);
    if (slug) {
      newParams.set('category', slug);
    } else {
      newParams.delete('category');
    }
    setSearchParams(newParams);
  };

  return (
    <section className="shop-wrapper" style={{ minHeight: '80vh' }}>
      {/* FILTER & CATEGORY CHIPS */}
      <div className="shop-top" style={{ display: 'flex', flexDirection: 'column', alignItems: 'stretch', gap: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div className="shop-left">
            <strong>FILTER</strong>
            <span className="product-count">{products.length} PRODUCTS</span>
          </div>

          <div className="shop-right">
            <button className="sort-btn">SORT</button>
          </div>
        </div>

        {/* Categories chips bar */}
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', paddingBottom: '10px' }}>
          <button
            onClick={() => handleCategorySelect('')}
            style={{
              padding: '8px 18px',
              borderRadius: '20px',
              border: '1px solid var(--border-color)',
              background: categoryParam === '' ? 'var(--accent)' : 'var(--bg-secondary)',
              color: 'var(--text-primary)',
              fontFamily: 'var(--font-heading)',
              fontSize: '11px',
              fontWeight: '700',
              cursor: 'pointer',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              transition: 'var(--transition-fast)',
            }}
          >
            All Products
          </button>
          {categories.map((c) => (
            <button
              key={c.slug}
              onClick={() => handleCategorySelect(c.slug)}
              style={{
                padding: '8px 18px',
                borderRadius: '20px',
                border: '1px solid var(--border-color)',
                background: categoryParam === c.slug ? 'var(--accent)' : 'var(--bg-secondary)',
                color: 'var(--text-primary)',
                fontFamily: 'var(--font-heading)',
                fontSize: '11px',
                fontWeight: '700',
                cursor: 'pointer',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                transition: 'var(--transition-fast)',
              }}
            >
              {c.name}
            </button>
          ))}
        </div>

        {query && (
          <div style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
            Showing results for: <strong style={{ color: 'var(--text-primary)' }}>"{query}"</strong>
          </div>
        )}
      </div>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '40vh', color: 'var(--text-primary)' }}>
          <div className="loading-spinner">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="spin-icon"><path d="M21 12a9 9 0 1 1-6.219-8.56" /></svg>
            <span>FETCHING PRODUCTS...</span>
          </div>
        </div>
      ) : (
        <div className="shop-grid">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}

          {products.length === 0 && (
            <p style={{ gridColumn: 'span 4', textAlign: 'center', padding: '40px 0', color: 'var(--text-muted)' }}>
              No products available matching your criteria.
            </p>
          )}
        </div>
      )}
    </section>
  );
}
