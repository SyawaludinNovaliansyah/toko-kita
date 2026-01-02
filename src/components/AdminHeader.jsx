import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  FaBoxOpen,
  FaShoppingCart,
  FaChartBar,
  FaSignOutAlt,
  FaBars,
  FaTimes,
} from 'react-icons/fa';
import Swal from 'sweetalert2';
import { useAuth } from '../context/AuthContext';
import '../styles/AdminHeader.css';

const AdminHeader = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  if (!user || user.role !== 'admin') return null;

  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? 'hidden' : 'auto';
  }, [mobileMenuOpen]);

  const handleLogout = () => {
    Swal.fire({
      title: 'Keluar dari Panel Admin?',
      text: 'Anda akan diarahkan ke halaman utama',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonText: 'Batal',
      confirmButtonText: 'Keluar',
    }).then((res) => {
      if (res.isConfirmed) {
        // logout auth
        logout();

        // alert sukses
        Swal.fire({
          icon: 'success',
          title: 'Berhasil Logout',
          text: 'Anda telah keluar dari akun admin',
          timer: 1800,
          showConfirmButton: false,
        }).then(() => {
          navigate('/'); // arahkan ke halaman utama
        });
      }
    });
  };

  return (
    <>
      {/* HEADER */}
      <div className="admin-header-container">
        <header className="admin-header">
          <div className="container">
            <div className="logo-admin">
              <Link to="/admin/dashboard">
                TOKOKITA <span>Admin</span>
              </Link>
            </div>

            <nav className="desktop-nav">
              <Link to="/admin/products" className="nav-link">
                <FaBoxOpen /> Produk
              </Link>
              <Link to="/admin/orders" className="nav-link">
                <FaShoppingCart /> Penjualan
              </Link>
              <Link to="/admin/sales-report" className="nav-link">
                <FaChartBar /> Laporan
              </Link>
              <button className="logout-btn" onClick={handleLogout}>
                <FaSignOutAlt /> Keluar
              </button>
            </nav>

            <button
              className="mobile-menu-toggle"
              onClick={() => setMobileMenuOpen(true)}
            >
              <FaBars />
            </button>
          </div>
        </header>
      </div>

      {/* OVERLAY */}
      {mobileMenuOpen && (
        <div
          className="mobile-menu-overlay"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* MOBILE MENU */}
      <aside className={`mobile-nav ${mobileMenuOpen ? 'active' : ''}`}>
        <div className="mobile-nav-header">
          <div>
            <h3>TOKOKITA <span>Admin</span></h3>
            
          </div>
          <button
            className="mobile-menu-close"
            onClick={() => setMobileMenuOpen(false)}
          >
            <FaTimes />
          </button>
        </div>

        <div className="mobile-nav-links">
          <Link to="/admin/products" onClick={() => setMobileMenuOpen(false)}>
            <FaBoxOpen /> Produk
          </Link>
          <Link to="/admin/orders" onClick={() => setMobileMenuOpen(false)}>
            <FaShoppingCart /> Penjualan
          </Link>
          <Link to="/admin/sales-report" onClick={() => setMobileMenuOpen(false)}>
            <FaChartBar /> Laporan Penjualan
          </Link>
        </div>

        {/* LOGOUT PALING BAWAH */}
        <div className="mobile-logout">
          <button onClick={handleLogout}>
            <FaSignOutAlt /> Keluar dari Admin
          </button>
        </div>
      </aside>
    </>
  );
};

export default AdminHeader;
