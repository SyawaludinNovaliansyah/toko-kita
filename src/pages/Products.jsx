import React, { useState } from 'react';
import ProductCard from '../components/ProductCard';
import SearchBar from '../components/SearchBar';
import productsData from '../data/products.json';

const Products = () => {
  const [products] = useState(productsData);
  const [filteredProducts, setFilteredProducts] = useState(productsData);

  const handleSearch = (searchTerm) => {
    if (!searchTerm.trim()) {
      setFilteredProducts(products);
      return;
    }
    
    const filtered = products.filter(product =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredProducts(filtered);
  };

  const handleCategoryChange = (category) => {
    if (category === 'all') {
      setFilteredProducts(products);
    } else {
      const filtered = products.filter(product => 
        product.category.toLowerCase() === category.toLowerCase()
      );
      setFilteredProducts(filtered);
    }
  };

  return (
    <div className="products-page">
      <h1>Semua Produk</h1>
      
      <SearchBar 
        onSearch={handleSearch}
        onCategoryChange={handleCategoryChange}
      />

      <div className="products-container">
        {filteredProducts.length > 0 ? (
          <div className="products-grid">
            {filteredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="no-products">
            <p>Tidak ada produk ditemukan. Coba kata kunci atau kategori lain.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Products;