'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { getSiteSetting } from '@/lib/db';

export default function Footer() {
  const [contact, setContact] = useState(null);

  useEffect(() => {
    async function load() {
      try {
        const contact = await getSiteSetting('contact');
        setContact(contact);
      } catch (err) { console.error(err); }
    }
    load();
  }, []);

  if (!contact) return (
    <footer className="site-footer">
      <div className="footer-bottom">
        <p>&copy; 2026 DebutFit Club. Tüm hakları saklıdır.</p>
      </div>
    </footer>
  );

  const phones = Array.isArray(contact.phones)
    ? contact.phones
    : [contact.phone || '+90 555 555 55 55'];

  const cleanWp = contact.whatsapp
    ? contact.whatsapp.replace(/[^0-9]/g, '')
    : '905555555555';

  const insUser = contact.instagram || 'debutfit';
  const tikUser = contact.tiktok || 'debutfit';

  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        {/* Logo & Description */}
        <div className="footer-col">
          <Image src="/images/DEBUTFiT.png" alt="DebutFit Club Logo" className="footer-logo" width={150} height={55} />
          <p className="footer-desc">
            Sıradanlığı Bırak, Zirveye Ulaş. Hedeflerine en hızlı şekilde ulaşman için tasarlanmış premium yaşam tarzı merkezi.
          </p>
          <div className="footer-socials" id="footerSocial">
            <a href={`https://instagram.com/${insUser}`} target="_blank" rel="noopener noreferrer" className="footer-social-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
              </svg>
            </a>
            <a href={`https://tiktok.com/@${tikUser}`} target="_blank" rel="noopener noreferrer" className="footer-social-icon">
              <svg viewBox="0 0 24 24" fill="currentColor" stroke="none">
                <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"></path>
              </svg>
            </a>
          </div>
        </div>

        {/* Working Hours */}
        <div className="footer-col">
          <h4 className="footer-title">Çalışma <span className="highlight">Saatleri</span></h4>
          <ul className="footer-hours">
            <li><span>Hafta İçi:</span> 09:00 - 23:00</li>
            <li><span>Hafta Sonu:</span> 09:00 - 22:00</li>
          </ul>
        </div>

        {/* Contact Info */}
        <div className="footer-col">
          <h4 className="footer-title">Bize <span className="highlight">Ulaşın</span></h4>
          <ul className="footer-contact">
            <li>
              <svg viewBox="0 0 24 24" fill="none" stroke="var(--accent-orange)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                <circle cx="12" cy="10" r="3"></circle>
              </svg>
              <span id="footerAddress">{contact.address}</span>
            </li>
            <li>
              <svg viewBox="0 0 24 24" fill="none" stroke="var(--accent-orange)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
              </svg>
              <div id="footerPhones">
                {phones.map((p, i) => {
                  if (!p || p.trim() === '') return null;
                  const cleanPhone = p.replace(/[^0-9+]/g, '');
                  return (
                    <a key={i} href={`tel:${cleanPhone}`} className="footer-phone-link">{p}</a>
                  );
                })}
              </div>
            </li>
            <li>
              <svg viewBox="0 0 24 24" fill="var(--accent-orange)" stroke="none">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"></path>
              </svg>
              <a href={`https://wa.me/${cleanWp}`} id="footerWhatsapp" target="_blank" rel="noopener noreferrer">WhatsApp&apos;tan Mesaj Atın</a>
            </li>
          </ul>
        </div>

        {/* Map */}
        <div className="footer-col">
          <h4 className="footer-title">Tesis <span className="highlight">Konumu</span></h4>
          <div className="footer-map" id="footerMap">
            {(() => {
              const match = contact.map?.match(/src="([^"]+)"/);
              const src = match?.[1];
              try {
                const url = new URL(src || '');
                if (url.hostname.endsWith('google.com') && url.pathname.startsWith('/maps')) {
                  return <iframe src={url.href} width="100%" height="100%" style={{ border: 0 }} allowFullScreen="" loading="lazy" referrerPolicy="no-referrer-when-downgrade" />;
                }
              } catch { /* invalid URL */ }
              return null;
            })()}
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; 2026 DebutFit Club. Tüm hakları saklıdır. | Sınırlarını Zorla.</p>
      </div>
    </footer>
  );
}
