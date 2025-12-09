import React from 'react';
import { Link } from 'react-router-dom';
import { FaShoppingCart, FaHome, FaBox } from 'react-icons/fa';
import useCart from '../hooks/useCart';

const Header = () => {
  const { getCartCount } = useCart();

  return (
    <header className="header">
      <div className="container">
        <div className="logo">
          <Link to="/">TokoKita</Link>
        </div>
        
        <nav className="nav">
          <Link to="/"><FaHome /> Beranda</Link>
          <Link to="/products"><FaBox /> Produk</Link>
          <div className="cart-icon">
            <Link to="/cart">
              <FaShoppingCart />
              {getCartCount() > 0 && (
                <span className="cart-count">{getCartCount()}</span>
              )}
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;