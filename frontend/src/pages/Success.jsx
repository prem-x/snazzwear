import React from 'react';
import { useSearchParams, Link } from 'react-router-dom';

export default function Success() {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('order_id') || 'N/A';
  const paymentId = searchParams.get('payment_id');

  return (
    <section style={{ padding: '100px 8%', textAlign: 'center', minHeight: '60vh', background: 'var(--bg-primary)' }}>
      <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '32px', letterSpacing: '2px', marginBottom: '30px', color: 'var(--text-primary)' }}>
        ORDER CONFIRMED
      </h2>
      
      <div style={{ maxWidth: '600px', margin: '0 auto', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', padding: '50px 40px', borderRadius: '12px', boxShadow: '0 10px 40px rgba(0,0,0,0.5)' }}>
        <div style={{ marginBottom: '25px', color: 'var(--accent)' }}>
          <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-check-circle"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
        </div>
        <p style={{ fontSize: '20px', marginBottom: '10px', color: 'var(--text-primary)', fontFamily: 'var(--font-body)', fontWeight: 600 }}>
          Thank you for your order!
        </p>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '15px', fontFamily: 'var(--font-body)', fontSize: '15px' }}>
          Your Order ID is: <strong style={{ color: 'var(--text-primary)' }}>#{orderId}</strong>
        </p>
        {paymentId && (
          <p style={{ color: 'var(--text-secondary)', marginBottom: '30px', fontFamily: 'var(--font-body)', fontSize: '14px' }}>
            Payment ID: <strong style={{ color: 'var(--text-primary)' }}>{paymentId}</strong>
          </p>
        )}
        
        <Link 
          to="/" 
          style={{
            display: 'inline-block',
            padding: '14px 38px',
            background: 'var(--accent-gradient)',
            color: 'white',
            textDecoration: 'none',
            fontFamily: 'var(--font-heading)',
            fontWeight: '700',
            fontSize: '13px',
            letterSpacing: '1px',
            textTransform: 'uppercase',
            borderRadius: '30px',
            boxShadow: '0 4px 15px var(--accent-glow)',
            transition: 'var(--transition-smooth)'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 6px 20px rgba(255, 95, 54, 0.45)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 4px 15px var(--accent-glow)';
          }}
        >
          CONTINUE SHOPPING
        </Link>
      </div>
    </section>
  );
}
