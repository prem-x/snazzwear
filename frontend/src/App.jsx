import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
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
import Login from './pages/Login';
import Signup from './pages/Signup';

function AppContent({ authModalOpen, setAuthModalOpen }) {
  const location = useLocation();
  const isAuthPage = location.pathname === '/login' || location.pathname === '/signup';

  return (
    <div className="page-wrapper">
      {!isAuthPage && <Header onOpenAuth={() => setAuthModalOpen(true)} />}
      
      <main style={{ minHeight: isAuthPage ? '100vh' : '80vh' }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/product/:slug" element={<ProductDetail />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/success" element={<Success />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Routes>
      </main>

      {!isAuthPage && <Footer />}
      
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
