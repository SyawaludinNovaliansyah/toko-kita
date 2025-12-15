// src/hooks/useCart.js
import { useContext, useEffect } from 'react';
import CartContext from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import Swal from 'sweetalert2';

export default function useCart() {
  const context = useContext(CartContext);
  const { user } = useAuth();

  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }

  const { addToCart: originalAddToCart, ...rest } = context;

  // Tangani pending cart OTOMATIS setiap kali user berubah (login)
  useEffect(() => {
    if (user) {
      const pending = sessionStorage.getItem('pendingCartItem');
      if (pending) {
        try {
          const { product, quantity } = JSON.parse(pending);

          // Tambahkan ke keranjang asli
          for (let i = 0; i < quantity; i++) {
            originalAddToCart(product);
          }

          sessionStorage.removeItem('pendingCartItem');

          Swal.fire({
            icon: 'success',
            title: 'Berhasil!',
            text: `${quantity > 1 ? `${quantity} × ` : ''}${product.name} telah ditambahkan ke keranjang!`,
            timer: 2500,
            timerProgressBar: true,
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
          });
        } catch (e) {
          console.error('Gagal parse pending cart item', e);
          sessionStorage.removeItem('pendingCartItem');
        }
      }
    }
  }, [user, originalAddToCart]); // originalAddToCart penting di dependency

  const addToCart = (product, quantity = 1) => {
    if (!user) {
      sessionStorage.setItem('pendingCartItem', JSON.stringify({ product, quantity }));

      Swal.fire({
        icon: 'warning',
        title: 'Login Diperlukan',
        text: 'Kamu harus login terlebih dahulu untuk menambahkan produk ke keranjang.',
        timer: 4000,
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
      });

      return false;
    }

    // Langsung tambahkan jika sudah login
    for (let i = 0; i < quantity; i++) {
      originalAddToCart(product);
    }
    return true;
  };

  return { addToCart, ...rest };
}