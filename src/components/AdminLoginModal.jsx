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

  useEffect(() => {
    if (isOpen) {
      setEmail('');
      setPassword('');
      setError('');
    }
  }, [isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = login(email.trim(), password, 'admin');

    if (result.success && result.user?.role === 'admin') {
      sessionStorage.setItem('justLoggedIn', 'true');
      Swal.fire({
        title: 'Login Admin Berhasil!',
        text: `Selamat datang, ${result.user.name}!`,
        icon: 'success',
        timer: 2000,
        showConfirmButton: false,
      }).then(() => {
        onClose();
        navigate('/admin/dashboard'); // Ganti sesuai route dashboard admin kamu
      });
    } else {
      setError(result.error || 'Email/password salah atau bukan akun Admin!');
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content admin-modal" onClick={(e) => e.stopPropagation()}>
        <button className="close-modal" onClick={onClose}>
          <FaTimes />
        </button>

        <div className="admin-modal-header">
          <FaUserShield className="admin-modal-icon" />
          <h2>Login Admin</h2>
          <p>Panel Administrasi TokoKita</p>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label><FaEnvelope /> Email Admin</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@tokokita.com"
              required
              autoFocus
            />
          </div>

          <div className="form-group">
            <label><FaLock /> Password</label>
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
            {loading ? 'Memproses...' : 'Masuk sebagai Admin'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLoginModal;