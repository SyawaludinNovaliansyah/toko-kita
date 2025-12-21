// src/pages/admin/AdminOrders.jsx
import React, { useState } from 'react';
import { FaEye, FaShoppingCart } from 'react-icons/fa'; // Ikon yang digunakan
import AdminHeader from '../../components/AdminHeader';

const AdminOrders = () => {
  const [searchTerm, setSearchTerm] = useState('');

  // Data dummy pesanan
  const orders = [
    { id: 'ORD-001', customer: 'Budi Santoso', date: '21 Des 2025', total: 25000000, status: 'pending' },
    { id: 'ORD-002', customer: 'Siti Aminah', date: '20 Des 2025', total: 1500000, status: 'processing' },
    { id: 'ORD-003', customer: 'Ahmad Fauzi', date: '19 Des 2025', total: 12000000, status: 'shipped' },
    { id: 'ORD-004', customer: 'Rina Wijaya', date: '18 Des 2025', total: 850000, status: 'delivered' },
    { id: 'ORD-005', customer: 'Dedi Kusuma', date: '17 Des 2025', total: 18000000, status: 'cancelled' },
    { id: 'ORD-006', customer: 'Laras Putri', date: '16 Des 2025', total: 3200000, status: 'pending' },
  ];

  // Filter pesanan berdasarkan search
  const filteredOrders = orders.filter((order) =>
    order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.customer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Badge status pesanan
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
          {/* Judul Halaman */}
          <div className="orders-header">
            <h1 className="orders-title">
              <FaShoppingCart />
              Daftar Pesanan
            </h1>
          </div>

          {/* Search Bar */}
          <div className="search-container">
            <input
              type="text"
              placeholder="Cari ID pesanan atau nama pelanggan..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>

          {/* Tabel Pesanan */}
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
                      <td colSpan="6" className="text-center py-10 text-gray-500">
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
                          <button className="btn-view" title="Lihat Detail">
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
    </>
  );
};

export default AdminOrders;