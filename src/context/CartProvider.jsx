import React, { useState, useEffect } from 'react';
import CartContext from './CartContext';

const CartProvider = ({ children }) => {
  // Ambil data dari localStorage saat pertama kali load
  const [cartItems, setCartItems] = useState(() => {
    try {
      const savedCart = localStorage.getItem('cartItems');
      return savedCart ? JSON.parse(savedCart) : [];
    } catch (error) {
      console.error('Gagal membaca keranjang dari localStorage:', error);
      return [];
    }
  });

  // Simpan ke localStorage setiap kali cartItems berubah
  useEffect(() => {
    try {
      localStorage.setItem('cartItems', JSON.stringify(cartItems));
    } catch (error) {
      console.error('Gagal menyimpan keranjang ke localStorage:', error);
    }
  }, [cartItems]);

  // Fungsi untuk menambah produk ke keranjang
  const addToCart = (product) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === product.id);
      if (existingItem) {
        return prevItems.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prevItems, { ...product, quantity: 1 }];
    });
  };

  // Fungsi untuk menghapus produk dari keranjang
  const removeFromCart = (productId) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== productId));
  };

  // Fungsi untuk mengupdate jumlah produk
  const updateQuantity = (productId, quantity) => {
    if (quantity < 1) {
      removeFromCart(productId);
      return;
    }
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === productId ? { ...item, quantity } : item
      )
    );
  };

  // Fungsi untuk mengosongkan keranjang
  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem('cartItems'); // Opsional: hapus dari localStorage juga
  };

  // Fungsi untuk menghitung total harga
  const getCartTotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  // Fungsi untuk menghitung total jumlah item
  const getCartCount = () => {
    return cartItems.reduce((count, item) => count + item.quantity, 0);
  };
  // Di dalam CartProvider.jsx (tambahkan fungsi ini)
const removeSelectedItems = (selectedIds) => {
  if (!selectedIds || selectedIds.length === 0) return;
  setCartItems(prevItems => 
    prevItems.filter(item => !selectedIds.includes(item.id))
  );
};
  

const cartValue = {
  cartItems,
  addToCart,
  removeFromCart,
  updateQuantity,
  clearCart,
  removeSelectedItems,  // ← Tambahkan ini
  getCartTotal,
  getCartCount,
};

  return (
    <CartContext.Provider value={cartValue}>
      {children}
    </CartContext.Provider>
  );
};

export default CartProvider;
export { CartProvider };