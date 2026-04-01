'use client';
import { useState, useEffect } from 'react';
import { getJSON, setJSON, KEYS, DEFAULT_CONTACT } from '@/lib/storage';

export default function ContactSettings() {
  const [address, setAddress] = useState('');
  const [phones, setPhones] = useState(['']);
  const [whatsapp, setWhatsapp] = useState('');
  const [instagram, setInstagram] = useState('');
  const [tiktok, setTiktok] = useState('');
  const [map, setMap] = useState('');
  const [navGoogle, setNavGoogle] = useState({ active: true, link: '' });
  const [navApple, setNavApple] = useState({ active: true, link: '' });
  const [navYandex, setNavYandex] = useState({ active: true, link: '' });
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const contact = getJSON(KEYS.contact) || DEFAULT_CONTACT;
    setAddress(contact.address || '');
    setWhatsapp(contact.whatsapp || '');
    setInstagram(contact.instagram || 'debutfit');
    setTiktok(contact.tiktok || 'debutfit');
    setMap(contact.map || '');

    let phoneArray = [];
    if (contact.phones && Array.isArray(contact.phones)) {
      phoneArray = contact.phones;
    } else if (contact.phone) {
      phoneArray = [contact.phone];
    }
    if (phoneArray.length === 0) phoneArray = [''];
    setPhones(phoneArray);

    const defaultNav = { google: { active: true, link: '' }, apple: { active: true, link: '' }, yandex: { active: true, link: '' } };
    const navData = contact.nav || defaultNav;
    setNavGoogle(navData.google || { active: true, link: '' });
    setNavApple(navData.apple || { active: true, link: '' });
    setNavYandex(navData.yandex || { active: true, link: '' });
  }, []);

  const addPhone = () => setPhones([...phones, '']);
  const removePhone = (idx) => setPhones(phones.filter((_, i) => i !== idx));
  const updatePhone = (idx, val) => {
    const cleaned = val.replace(/[^0-9+ ]/g, '');
    const newPhones = [...phones];
    newPhones[idx] = cleaned;
    setPhones(newPhones);
  };

  const handleSave = (e) => {
    e.preventDefault();
    const phonesFiltered = phones.filter(p => p.trim() !== '');
    const contactData = {
      address,
      phones: phonesFiltered,
      whatsapp,
      instagram,
      tiktok,
      map,
      nav: {
        google: navGoogle,
        apple: navApple,
        yandex: navYandex,
      }
    };
    setJSON(KEYS.contact, contactData);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <>
      <div className="section-header">
        <h2>Iletisim Bilgilerini Duzenle</h2>
      </div>
      <div className="admin-modal-content" style={{ width: '100%', maxWidth: '800px', margin: 0, background: '#1a1a1a', maxHeight: 'none', overflow: 'visible', position: 'relative' }}>
        <form onSubmit={handleSave}>
          <div className="form-group">
            <h3 style={{ color: '#FF8C00', marginBottom: '15px', fontSize: '16px' }}>Adres Bilgisi</h3>
            <label>Acik Adres</label>
            <textarea rows="3" value={address} onChange={e => setAddress(e.target.value)} required />
          </div>

          <div className="form-group" style={{ marginTop: '30px', paddingTop: '25px', borderTop: '1px solid #333' }}>
            <h3 style={{ color: '#FF8C00', marginBottom: '15px', fontSize: '16px' }}>Navigasyon Yonlendirmeleri (Adrese Tiklaninca)</h3>

            <div style={{ marginBottom: '15px', padding: '15px', background: '#222', borderRadius: '8px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', color: '#fff', fontWeight: 'bold', marginBottom: '10px' }}>
                <input type="checkbox" checked={navGoogle.active} onChange={e => setNavGoogle({ ...navGoogle, active: e.target.checked })} style={{ width: 'auto' }} />
                Google Maps Goster
              </label>
              <input type="text" value={navGoogle.link} onChange={e => setNavGoogle({ ...navGoogle, link: e.target.value })} placeholder="Google Haritalar Yol Tarifi Linki" />
            </div>

            <div style={{ marginBottom: '15px', padding: '15px', background: '#222', borderRadius: '8px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', color: '#fff', fontWeight: 'bold', marginBottom: '10px' }}>
                <input type="checkbox" checked={navApple.active} onChange={e => setNavApple({ ...navApple, active: e.target.checked })} style={{ width: 'auto' }} />
                Apple Harita Goster
              </label>
              <input type="text" value={navApple.link} onChange={e => setNavApple({ ...navApple, link: e.target.value })} placeholder="Apple Haritalar Yonlendirme Linki (http://maps.apple.com/?q=...)" />
            </div>

            <div style={{ marginBottom: '15px', padding: '15px', background: '#222', borderRadius: '8px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', color: '#fff', fontWeight: 'bold', marginBottom: '10px' }}>
                <input type="checkbox" checked={navYandex.active} onChange={e => setNavYandex({ ...navYandex, active: e.target.checked })} style={{ width: 'auto' }} />
                Yandex Navi Goster
              </label>
              <input type="text" value={navYandex.link} onChange={e => setNavYandex({ ...navYandex, link: e.target.value })} placeholder="Yandex Navi Linki (yandexnavi://build_route_on_map?lat_to=...)" />
            </div>
          </div>

          <div className="form-group" style={{ marginTop: '30px', paddingTop: '25px', borderTop: '1px solid #333' }}>
            <h3 style={{ color: '#FF8C00', marginBottom: '15px', fontSize: '16px' }}>Telefon ve WhatsApp</h3>
            <label>Gorunen Telefon Numaralari (Harf yazilamaz)</label>
            {phones.map((phone, idx) => (
              <div key={idx} style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                <input
                  type="text"
                  value={phone}
                  onChange={e => updatePhone(idx, e.target.value)}
                  placeholder="Orn: +90 555 123 4567"
                />
                <button type="button" onClick={() => removePhone(idx)} style={{ background: '#ff4444', color: '#fff', border: 'none', borderRadius: '5px', padding: '0 15px', cursor: 'pointer', fontWeight: 'bold' }}>X</button>
              </div>
            ))}
            <button type="button" onClick={addPhone} style={{ background: '#333', color: '#FF8C00', border: '1px solid #FF8C00', padding: '8px 15px', borderRadius: '5px', cursor: 'pointer', marginTop: '10px', marginBottom: '25px', fontWeight: 'bold' }}>
              + Yeni Numara Ekle
            </button>

            <label>WhatsApp Numarasi (Sadece rakam yazin, Orn: 905551234567)</label>
            <input type="text" value={whatsapp} onChange={e => setWhatsapp(e.target.value.replace(/[^0-9]/g, ''))} required />
          </div>

          <div className="form-group" style={{ marginTop: '30px', paddingTop: '25px', borderTop: '1px solid #333' }}>
            <h3 style={{ color: '#FF8C00', marginBottom: '15px', fontSize: '16px' }}>Sosyal Medya Hesaplari</h3>
            <label>Instagram Kullanici Adi (Sadece adinizi yazin, Orn: debutfit)</label>
            <input type="text" value={instagram} onChange={e => setInstagram(e.target.value)} required style={{ marginBottom: '20px' }} />

            <label>TikTok Kullanici Adi (Sadece adinizi yazin, Orn: debutfit)</label>
            <input type="text" value={tiktok} onChange={e => setTiktok(e.target.value)} required />
          </div>

          <div className="form-group" style={{ marginTop: '30px', paddingTop: '25px', borderTop: '1px solid #333' }}>
            <h3 style={{ color: '#FF8C00', marginBottom: '15px', fontSize: '16px' }}>Harita Gorunumu (Iframe)</h3>
            <label>Google Maps Iframe Kodu</label>
            <textarea rows="4" value={map} onChange={e => setMap(e.target.value)} required />
          </div>

          <button type="submit" className="save-btn" style={{ background: '#00C06B', marginTop: '30px' }}>
            {saved ? 'Guncellendi' : 'Bilgileri Guncelle'}
          </button>
        </form>
      </div>
    </>
  );
}
