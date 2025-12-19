// src/components/AdminLoginModal.jsx
import React, { useState, useEffect } from 'react';
import { FaTimes, FaUserShield, FaEnvelope, FaLock } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const AdminLoginModal = ({ isOpen, onClose }) => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Reset form setiap modal dibuka
  useEffect(() => {
    if (isOpen) {
      setEmail('');
      setPassword('');
      setError('');
      setLoading(false);
    }
  }, [isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = login(email.trim(), password, 'admin');

    if (result.success && result.user?.role === 'admin') {
      // Simpan flag untuk toast selamat datang di dashboard
      sessionStorage.setItem('justLoggedIn', 'true');

      Swal.fire({
        title: 'Login Admin Berhasil!',
        text: `Selamat datang kembali, ${result.user.name}!`,
        icon: 'success',
        timer: 2000,
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        background: '#10b981',
        color: 'white',
        iconColor: 'white',
      }).then(() => {
        // LANGSUNG NAVIGASI KE DASHBOARD ADMIN
        // JANGAN panggil onClose() di sini, karena akan trigger redirect ke home
        navigate('/admin/dashboard', { replace: true });
      });
    } else {
      setError(result.error || 'Email atau password salah / bukan akun Admin');
      setLoading(false);
    }
  };

  // Tutup modal manual (misal klik X atau backdrop)
  const handleClose = () => {
    onClose(); // Ini akan membersihkan /loginadmin dari URL di App.jsx
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-content admin-modal" onClick={(e) => e.stopPropagation()}>
        <button className="close-modal" onClick={handleClose}>
          <FaTimes />
        </button>

        <div className="admin-modal-header">
          <FaUserShield className="admin-modal-icon" />
          <h2>Login Admin</h2>
          <p>Panel Administrasi TokoKita</p>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>
              <FaEnvelope /> Email Admin
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@tokokita.com"
              required
              autoFocus
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label>
              <FaLock /> Pasword
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              disabled={loading}
            />
          </div>

          {error && (
            <div className="error-message">
              <strong>⚠️</strong> {error}
            </div>
          )}

          <button type="submit" className="btn-login" disabled={loading}>
            {loading ? (
              <>
                <span className="spinner" style={{ marginRight: '8px' }}></span>
                Memproses...
              </>
            ) : (
              'Masuk sebagai Admin'
            )}
          </button>
        </form>

        {/* Optional: Petunjuk kecil */}
        <div className="text-center mt-4 text-sm text-gray-500">
          Gunakan akun admin untuk mengakses panel ini
        </div>
      </div>
    </div>
  );
};

export default AdminLoginModal;