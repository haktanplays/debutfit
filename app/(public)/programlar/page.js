'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { getPrograms, getPublicUrl } from '@/lib/db';

export default function ProgramlarPage() {
  const [programs, setPrograms] = useState([]);
  const [flipped, setFlipped] = useState({});
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        setPrograms(await getPrograms());
      } catch (err) { console.error(err); }
      setLoaded(true);
    }
    load();
  }, []);

  const toggleFlip = (id) => {
    setFlipped(prev => ({ ...prev, [id]: !prev[id] }));
  };

  if (!loaded) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: '40px', height: '40px', border: '3px solid rgba(255,255,255,0.1)', borderTopColor: '#FF8C00', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );

  return (
    <section className="programs-page-section" style={{ minHeight: '100vh', paddingTop: '150px' }}>
      <div className="container">
        <div className="section-header" data-aos="fade-up" data-aos-duration="800">
          <h2>TÜM <span className="highlight">PROGRAMLARIMIZ</span></h2>
          <p>Hedefinize en uygun dersi seçin ve profesyonel eğitmenlerimizle sınırlarınızı zorlayın.</p>
          <div className="header-line"></div>
        </div>
        <div className="programs-grid-full" id="programsGrid">
          {programs.length === 0 ? (
            <p style={{ color: '#fff', textAlign: 'center', gridColumn: '1/-1', fontSize: '18px' }}>Sistemde henüz ekli bir program bulunmuyor. Lütfen yönetici panelinden ekleyin.</p>
          ) : (
            programs.map((p, index) => {
              const delay = (index % 4) * 100 + 100;
              return (
                <div key={p.id} className={`pg-card ${flipped[p.id] ? 'flipped' : ''}`} onClick={() => toggleFlip(p.id)} data-aos="fade-up" data-aos-delay={String(delay)}>
                  <div className="pg-card-inner">
                    <div className="pg-card-front">
                      <div className="pg-img" style={{ position: 'relative' }}><Image src={getPublicUrl(p.image_path)} alt={p.name} fill sizes="(max-width: 576px) 100vw, (max-width: 1200px) 33vw, 25vw" style={{ objectFit: 'cover' }} /></div>
                      <div className="pg-info"><h3>{p.name}</h3></div>
                    </div>
                    <div className="pg-card-back">
                      <h3>{p.name}</h3>
                      <p>{p.description}</p>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </section>
  );
}
