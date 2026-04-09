'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AdminProvider, useAdmin } from '@/components/admin/AdminContext';
import { createClient } from '@/lib/supabase-client';

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="9"/><rect x="14" y="3" width="7" height="5"/><rect x="14" y="12" width="7" height="9"/><rect x="3" y="16" width="7" height="5"/></svg> },
  { id: 'programlar', label: 'Program Yonetimi', icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg> },
  { id: 'uyeler', label: 'Fiyat Talepleri', icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg> },
  { id: 'form-ayarlari', label: 'Teklif Formu Ayarlari', icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg> },
  { id: 'tesis', label: 'Tesis Gorselleri', icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg> },
  { id: 'iletisim', label: 'Iletisim Ayarlari', icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg> },
  { id: 'slider', label: 'Ana Sayfa Gorselleri', icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg> },
  { id: 'hakkimizda', label: 'Hakkimizda & Acilir Yazilar', icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg> },
  { id: 'galeri-admin', label: 'Galeri Yonetimi', icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg> },
];

function AdminLayoutInner({ children }) {
  const { activeTab, setActiveTab, sidebarOpen, setSidebarOpen } = useAdmin();
  const currentLabel = menuItems.find(m => m.id === activeTab)?.label || 'Yonetici Paneli';

  return (
    <>
      <style jsx global>{`
        .admin-root * { margin: 0; padding: 0; box-sizing: border-box; font-family: 'Montserrat', sans-serif; }
        .admin-root { background-color: #0a0a0a; color: #fff; display: flex; height: 100vh; overflow: hidden; }

        .admin-sidebar { width: 280px; min-width: 280px; background-color: #121212; border-right: 1px solid #333; display: flex; flex-direction: column; height: 100vh; }
        .admin-sidebar-logo { padding: 30px 20px; text-align: center; border-bottom: 1px solid #333; display: flex; justify-content: space-between; align-items: center; }
        .admin-menu { flex: 1; padding: 20px 0; overflow-y: auto; }
        .admin-menu-item { padding: 15px 25px; color: #aaa; text-decoration: none; display: flex; align-items: center; gap: 15px; font-weight: 600; transition: all 0.3s; border-left: 4px solid transparent; cursor: pointer; font-size: 14px; }
        .admin-menu-item:hover, .admin-menu-item.active { background-color: rgba(255, 140, 0, 0.1); color: #FF8C00; border-left-color: #FF8C00; }
        .admin-menu-item svg { width: 20px; height: 20px; min-width: 20px; }
        .admin-logout-btn { padding: 20px; text-align: center; border-top: 1px solid #333; flex-shrink: 0; min-height: 60px; }
        .admin-logout-btn a { color: #ff4444; text-decoration: none; font-weight: bold; display: flex; align-items: center; justify-content: center; gap: 10px; transition: 0.3s; }
        .admin-logout-btn a:hover { color: #ff0000; transform: translateX(5px); }

        .admin-main-content { flex: 1; display: flex; flex-direction: column; background-color: #0f0f0f; overflow-y: auto; }
        .admin-top-header { padding: 20px 40px; background-color: #121212; border-bottom: 1px solid #333; display: flex; justify-content: space-between; align-items: center; position: relative; top: auto; z-index: auto; width: auto; backdrop-filter: none; box-shadow: none; }
        .admin-top-header h1 { font-size: 20px; color: #fff; }
        .admin-profile { display: flex; align-items: center; gap: 10px; color: #FF8C00; font-weight: bold; }

        .admin-page-content { padding: 40px; animation: adminFadeIn 0.4s ease; overflow-wrap: break-word; word-break: break-word; }
        @keyframes adminFadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }

        .admin-page-content .section-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px; flex-wrap: wrap; gap: 10px; text-align: left; }
        .section-header h2 { font-size: 28px; color: #fff; overflow-wrap: break-word; word-break: break-word; }
        .add-btn { background: #FF8C00; color: #fff; border: none; padding: 10px 20px; border-radius: 5px; font-weight: bold; cursor: pointer; display: flex; align-items: center; gap: 8px; transition: 0.3s; font-size: 14px; }
        .add-btn:hover { background: #e67e00; }

        .data-table { width: 100%; border-collapse: collapse; background: #1a1a1a; border-radius: 8px; overflow: hidden; }
        .data-table th, .data-table td { padding: 15px 20px; text-align: left; border-bottom: 1px solid #333; }
        .data-table th { background: #222; color: #FF8C00; font-weight: 700; text-transform: uppercase; font-size: 13px; white-space: nowrap; }
        .data-table td { color: #ccc; font-size: 14px; vertical-align: middle; overflow-wrap: break-word; white-space: normal; max-width: 300px; }
        .prog-img-preview { width: 60px; height: 40px; object-fit: cover; border-radius: 4px; }

        .action-btns { white-space: nowrap; }
        .action-btns button { margin-right: 8px; }
        .action-btns button:last-child { margin-right: 0; }
        .edit-btn { background: #00C06B; color: #fff; border: none; padding: 6px 12px; border-radius: 4px; cursor: pointer; font-weight: 600; font-size: 12px; transition: 0.3s; white-space: nowrap; }
        .edit-btn:hover { background: #009e58; }
        .delete-btn { background: #ff4444; color: #fff; border: none; padding: 6px 12px; border-radius: 4px; cursor: pointer; font-weight: 600; font-size: 12px; transition: 0.3s; white-space: nowrap; }
        .delete-btn:hover { background: #cc0000; }

        .admin-modal { display: flex; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.8); z-index: 1000; align-items: center; justify-content: center; backdrop-filter: blur(5px); }
        .admin-modal-content { background: #1a1a1a; padding: 40px; border-radius: 10px; width: 600px; max-height: 90vh; overflow-y: auto; position: relative; border: 1px solid #333; }
        .admin-modal-content h3 { color: #FF8C00; margin-bottom: 25px; font-size: 22px; overflow-wrap: break-word; word-break: break-word; }
        .close-modal { position: absolute; top: 15px; right: 20px; color: #aaa; font-size: 28px; cursor: pointer; background: none; border: none; }
        .close-modal:hover { color: #fff; }

        .form-group { margin-bottom: 20px; text-align: left; }
        .form-group label { display: block; color: #aaa; margin-bottom: 8px; font-size: 14px; }
        .form-group input, .form-group textarea, .form-group select { width: 100%; padding: 12px; background: #222; border: 1px solid #444; color: #fff; border-radius: 5px; font-family: inherit; resize: vertical; font-size: 14px; }
        .form-group input:focus, .form-group textarea:focus { outline: none; border-color: #FF8C00; }
        .form-group input[type="file"] { padding: 10px; }
        .form-group input[type="checkbox"] { width: auto; }
        .save-btn { width: 100%; padding: 15px; background: #FF8C00; color: #fff; border: none; border-radius: 5px; font-weight: bold; font-size: 16px; cursor: pointer; margin-top: 10px; transition: 0.3s; }
        .save-btn:hover { background: #e67e00; }

        .status-badge { padding: 5px 10px; border-radius: 20px; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; display: inline-block; }
        .status-badge.new { background-color: rgba(0, 192, 107, 0.15); color: #00C06B; border: 1px solid rgba(0, 192, 107, 0.3); }
        .status-badge.called { background-color: rgba(255, 140, 0, 0.15); color: #FF8C00; border: 1px solid rgba(255, 140, 0, 0.3); }

        .cropper-view-box, .cropper-face { border-radius: 4px; }

        .stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; margin-bottom: 40px; }
        .stat-box { background: #1a1a1a; padding: 25px; border-radius: 10px; border: 1px solid #333; text-align: center; box-shadow: 0 4px 15px rgba(0,0,0,0.3); transition: transform 0.3s; }
        .stat-box:hover { transform: translateY(-5px); border-color: #FF8C00; }
        .stat-title { color: #aaa; font-size: 14px; font-weight: 600; text-transform: uppercase; margin-bottom: 15px; letter-spacing: 1px; }
        .stat-value { color: #FF8C00; font-size: 36px; font-weight: 900; }

        .mobile-menu-toggle { display: none; cursor: pointer; color: #FF8C00; background: none; border: none; }
        .close-admin-menu { display: none; cursor: pointer; background: none; border: none; }

        .drag-handle { cursor: grab; color: #666; transition: color 0.3s; }
        .drag-handle:hover { color: #FF8C00; }
        .sortable-ghost { opacity: 0.4; background-color: rgba(255, 140, 0, 0.1); }
        .sortable-drag { cursor: grabbing !important; }

        @media (max-width: 1024px) {
          .stats-grid { grid-template-columns: repeat(2, 1fr); }
        }

        @media (max-width: 768px) {
          .admin-sidebar {
            position: fixed; left: -300px; top: 0; width: 280px; max-width: 85vw; height: 100vh; z-index: 2000;
            transition: left 0.3s ease; box-shadow: 5px 0 15px rgba(0,0,0,0.5);
          }
          .admin-sidebar.open { left: 0; }
          .admin-sidebar .admin-menu { flex: 1; overflow-y: auto; -webkit-overflow-scrolling: touch; }
          .admin-sidebar .admin-logout-btn { position: sticky; bottom: 0; background: #121212; border-top: 1px solid #333; padding: 15px 20px; flex-shrink: 0; }
          .mobile-menu-toggle { display: block; }
          .close-admin-menu { display: block !important; }
          .stats-grid { grid-template-columns: 1fr; }
          .admin-top-header { padding: 15px 20px; }
          .admin-top-header h1 { font-size: 16px; }
          .admin-profile { font-size: 12px; }
          .admin-page-content { padding: 20px; }
          .section-header { flex-direction: column; align-items: flex-start; gap: 15px; }
          .section-header h2 { font-size: 22px; }
          .data-table td { white-space: normal; max-width: 200px; }
          .admin-modal-content { width: 95%; padding: 20px; margin: 20px auto; }
          .action-btns { display: flex; gap: 6px; flex-wrap: wrap; }
          .action-btns button { margin-right: 0; padding: 8px 14px; font-size: 12px; }
          .edit-btn, .delete-btn { padding: 8px 14px; font-size: 12px; }
        }
      `}</style>
      <div className="admin-root">
        {sidebarOpen && (
          <div
            style={{
              position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
              background: 'rgba(0,0,0,0.6)', zIndex: 1999, backdropFilter: 'blur(2px)'
            }}
            onClick={() => setSidebarOpen(false)}
          />
        )}
        <aside className={`admin-sidebar${sidebarOpen ? ' open' : ''}`}>
          <div className="admin-sidebar-logo">
            <h2 style={{ color: '#fff', letterSpacing: '2px', fontSize: '18px' }}>
              DEBUTFIT <span style={{ color: '#FF8C00' }}>ADMIN</span>
            </h2>
            <button className="close-admin-menu" onClick={() => setSidebarOpen(false)} style={{ display: sidebarOpen ? 'block' : undefined }}>
              <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="#FF8C00" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>
          <div className="admin-menu">
            {menuItems.map(item => (
              <div
                key={item.id}
                className={`admin-menu-item${activeTab === item.id ? ' active' : ''}`}
                onClick={() => { setActiveTab(item.id); setSidebarOpen(false); }}
              >
                {item.icon}
                {item.label}
              </div>
            ))}
          </div>
          <div className="admin-logout-btn">
            <a href="#" onClick={async (e) => {
              e.preventDefault();
              const { createClient } = await import('@/lib/supabase-client');
              const supabase = createClient();
              await supabase.auth.signOut();
              window.location.href = '/';
            }}>
              <svg viewBox="0 0 24 24" width="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
              Cikis Yap
            </a>
          </div>
        </aside>

        <main className="admin-main-content">
          <header className="admin-top-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              <button className="mobile-menu-toggle" onClick={() => setSidebarOpen(!sidebarOpen)}>
                <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
              </button>
              <h1>{currentLabel}</h1>
            </div>
            <div className="admin-profile"><span>Hos Geldin, Yonetici</span></div>
          </header>
          <div className="admin-page-content">
            {children}
          </div>
        </main>
      </div>
    </>
  );
}

export default function AdminLayout({ children }) {
  const [authChecked, setAuthChecked] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) {
        router.replace('/');
      } else {
        setAuthChecked(true);
      }
    });
  }, [router]);

  if (!authChecked) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0a0a0a' }}>
        <div style={{ width: '40px', height: '40px', border: '3px solid rgba(255,255,255,0.1)', borderTopColor: '#FF8C00', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <AdminProvider>
      <AdminLayoutInner>{children}</AdminLayoutInner>
    </AdminProvider>
  );
}
