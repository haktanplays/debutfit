'use client';
import { useState, useEffect, useRef } from 'react';
import { getPrograms, upsertProgram, deleteProgram as deleteProgramDb, uploadMediaBlob, deleteMedia, getPublicUrl } from '@/lib/db';
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
  const pendingImageData = useRef(null);

  const loadPrograms = async () => {
    try {
      const data = await getPrograms();
      setPrograms(data);
    } catch (err) { console.error('Failed to load programs:', err); }
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
      const p = programs.find(x => x.id === id);
      if (p) {
        setEditId(p.id);
        setName(p.name);
        setDesc(p.description);
        setExistingImg(p.image_path);
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
      if (cropperRef.current) { cropperRef.current.destroy(); cropperRef.current = null; }
      pendingImageData.current = ev.target.result;
      setShowCropper(true);
    };
    reader.readAsDataURL(file);
  };

  useEffect(() => {
    if (showCropper && pendingImageData.current && imgRef.current) {
      imgRef.current.src = pendingImageData.current;
      pendingImageData.current = null;
      if (cropperRef.current) { cropperRef.current.destroy(); cropperRef.current = null; }
      setTimeout(() => {
        if (imgRef.current) {
          cropperRef.current = new Cropper(imgRef.current, {
            aspectRatio: 280 / 180,
            viewMode: 1,
            autoCropArea: 1,
          });
        }
      }, 100);
    }
  }, [showCropper]);

  const handleSave = async (e) => {
    e.preventDefault();
    let imagePath = existingImg;
    if (cropperRef.current) {
      const canvas = cropperRef.current.getCroppedCanvas({ width: 560, fillColor: '#fff' });
      const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/jpeg', 0.7));
      imagePath = await uploadMediaBlob('programs', blob, 'jpg');
      if (existingImg && existingImg !== imagePath) await deleteMedia(existingImg);
    }

    try {
      await upsertProgram({ id: editId, name, description: desc, image_path: imagePath });
      closeModal();
      await loadPrograms();
    } catch {
      alert('Hata: Resim boyutu cok yuksek.');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Bu programi kalici olarak silmek istediginize emin misiniz?')) return;
    const p = programs.find(x => x.id === id);
    if (p?.image_path) await deleteMedia(p.image_path);
    await deleteProgramDb(id);
    await loadPrograms();
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
      <div style={{ overflowX: 'auto' }}>
      <table className="data-table" style={{ minWidth: '600px' }}>
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
              <td>{p.image_path && <img src={getPublicUrl(p.image_path)} className="prog-img-preview" alt={p.name} />}</td>
              <td><strong>{p.name}</strong></td>
              <td>{p.description}</td>
              <td className="action-btns">
                <button className="edit-btn" onClick={() => openModal(p.id)}>Duzenle</button>
                <button className="delete-btn" onClick={() => handleDelete(p.id)}>Sil</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>

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
