// src/pages/admin/AdminProducts.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaSearch,
  FaBoxOpen,
} from 'react-icons/fa';
import AdminHeader from '../../components/AdminHeader';
import Swal from 'sweetalert2';

const AdminProducts = () => {
  const [searchTerm, setSearchTerm] = useState('');

  // Data dummy produk (nanti bisa diganti dengan state dari context atau API)
  const products = [
    {
      id: 1,
      name: 'Laptop Gaming ASUS ROG Strix',
      price: 25000000,
      category: 'Elektronik',
      stock: 15,
      status: 'active',
      image: 'https://via.placeholder.com/80?text=Laptop', // Ganti dengan URL gambar asli nanti
    },
    {
      id: 2,
      name: 'Sepatu Sneakers Nike Air Max',
      price: 1500000,
      category: 'Fashion',
      stock: 0,
      status: 'outofstock',
      image: 'https://via.placeholder.com/80?text=Sepatu',
    },
    {
      id: 3,
      name: 'Smartphone Samsung Galaxy S24',
      price: 12000000,
      category: 'Elektronik',
      stock: 30,
      status: 'active',
      image: 'https://via.placeholder.com/80?text=Smartphone',
    },
    {
      id: 4,
      name: 'Tas Ransel Eiger Adventure',
      price: 850000,
      category: 'Fashion',
      stock: 8,
      status: 'lowstock',
      image: 'https://via.placeholder.com/80?text=Tas',
    },
    {
      id: 5,
      name: 'Kamera DSLR Canon EOS 1500D',
      price: 18000000,
      category: 'Elektronik',
      stock: 5,
      status: 'lowstock',
      image: 'https://via.placeholder.com/80?text=Kamera',
    },
  ];

  // Filter produk berdasarkan search
  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Konfirmasi hapus produk
  const handleDelete = (productName) => {
    Swal.fire({
      title: 'Hapus Produk?',
      text: `Produk "${productName}" akan dihapus permanen dari toko.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Ya, Hapus!',
      cancelButtonText: 'Batal',
    }).then((result) => {
      if (result.isConfirmed) {
        // Logika hapus produk (nanti connect ke API)
        Swal.fire({
          title: 'Terhapus!',
          text: 'Produk berhasil dihapus.',
          icon: 'success',
          timer: 2000,
          showConfirmButton: false,
        });
      }
    });
  };

  // Badge status stok
  const getStatusBadge = (status) => {
    if (status === 'active') {
      return <span className="status-badge status-active">Tersedia</span>;
    } else if (status === 'lowstock') {
      return <span className="status-badge status-lowstock">Stok Menipis</span>;
    } else if (status === 'outofstock') {
      return <span className="status-badge status-outofstock">Habis</span>;
    }
    return null;
  };

  return (
    <>

      <main className="main-content admin-products-container">
        <div className="container mx-auto px-4 py-8">
          {/* Header Section */}
          <div className="products-header">
            <h1 className="products-title">
              <FaBoxOpen />
              Kelola Produk
            </h1>
            <Link to="/admin/products/add" className="btn-add-product">
              <FaPlus />
              Tambah Produk
            </Link>
          </div>

          {/* Search Bar */}
          <div className="search-container mb-8">
            <FaSearch className="search-icon" />
            <input
              type="text"
              placeholder="Cari nama produk atau kategori..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
          <br />

          {/* Tabel Produk */}
          <div className="products-table-container">
            <div className="overflow-x-auto">
              <table className="products-table">
                <thead>
                  <tr>
                    <th>Gambar</th>
                    <th>Produk</th>
                    <th>Harga</th>
                    <th>Kategori</th>
                    <th>Stok</th>
                    <th>Status</th>
                    <th>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="text-center py-10 text-gray-500">
                        Tidak ada produk ditemukan
                      </td>
                    </tr>
                  ) : (
                    filteredProducts.map((product) => (
                      <tr key={product.id}>
                        <td data-label="Gambar">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-16 h-16 object-cover rounded-lg"
                          />
                        </td>
                        <td data-label="Produk">
                          <div className="product-name">{product.name}</div>
                        </td>
                        <td data-label="Harga">
                          <div className="product-price">
                            Rp {product.price.toLocaleString('id-ID')}
                          </div>
                        </td>
                        <td data-label="Kategori">{product.category}</td>
                        <td data-label="Stok">{product.stock}</td>
                        <td data-label="Status">{getStatusBadge(product.status)}</td>
                        <td data-label="Aksi">
                          <div className="action-buttons">
                            <button className="btn-edit" title="Edit">
                              <FaEdit />
                            </button>
                            <button
                              className="btn-delete"
                              onClick={() => handleDelete(product.name)}
                              title="Hapus"
                            >
                              <FaTrash />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="pagination">
              <div className="pagination-info">
                Menampilkan 1 sampai {filteredProducts.length} dari {products.length} produk
              </div>
              <div className="pagination-buttons">
                <button className="btn-pagination">Previous</button>
                <button className="btn-pagination active">1</button>
                <button className="btn-pagination">Next</button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default AdminProducts;