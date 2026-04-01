'use client';
import { useState, useEffect } from 'react';
import { getJSON, setJSON, KEYS } from '@/lib/storage';

export default function TrialManager() {
  const [trials, setTrials] = useState([]);
  const [filter, setFilter] = useState('');
  const [statusModal, setStatusModal] = useState(null);
  const [handledBy, setHandledBy] = useState('');

  const loadTrials = () => {
    const data = getJSON(KEYS.trials) || [];
    setTrials([...data].reverse());
  };

  useEffect(() => { loadTrials(); }, []);

  const filtered = trials.filter(t => {
    if (!filter.trim()) return true;
    const f = filter.trim().toLowerCase();
    const nameStr = (t.name || '').toLowerCase();
    const phoneStr = (t.phone || '').toLowerCase();
    const handledStr = (t.handledBy || '').toLowerCase();
    return nameStr.includes(f) || phoneStr.includes(f) || handledStr.includes(f);
  });

  const openStatusModal = (id) => {
    setStatusModal({ id });
    setHandledBy('');
  };

  const saveStatus = (e) => {
    e.preventDefault();
    if (!handledBy.trim()) { alert('Ilgilenen kisi adini girmelisiniz.'); return; }
    let data = getJSON(KEYS.trials) || [];
    const idx = data.findIndex(item => item.id === statusModal.id);
    if (idx > -1) {
      data[idx].status = 'called';
      data[idx].handledBy = handledBy.trim();
      setJSON(KEYS.trials, data);
    }
    setStatusModal(null);
    loadTrials();
  };

  const deleteTrial = (id) => {
    if (!confirm('Bu talebi kalici olarak silmek istediginize emin misiniz?')) return;
    let data = getJSON(KEYS.trials) || [];
    data = data.filter(item => item.id !== id);
    setJSON(KEYS.trials, data);
    loadTrials();
  };

  return (
    <>
      <div className="section-header" style={{ marginBottom: '20px', alignItems: 'center' }}>
        <h2>Ucretsiz Deneme Randevulari</h2>
        <input
          type="text"
          placeholder="Isim, Numara veya Ilgilenen"
          value={filter}
          onChange={e => setFilter(e.target.value)}
          style={{ padding: '10px 15px', borderRadius: '5px', border: '1px solid #444', background: '#222', color: '#fff', width: '300px', fontFamily: 'inherit' }}
        />
      </div>
      <table className="data-table">
        <thead>
          <tr>
            <th style={{ width: '15%' }}>Talep Tarihi</th>
            <th style={{ width: '15%' }}>Isim Soyisim</th>
            <th style={{ width: '10%' }}>Cinsiyet</th>
            <th style={{ width: '15%' }}>Telefon</th>
            <th style={{ width: '15%' }}>Randevu Tarihi</th>
            <th style={{ width: '10%' }}>Ilgilenen Kisi</th>
            <th style={{ width: '10%' }}>Durum</th>
            <th style={{ width: '10%' }}>Islem</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map(t => (
            <tr key={t.id}>
              <td>{t.requestDate}</td>
              <td><strong>{t.name}</strong></td>
              <td>{t.gender === 'kadin' ? 'Kadin' : 'Erkek'}</td>
              <td>{t.phone}</td>
              <td style={{ color: '#fff', fontWeight: 'bold' }}>{t.date}</td>
              <td style={{ color: '#FF8C00', fontWeight: 'bold' }}>{t.handledBy || '-'}</td>
              <td>
                {t.status === 'new'
                  ? <span className="status-badge new">Yeni</span>
                  : <span className="status-badge called">Arandi</span>
                }
              </td>
              <td className="action-btns">
                {t.status === 'new' && (
                  <button className="edit-btn" onClick={() => openStatusModal(t.id)}>Arandi Isaretle</button>
                )}
                <button className="delete-btn" onClick={() => deleteTrial(t.id)}>Sil</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {statusModal && (
        <div className="admin-modal">
          <div className="admin-modal-content" style={{ width: '100%', maxWidth: '400px' }}>
            <button className="close-modal" onClick={() => setStatusModal(null)}>&times;</button>
            <h3 style={{ color: '#FF8C00', marginBottom: '20px', fontSize: '20px' }}>Talebi Arandi Olarak Isaretle</h3>
            <form onSubmit={saveStatus}>
              <div className="form-group">
                <label>Arayan / Ilgilenen Kisi</label>
                <input type="text" value={handledBy} onChange={e => setHandledBy(e.target.value)} required placeholder="Orn: Ahmet Bey" autoFocus />
              </div>
              <button type="submit" className="save-btn" style={{ background: '#00C06B' }}>Kaydet ve Isaretle</button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
