// src/App.jsx
import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, useLocation, useNavigate } from 'react-router-dom';

import Header from './components/Header';
import Footer from './components/Footer';

import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import ProtectedCheckout from './components/ProtectedCheckout';

import AdminLoginModal from './components/AdminLoginModal';

import { CartProvider } from './context/CartProvider';
import { AuthProvider, useAuth } from './context/AuthContext';

import './styles/App.css';
import './styles/responsive.css';

function AppContent() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [showAdminModal, setShowAdminModal] = useState(false);
  const [backgroundPath, setBackgroundPath] = useState('/');

  // Deteksi apakah URL berakhiran /loginadmin (bisa nested seperti /products/loginadmin)
  const currentPath = location.pathname;
  const isTryingAdminLogin = currentPath.endsWith('/loginadmin');

  useEffect(() => {
    if (isTryingAdminLogin) {
      // Ambil path sebelum /loginadmin sebagai background
      const basePath = currentPath.replace(/\/loginadmin$/, '') || '/';
      setBackgroundPath(basePath);

      // Jika user sudah login dan bukan admin → blokir
      if (user && user.role !== 'admin') {
        // Bersihkan URL dan redirect ke basePath
        navigate(basePath || '/', { replace: true });
        setShowAdminModal(false);
      } else {
        // Boleh buka modal
        setShowAdminModal(true);
      }
    } else {
      setShowAdminModal(false);
    }
  }, [currentPath, user, navigate]);

  const closeAdminModal = () => {
    setShowAdminModal(false);
    // Bersihkan /loginadmin dari URL
    const basePath = currentPath.replace(/\/loginadmin$/, '') || '/';
    navigate(basePath, { replace: true });
  };

  // Tentukan komponen yang dirender berdasarkan backgroundPath
  const renderBackgroundPage = () => {
    if (!showAdminModal) {
      // Normal routing
      return null; // akan ditangani oleh <Routes> biasa
    }

    switch (backgroundPath) {
      case '/':
        return <Home />;
      case '/products':
        return <Products />;
      case '/cart':
        return <Cart />;
      case '/checkout':
        return <ProtectedCheckout />;
      default:
        if (backgroundPath.startsWith('/product/')) {
          return <ProductDetail />;
        }
        return <Home />;
    }
  };

  return (
    <>
      <Header />

      <main className="main-content">
        {/* Jika sedang buka modal admin, render manual background */}
        {showAdminModal ? (
          renderBackgroundPage()
        ) : (
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<Products />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/cart" element={<Cart />} />
            {/* Catch-all untuk path tidak dikenal */}
            <Route path="*" element={<Home />} />
          </Routes>
        )}
      </main>

      <Footer />

      {/* Modal Login Admin */}
      <AdminLoginModal
        isOpen={showAdminModal}
        onClose={closeAdminModal}
      />
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <div className="App">
            <AppContent />
          </div>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;