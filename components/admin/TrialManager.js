'use client';
import { useState, useEffect } from 'react';
import { getTrials, updateTrialStatus, deleteTrial as deleteTrialDb } from '@/lib/db';

export default function TrialManager() {
  const [trials, setTrials] = useState([]);
  const [filter, setFilter] = useState('');
  const [statusModal, setStatusModal] = useState(null);
  const [handledBy, setHandledBy] = useState('');

  const loadTrials = async () => {
    try {
      const data = await getTrials();
      setTrials(data);
    } catch (err) { console.error(err); }
  };

  useEffect(() => { loadTrials(); }, []);

  const filtered = trials.filter(t => {
    if (!filter.trim()) return true;
    const f = filter.trim().toLowerCase();
    const nameStr = (t.name || '').toLowerCase();
    const phoneStr = (t.phone || '').toLowerCase();
    const handledStr = (t.handled_by || '').toLowerCase();
    return nameStr.includes(f) || phoneStr.includes(f) || handledStr.includes(f);
  });

  const openStatusModal = (id) => {
    setStatusModal({ id });
    setHandledBy('');
  };

  const saveStatus = async (e) => {
    e.preventDefault();
    if (!handledBy.trim()) { alert('Ilgilenen kisi adini girmelisiniz.'); return; }
    try {
      await updateTrialStatus(statusModal.id, handledBy.trim());
      setStatusModal(null);
      await loadTrials();
    } catch (err) { console.error(err); }
  };

  const handleDeleteTrial = async (id) => {
    if (!confirm('Bu talebi kalici olarak silmek istediginize emin misiniz?')) return;
    try {
      await deleteTrialDb(id);
      await loadTrials();
    } catch (err) { console.error(err); }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '-';
    const d = new Date(dateStr);
    return d.toLocaleDateString('tr-TR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
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
              <td>{formatDate(t.request_date)}</td>
              <td><strong>{t.name}</strong></td>
              <td>{t.gender === 'kadin' ? 'Kadin' : 'Erkek'}</td>
              <td>{t.phone}</td>
              <td style={{ color: '#fff', fontWeight: 'bold' }}>{formatDate(t.trial_date)}</td>
              <td style={{ color: '#FF8C00', fontWeight: 'bold' }}>{t.handled_by || '-'}</td>
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
                <button className="delete-btn" onClick={() => handleDeleteTrial(t.id)}>Sil</button>
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
