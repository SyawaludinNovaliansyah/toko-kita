import React from 'react';
import { Link } from 'react-router-dom';
import useCart from '../hooks/useCart';
import { FaCartPlus } from 'react-icons/fa';
import Swal from 'sweetalert2';
import '../styles/ProductCard.css';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    const success = addToCart(product, 1); // quantity = 1

    if (success) {
      Swal.fire({
        icon: 'success',
        title: 'Berhasil!',
        text: `${product.name} telah ditambahkan ke keranjang`,
        timer: 2000,
        timerProgressBar: true,
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
      });
    }
    // Jika false → user belum login, sudah ditangani di useCart (muncul toast warning)
  };

  return (
    <div className="product-card">
      <div className="product-image">
        <img src={product.image} alt={product.name} loading="lazy" />
      </div>

      <div className="product-info">
        <h3 className="font-semibold text-lg line-clamp-2">{product.name}</h3>
        <p className="price text-xl font-bold text-orange-600 mt-2">
          Rp {product.price.toLocaleString('id-ID')}
        </p>
        <p className="category text-sm text-gray-500">{product.category}</p>
        <p className="description text-sm text-gray-700 mt-2 line-clamp-2">
          {product.description}
        </p>

        <div className="product-actions mt-4 flex gap-3">
          <Link
            to={`/product/${product.id}`}
            className="btn-detail flex-1 text-center"
          >
            Lihat Detail
          </Link>

          <button
            className="btn-cart flex-1 flex items-center justify-center gap-2"
            onClick={handleAddToCart}
          >
            <FaCartPlus />
            Tambah (+)
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;