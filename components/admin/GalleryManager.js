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
const modalStyle = { background: '#1e1e1e', borderRadius: '12px', padding: '30px', border: '1px solid #333', width: '90%', maxWidth: '600px', maxHeight: '90vh', overflowY: 'auto' };

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

export default function GalleryManager() {
  const [albums, setAlbums] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [author, setAuthor] = useState('');
  const [existingPhotos, setExistingPhotos] = useState([]);
  const [processing, setProcessing] = useState(false);

  const load = () => setAlbums(getJSON(KEYS.galeri) || []);
  useEffect(() => { load(); }, []);

  const saveAlbums = (newAlbums) => {
    setJSON(KEYS.galeri, newAlbums);
    setAlbums(newAlbums);
  };

  const openModal = (id = null) => {
    if (id) {
      const album = albums.find(a => a.id === id);
      if (album) {
        setEditId(id);
        setTitle(album.title || '');
        setDesc(album.desc || '');
        setAuthor(album.author || '');
        setExistingPhotos(album.photos || []);
      }
    } else {
      setEditId(null);
      setTitle('');
      setDesc('');
      setAuthor('');
      setExistingPhotos([]);
    }
    setModalOpen(true);
  };

  const removeExistingPhoto = (idx) => {
    setExistingPhotos(prev => prev.filter((_, i) => i !== idx));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    setProcessing(true);

    const fileInput = e.target.querySelector('input[type="file"]');
    const files = fileInput?.files || [];
    const newPhotos = [];

    for (let i = 0; i < files.length; i++) {
      const resized = await resizeImage(files[i], 560, 0.7);
      newPhotos.push(resized);
    }

    const allPhotos = [...existingPhotos, ...newPhotos];
    const cover = allPhotos[0] || '';

    if (editId) {
      saveAlbums(albums.map(a => a.id === editId ? { ...a, title, desc, author, photos: allPhotos, cover } : a));
    } else {
      saveAlbums([...albums, { id: Date.now(), title, desc, author, photos: allPhotos, cover }]);
    }

    setProcessing(false);
    setModalOpen(false);
  };

  const deleteAlbum = (id) => {
    if (!confirm('Delete this album and all its photos?')) return;
    saveAlbums(albums.filter(a => a.id !== id));
  };

  return (
    <div>
      <h2 style={{ color: '#fff', fontSize: '24px', fontWeight: 700, marginBottom: '20px' }}>Gallery Manager</h2>

      <div style={adminCardStyle}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h3 style={{ color: '#FF8C00', fontSize: '16px' }}>Albums ({albums.length})</h3>
          <button onClick={() => openModal()} style={adminBtnStyle}>+ Add Album</button>
        </div>

        {albums.length === 0 ? (
          <p style={{ color: '#666' }}>No albums yet.</p>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={adminThStyle}>Cover</th>
                <th style={adminThStyle}>Title</th>
                <th style={adminThStyle}>Photos</th>
                <th style={adminThStyle}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {albums.map(album => (
                <tr key={album.id}>
                  <td style={adminTdStyle}>
                    {album.cover ? (
                      <img src={album.cover} alt="" style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '4px' }} />
                    ) : (
                      <span style={{ color: '#666' }}>No cover</span>
                    )}
                  </td>
                  <td style={adminTdStyle}>{album.title}</td>
                  <td style={adminTdStyle}>{album.photos?.length || 0}</td>
                  <td style={adminTdStyle}>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button onClick={() => openModal(album.id)} style={{ ...adminBtnStyle, padding: '6px 14px', fontSize: '12px', background: '#333' }}>
                        Edit
                      </button>
                      <button onClick={() => deleteAlbum(album.id)} style={{ ...adminBtnStyle, padding: '6px 14px', fontSize: '12px', background: '#c0392b' }}>
                        Delete
                      </button>
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
              {editId ? 'Edit Album' : 'Add Album'}
            </h3>
            <form onSubmit={handleSave}>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', color: '#ccc', fontSize: '13px', marginBottom: '6px' }}>Title *</label>
                <input style={adminInputStyle} value={title} onChange={e => setTitle(e.target.value)} placeholder="Album title" required />
              </div>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', color: '#ccc', fontSize: '13px', marginBottom: '6px' }}>Description</label>
                <textarea
                  style={{ ...adminInputStyle, minHeight: '80px', resize: 'vertical' }}
                  value={desc}
                  onChange={e => setDesc(e.target.value)}
                  placeholder="Album description"
                />
              </div>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', color: '#ccc', fontSize: '13px', marginBottom: '6px' }}>Author (optional)</label>
                <input style={adminInputStyle} value={author} onChange={e => setAuthor(e.target.value)} placeholder="Photographer name" />
              </div>

              {/* Existing photos */}
              {existingPhotos.length > 0 && (
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', color: '#ccc', fontSize: '13px', marginBottom: '8px' }}>
                    Current Photos ({existingPhotos.length})
                  </label>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {existingPhotos.map((photo, idx) => (
                      <div key={idx} style={{ position: 'relative' }}>
                        <img src={photo} alt="" style={{ width: '70px', height: '70px', objectFit: 'cover', borderRadius: '4px', border: '1px solid #444' }} />
                        <button
                          type="button"
                          onClick={() => removeExistingPhoto(idx)}
                          style={{
                            position: 'absolute', top: '-6px', right: '-6px',
                            background: '#c0392b', color: '#fff', border: 'none', borderRadius: '50%',
                            width: '20px', height: '20px', fontSize: '12px', cursor: 'pointer',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', lineHeight: 1
                          }}
                        >
                          x
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', color: '#ccc', fontSize: '13px', marginBottom: '6px' }}>
                  {editId ? 'Add More Photos' : 'Upload Photos'}
                </label>
                <input type="file" accept="image/*" multiple style={{ color: '#ccc', fontSize: '13px' }} />
              </div>

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                <button type="button" onClick={() => setModalOpen(false)} style={{ ...adminBtnStyle, background: '#333' }}>Cancel</button>
                <button type="submit" disabled={processing} style={{ ...adminBtnStyle, opacity: processing ? 0.6 : 1 }}>
                  {processing ? 'Processing...' : editId ? 'Update' : 'Add'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
