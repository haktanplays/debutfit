'use client';
import { useState, useEffect } from 'react';
import { getAlbums, upsertAlbum, deleteAlbum as deleteAlbumDb, addAlbumPhoto, deleteAlbumPhoto, uploadMediaBlob, deleteMedia, getPublicUrl } from '@/lib/db';
import { resizeToBlob } from '@/lib/imageUtils';

const adminCardStyle = { background: '#1e1e1e', borderRadius: '12px', padding: '30px', border: '1px solid #333', marginBottom: '30px' };
const adminInputStyle = { width: '100%', padding: '12px', background: '#2a2a2a', border: '1px solid #444', borderRadius: '8px', color: '#fff', fontSize: '14px' };
const adminBtnStyle = { padding: '12px 24px', background: '#FF8C00', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 700, fontSize: '14px' };
const adminThStyle = { padding: '12px', textAlign: 'left', borderBottom: '2px solid #FF8C00', color: '#FF8C00', fontSize: '13px', textTransform: 'uppercase', whiteSpace: 'nowrap' };
const adminTdStyle = { padding: '12px', borderBottom: '1px solid #333', color: '#ccc', fontSize: '14px' };

const overlayStyle = {
  position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.7)',
  display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999
};
const modalStyle = { background: '#1e1e1e', borderRadius: '12px', padding: '30px', border: '1px solid #333', width: '90%', maxWidth: '600px', maxHeight: '90vh', overflowY: 'auto' };

export default function GalleryManager() {
  const [albums, setAlbums] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [author, setAuthor] = useState('');
  const [existingPhotos, setExistingPhotos] = useState([]);
  const [processing, setProcessing] = useState(false);

  const load = async () => {
    try {
      const data = await getAlbums();
      setAlbums(data);
    } catch (err) { console.error('Failed to load albums:', err); }
  };
  useEffect(() => { load(); }, []);

  const openModal = (id = null) => {
    if (id) {
      const album = albums.find(a => a.id === id);
      if (album) {
        setEditId(id);
        setTitle(album.title || '');
        setDesc(album.description || '');
        setAuthor(album.author || '');
        setExistingPhotos(album.gallery_photos || []);
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

  const removeExistingPhoto = async (photo) => {
    await deleteMedia(photo.file_path);
    await deleteAlbumPhoto(photo.id);
    setExistingPhotos(prev => prev.filter(p => p.id !== photo.id));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    setProcessing(true);

    try {
      const coverPhoto = existingPhotos.find(p => p.file_path);
      const albumId = await upsertAlbum({ id: editId, title, description: desc, author, cover_path: coverPhoto?.file_path || '' });

      const fileInput = e.target.querySelector('input[type="file"]');
      const files = fileInput?.files || [];

      for (let i = 0; i < files.length; i++) {
        const blob = await resizeToBlob(files[i], 560, 0.7);
        const path = await uploadMediaBlob(`gallery/${albumId}`, blob, 'jpg');
        await addAlbumPhoto(albumId, path);
      }

      await load();
      setModalOpen(false);
    } catch (err) {
      alert('Error saving album: ' + err.message);
    }

    setProcessing(false);
  };

  const handleDeleteAlbum = async (id) => {
    if (!confirm('Delete this album and all its photos?')) return;
    await deleteAlbumDb(id);
    await load();
  };

  return (
    <div>
      <h2 style={{ color: '#fff', fontSize: '24px', fontWeight: 700, marginBottom: '20px' }}>Galeri Yonetimi</h2>

      <div style={adminCardStyle}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h3 style={{ color: '#FF8C00', fontSize: '16px' }}>Albumler ({albums.length})</h3>
          <button onClick={() => openModal()} style={adminBtnStyle}>+ Album Ekle</button>
        </div>

        {albums.length === 0 ? (
          <p style={{ color: '#666' }}>Henuz album eklenmedi.</p>
        ) : (
          <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '500px' }}>
            <thead>
              <tr>
                <th style={adminThStyle}>Kapak</th>
                <th style={adminThStyle}>Baslik</th>
                <th style={adminThStyle}>Fotograf</th>
                <th style={adminThStyle}>Islemler</th>
              </tr>
            </thead>
            <tbody>
              {albums.map(album => (
                <tr key={album.id}>
                  <td style={adminTdStyle}>
                    {album.cover_path ? (
                      <img src={getPublicUrl(album.cover_path)} alt="" style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '4px' }} />
                    ) : (
                      <span style={{ color: '#666' }}>Kapak yok</span>
                    )}
                  </td>
                  <td style={adminTdStyle}>{album.title}</td>
                  <td style={adminTdStyle}>{album.gallery_photos?.length || 0}</td>
                  <td style={adminTdStyle}>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button onClick={() => openModal(album.id)} style={{ ...adminBtnStyle, padding: '6px 14px', fontSize: '12px', background: '#333' }}>
                        Duzenle
                      </button>
                      <button onClick={() => handleDeleteAlbum(album.id)} style={{ ...adminBtnStyle, padding: '6px 14px', fontSize: '12px', background: '#c0392b' }}>
                        Sil
                      </button>
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
        <div style={overlayStyle} onClick={() => setModalOpen(false)}>
          <div style={modalStyle} onClick={e => e.stopPropagation()}>
            <h3 style={{ color: '#FF8C00', fontSize: '18px', marginBottom: '20px' }}>
              {editId ? 'Albumu Duzenle' : 'Album Ekle'}
            </h3>
            <form onSubmit={handleSave}>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', color: '#ccc', fontSize: '13px', marginBottom: '6px' }}>Baslik *</label>
                <input style={adminInputStyle} value={title} onChange={e => setTitle(e.target.value)} placeholder="Album baslik" required />
              </div>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', color: '#ccc', fontSize: '13px', marginBottom: '6px' }}>Aciklama</label>
                <textarea
                  style={{ ...adminInputStyle, minHeight: '80px', resize: 'vertical' }}
                  value={desc}
                  onChange={e => setDesc(e.target.value)}
                  placeholder="Album aciklama"
                />
              </div>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', color: '#ccc', fontSize: '13px', marginBottom: '6px' }}>Fotografci (opsiyonel)</label>
                <input style={adminInputStyle} value={author} onChange={e => setAuthor(e.target.value)} placeholder="Fotografci adi" />
              </div>

              {/* Existing photos */}
              {existingPhotos.length > 0 && (
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', color: '#ccc', fontSize: '13px', marginBottom: '8px' }}>
                    Mevcut Fotograflar ({existingPhotos.length})
                  </label>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {existingPhotos.map((photo) => (
                      <div key={photo.id} style={{ position: 'relative' }}>
                        <img src={getPublicUrl(photo.file_path)} alt="" style={{ width: '70px', height: '70px', objectFit: 'cover', borderRadius: '4px', border: '1px solid #444' }} />
                        <button
                          type="button"
                          onClick={() => removeExistingPhoto(photo)}
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
                  {editId ? 'Fotograf Ekle' : 'Fotograf Yukle'}
                </label>
                <input type="file" accept="image/*" multiple style={{ color: '#ccc', fontSize: '13px' }} />
              </div>

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                <button type="button" onClick={() => setModalOpen(false)} style={{ ...adminBtnStyle, background: '#333' }}>Iptal</button>
                <button type="submit" disabled={processing} style={{ ...adminBtnStyle, opacity: processing ? 0.6 : 1 }}>
                  {processing ? 'Isleniyor...' : editId ? 'Guncelle' : 'Ekle'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
