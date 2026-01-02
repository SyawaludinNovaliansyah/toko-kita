// src/pages/admin/AdminOrders.jsx
import React, { useState } from 'react';
import { FaEye, FaShoppingCart, FaTimes, FaUser, FaCalendarAlt, FaMoneyBillWave, FaBox } from 'react-icons/fa';
import AdminHeader from '../../components/AdminHeader';
import '../../styles/AdminOrders.css';

const AdminOrders = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  // Data dummy pesanan
  const orders = [
    {
      id: 'ORD-001',
      customer: 'Budi Santoso',
      date: '21 Des 2025',
      total: 25000000,
      status: 'pending',
      items: [
        { name: 'Laptop Gaming ASUS ROG', qty: 1, price: 25000000 },
      ],
      address: 'Jl. Sudirman No. 123, Jakarta',
      phone: '081234567890',
    },
    {
      id: 'ORD-002',
      customer: 'Siti Aminah',
      date: '20 Des 2025',
      total: 1500000,
      status: 'processing',
      items: [
        { name: 'Sepatu Sneakers Nike', qty: 1, price: 1500000 },
      ],
      address: 'Jl. Thamrin No. 45, Bandung',
      phone: '082345678901',
    },
    {
      id: 'ORD-003',
      customer: 'Ahmad Fauzi',
      date: '19 Des 2025',
      total: 12000000,
      status: 'shipped',
      items: [
        { name: 'Smartphone Samsung Galaxy', qty: 1, price: 12000000 },
      ],
      address: 'Jl. Gatot Subroto No. 78, Surabaya',
      phone: '083456789012',
    },
    {
      id: 'ORD-004',
      customer: 'Rina Wijaya',
      date: '18 Des 2025',
      total: 850000,
      status: 'delivered',
      items: [
        { name: 'Tas Ransel Eiger', qty: 1, price: 850000 },
      ],
      address: 'Jl. Malioboro No. 56, Yogyakarta',
      phone: '084567890123',
    },
    {
      id: 'ORD-005',
      customer: 'Dedi Kusuma',
      date: '17 Des 2025',
      total: 18000000,
      status: 'cancelled',
      items: [
        { name: 'Kamera DSLR Canon', qty: 1, price: 18000000 },
      ],
      address: 'Jl. Diponegoro No. 89, Medan',
      phone: '085678901234',
    },
  ];

  // Filter pesanan
  const filteredOrders = orders.filter((order) =>
    order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.customer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Buka modal detail
  const openDetailModal = (order) => {
    setSelectedOrder(order);
    setIsDetailModalOpen(true);
  };

  // Badge status
  const getStatusBadge = (status) => {
    switch (status) {
      case 'pending':
        return <span className="status-badge status-pending">Menunggu Pembayaran</span>;
      case 'processing':
        return <span className="status-badge status-processing">Diproses</span>;
      case 'shipped':
        return <span className="status-badge status-shipped">Dikirim</span>;
      case 'delivered':
        return <span className="status-badge status-delivered">Terkirim</span>;
      case 'cancelled':
        return <span className="status-badge status-cancelled">Dibatalkan</span>;
      default:
        return null;
    }
  };

  return (
    <>

      <main className="main-content admin-orders-container">
        <div className="container mx-auto px-4 py-8">
          {/* Judul */}
          <div className="orders-header">
            <h1 className="orders-title">
              <FaShoppingCart />
              Daftar Pesanan
            </h1>
          </div>

          {/* Search */}
          <div className="search-container">
            <input
              type="text"
              placeholder="Cari ID pesanan atau nama pelanggan..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>

          {/* Tabel */}
          <div className="orders-table-container">
            <div className="overflow-x-auto">
              <table className="orders-table">
                <thead>
                  <tr>
                    <th>ID Pesanan</th>
                    <th>Pelanggan</th>
                    <th>Tanggal</th>
                    <th>Total</th>
                    <th>Status</th>
                    <th>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="text-center py-12 text-gray-500">
                        Tidak ada pesanan ditemukan
                      </td>
                    </tr>
                  ) : (
                    filteredOrders.map((order) => (
                      <tr key={order.id}>
                        <td data-label="ID Pesanan">
                          <div className="order-id">{order.id}</div>
                        </td>
                        <td data-label="Pelanggan">
                          <div className="order-customer">{order.customer}</div>
                        </td>
                        <td data-label="Tanggal">{order.date}</td>
                        <td data-label="Total">
                          <div className="order-total">
                            Rp {order.total.toLocaleString('id-ID')}
                          </div>
                        </td>
                        <td data-label="Status">{getStatusBadge(order.status)}</td>
                        <td data-label="Aksi">
                          <button
                            className="btn-view"
                            onClick={() => openDetailModal(order)}
                            title="Lihat Detail"
                          >
                            <FaEye />
                          </button>
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
                Menampilkan 1 sampai {filteredOrders.length} dari {orders.length} pesanan
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

      {/* MODAL DETAIL PESANAN */}
      {isDetailModalOpen && selectedOrder && (
        <div className="modal-overlay" onClick={() => setIsDetailModalOpen(false)}>
          <div className="modal-content order-detail-modal" onClick={(e) => e.stopPropagation()}>
            <button className="close-modal" onClick={() => setIsDetailModalOpen(false)}>
              <FaTimes />
            </button>

            <h2 className="modal-title">
              Detail Pesanan {selectedOrder.id}
            </h2>

            <div className="order-detail-content">
              {/* Info Utama */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="detail-card">
                  <div>
                    <p className="detail-label">Pelanggan</p>
                    <p className="detail-value">{selectedOrder.customer}</p>
                    <p className="detail-value">{selectedOrder.phone}</p>
                  </div>
                </div>

                <div className="detail-card">
                  <div>
                    <p className="detail-label">Tanggal Pesan</p>
                    <p className="detail-value">{selectedOrder.date}</p>
                  </div>
                </div>

                <div className="detail-card">
                  <div>
                    <p className="detail-label">Total Pembayaran</p>
                    <p className="">
                      Rp {selectedOrder.total.toLocaleString('id-ID')}
                    </p>
                  </div>
                </div>

                <div className="detail-card">
                  <div>
                    <p className="detail-label">Status Pesanan</p>
                    <div className="mt-2">{getStatusBadge(selectedOrder.status)}</div>
                  </div>
                </div>
              </div>

              {/* Alamat Pengiriman */}
              <div className="detail-section">
                <h3 className="section-title">Alamat Pengiriman</h3>
                <p className="section-content">{selectedOrder.address}</p>
              </div>

              {/* Daftar Produk */}
              <div className="detail-section">
                <h3 className="section-title">Produk yang Dipesan</h3>
                <div className="products-list">
                  {selectedOrder.items.map((item, index) => (
                    <div key={index} className="product-item">
                      <div className="product-info">
                        <p className="product-name">{item.name}</p>
                        <p className="product-qty">Jumlah: {item.qty}x</p>
                      </div>
                      <p className="product-price">
                        Rp {item.price.toLocaleString('id-ID')}
                      </p>
                    </div>
                  ))}
                </div>
                <div className="total-section">
                  <p className="total-label">Total</p>
                  <p className="total-value">
                    Rp {selectedOrder.total.toLocaleString('id-ID')}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AdminOrders;