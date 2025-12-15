// src/components/Header.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  FaShoppingCart,
  FaHome,
  FaBox,
  FaUser,
  FaSignOutAlt,
  FaBars,
  FaTimes,
} from 'react-icons/fa';
import useCart from '../hooks/useCart';
import { useAuth } from '../context/AuthContext';
import Swal from 'sweetalert2';

const Header = () => {
  const { getCartCount } = useCart();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  // SweetAlert Selamat Datang hanya saat baru login
  useEffect(() => {
    if (user) {
      const justLoggedIn = sessionStorage.getItem('justLoggedIn');
      if (justLoggedIn === 'true') {
        Swal.fire({
          title: 'Selamat Datang Kembali!',
          html: `<strong>Hai, ${user.name.split(' ')[0]}!</strong>`,
          icon: 'success',
          timer: 1500,
          timerProgressBar: true,
          showConfirmButton: false,
        });
        sessionStorage.removeItem('justLoggedIn');
      }

      const redirectPath = sessionStorage.getItem('redirectAfterLogin');
      if (redirectPath) {
        sessionStorage.removeItem('redirectAfterLogin');
        navigate(redirectPath, { replace: true });
      }
    }
  }, [user, navigate]);

  // Toggle mobile menu + prevent body scroll
  useEffect(() => {
    if (showMobileMenu) {
      document.body.classList.add('menu-open');
    } else {
      document.body.classList.remove('menu-open');
    }

    // Cleanup saat component unmount
    return () => document.body.classList.remove('menu-open');
  }, [showMobileMenu]);

  const closeMobileMenu = () => setShowMobileMenu(false);

  const handleLogout = () => {
    Swal.fire({
      title: 'Keluar dari Akun?',
      text: 'Anda akan logout dari akun TokoKita',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Ya, Keluar',
      cancelButtonText: 'Batal',
      reverseButtons: true,
    }).then((result) => {
      if (result.isConfirmed) {
        logout();
        closeMobileMenu();
        Swal.fire({
          title: 'Berhasil Keluar',
          text: 'Anda telah logout dari akun',
          icon: 'success',
          timer: 1500,
          timerProgressBar: true,
          showConfirmButton: false,
        });
      }
    });
  };

  return (
    <>
      <header className="header">
        <div className="container header-container">
          <div className="logo">
            <Link to="/" onClick={closeMobileMenu}>
              TokoKita
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="desktop-nav">
            <Link to="/">
              <FaHome /> <span className="nav-text">Beranda</span>
            </Link>
            <Link to="/products">
              <FaBox /> <span className="nav-text">Produk</span>
            </Link>

            <div className="cart-icon">
              <Link to="/cart">
                <FaShoppingCart /><span className="nav-text">Keranjang</span>
                {getCartCount() > 0 && (
                  <span className="cart-count">{getCartCount()}</span>
                )}
              </Link>
            </div>

            {user ? (
              <div className="user-logged-in">
                <div className="user-info">
                  <span className="user-greeting">Hai,</span>
                  <span className="user-name">{user.name.split(' ')[0]}!</span>
                </div>
                <button className="logout-btn" onClick={handleLogout}>
                  <FaSignOutAlt />
                </button>
              </div>
            ) : (
              <button
                className="user-icon"
                onClick={() => setShowLoginModal(true)}
                aria-label="Masuk"
              >
                <FaUser />
              </button>
            )}
          </nav>

          {/* Mobile Hamburger Button */}
          <button
            className="mobile-menu-toggle"
            onClick={() => setShowMobileMenu(true)}
            aria-label="Buka Menu"
            aria-expanded={showMobileMenu}
          >
            <FaBars />
            {/* Cart badge di hamburger kalau ada item */}
            {getCartCount() > 0 && (
              <span className="mobile-cart-badge">{getCartCount()}</span>
            )}
          </button>
        </div>
      </header>

      {/* Mobile Menu Overlay & Panel */}
      {showMobileMenu && (
        <div
          className="mobile-menu-overlay active"
          onClick={closeMobileMenu}
        >
          <nav
            className="mobile-nav active"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header dengan logo & close button */}
            <div className="mobile-nav-header">
              <div className="mobile-logo">TokoKita</div>
              <button
                className="mobile-menu-close"
                onClick={closeMobileMenu}
                aria-label="Tutup Menu"
              >
                <FaTimes />
              </button>
            </div>

            {/* Navigation Links */}
            <div className="mobile-nav-links">
              <Link to="/" onClick={closeMobileMenu} className={location.pathname === '/' ? 'active' : ''}>
                <FaHome /> Beranda
              </Link>
              <Link to="/products" onClick={closeMobileMenu} className={location.pathname.startsWith('/products') ? 'active' : ''}>
                <FaBox /> Produk
              </Link>
              <Link to="/cart" onClick={closeMobileMenu} className={location.pathname === '/cart' ? 'active' : ''}>
                <FaShoppingCart /> Keranjang
                {getCartCount() > 0 && (
                  <span className="cart-count-mobile">{getCartCount()}</span>
                )}
              </Link>
            </div>

            {/* User Section */}
            <div className="mobile-user-section">
              {user ? (
                <>
                  <div className="mobile-user-info">
                    <div className="mobile-user-avatar">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="mobile-user-details">
                      <div className="mobile-user-name">{user.name}</div>
                      <div className="mobile-user-email">{user.email || user.username}</div>
                    </div>
                  </div>
                  <button className="logout-btn-mobile" onClick={handleLogout}>
                    <FaSignOutAlt /> Keluar
                  </button>
                </>
              ) : (
                <button
                  className="login-btn-mobile"
                  onClick={() => {
                    closeMobileMenu();
                    setShowLoginModal(true);
                  }}
                >
                  <FaUser /> Masuk ke Akun
                </button>
              )}
            </div>

            {/* Optional Footer */}
            <div className="mobile-footer">
              <p className="mobile-copyright">© 2025 TokoKita. All rights reserved.</p>
            </div>
          </nav>
        </div>
      )}

      {/* Login Modal */}
      {showLoginModal && !user && (
        <div className="modal-overlay" onClick={() => setShowLoginModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button
              className="close-modal"
              onClick={() => setShowLoginModal(false)}
            >
              ×
            </button>
            <h2>Masuk ke Akun TokoKita</h2>
            <LoginForm onSuccess={() => setShowLoginModal(false)} />
          </div>
        </div>
      )}
    </>
  );
};

const LoginForm = ({ onSuccess }) => {
  const { login } = useAuth();
  const [emailOrUsername, setEmailOrUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = login(emailOrUsername.trim(), password);

    if (result.success) {
      sessionStorage.setItem('justLoggedIn', 'true');
      onSuccess();
    } else {
      setError(result.error || 'Email/Username atau password salah!');
    }
    setLoading(false);
  };

  return (
    <form className="login-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label>Email atau Username</label>
        <input
          type="text"
          value={emailOrUsername}
          onChange={(e) => setEmailOrUsername(e.target.value)}
          placeholder="user@example.com atau username"
          required
          autoFocus
        />
      </div>

      <div className="form-group">
        <label>Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          required
        />
      </div>

      {error && <div className="error-message">{error}</div>}

      <button type="submit" className="btn-login" disabled={loading}>
        {loading && <span className="spinner"></span>}
        {loading ? 'Memproses...' : 'Masuk'}
      </button>
    </form>
  );
};

export default Header;