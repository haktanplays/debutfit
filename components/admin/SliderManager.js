'use client';
import { useState, useEffect } from 'react';
import { getJSON, setJSON, KEYS } from '@/lib/storage';

const adminCardStyle = { background: '#1e1e1e', borderRadius: '12px', padding: '30px', border: '1px solid #333', marginBottom: '30px' };
const adminInputStyle = { width: '100%', padding: '12px', background: '#2a2a2a', border: '1px solid #444', borderRadius: '8px', color: '#fff', fontSize: '14px' };
const adminBtnStyle = { padding: '12px 24px', background: '#FF8C00', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 700, fontSize: '14px' };
const adminTdStyle = { padding: '12px', borderBottom: '1px solid #333', color: '#ccc', fontSize: '14px' };
const adminThStyle = { padding: '12px', textAlign: 'left', borderBottom: '2px solid #FF8C00', color: '#FF8C00', fontSize: '13px', textTransform: 'uppercase' };

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

function readFileAsBase64(file) {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target.result);
    reader.readAsDataURL(file);
  });
}

export default function SliderManager() {
  const [items, setItems] = useState([]);
  const [heroBg, setHeroBg] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [mediaType, setMediaType] = useState('image'); // 'image' or 'video'
  const [error, setError] = useState('');

  const load = () => {
    setItems(getJSON(KEYS.slider) || []);
    if (typeof window !== 'undefined') {
      setHeroBg(localStorage.getItem(KEYS.heroBg) || '');
    }
  };

  useEffect(() => { load(); }, []);

  const saveItems = (newItems) => {
    setJSON(KEYS.slider, newItems);
    setItems(newItems);
  };

  const openAddModal = () => {
    setTitle('');
    setMediaType('image');
    setError('');
    setModalOpen(true);
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    const fileInput = e.target.querySelector('input[type="file"]');
    const file = fileInput?.files?.[0];
    if (!file) { setError('Please select a file.'); return; }

    let newItem = { id: Date.now(), title };

    if (mediaType === 'video') {
      if (file.size > 1.5 * 1024 * 1024) {
        setError('Video must be under 1.5MB.');
        return;
      }
      newItem.video = await readFileAsBase64(file);
      newItem.img = '';
    } else {
      newItem.img = await resizeImage(file, 560, 0.7);
      newItem.video = '';
    }

    saveItems([...items, newItem]);
    setModalOpen(false);
  };

  const deleteItem = (id) => {
    if (!confirm('Delete this slider item?')) return;
    saveItems(items.filter(i => i.id !== id));
  };

  const handleHeroBgUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const base64 = await resizeImage(file, 1920, 0.8);
    localStorage.setItem(KEYS.heroBg, base64);
    setHeroBg(base64);
  };

  return (
    <div>
      <h2 style={{ color: '#fff', fontSize: '24px', fontWeight: 700, marginBottom: '20px' }}>Slider & Hero Manager</h2>

      {/* Slider Items */}
      <div style={adminCardStyle}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h3 style={{ color: '#FF8C00', fontSize: '16px' }}>Slider Items ({items.length})</h3>
          <button onClick={openAddModal} style={adminBtnStyle}>+ Add Item</button>
        </div>

        {items.length === 0 ? (
          <p style={{ color: '#666' }}>No slider items yet.</p>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={adminThStyle}>Preview</th>
                <th style={adminThStyle}>Title</th>
                <th style={adminThStyle}>Type</th>
                <th style={adminThStyle}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map(item => (
                <tr key={item.id}>
                  <td style={adminTdStyle}>
                    {item.video ? (
                      <span style={{ background: '#FF8C00', color: '#fff', padding: '4px 10px', borderRadius: '4px', fontSize: '11px', fontWeight: 700 }}>VIDEO</span>
                    ) : item.img ? (
                      <img src={item.img} alt="" style={{ width: '80px', height: '50px', objectFit: 'cover', borderRadius: '4px' }} />
                    ) : null}
                  </td>
                  <td style={adminTdStyle}>{item.title || '(no title)'}</td>
                  <td style={adminTdStyle}>{item.video ? 'Video' : 'Image'}</td>
                  <td style={adminTdStyle}>
                    <button onClick={() => deleteItem(item.id)} style={{ ...adminBtnStyle, background: '#c0392b', padding: '6px 14px', fontSize: '12px' }}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Hero Background */}
      <div style={adminCardStyle}>
        <h3 style={{ color: '#FF8C00', fontSize: '16px', marginBottom: '16px' }}>Hero Background</h3>
        {heroBg && (
          <div style={{ marginBottom: '16px' }}>
            <img src={heroBg} alt="Hero background" style={{ maxWidth: '100%', maxHeight: '200px', objectFit: 'cover', borderRadius: '8px', border: '1px solid #333' }} />
          </div>
        )}
        <label style={{ display: 'block', color: '#ccc', fontSize: '13px', marginBottom: '8px' }}>Upload new hero background image</label>
        <input type="file" accept="image/*" onChange={handleHeroBgUpload} style={{ color: '#ccc', fontSize: '13px' }} />
      </div>

      {/* Add Modal */}
      {modalOpen && (
        <div style={overlayStyle} onClick={() => setModalOpen(false)}>
          <div style={modalStyle} onClick={e => e.stopPropagation()}>
            <h3 style={{ color: '#FF8C00', fontSize: '18px', marginBottom: '20px' }}>Add Slider Item</h3>
            <form onSubmit={handleAdd}>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', color: '#ccc', fontSize: '13px', marginBottom: '6px' }}>Title (optional)</label>
                <input style={adminInputStyle} value={title} onChange={e => setTitle(e.target.value)} placeholder="Slider title" />
              </div>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', color: '#ccc', fontSize: '13px', marginBottom: '6px' }}>Media Type</label>
                <div style={{ display: 'flex', gap: '16px' }}>
                  <label style={{ color: '#ccc', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <input type="radio" name="mediaType" checked={mediaType === 'image'} onChange={() => setMediaType('image')} style={{ accentColor: '#FF8C00' }} /> Image
                  </label>
                  <label style={{ color: '#ccc', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <input type="radio" name="mediaType" checked={mediaType === 'video'} onChange={() => setMediaType('video')} style={{ accentColor: '#FF8C00' }} /> Video
                  </label>
                </div>
              </div>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', color: '#ccc', fontSize: '13px', marginBottom: '6px' }}>
                  {mediaType === 'video' ? 'Video File (max 1.5MB)' : 'Image File'}
                </label>
                <input type="file" accept={mediaType === 'video' ? 'video/*' : 'image/*'} style={{ color: '#ccc', fontSize: '13px' }} />
              </div>
              {error && <p style={{ color: '#e74c3c', fontSize: '13px', marginBottom: '12px' }}>{error}</p>}
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                <button type="button" onClick={() => setModalOpen(false)} style={{ ...adminBtnStyle, background: '#333' }}>Cancel</button>
                <button type="submit" style={adminBtnStyle}>Add</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
