import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import Slideshow from '../components/Slideshow';

export default function Home() {
  const [data, setData] = useState({ new_arrivals: [], top_sellers: [], slides: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        const response = await fetch('/api/home/');
        if (response.ok) {
          const result = await response.json();
          setData(result);
        }
      } catch (error) {
        console.error('Error fetching home data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchHomeData();
  }, []);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh', color: 'var(--text-primary)' }}>
        <div className="loading-spinner">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="spin-icon"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
          <span>LOADING LATEST RELEASES...</span>
        </div>
      </div>
    );
  }

  const hasSlides = data.slides && data.slides.length > 0;

  return (
    <div className="page-wrapper">
      {hasSlides ? (
        <Slideshow slides={data.slides} />
      ) : (
        /* HERO SECTION FALLBACK */
        <section className="hero">
          <div className="hero-text">
            <h1>FIND CLOTHES<br />THAT MATCHES<br />YOUR STYLE</h1>
            <p>
              Browse through our diverse range of meticulously crafted garments,
              designed to bring out your individuality and cater to your sense of style.
            </p>
            <Link to="/shop" className="btn-primary">Shop Now</Link>
          </div>

          <div className="hero-image">
            <img src="/static/images/Back.png" alt="Hero Image" />
          </div>
        </section>
      )}

      {/* NEW ARRIVALS */}
      <section className="home-products">
        <div className="container">
          <h2 className="section-title">NEW ARRIVALS</h2>
          <div className="shop-grid">
            {data.new_arrivals?.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* TOP SELLING */}
      <section className="product-section">
        <div className="container">
          <h2>TOP SELLING</h2>
          <div className="product-grid">
            {data.top_sellers?.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
            {(!data.top_sellers || data.top_sellers.length === 0) && (
              <p>No products yet.</p>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
