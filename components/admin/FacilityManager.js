'use client';
import { useState, useEffect } from 'react';
import { getJSON, setJSON, KEYS } from '@/lib/storage';

const adminCardStyle = { background: '#1e1e1e', borderRadius: '12px', padding: '30px', border: '1px solid #333', marginBottom: '30px' };
const adminInputStyle = { width: '100%', padding: '12px', background: '#2a2a2a', border: '1px solid #444', borderRadius: '8px', color: '#fff', fontSize: '14px' };
const adminBtnStyle = { padding: '12px 24px', background: '#FF8C00', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 700, fontSize: '14px' };
const adminThStyle = { padding: '12px', textAlign: 'left', borderBottom: '2px solid #FF8C00', color: '#FF8C00', fontSize: '13px', textTransform: 'uppercase' };
const adminTdStyle = { padding: '12px', borderBottom: '1px solid #333', color: '#ccc', fontSize: '14px' };

const overlayStyle = {
  position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.7)',
  display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999
};
const modalStyle = { background: '#1e1e1e', borderRadius: '12px', padding: '30px', border: '1px solid #333', width: '90%', maxWidth: '500px', maxHeight: '90vh', overflowY: 'auto' };

function resizeImage(file, maxW, quality) {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let w = img.width, h = img.height;
        if (w > maxW) { h = Math.round(h * maxW / w); w = maxW; }
        canvas.width = w; canvas.height = h;
        canvas.getContext('2d').drawImage(img, 0, 0, w, h);
        resolve(canvas.toDataURL('image/jpeg', quality));
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  });
}

export default function FacilityManager() {
  const [items, setItems] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [existingImg, setExistingImg] = useState('');
  const [preview, setPreview] = useState('');

  const load = () => setItems(getJSON(KEYS.tesis) || []);
  useEffect(() => { load(); }, []);

  const openModal = (id = null) => {
    if (id) {
      const item = (getJSON(KEYS.tesis) || []).find(x => x.id === id);
      if (item) {
        setEditId(item.id);
        setTitle(item.title);
        setDesc(item.desc);
        setExistingImg(item.img);
        setPreview(item.img);
      }
    } else {
      setEditId(null);
      setTitle('');
      setDesc('');
      setExistingImg('');
      setPreview('');
    }
    setModalOpen(true);
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const resized = await resizeImage(file, 560, 0.7);
    setPreview(resized);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const finalImg = preview || existingImg;

    let list = getJSON(KEYS.tesis) || [];
    if (editId) {
      const idx = list.findIndex(x => x.id === editId);
      if (idx > -1) {
        list[idx].title = title;
        list[idx].desc = desc;
        list[idx].img = finalImg;
      }
    } else {
      list.push({ id: Date.now(), title, desc, img: finalImg });
    }

    try {
      setJSON(KEYS.tesis, list);
      setModalOpen(false);
      load();
    } catch {
      alert('Hata: Resim boyutu cok yuksek.');
    }
  };

  const deleteItem = (id) => {
    if (!confirm('Bu tesisi kalici olarak silmek istediginize emin misiniz?')) return;
    let list = getJSON(KEYS.tesis) || [];
    list = list.filter(t => t.id !== id);
    setJSON(KEYS.tesis, list);
    load();
  };

  return (
    <div>
      <h2 style={{ color: '#fff', fontSize: '24px', fontWeight: 700, marginBottom: '20px' }}>Tesis Gorselleri ve Imkanlar</h2>

      <div style={adminCardStyle}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h3 style={{ color: '#FF8C00', fontSize: '16px' }}>Imkanlar ({items.length})</h3>
          <button onClick={() => openModal()} style={adminBtnStyle}>+ Yeni Imkan Ekle</button>
        </div>

        {items.length === 0 ? (
          <p style={{ color: '#666' }}>Henuz tesis imkani eklenmedi.</p>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={adminThStyle}>Gorsel</th>
                <th style={adminThStyle}>Baslik</th>
                <th style={adminThStyle}>Aciklama</th>
                <th style={adminThStyle}>Islemler</th>
              </tr>
            </thead>
            <tbody>
              {items.map(t => (
                <tr key={t.id}>
                  <td style={adminTdStyle}>
                    {t.img && <img src={t.img} alt={t.title} style={{ width: '80px', height: '56px', objectFit: 'cover', borderRadius: '4px' }} />}
                  </td>
                  <td style={adminTdStyle}><strong>{t.title}</strong></td>
                  <td style={adminTdStyle}>{t.desc}</td>
                  <td style={adminTdStyle}>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button onClick={() => openModal(t.id)} style={{ ...adminBtnStyle, padding: '6px 14px', fontSize: '12px', background: '#333' }}>Duzenle</button>
                      <button onClick={() => deleteItem(t.id)} style={{ ...adminBtnStyle, padding: '6px 14px', fontSize: '12px', background: '#c0392b' }}>Sil</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal */}
      {modalOpen && (
        <div style={overlayStyle} onClick={() => setModalOpen(false)}>
          <div style={modalStyle} onClick={e => e.stopPropagation()}>
            <h3 style={{ color: '#FF8C00', fontSize: '18px', marginBottom: '20px' }}>
              {editId ? 'Tesis Imkani Duzenle' : 'Yeni Imkan Ekle'}
            </h3>
            <form onSubmit={handleSave}>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', color: '#ccc', fontSize: '13px', marginBottom: '6px' }}>Baslik</label>
                <input style={adminInputStyle} value={title} onChange={e => setTitle(e.target.value)} required placeholder="Orn: Spa & Sauna Merkezi" />
              </div>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', color: '#ccc', fontSize: '13px', marginBottom: '6px' }}>Aciklama</label>
                <textarea
                  style={{ ...adminInputStyle, minHeight: '100px', resize: 'vertical' }}
                  value={desc}
                  onChange={e => setDesc(e.target.value)}
                  required
                  placeholder="Bu alan hakkinda detayli bilgi yazin..."
                />
              </div>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', color: '#ccc', fontSize: '13px', marginBottom: '6px' }}>
                  Gorsel Yukle {!editId && '*'}
                </label>
                <input type="file" accept="image/*" onChange={handleFileChange} required={!editId} style={{ color: '#ccc', fontSize: '13px' }} />
                {editId && <small style={{ color: '#FF8C00', display: 'block', marginTop: '5px' }}>Yeni gorsel secerseniz eskisi degisir.</small>}
              </div>
              {preview && (
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', color: '#ccc', fontSize: '13px', marginBottom: '6px' }}>Onizleme</label>
                  <img src={preview} alt="preview" style={{ maxWidth: '100%', maxHeight: '200px', objectFit: 'contain', borderRadius: '8px', border: '1px solid #444' }} />
                </div>
              )}
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                <button type="button" onClick={() => setModalOpen(false)} style={{ ...adminBtnStyle, background: '#333' }}>Iptal</button>
                <button type="submit" style={adminBtnStyle}>{editId ? 'Guncelle' : 'Ekle'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
