'use client';
import { useState, useEffect, useRef } from 'react';
import { getJSON, setJSON, KEYS, DEFAULT_DURATIONS } from '@/lib/storage';
import Sortable from 'sortablejs';

function SettingSection({ title, placeholder, data, onAdd, onDelete, tbodyId, type }) {
  const [inputVal, setInputVal] = useState('');
  const tbodyRef = useRef(null);

  useEffect(() => {
    if (tbodyRef.current && data.length > 0) {
      new Sortable(tbodyRef.current, {
        handle: '.drag-handle',
        animation: 150,
        ghostClass: 'sortable-ghost',
        onEnd: () => {
          const key = type === 'duration' ? KEYS.formDurations : (type === 'campaign' ? KEYS.formCampaigns : KEYS.formExtras);
          const oldData = getJSON(key) || [];
          const newData = [];
          tbodyRef.current.querySelectorAll('tr[data-id]').forEach(row => {
            const id = parseInt(row.getAttribute('data-id'));
            const item = oldData.find(x => x.id === id);
            if (item) newData.push(item);
          });
          setJSON(key, newData);
        }
      });
    }
  }, [data, type]);

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

  const loadAll = () => {
    let d = getJSON(KEYS.formDurations) || DEFAULT_DURATIONS;
    setJSON(KEYS.formDurations, d);
    setDurations(d);
    setCampaigns(getJSON(KEYS.formCampaigns) || []);
    setExtras(getJSON(KEYS.formExtras) || []);
  };

  useEffect(() => { loadAll(); }, []);

  const addSetting = (type, name) => {
    const key = type === 'duration' ? KEYS.formDurations : (type === 'campaign' ? KEYS.formCampaigns : KEYS.formExtras);
    let data = getJSON(key) || [];
    data.push({ id: Date.now(), name });
    setJSON(key, data);
    loadAll();
  };

  const deleteSetting = (type, id) => {
    if (!confirm('Bu secenegi silmek istediginize emin misiniz?')) return;
    const key = type === 'duration' ? KEYS.formDurations : (type === 'campaign' ? KEYS.formCampaigns : KEYS.formExtras);
    let data = getJSON(key) || [];
    data = data.filter(item => item.id !== id);
    setJSON(key, data);
    loadAll();
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
        onAdd={(name) => addSetting('duration', name)}
        onDelete={(id) => deleteSetting('duration', id)}
        tbodyId="durationsTableBody"
        type="duration"
      />
      <SettingSection
        title="Kampanyalar (Tekli Secim)"
        placeholder="Orn: Ogrenci Indirimi (%15)"
        data={campaigns}
        onAdd={(name) => addSetting('campaign', name)}
        onDelete={(id) => deleteSetting('campaign', id)}
        tbodyId="campaignsTableBody"
        type="campaign"
      />
      <SettingSection
        title="Ek Dersler ve Hizmetler (Coklu Secim)"
        placeholder="Orn: Personal Training (PT)"
        data={extras}
        onAdd={(name) => addSetting('extra', name)}
        onDelete={(id) => deleteSetting('extra', id)}
        tbodyId="extrasTableBody"
        type="extra"
      />
    </>
  );
}
