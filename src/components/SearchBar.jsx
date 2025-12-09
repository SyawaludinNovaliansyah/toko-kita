import React, { useState } from 'react';
import { FaSearch } from 'react-icons/fa';

const SearchBar = ({ onSearch, onCategoryChange }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Kategori dalam bahasa Indonesia
  const categories = [
    { value: 'all', label: 'Semua' },
    { value: 'Elektronik', label: 'Elektronik' },
    { value: 'Fashion', label: 'Fashion' },
    { value: 'Buku', label: 'Buku' },
    { value: 'Furniture', label: 'Furniture' },
    { value: 'Perabot Rumah', label: 'Perabot Rumah' }
  ];

  const handleSearch = (e) => {
    e.preventDefault();
    onSearch(searchTerm);
  };

  const handleCategoryChange = (categoryValue) => {
    setSelectedCategory(categoryValue);
    onCategoryChange(categoryValue);
  };

  return (
    <div className="search-filter-container">
      <form onSubmit={handleSearch} className="search-form">
        <input
          type="text"
          placeholder="Cari produk..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        <button type="submit" className="search-btn">
          <FaSearch />
        </button>
      </form>

      <div className="category-filter">
        {categories.map(({ value, label }) => (
          <button
            key={value}
            className={`category-btn ${selectedCategory === value ? 'active' : ''}`}
            onClick={() => handleCategoryChange(value)}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SearchBar;