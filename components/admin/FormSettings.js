'use client';
import { useState, useEffect, useRef } from 'react';
import { getFormOptions, addFormOption, deleteFormOption, reorderFormOptions } from '@/lib/db';
import Sortable from 'sortablejs';

function SettingSection({ title, placeholder, data, onAdd, onDelete, onReorder, tbodyId, type }) {
  const [inputVal, setInputVal] = useState('');
  const tbodyRef = useRef(null);

  useEffect(() => {
    if (tbodyRef.current && data.length > 0) {
      new Sortable(tbodyRef.current, {
        handle: '.drag-handle',
        animation: 150,
        ghostClass: 'sortable-ghost',
        onEnd: () => {
          const ids = [];
          tbodyRef.current.querySelectorAll('tr[data-id]').forEach(row => {
            ids.push(parseInt(row.getAttribute('data-id')));
          });
          onReorder(ids);
        }
      });
    }
  }, [data, type, onReorder]);

  const handleAdd = () => {
    if (!inputVal.trim()) { alert('Lutfen bu alan icin bir isim girin.'); return; }
    onAdd(inputVal.trim());
    setInputVal('');
  };

  return (
    <div className="admin-modal-content" style={{ width: '100%', maxWidth: '800px', margin: '0 0 30px 0', background: '#1a1a1a', position: 'relative' }}>
      <h3 style={{ color: '#FF8C00', marginBottom: '15px', fontSize: '18px' }}>{title}</h3>
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <input
          type="text"
          placeholder={placeholder}
          value={inputVal}
          onChange={e => setInputVal(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); handleAdd(); } }}
          style={{ flex: 1, padding: '10px', background: '#222', border: '1px solid #444', color: '#fff', borderRadius: '5px' }}
        />
        <button onClick={handleAdd} className="save-btn" style={{ width: 'auto', margin: 0, padding: '10px 20px', background: '#00C06B' }}>Ekle</button>
      </div>
      <table className="data-table">
        <tbody ref={tbodyRef}>
          {data.length === 0 ? (
            <tr><td colSpan="3" style={{ textAlign: 'center', color: '#888' }}>Henuz secenek eklenmemis.</td></tr>
          ) : (
            data.map(item => (
              <tr key={item.id} data-id={item.id}>
                <td style={{ width: '40px', textAlign: 'center' }} className="drag-handle">
                  <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                    <path d="M8 6a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm0 6a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm0 6a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm8-12a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm0 6a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm0 6a2 2 0 1 1-4 0 2 2 0 0 1 4 0z"/>
                  </svg>
                </td>
                <td><strong>{item.name}</strong></td>
                <td className="action-btns" style={{ textAlign: 'right', width: '100px' }}>
                  <button className="delete-btn" onClick={() => onDelete(item.id)}>Sil</button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default function FormSettings() {
  const [durations, setDurations] = useState([]);
  const [campaigns, setCampaigns] = useState([]);
  const [extras, setExtras] = useState([]);

  const loadAll = async () => {
    try {
      const d = await getFormOptions('duration');
      setDurations(d);
      const c = await getFormOptions('campaign');
      setCampaigns(c);
      const e = await getFormOptions('extra');
      setExtras(e);
    } catch (err) { console.error(err); }
  };

  useEffect(() => { loadAll(); }, []);

  const handleAdd = async (type, name) => {
    try {
      await addFormOption(type, name);
      await loadAll();
    } catch (err) { console.error(err); }
  };

  const handleDelete = async (type, id) => {
    if (!confirm('Bu secenegi silmek istediginize emin misiniz?')) return;
    try {
      await deleteFormOption(id);
      await loadAll();
    } catch (err) { console.error(err); }
  };

  const handleReorder = async (ids) => {
    try {
      await reorderFormOptions(ids);
      await loadAll();
    } catch (err) { console.error(err); }
  };

  return (
    <>
      <div className="section-header">
        <h2>Teklif Formu Secenekleri</h2>
        <p style={{ color: '#aaa' }}>Fiyat Teklifi Al formunda musteriye sunulacak secenekleri buradan yonetebilirsiniz.</p>
      </div>

      <SettingSection
        title="Istenen Uyelik Sureleri (Aylar)"
        placeholder="Orn: 6 Aylik Uyelik"
        data={durations}
        onAdd={(name) => handleAdd('duration', name)}
        onDelete={(id) => handleDelete('duration', id)}
        onReorder={handleReorder}
        tbodyId="durationsTableBody"
        type="duration"
      />
      <SettingSection
        title="Kampanyalar (Tekli Secim)"
        placeholder="Orn: Ogrenci Indirimi (%15)"
        data={campaigns}
        onAdd={(name) => handleAdd('campaign', name)}
        onDelete={(id) => handleDelete('campaign', id)}
        onReorder={handleReorder}
        tbodyId="campaignsTableBody"
        type="campaign"
      />
      <SettingSection
        title="Ek Dersler ve Hizmetler (Coklu Secim)"
        placeholder="Orn: Personal Training (PT)"
        data={extras}
        onAdd={(name) => handleAdd('extra', name)}
        onDelete={(id) => handleDelete('extra', id)}
        onReorder={handleReorder}
        tbodyId="extrasTableBody"
        type="extra"
      />
    </>
  );
}
