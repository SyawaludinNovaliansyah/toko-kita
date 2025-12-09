import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import useCart from '../hooks/useCart';
import { FaCheckCircle } from 'react-icons/fa';

const Checkout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { cartItems, removeSelectedItems } = useCart();

  // Ambil ID barang yang dipilih dari halaman Cart
  const selectedItemIds = location.state?.selectedItems || [];

  // Filter hanya barang yang dipilih
  const selectedCartItems = selectedItemIds.length > 0
    ? cartItems.filter(item => selectedItemIds.includes(item.id))
    : [];

  // Hitung total harga barang yang dipilih
  const subtotal = selectedCartItems.reduce(
    (total, item) => total + (item.price * item.quantity),
    0
  );
  const shippingCost = subtotal >= 500000 ? 0 : 25000;
  const finalTotal = subtotal + shippingCost;

  // State untuk form
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
  });

  const [paymentMethod, setPaymentMethod] = useState('transfer');
  const [errors, setErrors] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [purchasedCount, setPurchasedCount] = useState(0); // Simpan jumlah item yang dibeli

  // Validasi form
  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = 'Nama lengkap wajib diisi';
    if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/))
      newErrors.email = 'Email tidak valid';
    if (!formData.phone.match(/^\d{10,13}$/))
      newErrors.phone = 'Nomor HP harus 10-13 digit';
    if (!formData.address.trim()) newErrors.address = 'Alamat wajib diisi';
    if (!formData.city.trim()) newErrors.city = 'Kota wajib diisi';
    if (!formData.postalCode.match(/^\d{5}$/))
      newErrors.postalCode = 'Kode pos harus 5 digit';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // Handle submit checkout
  const handleSubmit = (e) => {
    e.preventDefault();

    if (selectedCartItems.length === 0) {
      alert('Tidak ada produk yang dipilih untuk checkout.');
      return;
    }

    if (!validateForm()) return;

    // Simpan jumlah item yang dibeli SEBELUM dihapus dari keranjang
    setPurchasedCount(selectedCartItems.length);

    // Tampilkan halaman sukses
    setIsSubmitted(true);

    // Hapus hanya barang yang dipilih dari keranjang
    removeSelectedItems(selectedItemIds);

    // Redirect ke beranda setelah 3 detik
    setTimeout(() => {
      navigate('/');
    }, 3000);
  };

  // Halaman Sukses
  if (isSubmitted) {
    return (
      <div className="order-success">
        <FaCheckCircle className="success-icon" />
        <h2>Pesanan Berhasil!</h2>
        <p className="text-lg font-medium">Terima kasih telah berbelanja di TokoKita!</p>
        <p className="text-sm text-gray-600 mt-4">
          <strong>{purchasedCount} item</strong> telah berhasil dibeli.<br />
          Barang yang tidak dipilih masih tersimpan di keranjang Anda.
        </p>
        <p className="text-sm text-gray-500 mt-8">
          Anda akan dialihkan ke beranda dalam beberapa detik...
        </p>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <h1>Checkout</h1>

      {selectedCartItems.length === 0 && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg mb-6 text-center">
          <p className="font-medium">Tidak ada produk yang dipilih untuk checkout.</p>
          <button
            onClick={() => navigate('/cart')}
            className="underline mt-2 inline-block font-medium"
          >
            Kembali ke Keranjang
          </button>
        </div>
      )}

      <div className="checkout-container">
        {/* Form Pengiriman & Pembayaran */}
        <form onSubmit={handleSubmit} className="checkout-form">
          <h2>Informasi Pengiriman</h2>

          <div className="form-group">
            <label>Nama Lengkap *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Masukkan nama lengkap"
            />
            {errors.name && <span className="error">{errors.name}</span>}
          </div>

          <div className="form-group">
            <label>Email *</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="contoh@email.com"
            />
            {errors.email && <span className="error">{errors.email}</span>}
          </div>

          <div className="form-group">
            <label>Nomor HP *</label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="081234567890"
            />
            {errors.phone && <span className="error">{errors.phone}</span>}
          </div>

          <div className="form-group">
            <label>Alamat Lengkap *</label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              rows="3"
              placeholder="Jalan, nomor rumah, RT/RW, kelurahan"
            />
            {errors.address && <span className="error">{errors.address}</span>}
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Kota / Kabupaten *</label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                placeholder="Jakarta Selatan"
              />
              {errors.city && <span className="error">{errors.city}</span>}
            </div>
            <div className="form-group">
              <label>Kode Pos *</label>
              <input
                type="text"
                name="postalCode"
                value={formData.postalCode}
                onChange={handleChange}
                maxLength="5"
                placeholder="12345"
              />
              {errors.postalCode && <span className="error">{errors.postalCode}</span>}
            </div>
          </div>

          <h2 className="mt-10">Metode Pembayaran</h2>
          <div className="payment-methods">
            <label className="payment-option">
              <input
                type="radio"
                name="payment"
                value="transfer"
                checked={paymentMethod === 'transfer'}
                onChange={(e) => setPaymentMethod(e.target.value)}
              />
              <span>Transfer Bank (BCA, BNI, Mandiri, BRI)</span>
            </label>
            <br />
            <label className="payment-option">
              <input
                type="radio"
                name="payment"
                value="card"
                checked={paymentMethod === 'card'}
                onChange={(e) => setPaymentMethod(e.target.value)}
              />
              <span>Kartu Kredit / Debit</span>
            </label>
            <br />
            <label className="payment-option">
              <input
                type="radio"
                name="payment"
                value="ewallet"
                checked={paymentMethod === 'ewallet'}
                onChange={(e) => setPaymentMethod(e.target.value)}
              />
              <span>E-Wallet (GoPay, OVO, DANA, ShopeePay)</span>
            </label>
          </div>

          <button
            type="submit"
            className="btn-submit"
            disabled={selectedCartItems.length === 0}
          >
            {selectedCartItems.length === 0
              ? 'Pilih Produk Dulu'
              : `Bayar Sekarang • Rp ${finalTotal.toLocaleString('id-ID')}`}
          </button>
        </form>

        {/* Ringkasan Pesanan */}
        <div className="order-summary">
          <h2>Ringkasan Pesanan</h2>

          {selectedCartItems.length === 0 ? (
            <p className="text-center text-gray-500 py-10">Tidak ada item dipilih</p>
          ) : (
            <>
              {selectedCartItems.map(item => (
                <div key={item.id} className="order-item">
                  <span>{item.name} × {item.quantity}</span>
                  <span>Rp {(item.price * item.quantity).toLocaleString('id-ID')}</span>
                </div>
              ))}

              <div className="order-divider"></div>

              <div className="order-item">
                <span>Subtotal</span>
                <span>Rp {subtotal.toLocaleString('id-ID')}</span>
              </div>

              <div className="order-item">
                <span>Ongkos Kirim</span>
                <span>{shippingCost === 0 ? 'Gratis' : `Rp ${shippingCost.toLocaleString('id-ID')}`}</span>
              </div>

              <div className="order-total">
                <span>Total Belanja</span>
                <span className="font-bold text-lg">Rp {finalTotal.toLocaleString('id-ID')}</span>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Checkout;