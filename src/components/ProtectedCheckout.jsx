// src/components/ProtectedCheckout.jsx
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Checkout from '../pages/Checkout'; // Ganti dengan path Checkout kamu
import Swal from 'sweetalert2';
import '../styles/ProtectedCheckout.css';

const ProtectedCheckout = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  React.useEffect(() => {
    if (!user) {
      // Simpan lokasi checkout agar setelah login kembali ke sini
      sessionStorage.setItem(
        'redirectAfterLogin',
        location.pathname + (location.search || '')
      );

      Swal.fire({
        icon: 'warning',
        title: 'Login Diperlukan',
        text: 'Kamu harus login terlebih dahulu untuk melanjutkan pembayaran.',
        confirmButtonText: 'Login Sekarang',
        cancelButtonText: 'Batal',
        showCancelButton: true,
        allowOutsideClick: false,
        reverseButtons: true,
      }).then((result) => {
        if (result.isConfirmed) {
          // Kembali ke cart agar Header (modal login) muncul
          navigate('/cart', { replace: true });
        } else {
          navigate(-1); // Kembali ke halaman sebelumnya
        }
      });
    }
  }, [user, navigate, location]);

  // Loading sementara saat cek login
  if (!user) {
    return (
      <div className="loading text-center py-20">
        <p className="text-lg">Memeriksa status login...</p>
      </div>
    );
  }

  // Jika sudah login → tampilkan Checkout normal
  return <Checkout />;
};

export default ProtectedCheckout;