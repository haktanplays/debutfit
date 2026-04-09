'use client';
import { useState, useEffect, useRef } from 'react';
import { getFacilities, upsertFacility, deleteFacility, uploadMediaBlob, deleteMedia, getPublicUrl } from '@/lib/db';
import Cropper from 'cropperjs';
import 'cropperjs/dist/cropper.css';

const adminCardStyle = { background: '#1e1e1e', borderRadius: '12px', padding: '30px', border: '1px solid #333', marginBottom: '30px' };
const adminInputStyle = { width: '100%', padding: '12px', background: '#2a2a2a', border: '1px solid #444', borderRadius: '8px', color: '#fff', fontSize: '14px' };
const adminBtnStyle = { padding: '12px 24px', background: '#FF8C00', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 700, fontSize: '14px' };
const adminThStyle = { padding: '12px', textAlign: 'left', borderBottom: '2px solid #FF8C00', color: '#FF8C00', fontSize: '13px', textTransform: 'uppercase', whiteSpace: 'nowrap' };
const adminTdStyle = { padding: '12px', borderBottom: '1px solid #333', color: '#ccc', fontSize: '14px' };

const overlayStyle = {
  position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.7)',
  display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999
};
const modalStyle = { background: '#1e1e1e', borderRadius: '12px', padding: '30px', border: '1px solid #333', width: '90%', maxWidth: '500px', maxHeight: '90vh', overflowY: 'auto' };

export default function FacilityManager() {
  const [items, setItems] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [existingImg, setExistingImg] = useState('');
  const [preview, setPreview] = useState('');
  const cropperRef = useRef(null);
  const imgRef = useRef(null);
  const [showCropper, setShowCropper] = useState(false);

  const load = async () => {
    const data = await getFacilities();
    setItems(data);
  };
  useEffect(() => { load(); }, []);

  const openModal = (id = null) => {
    setEditId(null);
    setTitle('');
    setDesc('');
    setExistingImg('');
    setPreview('');
    setShowCropper(false);
    if (cropperRef.current) { cropperRef.current.destroy(); cropperRef.current = null; }

    if (id) {
      const item = items.find(x => x.id === id);
      if (item) {
        setEditId(item.id);
        setTitle(item.title);
        setDesc(item.description);
        setExistingImg(item.image_path);
        setPreview(item.image_path ? getPublicUrl(item.image_path) : '');
      }
    }
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    if (cropperRef.current) { cropperRef.current.destroy(); cropperRef.current = null; }
    setShowCropper(false);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      if (cropperRef.current) cropperRef.current.destroy();
      setPreview('');
      if (imgRef.current) {
        imgRef.current.src = ev.target.result;
        setShowCropper(true);
        setTimeout(() => {
          cropperRef.current = new Cropper(imgRef.current, {
            aspectRatio: 560 / 320,
            viewMode: 1,
            autoCropArea: 1,
          });
        }, 100);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    let imagePath = existingImg;
    if (cropperRef.current) {
      const canvas = cropperRef.current.getCroppedCanvas({ width: 560, fillColor: '#fff' });
      const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/jpeg', 0.7));
      imagePath = await uploadMediaBlob('facilities', blob, 'jpg');
    }

    try {
      await upsertFacility({ id: editId, title, description: desc, image_path: imagePath });
      closeModal();
      await load();
    } catch {
      alert('Hata: Resim boyutu cok yuksek.');
    }
  };

  const deleteItem = async (id) => {
    if (!confirm('Bu tesisi kalici olarak silmek istediginize emin misiniz?')) return;
    const item = items.find(x => x.id === id);
    if (item?.image_path) await deleteMedia(item.image_path);
    await deleteFacility(id);
    await load();
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
          <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '500px' }}>
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
                    {t.image_path && <img src={getPublicUrl(t.image_path)} alt={t.title} style={{ width: '80px', height: '56px', objectFit: 'cover', borderRadius: '4px' }} />}
                  </td>
                  <td style={adminTdStyle}><strong>{t.title}</strong></td>
                  <td style={adminTdStyle}>{t.description}</td>
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
          </div>
        )}
      </div>

      {/* Modal */}
      {modalOpen && (
        <div style={overlayStyle} onClick={closeModal}>
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
              {showCropper && (
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', color: '#FF8C00', fontSize: '13px', marginBottom: '6px' }}>Gorseli Kirpin</label>
                  <div style={{ maxHeight: '300px', backgroundColor: '#222', border: '1px solid #444', borderRadius: '5px', overflow: 'hidden' }}>
                    <img ref={imgRef} src="" style={{ maxWidth: '100%', display: 'block' }} alt="crop" />
                  </div>
                </div>
              )}
              {!showCropper && preview && (
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', color: '#ccc', fontSize: '13px', marginBottom: '6px' }}>Mevcut Gorsel</label>
                  <img src={preview} alt="preview" style={{ maxWidth: '100%', maxHeight: '200px', objectFit: 'contain', borderRadius: '8px', border: '1px solid #444' }} />
                </div>
              )}
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                <button type="button" onClick={closeModal} style={{ ...adminBtnStyle, background: '#333' }}>Iptal</button>
                <button type="submit" style={adminBtnStyle}>{editId ? 'Guncelle' : 'Ekle'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
