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

// Data user statis dengan role
const staticUsers = [
  {
    email: 'user@toko.com',
    username: 'user',
    password: 'user123',
    name: 'User Biasa',
    role: 'user',
  },
  {
    email: 'admin@toko.com',
    username: 'admin',
    password: 'admin123',
    name: 'Admin Toko',
    role: 'admin',
  },
];

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('tokoKitaUser');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch (error) {
      console.error('Error parsing saved user:', error);
      return null;
    }
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('tokoKitaUser', JSON.stringify(user));
    } else {
      localStorage.removeItem('tokoKitaUser');
    }
  }, [user]);

  // Fungsi login — ganti nama parameter 'password' jadi 'pwd' untuk hindari konflik
  const login = (emailOrUsername, pwd, expectedRole = null) => {
    const foundUser = staticUsers.find(
      (u) =>
        (u.email.toLowerCase() === emailOrUsername.toLowerCase() ||
         u.username.toLowerCase() === emailOrUsername.toLowerCase()) &&
        u.password === pwd
    );

    if (!foundUser) {
      return { success: false, error: 'Email/Username atau password salah!' };
    }

    // Cek role jika diperlukan
    if (expectedRole && foundUser.role !== expectedRole) {
      return {
        success: false,
        error:
          expectedRole === 'admin'
            ? 'Akses ditolak!'
            : 'Akses ditolak!',
      };
    }

    // Hapus password dari data yang disimpan
    const { password, ...safeUserData } = foundUser;
    setUser(safeUserData);
    return { success: true, user: safeUserData };
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};