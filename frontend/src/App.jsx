import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import Header from './components/Header';
import Footer from './components/Footer';
import CartDrawer from './components/CartDrawer';
import AuthModal from './components/AuthModal';

// Pages
import Home from './pages/Home';
import Shop from './pages/Shop';
import ProductDetail from './pages/ProductDetail';
import Wishlist from './pages/Wishlist';
import Checkout from './pages/Checkout';
import Success from './pages/Success';
import Profile from './pages/Profile';

function AppContent({ authModalOpen, setAuthModalOpen }) {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (location.state?.openAuth) {
      setAuthModalOpen(true);
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location, setAuthModalOpen, navigate]);

  return (
    <div className="page-wrapper">
      <Header onOpenAuth={() => setAuthModalOpen(true)} />
      
      <main style={{ minHeight: '80vh' }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/product/:slug" element={<ProductDetail />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/success" element={<Success />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </main>

      <Footer />
      
      {/* Drawers and Overlays */}
      <CartDrawer />
      <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} />
    </div>
  );
}

function App() {
  const [authModalOpen, setAuthModalOpen] = useState(false);

  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <AppContent authModalOpen={authModalOpen} setAuthModalOpen={setAuthModalOpen} />
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
