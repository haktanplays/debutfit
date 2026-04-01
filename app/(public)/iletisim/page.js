'use client';
import { useState, useEffect } from 'react';
import { getSiteSetting, trackClick } from '@/lib/db';

export default function IletisimPage() {
  const [contact, setContact] = useState(null);
  const [navOpen, setNavOpen] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const contact = await getSiteSetting('contact');
        setContact(contact);
      } catch (err) { console.error(err); }
    }
    load();
  }, []);

  if (!contact) return null;

  const cleanWp = contact.whatsapp ? contact.whatsapp.replace(/[^0-9]/g, '') : '';
  const instagramUser = contact.instagram || 'debutfit';
  const tiktokUser = contact.tiktok || 'debutfit';
  const phoneArray = Array.isArray(contact.phones)
    ? contact.phones
    : [contact.phone || '+90 555 555 55 55'];
  const navData = contact.nav || {
    google: { active: false, link: '' },
    apple: { active: false, link: '' },
    yandex: { active: false, link: '' },
  };

  function handleTrackClick(type) {
    trackClick(type === 'wp' ? 'whatsapp' : 'call');
  }

  const hasNavOptions =
    (navData.google.active && navData.google.link) ||
    (navData.apple.active && navData.apple.link) ||
    (navData.yandex.active && navData.yandex.link);

  return (
    <>
      <section className="contact-page-section" style={{ minHeight: '100vh', paddingTop: '150px' }}>
        <div className="container">
          <div className="section-header" data-aos="fade-up" data-aos-duration="800">
            <h2>BİZE <span className="highlight">ULAŞIN</span></h2>
            <p>Sorularınız, üyelik detayları veya tesisimizi ziyaret etmek için bizimle iletişime geçin.</p>
            <div className="header-line"></div>
          </div>

          <div className="contact-grid">
            {/* Left: Contact Info Card */}
            <div className="contact-info-card" data-aos="fade-right" data-aos-duration="800">
              {/* Address */}
              <div className="contact-item">
                <div className="contact-item-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                    <circle cx="12" cy="10" r="3"></circle>
                  </svg>
                </div>
                <div className="contact-item-text">
                  <h4>{"Açık Adres"}</h4>
                  <p
                    style={{ cursor: 'pointer', textDecoration: 'underline', textDecorationColor: '#FF8C00', textUnderlineOffset: '4px', transition: 'color 0.3s', color: '#ccc' }}
                    onMouseOver={(e) => (e.currentTarget.style.color = '#FF8C00')}
                    onMouseOut={(e) => (e.currentTarget.style.color = '#ccc')}
                    onClick={() => setNavOpen(true)}
                  >
                    {contact.address}
                  </p>
                  <small style={{ color: '#777', fontSize: '12px', display: 'block', marginTop: '5px' }}>{"Yol tarifi almak için adrese tıklayın."}</small>
                </div>
              </div>

              {/* Phone */}
              <div className="contact-item">
                <div className="contact-item-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                  </svg>
                </div>
                <div className="contact-item-text">
                  <h4>Telefon</h4>
                  {phoneArray.map((p, i) => {
                    if (!p.trim()) return null;
                    const cleanPhone = p.replace(/[^0-9+]/g, '');
                    return (
                      <a
                        key={i}
                        href={`tel:${cleanPhone}`}
                        onClick={() => handleTrackClick('call')}
                        style={{ display: 'block', marginBottom: '5px' }}
                      >
                        {p}
                      </a>
                    );
                  })}
                </div>
              </div>

              {/* WhatsApp */}
              <div className="contact-item">
                <div className="contact-item-icon" style={{ color: '#25D366', background: 'rgba(37, 211, 102, 0.1)' }}>
                  <svg viewBox="0 0 24 24" fill="currentColor" stroke="none" width="28" height="28">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"></path>
                  </svg>
                </div>
                <div className="contact-item-text">
                  <h4>WhatsApp</h4>
                  <a href={`https://wa.me/${cleanWp}`} target="_blank" rel="noopener noreferrer" onClick={() => handleTrackClick('wp')}>
                    {"WhatsApp Üzerinden Mesaj Atın"}
                  </a>
                </div>
              </div>

              {/* Instagram */}
              <div className="contact-item">
                <div className="contact-item-icon" style={{ color: '#E1306C', background: 'rgba(225, 48, 108, 0.1)' }}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                  </svg>
                </div>
                <div className="contact-item-text">
                  <h4>Instagram</h4>
                  <a href={`https://instagram.com/${instagramUser}`} target="_blank" rel="noopener noreferrer">
                    @{instagramUser}
                  </a>
                </div>
              </div>

              {/* TikTok */}
              <div className="contact-item">
                <div className="contact-item-icon" style={{ color: '#fff', background: 'rgba(255, 255, 255, 0.1)' }}>
                  <svg viewBox="0 0 24 24" fill="currentColor" stroke="none" width="24" height="24">
                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"></path>
                  </svg>
                </div>
                <div className="contact-item-text">
                  <h4>TikTok</h4>
                  <a href={`https://tiktok.com/@${tiktokUser}`} target="_blank" rel="noopener noreferrer">
                    @{tiktokUser}
                  </a>
                </div>
              </div>
            </div>

            {/* Right: Map */}
            <div
              className="contact-map-container"
              data-aos="fade-left"
              data-aos-duration="800"
              data-aos-delay="200"
            >
              {(() => {
                const match = contact.map?.match(/src="([^"]+)"/);
                const src = match?.[1];
                return src?.includes('google.com/maps') ? (
                  <iframe src={src} width="100%" height="100%" style={{ border: 0, minHeight: '450px' }} allowFullScreen="" loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
                ) : null;
              })()}
            </div>
          </div>
        </div>
      </section>

      {/* Navigation Modal */}
      {navOpen && (
        <div
          className="modal"
          style={{ display: 'flex' }}
          onClick={(e) => { if (e.target === e.currentTarget) setNavOpen(false); }}
        >
          <div className="modal-content" style={{ width: '100%', maxWidth: '400px', padding: '40px 30px' }}>
            <span className="close" onClick={() => setNavOpen(false)}>&times;</span>
            <h3 style={{ color: '#fff', marginBottom: '25px', fontSize: '24px', textTransform: 'uppercase', fontWeight: 800 }}>
              Yol Tarifi Al
            </h3>
            <p style={{ color: '#aaa', marginBottom: '25px', fontSize: '14px' }}>
              Hangi uygulama ile gitmek istersiniz?
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              {navData.google.active && navData.google.link && (
                <a href={navData.google.link} target="_blank" rel="noopener noreferrer" className="nav-app-btn">
                  <svg viewBox="0 0 488 512" style={{ width: '22px', height: '22px', minWidth: '22px', marginRight: '15px', fill: 'currentColor', flexShrink: 0 }}>
                    <path d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z" />
                  </svg>
                  <span>Google Haritalar</span>
                </a>
              )}
              {navData.apple.active && navData.apple.link && (
                <a href={navData.apple.link} target="_blank" rel="noopener noreferrer" className="nav-app-btn">
                  <svg viewBox="0 0 384 512" style={{ width: '22px', height: '22px', minWidth: '22px', marginRight: '15px', fill: 'currentColor', flexShrink: 0 }}>
                    <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z" />
                  </svg>
                  <span>Apple Haritalar</span>
                </a>
              )}
              {navData.yandex.active && navData.yandex.link && (
                <a href={navData.yandex.link} target="_blank" rel="noopener noreferrer" className="nav-app-btn">
                  <svg viewBox="0 0 384 512" style={{ width: '22px', height: '22px', minWidth: '22px', marginRight: '15px', fill: 'currentColor', flexShrink: 0 }}>
                    <path d="M129.5 512V239L7.5 0h73.9l89.2 178.1L286.6 0h71.8L192.8 239v273H129.5z" />
                  </svg>
                  <span>Yandex Navigasyon</span>
                </a>
              )}
              {!hasNavOptions && (
                <p style={{ color: '#ccc', textAlign: 'center' }}>{"Yönlendirme seçeneği bulunamadı."}</p>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
