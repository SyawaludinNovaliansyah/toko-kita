// src/pages/admin/AdminSalesReport.jsx
import React from 'react';
import { FaChartBar, FaDollarSign, FaShoppingCart, FaUsers } from 'react-icons/fa';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import AdminHeader from '../../components/AdminHeader';
import '../../styles/AdminProducts.css'; // Import CSS khusus (buat file ini nanti)

const AdminSalesReport = () => {
  // Data pendapatan bulanan 2025 (dummy)
  const monthlyData = [
    { month: 'Jan', penjualan: 32000000 },
    { month: 'Feb', penjualan: 28000000 },
    { month: 'Mar', penjualan: 45000000 },
    { month: 'Apr', penjualan: 38000000 },
    { month: 'Mei', penjualan: 52000000 },
    { month: 'Jun', penjualan: 48000000 },
    { month: 'Jul', penjualan: 55000000 },
    { month: 'Agu', penjualan: 60000000 },
    { month: 'Sep', penjualan: 58000000 },
    { month: 'Okt', penjualan: 65000000 },
    { month: 'Nov', penjualan: 70000000 },
    { month: 'Des', penjualan: 82000000 },
  ];

  // Ringkasan penjualan
  const summary = {
    totalRevenue: 582000000,
    totalOrders: 1248,
    averageOrder: 466000,
    newCustomers: 312,
  };

  // Format rupiah
  const formatRupiah = (value) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(value);
  };

  return (
    <>

      <main className="main-content admin-sales-report-container">
        <div className="container mx-auto px-4 py-8">
          {/* Judul Halaman */}
          <div className="sales-report-header">
            <h1 className="sales-report-title">
              <FaChartBar />
              Laporan Penjualan Tahun 2025
            </h1>
          </div>

          {/* Summary Cards */}
          <div className="summary-cards">
            {/* Total Pendapatan */}
            <div className="summary-card">
              <div className="summary-icon">
                <FaDollarSign className="text-4xl" />
              </div>
              <h3 className="summary-value">{formatRupiah(summary.totalRevenue)}</h3>
              <p className="summary-label">Total Pendapatan</p>
            </div>

            {/* Total Pesanan */}
            <div className="summary-card">
              <div className="summary-icon">
                <FaShoppingCart className="text-4xl" />
              </div>
              <h3 className="summary-value">{summary.totalOrders.toLocaleString('id-ID')}</h3>
              <p className="summary-label">Total Pesanan</p>
            </div>

            {/* Rata-rata Pesanan */}
            <div className="summary-card">
              <div className="summary-icon">
                <FaChartBar className="text-4xl" />
              </div>
              <h3 className="summary-value">{formatRupiah(summary.averageOrder)}</h3>
              <p className="summary-label">Rata-rata Pesanan</p>
            </div>

            {/* Pelanggan Baru */}
            <div className="summary-card">
              <div className="summary-icon">
                <FaUsers className="text-4xl" />
              </div>
              <h3 className="summary-value">{summary.newCustomers}</h3>
              <p className="summary-label">Pelanggan Baru</p>
            </div>
          </div>

          {/* Bar Chart Pendapatan Bulanan */}
          <div className="chart-container">
            <h2 className="chart-title">
              Pendapatan Bulanan Tahun 2025
            </h2>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={monthlyData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                <XAxis dataKey="month" tick={{ fill: '#64748b' }} />
                <YAxis tickFormatter={(value) => `Rp ${(value / 1000000).toFixed(0)}jt`} tick={{ fill: '#64748b' }} />
                <Tooltip
                  formatter={(value) => formatRupiah(value)}
                  contentStyle={{
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    border: '1px solid #e0e0e0',
                    borderRadius: '12px',
                    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.15)',
                  }}
                />
                <Bar dataKey="penjualan" fill="#4c51bf" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </main>
    </>
  );
};

export default AdminSalesReport;