import React from 'react';
import { Link } from 'react-router-dom';
import { FaArrowRight, FaTag, FaShippingFast, FaHeadset } from 'react-icons/fa';
import products from '../data/products.json';

const Home = () => {
  const featuredProducts = products.slice(0, 8); // Tampilkan 8 produk biar lebih menarik

  return (
    <div className="home">
      {/* Hero Banner */}
      <section className="hero-banner">
        <div className="hero-content">
          <h1>Selamat Datang di TokoKita</h1>
          <p>Temukan produk berkualitas dengan harga terbaik dan pengiriman cepat</p>
          <Link to="/products" className="btn-hero">
            Belanja Sekarang <FaArrowRight />
          </Link>
        </div>
      </section>

      {/* Fitur Unggulan */}
      <section className="features">
        <div className="feature-item">
          <FaTag className="feature-icon" />
          <h3>Harga Terbaik</h3>
          <p>Harga kompetitif untuk semua produk</p>
        </div>
        <div className="feature-item">
          <FaShippingFast className="feature-icon" />
          <h3>Pengiriman Cepat & Gratis</h3>
          <p>Gratis ongkir untuk pembelian di atas Rp 500.000</p>
        </div>
        <div className="feature-item">
          <FaHeadset className="feature-icon" />
          <h3>Customer Service 24/7</h3>
          <p>Tim kami siap membantu kapan saja</p>
        </div>
      </section>

      {/* Produk Unggulan */}
      <section className="featured-products">
        <h2>Produk Unggulan</h2>
        <div className="products-grid">
          {featuredProducts.map(product => (
            <div key={product.id} className="featured-product-card">
              <img 
                src={product.image} 
                alt={product.name} 
                loading="lazy"
              />
              <h3>{product.name}</h3>
              <p className="category">{product.category}</p>
              <p className="price">
                Rp {product.price.toLocaleString('id-ID')}
              </p>
              <Link to={`/product/${product.id}`} className="btn-view">
                Lihat Detail
              </Link>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;