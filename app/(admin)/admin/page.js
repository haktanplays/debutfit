'use client';
import { useState, useEffect, useCallback } from 'react';
import Dashboard from '@/components/admin/Dashboard';
import ProgramManager from '@/components/admin/ProgramManager';
import QuoteManager from '@/components/admin/QuoteManager';
import TrialManager from '@/components/admin/TrialManager';
import FormSettings from '@/components/admin/FormSettings';
import FacilityManager from '@/components/admin/FacilityManager';
import ContactSettings from '@/components/admin/ContactSettings';
import SliderManager from '@/components/admin/SliderManager';
import AboutFaqManager from '@/components/admin/AboutFaqManager';
import GalleryManager from '@/components/admin/GalleryManager';

const tabs = [
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'programlar', label: 'Program Yonetimi' },
  { id: 'uyeler', label: 'Fiyat Talepleri' },
  { id: 'form-ayarlari', label: 'Teklif Formu Ayarlari' },
  { id: 'tesis', label: 'Tesis Gorselleri' },
  { id: 'iletisim', label: 'Iletisim Ayarlari' },
  { id: 'slider', label: 'Ana Sayfa Gorselleri' },
  { id: 'hakkimizda', label: 'Hakkimizda & Acilir Yazilar' },
  { id: 'galeri-admin', label: 'Galeri Yonetimi' },
];

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState('dashboard');

  const handleMenuClick = useCallback((e) => {
    const menuItem = e.target.closest('[data-tab]');
    if (menuItem) {
      const tabId = menuItem.getAttribute('data-tab');
      setActiveTab(tabId);

      // Update active class on sidebar items
      document.querySelectorAll('.admin-menu-item').forEach(el => el.classList.remove('active'));
      menuItem.classList.add('active');

      // Update header title
      const tabConfig = tabs.find(t => t.id === tabId);
      const headerTitle = document.querySelector('.admin-top-header h1');
      if (headerTitle && tabConfig) headerTitle.textContent = tabConfig.label;

      // Close mobile sidebar
      if (window.innerWidth <= 768) {
        document.querySelector('.admin-sidebar')?.classList.remove('open');
      }
    }
  }, []);

  useEffect(() => {
    const menu = document.querySelector('.admin-menu');
    if (menu) {
      menu.addEventListener('click', handleMenuClick);
      // Set initial active
      const firstItem = menu.querySelector('[data-tab="dashboard"]');
      if (firstItem) firstItem.classList.add('active');
    }
    return () => {
      if (menu) menu.removeEventListener('click', handleMenuClick);
    };
  }, [handleMenuClick]);

  const renderTab = () => {
    switch (activeTab) {
      case 'dashboard': return <Dashboard />;
      case 'programlar': return <ProgramManager />;
      case 'uyeler': return (
        <>
          <QuoteManager />
          <div style={{ marginTop: '50px' }}>
            <TrialManager />
          </div>
        </>
      );
      case 'form-ayarlari': return <FormSettings />;
      case 'tesis': return <FacilityManager />;
      case 'iletisim': return <ContactSettings />;
      case 'slider': return <SliderManager />;
      case 'hakkimizda': return <AboutFaqManager />;
      case 'galeri-admin': return <GalleryManager />;
      default: return <Dashboard />;
    }
  };

  return renderTab();
}
