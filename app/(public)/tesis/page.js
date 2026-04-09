'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { getFacilities, getPublicUrl } from '@/lib/db';

export default function TesisPage() {
  const [tesisList, setTesisList] = useState([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        setTesisList(await getFacilities());
      } catch (err) { console.error(err); }
      setLoaded(true);
    }
    load();
  }, []);

  if (!loaded) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: '40px', height: '40px', border: '3px solid rgba(255,255,255,0.1)', borderTopColor: '#FF8C00', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );

  return (
    <section className="amenities-section" style={{ minHeight: '100vh', paddingTop: '150px' }}>
      <div className="container">
        <div className="section-header" data-aos="fade-up" data-aos-duration="800">
          <h2>TESİS <span className="highlight">İMKANLARIMIZ</span></h2>
          <p>Sadece spor yapmanız için değil, kendinizi özel hissetmeniz için en ince detayına kadar tasarlandı.</p>
          <div className="header-line"></div>
        </div>
        {tesisList.length === 0 ? (
          <p style={{ color: '#fff', textAlign: 'center', fontSize: '18px' }}>Sistemde henüz ekli bir tesis imkanı bulunmuyor. Lütfen yönetici panelinden ekleyin.</p>
        ) : (
          <div className="tesis-2col-grid">
            {tesisList.map((t, index) => (
              <div key={t.id} className="tesis-grid-item" data-aos="fade-up" data-aos-delay={String((index % 2) * 100)}>
                <div className="tesis-grid-photo" style={{ position: 'relative' }}>
                  <Image src={getPublicUrl(t.image_path)} alt={t.title} fill sizes="(max-width: 992px) 100vw, 50vw" style={{ objectFit: 'cover' }} />
                </div>
                <h3 className="tesis-grid-title">{t.title}</h3>
                <p className="tesis-grid-desc">{t.description}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
