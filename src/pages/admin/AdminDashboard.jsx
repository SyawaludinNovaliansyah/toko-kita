// src/pages/admin/AdminDashboard.jsx
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  FaBoxOpen,
  FaShoppingCart,
  FaChartLine,
  FaChartBar,
  FaUsers,
  FaDollarSign,
  FaArrowUp,
  FaArrowDown,
} from 'react-icons/fa';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

import { useAuth } from '../../context/AuthContext';
import Swal from 'sweetalert2';

const AdminDashboard = () => {
  const { user } = useAuth();

  // Data dummy (nanti bisa diganti dengan fetch dari API)
  const stats = {
    totalProducts: 248,
    totalOrders: 1452,
    totalRevenue: 45820000,
    totalCustomers: 892,
    growthRevenue: 12.5,
    growthOrders: -3.2,
  };

  // Data grafik penjualan 7 hari terakhir (dummy)
  const salesData = [
    { name: 'Sen', penjualan: 4000000 },
    { name: 'Sel', penjualan: 3200000 },
    { name: 'Rab', penjualan: 5100000 },
    { name: 'Kam', penjualan: 4800000 },
    { name: 'Jum', penjualan: 6200000 },
    { name: 'Sab', penjualan: 7500000 },
    { name: 'Min', penjualan: 6800000 },
  ];

  // Efek selamat datang sekali saja setelah login admin
  useEffect(() => {
    if (sessionStorage.getItem('justLoggedIn') === 'true') {
      Swal.fire({
        title: `Selamat Datang Kembali, ${user?.name || 'Admin'}! 👋`,
        text: 'Anda berhasil masuk ke Panel Administrasi TOKOKITA',
        icon: 'success',
        timer: 3000,
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
      });
      sessionStorage.removeItem('justLoggedIn');
    }
  }, [user]);

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
      

<main className="main-content admin-dashboard-container">
  <div className="container">
    {/* Greeting */}
    <div className="admin-greeting mb-10">
      <br />
      <h1>Halo, {user?.name || 'Admin'}!</h1>
      <br />
    </div>

    {/* Stats Cards */}
    <div className="stats-grid">
      {/* Card 1 - Produk */}
      <div className="stat-card">
        <div className="stat-icon">
          <FaBoxOpen className="text-3xl" />
        </div>
        <div className="growth-indicator" style={{ visibility: 'hidden' }}></div> {/* spacer */}
        <div className="stat-value">{stats.totalProducts}</div>
        <div className="stat-label">Total Produk</div>
        <Link to="/admin/products" className="stat-link">
          Kelola Produk →
        </Link>
      </div>

      {/* Card 2 - Pesanan */}
      <div className="stat-card">
        <div className="stat-icon">
          <FaShoppingCart className="text-3xl" />
        </div>
        <div className="growth-indicator">
          {stats.growthOrders > 0 ? <FaArrowUp /> : <FaArrowDown />}
          <span className={stats.growthOrders > 0 ? 'text-green-600' : 'text-red-600'}>
            {Math.abs(stats.growthOrders)}%
          </span>
        </div>
        <div className="stat-value">{stats.totalOrders.toLocaleString('id-ID')}</div>
        <div className="stat-label">Total Pesanan</div>
        <Link to="/admin/orders" className="stat-link">
          Lihat Pesanan →
        </Link>
      </div>

      {/* Card 3 - Pendapatan */}
      <div className="stat-card">
        <div className="stat-icon">
          <FaDollarSign className="text-3xl" />
        </div>
        <div className="growth-indicator text-green-600">
          <FaArrowUp /> {stats.growthRevenue}%
        </div>
        <div className="stat-value">{formatRupiah(stats.totalRevenue)}</div>
        <div className="stat-label">Total Pendapatan</div>
        <Link to="/admin/sales-report" className="stat-link">
          Lihat Laporan →
        </Link>
      </div>

      {/* Card 4 - Pelanggan */}
      <div className="stat-card">
        <div className="stat-icon">
          <FaUsers className="text-3xl" />
        </div>
        <div className="growth-indicator" style={{ visibility: 'hidden' }}></div>
        <div className="stat-value">{stats.totalCustomers}</div>
        <div className="stat-label">Total Pelanggan</div>
      </div>
    </div>

{/* Grafik Penjualan - FIX HEIGHT */}
<div className="chart-container">
  <h2 className="chart-title">
    <FaChartLine className="text-green-600" />
    Grafik Penjualan 7 Hari Terakhir
  </h2>

  <div style={{ width: '100%', height: '400px' }}>
    <ResponsiveContainer width="100%" height="100%">
      <LineChart
        data={salesData}
        margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
        <XAxis 
          dataKey="name" 
          tick={{ fill: '#64748b' }}
          style={{ fontSize: '14px' }}
        />
        <YAxis 
          tickFormatter={(value) => `Rp ${(value / 1000000).toFixed(0)}jt`}
          tick={{ fill: '#64748b' }}
          style={{ fontSize: '14px' }}
        />
        <Tooltip 
          formatter={(value) => formatRupiah(value)}
          contentStyle={{ 
            backgroundColor: 'rgba(255, 255, 255, 0.95)', 
            border: '1px solid #e0e0e0',
            borderRadius: '8px'
          }}
        />
        <Line
          type="monotone"
          dataKey="penjualan"
          stroke="#4c51bf"
          strokeWidth={4}
          dot={{ fill: '#4c51bf', r: 6, strokeWidth: 2 }}
          activeDot={{ r: 8, stroke: '#4c51bf', strokeWidth: 3 }}
          animationDuration={1500}
        />
      </LineChart>
    </ResponsiveContainer>
  </div>
</div>

    {/* Quick Actions */}
    <div className="quick-actions">
      <Link to="/admin/products" className="action-card">
        <FaBoxOpen className="action-icon" />
        <h3 className="action-title">Kelola Produk</h3>
        <p className="action-desc">Tambah, edit, atau hapus produk</p>
      </Link>

      <Link to="/admin/orders" className="action-card">
        <FaShoppingCart className="action-icon" />
        <h3 className="action-title">Proses Pesanan</h3>
        <p className="action-desc">Update status pengiriman</p>
      </Link>

      <Link to="/admin/sales-report" className="action-card">
        <FaChartBar className="action-icon" />
        <h3 className="action-title">Laporan Penjualan</h3>
        <p className="action-desc">Analisis performa toko</p>
      </Link>
    </div>
  </div>
</main>
    </>
    
  );
};

export default AdminDashboard;