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
import LoginModal from './LoginModal'; // Komponen baru

const Header = () => {
  const { getCartCount } = useCart();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);

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

  // Prevent body scroll saat mobile menu terbuka
  useEffect(() => {
    if (showMobileMenu) {
      document.body.classList.add('menu-open');
    } else {
      document.body.classList.remove('menu-open');
    }
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
                <FaShoppingCart />
                <span className="nav-text">Keranjang</span>
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

          {/* Mobile Hamburger */}
          <button
            className="mobile-menu-toggle"
            onClick={() => setShowMobileMenu(true)}
            aria-label="Buka Menu"
            aria-expanded={showMobileMenu}
          >
            <FaBars />
            {getCartCount() > 0 && (
              <span className="mobile-cart-badge">{getCartCount()}</span>
            )}
          </button>
        </div>
      </header>

      {/* Mobile Menu */}
      {showMobileMenu && (
        <div className="mobile-menu-overlay active" onClick={closeMobileMenu}>
          <nav className="mobile-nav active" onClick={(e) => e.stopPropagation()}>
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

            <div className="mobile-nav-links">
              <Link to="/" onClick={closeMobileMenu}>
                <FaHome /> Beranda
              </Link>
              <Link to="/products" onClick={closeMobileMenu}>
                <FaBox /> Produk
              </Link>
              <Link to="/cart" onClick={closeMobileMenu}>
                <FaShoppingCart /> Keranjang
                {getCartCount() > 0 && (
                  <span className="cart-count-mobile">{getCartCount()}</span>
                )}
              </Link>
            </div>

            <div className="mobile-user-section">
              {user ? (
                <>
                  <div className="mobile-user-info">
                    <div className="mobile-user-avatar">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="mobile-user-details">
                      <div className="mobile-user-name">{user.name}</div>
                      <div className="mobile-user-email">
                        {user.email || user.username}
                      </div>
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

            <div className="mobile-footer">
              <p className="mobile-copyright">
                © 2025 TokoKita. All rights reserved.
              </p>
            </div>
          </nav>
        </div>
      )}

      {/* Login Modal – komponen terpisah */}
      <LoginModal
        isOpen={showLoginModal && !user}
        onClose={() => setShowLoginModal(false)}
      />
    </>
  );
};

export default Header;