'use client';
import { useAdmin } from '@/components/admin/AdminContext';
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

export default function AdminPage() {
  const { activeTab } = useAdmin();

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
}
