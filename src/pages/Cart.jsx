import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import useCart from '../hooks/useCart';
import { FaTrash, FaShoppingBag, FaArrowLeft } from 'react-icons/fa';
import Swal from 'sweetalert2';

const Cart = () => {
  const navigate = useNavigate();
  const {
    cartItems,
    removeFromCart,
    updateQuantity,
    clearCart,
  } = useCart();

  const [selectedItems, setSelectedItems] = useState([]);

  // Hitung total hanya dari item yang dipilih
  const getSelectedTotal = () => {
    if (selectedItems.length === 0) return 0;
    return cartItems
      .filter(item => selectedItems.includes(item.id))
      .reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const selectedTotal = getSelectedTotal();
  const shippingCost = selectedTotal >= 500000 ? 0 : (selectedItems.length > 0 ? 25000 : 0);
  const finalTotal = selectedTotal + shippingCost;

  const toggleSelect = (id) => {
    setSelectedItems(prev =>
      prev.includes(id)
        ? prev.filter(x => x !== id)
        : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedItems.length === cartItems.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(cartItems.map(item => item.id));
    }
  };

  // Hapus dengan SweetAlert
  const handleRemoveItem = (itemId, itemName) => {
    Swal.fire({
      title: 'Hapus Produk?',
      html: `Apakah kamu yakin ingin menghapus<br/><strong>${itemName}</strong><br/>dari keranjang?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Ya, Hapus',
      cancelButtonText: 'Batal',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        removeFromCart(itemId);
        Swal.fire({
          icon: 'success',
          title: 'Terhapus!',
          text: 'Produk telah dihapus dari keranjang',
          timer: 1500,
          timerProgressBar: true,
          toast: true,
          position: 'top-end',
          showConfirmButton: false
        });
      }
    });
  };

  if (cartItems.length === 0) {
    return (
      <div className="cart-empty">
        <FaShoppingBag className="empty-icon" />
        <h2>Keranjang Anda kosong</h2>
        <p>Yuk isi dengan produk favoritmu!</p>
        <button className="btn-shop" onClick={() => navigate('/products')}>
          Lanjut Belanja
        </button>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <h1>Keranjang Belanja Anda</h1>

      <div className="mb-4 flex items-center">
        <input
          type="checkbox"
          id="select-all"
          checked={selectedItems.length === cartItems.length && cartItems.length > 0}
          onChange={toggleSelectAll}
          className="mr-3 h-5 w-5 cursor-pointer"
        />
        <label htmlFor="select-all" className="cursor-pointer text-sm font-medium">
          {selectedItems.length === cartItems.length && cartItems.length > 0
            ? 'Batalkan semua'
            : 'Pilih semua produk'}
        </label>
      </div>

      <div className="cart-container">
        <div className="cart-items">
          {cartItems.map(item => (
            <div
              key={item.id}
              className="cart-item"
              style={{ cursor: 'pointer' }}
              onClick={(e) => {
                // Jangan buka detail jika klik checkbox, tombol, atau hapus
                if (
                  e.target.closest('input[type="checkbox"]') ||
                  e.target.tagName === 'BUTTON' ||
                  e.target.closest('.btn-remove')
                ) {
                  return;
                }
                // Ganti route sesuai project kamu
                navigate(`/product/${item.id}`);
                // atau: navigate(`/products/${item.id}`);
                // atau: navigate(`/detail/${item.id}`);
              }}
            >
              {/* Checkbox pilih item */}
              <div className="flex items-center justify-start mr-4">
                <input
                  type="checkbox"
                  checked={selectedItems.includes(item.id)}
                  onChange={() => toggleSelect(item.id)}
                  className="h-5 w-5 cursor-pointer accent-orange-600"
                />
              </div>

              <div className="cart-item-image">
                <img src={item.image} alt={item.name} loading="lazy" />
              </div>

              <div className="cart-item-info">
                <h3>{item.name}</h3>
                <p className="price">
                  Rp {item.price.toLocaleString('id-ID')}
                </p>
                <p className="category">{item.category}</p>
              </div>

              <div className="cart-item-quantity">
                <button
                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  disabled={item.quantity <= 1}
                >
                  −
                </button>
                <span>{item.quantity}</span>
                <button
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                >
                  +
                </button>

                <button
                  className="btn-remove"
                  onClick={(e) => {
                    e.stopPropagation(); // penting biar gak ikut navigate
                    handleRemoveItem(item.id, item.name);
                  }}
                  title="Hapus produk"
                >
                  <FaTrash />
                </button>
              </div>

              <div className="cart-item-total">
                <p>
                  Rp {(item.price * item.quantity).toLocaleString('id-ID')}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* === RINGKASAN PESANAN (TIDAK DIUBAH) === */}
        <div className="cart-summary">
          <h2>Ringkasan Pesanan</h2>

          {selectedItems.length === 0 ? (
            <p className="text-sm text-gray-500 mb-4">Belum ada produk yang dipilih</p>
          ) : selectedItems.length < cartItems.length ? (
            <p className="text-sm text-gray-600 mb-3">
              {selectedItems.length} dari {cartItems.length} item dipilih
            </p>
          ) : null}

          <div className="summary-row">
            <span>Subtotal</span>
            <span>Rp {selectedTotal.toLocaleString('id-ID')}</span>
          </div>

          <div className="summary-row">
            <span>Ongkos Kirim</span>
            <span>
              {selectedItems.length === 0
                ? '-'
                : shippingCost === 0
                  ? 'Gratis'
                  : `Rp ${shippingCost.toLocaleString('id-ID')}`}
            </span>
          </div>

          <div className="summary-row total">
            <span>Total Belanja</span>
            <span>Rp {finalTotal.toLocaleString('id-ID')}</span>
          </div>

          <div className="cart-actions">
            <button className="btn-clear" onClick={clearCart}>
              Kosongkan Keranjang
            </button>

            <Link to="/products" className="btn-continue">
              <FaArrowLeft /> Lanjut Belanja
            </Link>

            <button
              className="btn-checkout"
              onClick={() => navigate('/checkout', { state: { selectedItems } })}
              disabled={selectedItems.length === 0}
            >
              {selectedItems.length === 0 ? 'Pilih Produk Dulu' : 'Lanjut ke Pembayaran'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;