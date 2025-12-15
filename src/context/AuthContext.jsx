// src/context/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Data user statis (untuk demo/testing)
const staticUsers = [
  {
    email: 'user@toko.com',
    username: 'user',
    password: 'user123',
    name: 'User Biasa',
  },
  {
    email: 'admin@toko.com',
    username: 'admin',
    password: 'admin123',
    name: 'Admin Toko',
  },
  // Tambahkan user lain di sini jika perlu
];

export const AuthProvider = ({ children }) => {
  // Coba ambil user dari localStorage saat pertama load
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('tokoKitaUser');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch (error) {
      console.error('Error parsing saved user:', error);
      return null;
    }
  });

  // Simpan ke localStorage setiap kali user berubah
  useEffect(() => {
    if (user) {
      localStorage.setItem('tokoKitaUser', JSON.stringify(user));
    } else {
      localStorage.removeItem('tokoKitaUser');
    }
  }, [user]);

  const login = (emailOrUsername, password) => {
    // Cari user yang cocok (email atau username)
    const foundUser = staticUsers.find(
      (u) =>
        (u.email.toLowerCase() === emailOrUsername.toLowerCase() ||
         u.username.toLowerCase() === emailOrUsername.toLowerCase()) &&
        u.password === password
    );

    if (foundUser) {
      // Jangan simpan password di state atau localStorage
      const { password, ...safeUserData } = foundUser;
      setUser(safeUserData);
      return { success: true, user: safeUserData };
    }

    return { success: false, error: 'Email/Username atau password salah!' };
  };

  const logout = () => {
    setUser(null);
    // Opsional: bisa bersihkan data lain seperti cart jika perlu
    // localStorage.removeItem('cartItems');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};