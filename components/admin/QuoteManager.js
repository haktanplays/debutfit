'use client';
import { useState, useEffect } from 'react';
import { getQuotes, updateQuoteStatus, deleteQuote as deleteQuoteDb } from '@/lib/db';

export default function QuoteManager() {
  const [quotes, setQuotes] = useState([]);
  const [filter, setFilter] = useState('');
  const [statusModal, setStatusModal] = useState(null); // { id }
  const [handledBy, setHandledBy] = useState('');

  const loadQuotes = async () => {
    try {
      const data = await getQuotes();
      setQuotes(data);
    } catch (err) { console.error(err); }
  };

  useEffect(() => { loadQuotes(); }, []);

  const filtered = quotes.filter(q => {
    if (!filter.trim()) return true;
    const f = filter.trim().toLowerCase();
    const nameStr = (q.name || '').toLowerCase();
    const phoneStr = (q.phone || '').toLowerCase();
    const handledStr = (q.handled_by || '').toLowerCase();
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
      await updateQuoteStatus(statusModal.id, handledBy.trim());
      setStatusModal(null);
      await loadQuotes();
    } catch (err) { console.error(err); }
  };

  const handleDeleteQuote = async (id) => {
    if (!confirm('Bu talebi kalici olarak silmek istediginize emin misiniz?')) return;
    try {
      await deleteQuoteDb(id);
      await loadQuotes();
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
        <h2>Fiyat Teklifi Talepleri</h2>
        <input
          type="text"
          placeholder="Isim, Numara veya Ilgilenen"
          value={filter}
          onChange={e => setFilter(e.target.value)}
          style={{ padding: '10px 15px', borderRadius: '5px', border: '1px solid #444', background: '#222', color: '#fff', width: '300px', fontFamily: 'inherit' }}
        />
      </div>
      <div style={{ overflowX: 'auto' }}>
      <table className="data-table" style={{ minWidth: '1000px', tableLayout: 'fixed' }}>
        <thead>
          <tr>
            <th>Talep Tarihi</th>
            <th>Isim Soyisim</th>
            <th>Yas/Cins.</th>
            <th>Telefon</th>
            <th>Istenen Paket</th>
            <th>Kampanya</th>
            <th>Ek Hizmetler</th>
            <th>Ilgilenen</th>
            <th>Durum</th>
            <th>Islem</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map(q => {
            const cleanPhone = q.phone ? q.phone.replace(/[^0-9+]/g, '') : '';
            return (
              <tr key={q.id}>
                <td>{formatDate(q.created_at)}</td>
                <td><strong>{q.name}</strong></td>
                <td>{q.age} / {q.gender === 'kadin' ? 'Kadin' : 'Erkek'}</td>
                <td>
                  {q.phone ? (
                    <a href={`tel:${cleanPhone}`} style={{ color: '#FF8C00', textDecoration: 'none', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                      {q.phone}
                    </a>
                  ) : '-'}
                </td>
                <td style={{ fontWeight: 'bold', color: '#fff' }}>{q.duration || '-'}</td>
                <td style={{ color: '#00C06B', fontWeight: 600 }}>{q.campaign || '-'}</td>
                <td style={{ fontSize: '12px', color: '#ccc' }}>{q.extras || '-'}</td>
                <td style={{ color: '#FF8C00', fontWeight: 'bold' }}>{q.handled_by || '-'}</td>
                <td>
                  {q.status === 'new'
                    ? <span className="status-badge new">Yeni</span>
                    : <span className="status-badge called">Arandi</span>
                  }
                </td>
                <td className="action-btns">
                  {q.status === 'new' && (
                    <button className="edit-btn" onClick={() => openStatusModal(q.id)}>Arandi Isaretle</button>
                  )}
                  <button className="delete-btn" onClick={() => handleDeleteQuote(q.id)}>Sil</button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      </div>

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
