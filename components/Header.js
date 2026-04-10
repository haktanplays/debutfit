'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
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
    const handleEscape = (e) => {
      if (e.key === 'Escape' && menuOpen) setMenuOpen(false);
    };
    document.addEventListener('click', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('click', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [menuOpen]);

  return (
    <header style={scrolled ? {
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      padding: '10px clamp(15px, 4vw, 50px)',
      boxShadow: '0 4px 30px rgba(0,0,0,0.15)'
    } : {
      backgroundColor: 'rgba(255, 255, 255, 0.7)',
      padding: '15px clamp(15px, 4vw, 50px)',
      boxShadow: '0 2px 20px rgba(0,0,0,0.1)'
    }}>
      <div className="logo-container" style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        <Link href="/" style={{ marginRight: '25px' }}>
          <Image src="/images/DEBUTFiT.png" alt="DebutFit Club Logo" className="logo-img" width={150} height={55} priority />
        </Link>
        <span style={{ color: '#000000', fontSize: '20px', marginLeft: '5px', fontWeight: 800, userSelect: 'none' }}>X</span>
        <Link href="/satranc">
          <Image
            src="/images/debutsatranc.png"
            alt="Debut Satranç Logo"
            width={80}
            height={66}
            style={{ marginTop: '20px', transition: 'transform 0.3s' }}
            onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
            onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
          />
        </Link>
      </div>

      <button className="mobile-menu-btn" id="mobileMenuBtn" type="button" aria-label="Menüyü aç" onClick={() => setMenuOpen(true)}>
        <span></span><span></span><span></span>
      </button>

      <nav id="mainNav" className={menuOpen ? 'open' : ''} aria-label="Ana navigasyon">
        <button className="close-menu-btn" id="closeMenuBtn" type="button" aria-label="Menüyü kapat" onClick={() => setMenuOpen(false)}>&times;</button>
        <ul>
          <li><Link href="/" className="nav-link" onClick={() => setMenuOpen(false)}>Ana Sayfa</Link></li>
          <li><Link href="/#faq" className="nav-link" onClick={() => setMenuOpen(false)}>Hakkımızda</Link></li>
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
