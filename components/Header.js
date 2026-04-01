'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useModal } from '@/components/ModalProvider';

export default function Header() {
  const { setLoginOpen } = useModal();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      const nav = document.getElementById('mainNav');
      const btn = document.getElementById('mobileMenuBtn');
      if (nav && btn && !nav.contains(e.target) && !btn.contains(e.target) && menuOpen) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [menuOpen]);

  return (
    <header style={scrolled ? {
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      padding: '10px 50px',
      boxShadow: '0 4px 30px rgba(0,0,0,0.15)'
    } : {
      backgroundColor: 'rgba(255, 255, 255, 0.7)',
      padding: '15px 50px',
      boxShadow: '0 2px 20px rgba(0,0,0,0.1)'
    }}>
      <div className="logo-container" style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        <Link href="/" style={{ marginRight: '25px' }}>
          <img src="/images/DEBUTFiT.png" alt="DebutFit Club Logo" className="logo-img" />
        </Link>
        <span style={{ color: '#000000', fontSize: '20px', marginLeft: '5px', fontWeight: 800, userSelect: 'none' }}>X</span>
        <Link href="/satranc">
          <img
            src="/images/debutsatranc.png"
            alt="Partner Logo"
            style={{ height: '66px', width: 'auto', marginTop: '20px', transition: 'transform 0.3s' }}
            onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
            onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
          />
        </Link>
      </div>

      <div className="mobile-menu-btn" id="mobileMenuBtn" onClick={() => setMenuOpen(true)}>
        <span></span><span></span><span></span>
      </div>

      <nav id="mainNav" className={menuOpen ? 'open' : ''}>
        <div className="close-menu-btn" id="closeMenuBtn" onClick={() => setMenuOpen(false)}>&times;</div>
        <ul>
          <li><Link href="/" className="nav-link" onClick={() => setMenuOpen(false)}>Ana Sayfa</Link></li>
          <li><Link href="/#about" className="nav-link" onClick={() => setMenuOpen(false)}>Hakkımızda</Link></li>
          <li><Link href="/tesis" className="nav-link" onClick={() => setMenuOpen(false)}>Tesisimiz</Link></li>
          <li><Link href="/programlar" className="nav-link" onClick={() => setMenuOpen(false)}>Programlar</Link></li>
          <li><Link href="/galeri" className="nav-link" onClick={() => setMenuOpen(false)}>Galeri</Link></li>
          <li><Link href="/iletisim" className="nav-link" onClick={() => setMenuOpen(false)}>İletişim</Link></li>
          <li><button id="adminLoginBtn" className="login-btn-animated" onClick={() => { setLoginOpen(true); setMenuOpen(false); }}>Yönetici Girişi</button></li>
        </ul>
      </nav>
    </header>
  );
}
