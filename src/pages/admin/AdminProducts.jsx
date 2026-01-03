// src/pages/admin/AdminProducts.jsx
import React, { useState } from 'react';
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaSearch,
  FaBoxOpen,
  FaTimes,
  FaUpload,
} from 'react-icons/fa';
import AdminHeader from '../../components/AdminHeader';
import Swal from 'sweetalert2';
import '../../styles/AdminProducts.css';

const AdminProducts = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingProductId, setEditingProductId] = useState(null);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    category: 'Elektronik',
    stock: '',
    description: '',
    image: null,
    imagePreview: null,
  });

  // Data dummy produk
  const [products, setProducts] = useState([
    {
      id: 1,
      name: 'Smartphone X Pro',
      price: 7999000,
      category: 'Elektronik',
      stock: 15,
      status: 'active',
      image: 'https://techdaily.id/wp-content/uploads/2024/11/Cubot-KingKong-X-Pro-Smartphone-Tangguh-Cover.jpg',
    },
    {
      id: 2,
      name: 'Laptop Gaming Predator X',
      price: 21999000,
      category: 'Elektronik',
      stock: 8,
      status: 'lowstock',
      image: 'https://s.alicdn.com/@sc04/kf/H755355196440420487cf079443f2d3d6P.png',
    },
    {
      id: 3,
      name: 'Kaos Polos Premium Cotton',
      price: 89000,
      category: 'Fashion',
      stock: 120,
      status: 'active',
      image: 'https://down-id.img.susercontent.com/file/id-11134207-7rasg-m5cy75a07sa05b',
    },
    {
      id: 4,
      name: 'Sepatu Running UltraBoost',
      price: 1899000,
      category: 'Fashion',
      stock: 35,
      status: 'active',
      image: 'https://photo-fhad-fithub.s3.ap-southeast-1.amazonaws.com/Kenzo_Run_31c323e0f8.jpg',
    },
    {
      id: 5,
      name: 'Headphone Wireless Pro ANC',
      price: 3499000,
      category: 'Elektronik',
      stock: 22,
      status: 'active',
      image: 'https://img.id.my-best.com/product_images/75f526fbb360ac0f9b81dc06ebacbc0a.jpeg',
    },
  ]);

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Buka modal Tambah
  const openAddModal = () => {
    setIsEditMode(false);
    setEditingProductId(null);
    setFormData({
      name: '',
      price: '',
      category: 'Elektronik',
      stock: '',
      description: '',
      image: null,
      imagePreview: null,
    });
    setIsModalOpen(true);
  };

  // Buka modal Edit
  const openEditModal = (product) => {
    setIsEditMode(true);
    setEditingProductId(product.id);
    setFormData({
      name: product.name,
      price: product.price,
      category: product.category,
      stock: product.stock,
      description: product.description || '',
      image: null,
      imagePreview: product.image,
    });
    setIsModalOpen(true);
  };

  // Handle upload gambar
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({
          ...formData,
          image: file,
          imagePreview: reader.result,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle simpan (Tambah/Edit)
  const handleSaveProduct = (e) => {
    e.preventDefault();

    if (!formData.name || !formData.price || !formData.stock || (!formData.imagePreview && !isEditMode)) {
      Swal.fire('Error', 'Harap isi semua field wajib!', 'error');
      return;
    }

    if (isEditMode) {
      // Edit produk
      setProducts(products.map(p => 
        p.id === editingProductId 
          ? {
              ...p,
              name: formData.name,
              price: Number(formData.price),
              category: formData.category,
              stock: Number(formData.stock),
              description: formData.description,
              image: formData.imagePreview,
            }
          : p
      ));
      Swal.fire('Berhasil!', 'Produk berhasil diperbarui.', 'success');
    } else {
      // Tambah produk baru
      const newProduct = {
        id: products.length + 1,
        name: formData.name,
        price: Number(formData.price),
        category: formData.category,
        stock: Number(formData.stock),
        status: Number(formData.stock) > 10 ? 'active' : Number(formData.stock) > 0 ? 'lowstock' : 'outofstock',
        image: formData.imagePreview,
      };
      setProducts([...products, newProduct]);
      Swal.fire('Berhasil!', 'Produk baru berhasil ditambahkan.', 'success');
    }

    setIsModalOpen(false);
  };

  // Handle hapus
  const handleDelete = (id, productName) => {
    Swal.fire({
      title: 'Hapus Produk?',
      text: `Produk "${productName}" akan dihapus permanen.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Ya, Hapus!',
      cancelButtonText: 'Batal',
    }).then((result) => {
      if (result.isConfirmed) {
        setProducts(products.filter(p => p.id !== id));
        Swal.fire('Terhapus!', 'Produk berhasil dihapus.', 'success');
      }
    });
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'active':
        return <span className="status-badge status-active">Tersedia</span>;
      case 'lowstock':
        return <span className="status-badge status-lowstock">Stok Menipis</span>;
      case 'outofstock':
        return <span className="status-badge status-outofstock">Habis</span>;
      default:
        return null;
    }
  };

  return (
    <>

      <main className="main-content admin-products-container">
        <div className="container mx-auto px-4 py-8">
          <br />
          <br />
          {/* Header */}
          <div className="products-header">
            <h1 className="products-title">
              <FaBoxOpen />
              Kelola Produk
            </h1>
            <button onClick={openAddModal} className="btn-add-product">
              <FaPlus />
              Tambah Produk
            </button>
          </div>

          {/* Search */}
          <div className="search-container mb-8">
            <input
              type="text"
              placeholder="Cari nama produk atau kategori..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>

          {/* Tabel */}
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
                      <td colSpan="7" className="text-center py-12 text-gray-500">
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
                            className="product-thumbnail"
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
                            <button
                              className="btn-edit"
                              onClick={() => openEditModal(product)}
                              title="Edit"
                            >
                              <FaEdit />
                            </button>
                            <button
                              className="btn-delete"
                              onClick={() => handleDelete(product.id, product.name)}
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

      {/* MODAL TAMBAH / EDIT PRODUK */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal-content add-product-modal" onClick={(e) => e.stopPropagation()}>
            <button className="close-modal" onClick={() => setIsModalOpen(false)}>
              <FaTimes />
            </button>

            <h2 className="modal-title">
              <FaEdit className="mr-3" />
              {isEditMode ? 'Edit Produk' : 'Tambah Produk Baru'}
            </h2>

            <form onSubmit={handleSaveProduct} className="add-product-form">
              {/* Upload Gambar */}
              <div className="form-group mb-6">
                <label className="form-label">Gambar Produk {isEditMode ? '' : '*'}</label>
                <div className="image-upload-area">
                  {formData.imagePreview ? (
                    <img src={formData.imagePreview} alt="Preview" className="image-preview" />
                  ) : (
                    <div className="upload-placeholder">
                      <FaUpload className="upload-icon" />
                      <p className="upload-text">Klik untuk upload gambar</p>
                    </div>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="image-input"
                    required={!isEditMode}
                  />
                </div>
              </div>

              {/* Nama Produk */}
              <div className="form-group">
                <label className="form-label">Nama Produk *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Masukkan nama produk"
                  className="form-input"
                  required
                />
              </div>

              {/* Harga & Stok */}
              <div className="grid grid-cols-2 gap-4">
                <div className="form-group">
                  <label className="form-label">Harga (Rp) *</label>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    placeholder="0"
                    className="form-input"
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Stok *</label>
                  <input
                    type="number"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    placeholder="0"
                    className="form-input"
                    required
                  />
                </div>
              </div>

              {/* Kategori */}
              <div className="form-group">
                <label className="form-label">Kategori</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="form-input"
                >
                  <option value="Elektronik">Elektronik</option>
                  <option value="Fashion">Fashion</option>
                  <option value="Makanan">Makanan & Minuman</option>
                  <option value="Kesehatan">Kesehatan & Kecantikan</option>
                  <option value="Rumah Tangga">Rumah Tangga</option>
                </select>
              </div>

              {/* Deskripsi */}
              <div className="form-group">
                <label className="form-label">Deskripsi Produk</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Jelaskan produk ini..."
                  rows="4"
                  className="form-input"
                />
              </div>

              {/* Buttons */}
              <div className="modal-buttons">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="btn-cancel"
                >
                  Batal
                </button>
                <button type="submit" className="btn-save">
                  {isEditMode ? 'Simpan Perubahan' : 'Simpan Produk'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default AdminProducts;