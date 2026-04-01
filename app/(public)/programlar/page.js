'use client';
import { useState, useEffect } from 'react';
import { getJSON, KEYS } from '@/lib/storage';

export default function ProgramlarPage() {
  const [programs, setPrograms] = useState([]);
  const [flipped, setFlipped] = useState({});
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setPrograms(getJSON(KEYS.programs) || []);
    setLoaded(true);
  }, []);

  const toggleFlip = (id) => {
    setFlipped(prev => ({ ...prev, [id]: !prev[id] }));
  };

  if (!loaded) return null;

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
                      <div className="pg-img"><img src={p.img} alt={p.name} /></div>
                      <div className="pg-info"><h3>{p.name}</h3></div>
                    </div>
                    <div className="pg-card-back">
                      <h3>{p.name}</h3>
                      <p>{p.desc}</p>
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
