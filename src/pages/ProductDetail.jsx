import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useCart from '../hooks/useCart';
import productsData from '../data/products.json';
import { FaArrowLeft, FaCartPlus } from 'react-icons/fa';
import Swal from 'sweetalert2'; // Import SweetAlert2

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);

  const product = React.useMemo(() => {
    return productsData.find(p => p.id === parseInt(id));
  }, [id]);

  useEffect(() => {
    if (!product) {
      navigate('/products');
    }
  }, [product, navigate]);

  if (!product) {
    return <div className="loading">Memuat detail produk...</div>;
  }

  const handleAddToCart = () => {
    // Tambahkan produk sesuai jumlah yang dipilih
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }

    // SweetAlert2 — Notifikasi cantik
    Swal.fire({
      icon: 'success',
      title: 'Berhasil Ditambahkan!',
      html: `
        <strong>${quantity} × ${product.name}</strong><br/>
        <small>telah masuk ke keranjang belanja</small>
      `,
      timer: 2500,
      timerProgressBar: true,
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      customClass: {
        popup: 'animated fadeInRight faster'
      }
    });
  };

  const handleBuyNow = () => {
    handleAddToCart();
    navigate('/cart');
  };

  return (
    <div className="product-detail">
      <button className="btn-back" onClick={() => navigate(-1)}>
        <FaArrowLeft /> Kembali
      </button>

      <div className="product-detail-container">
        <div className="product-image-large">
          <img src={product.image} alt={product.name} loading="lazy" />
        </div>

        <div className="product-info-detail">
          <h1 className="text-2xl md:text-3xl font-bold">{product.name}</h1>
          <p className="price text-3xl font-bold text-orange-600 mt-3">
            Rp {product.price.toLocaleString('id-ID')}
          </p>
          <p className="category text-sm text-gray-600 mt-2">
            Kategori: <span className="font-medium">{product.category}</span>
          </p>
          <p className="description text-gray-700 mt-4 leading-relaxed">
            {product.description}
          </p>
          <p className="stock text-sm mt-3">
            Stok tersedia: <strong>{product.stock} buah</strong>
          </p>

          <div className="quantity-selector mt-6">
            <label className="block text-sm font-medium mb-2">Jumlah:</label>
            <div className="quantity-controls inline-flex items-center border rounded-lg">
              <button
                onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                disabled={quantity <= 1}
                className="px-4 py-2 hover:bg-gray-100 disabled:opacity-50"
              >
                −
              </button>
              <span className="px-6 py-2 font-semibold text-lg">{quantity}</span>
              <button
                onClick={() => setQuantity(prev => Math.min(product.stock, prev + 1))}
                disabled={quantity >= product.stock}
                className="px-4 py-2 hover:bg-gray-100 disabled:opacity-50"
              >
                +
              </button>
            </div>
          </div>

          <div className="action-buttons mt-8 flex flex-col sm:flex-row gap-4">
            <button
              className="btn-buy flex-1 flex items-center justify-center gap-3 text-lg py-4"
              onClick={handleAddToCart}
            >
              <FaCartPlus className="text-xl" />
              Tambah ke Keranjang
            </button>
            <button
              className="btn-checkout flex-1 py-4 text-lg font-bold"
              onClick={handleBuyNow}
            >
              Beli Sekarang
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;