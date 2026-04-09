'use client';
import { useState, useEffect } from 'react';
import { getSliderItems, insertSliderItem, deleteSliderItem, uploadMedia, deleteMedia, getPublicUrl, getSiteSetting, updateSiteSetting, uploadMediaBlob } from '@/lib/db';
import { resizeToBlob } from '@/lib/imageUtils';

const adminCardStyle = { background: '#1e1e1e', borderRadius: '12px', padding: '30px', border: '1px solid #333', marginBottom: '30px' };
const adminInputStyle = { width: '100%', padding: '12px', background: '#2a2a2a', border: '1px solid #444', borderRadius: '8px', color: '#fff', fontSize: '14px' };
const adminBtnStyle = { padding: '12px 24px', background: '#FF8C00', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 700, fontSize: '14px' };
const adminTdStyle = { padding: '12px', borderBottom: '1px solid #333', color: '#ccc', fontSize: '14px' };
const adminThStyle = { padding: '12px', textAlign: 'left', borderBottom: '2px solid #FF8C00', color: '#FF8C00', fontSize: '13px', textTransform: 'uppercase', whiteSpace: 'nowrap' };

const overlayStyle = {
  position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.7)',
  display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999
};
const modalStyle = { background: '#1e1e1e', borderRadius: '12px', padding: '30px', border: '1px solid #333', width: '90%', maxWidth: '500px', maxHeight: '90vh', overflowY: 'auto' };

export default function SliderManager() {
  const [items, setItems] = useState([]);
  const [heroBg, setHeroBg] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [mediaType, setMediaType] = useState('image'); // 'image' or 'video'
  const [error, setError] = useState('');

  const load = async () => {
    try {
      const data = await getSliderItems();
      setItems(data);
      const heroBgData = await getSiteSetting('hero_bg');
      setHeroBg(heroBgData?.image_path || '');
    } catch (err) { console.error('Failed to load slider items:', err); }
  };

  useEffect(() => { load(); }, []);

  const openAddModal = () => {
    setMediaType('image');
    setError('');
    setModalOpen(true);
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    const fileInput = e.target.querySelector('input[type="file"]');
    const file = fileInput?.files?.[0];
    if (!file) { setError('Please select a file.'); return; }

    try {
      const filePath = await uploadMedia('slider', file);
      await insertSliderItem({ media_type: mediaType, file_path: filePath });
      await load();
      setModalOpen(false);
    } catch (err) { setError(err.message); }
  };

  const deleteItem = async (id) => {
    if (!confirm('Delete this slider item?')) return;
    const item = items.find(i => i.id === id);
    if (item?.file_path) await deleteMedia(item.file_path);
    await deleteSliderItem(id);
    await load();
  };

  const handleHeroBgUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const blob = await resizeToBlob(file, 1920, 0.8);
    const path = await uploadMediaBlob('hero', blob, 'jpg');
    await updateSiteSetting('hero_bg', { image_path: path });
    setHeroBg(path);
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
                <th style={adminThStyle}>Type</th>
                <th style={adminThStyle}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map(item => (
                <tr key={item.id}>
                  <td style={adminTdStyle}>
                    {item.media_type === 'video' ? (
                      <span style={{ background: '#FF8C00', color: '#fff', padding: '4px 10px', borderRadius: '4px', fontSize: '11px', fontWeight: 700 }}>VIDEO</span>
                    ) : item.file_path ? (
                      <img src={getPublicUrl(item.file_path)} alt="" style={{ width: '80px', height: '50px', objectFit: 'cover', borderRadius: '4px' }} />
                    ) : null}
                  </td>
                  <td style={adminTdStyle}>{item.media_type === 'video' ? 'Video' : 'Image'}</td>
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
            <img src={getPublicUrl(heroBg)} alt="Hero background" style={{ maxWidth: '100%', maxHeight: '200px', objectFit: 'cover', borderRadius: '8px', border: '1px solid #333' }} />
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
                  {mediaType === 'video' ? 'Video File' : 'Image File'}
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
