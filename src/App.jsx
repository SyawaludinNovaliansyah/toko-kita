// src/App.jsx
import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';

import Header from './components/Header';
import Footer from './components/Footer';
import AdminHeader from './components/AdminHeader'; // ← Header khusus admin

import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout'; // ← Pastikan Anda punya file ini
// import ProtectedCheckout from './components/ProtectedCheckout'; // Jika pakai wrapper terpisah

import AdminDashboard from './pages/admin/AdminDashboard';
// Tambahkan halaman admin lain di sini nanti:
import AdminProducts from './pages/admin/AdminProducts';
import AdminOrders from './pages/admin/AdminOrders';
import AdminSalesReport from './pages/admin/AdminSalesReport';

import AdminLoginModal from './components/AdminLoginModal';

import { CartProvider } from './context/CartProvider';
import { AuthProvider, useAuth } from './context/AuthContext';

import './styles/App.css';
import './styles/responsive.css';

// === PROTECTED ROUTE UNTUK ADMIN ===
const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="loading">Memuat...</div>;
  }

  if (!user || user.role !== 'admin') {
    // Redirect ke halaman utama + tambahkan /loginadmin agar modal muncul
    return <Navigate to="/" replace state={{ triggerAdminLogin: true }} />;
  }

  return children;
};

// === KOMPONEN UTAMA ===
function AppContent() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();

  // Deteksi apakah ada state untuk memicu modal admin login
  const triggerLogin = location.state?.triggerAdminLogin;

  // Cek apakah URL mengandung /loginadmin (misal: /admin/dashboard/loginadmin)
  const isTryingAdminLogin = location.pathname.includes('/loginadmin');

  // Ambil path dasar tanpa /loginadmin
  const basePath = location.pathname.replace(/\/loginadmin$/, '');

  // Tampilkan modal jika sedang mencoba login admin DAN belum login sebagai admin
  const showAdminModal = isTryingAdminLogin && (!user || user.role !== 'admin');

  const closeAdminModal = () => {
    // Hapus /loginadmin dari URL
    navigate(basePath || '/', { replace: true });
  };

  // Render halaman latar belakang saat modal admin aktif
  const renderBackgroundPage = () => {
    switch (basePath) {
      case '/':
        return <Home />;
      case '/products':
        return <Products />;
      case '/cart':
        return <Cart />;
      case '/checkout':
        return <Checkout />;
      default:
        if (basePath.startsWith('/product/')) {
          return <ProductDetail />;
        }
        return <Home />;
    }
  };

  // Cek apakah sedang di route admin
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <>
      {/* Gunakan AdminHeader jika di route admin dan sudah login */}
      {isAdminRoute && user?.role === 'admin' ? <AdminHeader /> : <Header />}

      <main className="main-content">
        {showAdminModal ? (
          // Tampilkan halaman latar belakang (blur otomatis dari CSS modal-overlay)
          renderBackgroundPage()
        ) : (
          <Routes>
            {/* User Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<Products />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />

            {/* Admin Routes - Dilindungi */}
            <Route
              path="/admin/dashboard"
              element={
                <AdminRoute>
                  <AdminDashboard />
                </AdminRoute>
              }
            />
            {/* Tambahkan route admin lain di sini nanti */}
            
            <Route
              path="/admin/products"
              element={
                <AdminRoute>
                  <AdminProducts />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/orders"
              element={
                <AdminRoute>
                  <AdminOrders />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/sales-report"
              element={
                <AdminRoute>
                  <AdminSalesReport />
                </AdminRoute>
              }
            />
           

            {/* Catch-all */}
            <Route path="*" element={<Home />} />
          </Routes>
        )}
      </main>

      {!isAdminRoute && <Footer />}

      {/* Modal Login Admin */}
      <AdminLoginModal
        isOpen={showAdminModal || triggerLogin}
        onClose={closeAdminModal}
      />
    </>
  );
}

// === APP UTAMA ===
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