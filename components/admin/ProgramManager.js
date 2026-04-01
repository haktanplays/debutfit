'use client';
import { useState, useEffect, useRef } from 'react';
import { getJSON, setJSON, KEYS } from '@/lib/storage';
import Cropper from 'cropperjs';
import 'cropperjs/dist/cropper.css';

export default function ProgramManager() {
  const [programs, setPrograms] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [name, setName] = useState('');
  const [desc, setDesc] = useState('');
  const [existingImg, setExistingImg] = useState('');
  const cropperRef = useRef(null);
  const imgRef = useRef(null);
  const [showCropper, setShowCropper] = useState(false);

  const loadPrograms = () => {
    setPrograms(getJSON(KEYS.programs) || []);
  };

  useEffect(() => { loadPrograms(); }, []);

  const openModal = (id = null) => {
    setEditId(null);
    setName('');
    setDesc('');
    setExistingImg('');
    setShowCropper(false);
    if (cropperRef.current) { cropperRef.current.destroy(); cropperRef.current = null; }

    if (id) {
      const list = getJSON(KEYS.programs) || [];
      const p = list.find(x => x.id === id);
      if (p) {
        setEditId(p.id);
        setName(p.name);
        setDesc(p.desc);
        setExistingImg(p.img);
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
      if (imgRef.current) {
        imgRef.current.src = ev.target.result;
        setShowCropper(true);
        setTimeout(() => {
          cropperRef.current = new Cropper(imgRef.current, {
            aspectRatio: 280 / 180,
            viewMode: 1,
            autoCropArea: 1,
          });
        }, 100);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSave = (e) => {
    e.preventDefault();
    let finalImg = existingImg;
    if (cropperRef.current) {
      finalImg = cropperRef.current.getCroppedCanvas({ width: 560, fillColor: '#fff' }).toDataURL('image/jpeg', 0.7);
    }

    let list = getJSON(KEYS.programs) || [];
    if (editId) {
      const idx = list.findIndex(x => x.id === editId);
      if (idx > -1) {
        list[idx].name = name;
        list[idx].desc = desc;
        list[idx].img = finalImg;
      }
    } else {
      list.push({ id: Date.now(), name, desc, img: finalImg });
    }

    try {
      setJSON(KEYS.programs, list);
      closeModal();
      loadPrograms();
    } catch {
      alert('Hata: Resim boyutu cok yuksek.');
    }
  };

  const deleteProgram = (id) => {
    if (!confirm('Bu programi kalici olarak silmek istediginize emin misiniz?')) return;
    let list = getJSON(KEYS.programs) || [];
    list = list.filter(p => p.id !== id);
    setJSON(KEYS.programs, list);
    loadPrograms();
  };

  return (
    <>
      <div className="section-header">
        <h2>Mevcut Programlar</h2>
        <button className="add-btn" onClick={() => openModal()}>
          <svg viewBox="0 0 24 24" width="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Yeni Ekle
        </button>
      </div>
      <table className="data-table">
        <thead>
          <tr>
            <th style={{ width: '10%' }}>Gorsel</th>
            <th style={{ width: '20%' }}>Program Adi</th>
            <th style={{ width: '50%' }}>Aciklama</th>
            <th style={{ width: '20%' }}>Islemler</th>
          </tr>
        </thead>
        <tbody>
          {programs.map(p => (
            <tr key={p.id}>
              <td>{p.img && <img src={p.img} className="prog-img-preview" alt={p.name} />}</td>
              <td><strong>{p.name}</strong></td>
              <td>{p.desc}</td>
              <td className="action-btns">
                <button className="edit-btn" onClick={() => openModal(p.id)}>Duzenle</button>
                <button className="delete-btn" onClick={() => deleteProgram(p.id)}>Sil</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {modalOpen && (
        <div className="admin-modal">
          <div className="admin-modal-content">
            <button className="close-modal" onClick={closeModal}>&times;</button>
            <h3>{editId ? 'Programi Duzenle' : 'Yeni Program Ekle'}</h3>
            <form onSubmit={handleSave}>
              <div className="form-group">
                <label>Program Adi</label>
                <input type="text" value={name} onChange={e => setName(e.target.value)} required placeholder="Orn: Zumba" />
              </div>
              <div className="form-group">
                <label>Kisa Aciklama</label>
                <textarea rows="3" value={desc} onChange={e => setDesc(e.target.value)} required placeholder="Program hakkinda aciklama yazin..." />
              </div>
              <div className="form-group">
                <label>Gorsel Yukle (Dosya Secin)</label>
                <input type="file" accept="image/*" onChange={handleFileChange} required={!editId} />
                <small style={{ color: '#FF8C00', display: 'block', marginTop: '5px' }}>Yeni gorsel secerseniz eskisi degisir.</small>
              </div>
              {showCropper && (
                <div className="form-group">
                  <label style={{ color: '#FF8C00' }}>Gorseli Kirpin (Yatay Dikdortgen)</label>
                  <div style={{ maxHeight: '300px', backgroundColor: '#222', border: '1px solid #444', borderRadius: '5px', overflow: 'hidden' }}>
                    <img ref={imgRef} src="" style={{ maxWidth: '100%', display: 'block' }} alt="crop" />
                  </div>
                </div>
              )}
              <button type="submit" className="save-btn">Degisiklikleri Kaydet</button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
