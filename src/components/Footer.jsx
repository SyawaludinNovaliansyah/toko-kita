import React from 'react';
import { Link } from 'react-router-dom'; // TAMBAHKAN INI
import { FaInstagram, FaGithub } from 'react-icons/fa';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-content">    
        <div className="footer-section">
          <h4>Contact</h4>
          <p>Email: syawalnoval18@gmail.com</p>
          <p>Phone: (+62) 895-6165-57026</p>
        </div>
        
        <div className="footer-section">
          <h4>Follow Us</h4>
          <div className="social-icons">
            <a href="https://www.instagram.com/syawal_empen" aria-label="Instagram"><FaInstagram /></a>
            <a href="https://github.com/SyawaludinNovaliansyah" aria-label="GitHub"><FaGithub /></a>
          </div>
        </div>
      </div>
      
      <div className="footer-bottom">
        <p>&copy; {currentYear} E-Shop. Createt By : Syawaludin Novaliansyah (2404027)</p>
      </div>
    </footer>
  );
};

export default Footer;