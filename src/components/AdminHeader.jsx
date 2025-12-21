// src/components/AdminHeader.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaBoxOpen, FaShoppingCart, FaChartBar, FaSignOutAlt, FaBars, FaTimes } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import Swal from 'sweetalert2';
import AdminProducts from '../pages/admin/AdminProducts';

const AdminHeader = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Pastikan hanya admin yang bisa melihat header ini
  if (!user || user.role !== 'admin') {
    return null;
  }

  const handleLogout = () => {
    Swal.fire({
      title: 'Keluar dari Panel Admin?',
      text: 'Anda akan kembali ke halaman utama',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Ya, Keluar',
      cancelButtonText: 'Batal',
    }).then((result) => {
      if (result.isConfirmed) {
        logout();
        Swal.fire({
          title: 'Berhasil Keluar',
          icon: 'success',
          timer: 1500,
          showConfirmButton: false,
        }).then(() => {
          navigate('/');
        });
      }
    });
  };

  const navItems = [
    { to: '/admin/products', icon: <FaBoxOpen />, label: 'Produk' },
    { to: '/admin/orders', icon: <FaShoppingCart />, label: 'Penjualan' },
    { to: '/admin/sales-report', icon: <FaChartBar />, label: 'Laporan Penjualan' },
  ];

  return (
    <>
      {/* Desktop & Tablet Header */}
      <header className="header" style={{ backgroundColor: '#4c51bf', color: 'white' }}>
        <div className="container">
          <div className="logo">
            <Link to="/admin/dashboard" style={{ color: 'white', fontSize: '1.8rem' }}>
              TOKOKITA <span style={{ fontSize: '0.9rem', opacity: 0.9 }}>Admin</span>
            </Link>
          </div>

          <nav className="desktop-nav">
            {navItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="nav-link"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.5rem 1rem',
                  borderRadius: '8px',
                  transition: 'all 0.3s',
                }}
                onMouseEnter={(e) => (e.target.style.backgroundColor = 'rgba(255,255,255,0.15)')}
                onMouseLeave={(e) => (e.target.style.backgroundColor = 'transparent')}
              >
                {item.icon}
                {item.label}
              </Link>
            ))}

            <button
              onClick={handleLogout}
              className="logout-btn"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                background: 'none',
                border: 'none',
                color: 'white',
                cursor: 'pointer',
                padding: '0.5rem 1rem',
                borderRadius: '8px',
                transition: 'all 0.3s',
              }}
              onMouseEnter={(e) => (e.target.style.backgroundColor = 'rgba(239, 68, 68, 0.3)')}
              onMouseLeave={(e) => (e.target.style.backgroundColor = 'transparent')}
            >
              <FaSignOutAlt />
              Keluar
            </button>
          </nav>

          {/* Mobile Hamburger */}
          <button
            className="mobile-menu-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>
      </header>

      {/* Mobile Menu Panel (reuse struktur dari CSS sebelumnya) */}
      {mobileMenuOpen && (
        <>
          <div
            className="mobile-menu-overlay active"
            onClick={() => setMobileMenuOpen(false)}
          />
          <nav className="mobile-nav active">
            <div className="mobile-nav-header" style={{ background: '#4c51bf' }}>
              <div className="mobile-logo">TOKOKITA Admin</div>
              <button
                className="mobile-menu-close"
                onClick={() => setMobileMenuOpen(false)}
              >
                <FaTimes />
              </button>
            </div>

            <div className="mobile-nav-links">
              {navItems.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={() => setMobileMenuOpen(false)}
                  style={{ backgroundColor: '#f1f5f9' }}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </Link>
              ))}

              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleLogout();
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1.2rem',
                  backgroundColor: '#fee2e2',
                  color: '#ef4444',
                  border: 'none',
                  padding: '1.1rem 1.3rem',
                  borderRadius: '12px',
                  width: '100%',
                  fontWeight: '500',
                }}
              >
                <FaSignOutAlt />
                Keluar dari Admin
              </button>
            </div>
          </nav>
        </>
      )}
    </>
  );
};

export default AdminHeader;