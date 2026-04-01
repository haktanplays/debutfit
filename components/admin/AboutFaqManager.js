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
const modalStyle = { background: '#1e1e1e', borderRadius: '12px', padding: '30px', border: '1px solid #333', width: '90%', maxWidth: '500px', maxHeight: '90vh', overflowY: 'auto' };

export default function AboutFaqManager() {
  // About state
  const [aboutTitle, setAboutTitle] = useState('');
  const [aboutDesc, setAboutDesc] = useState('');
  const [aboutSaved, setAboutSaved] = useState(false);

  // FAQ state
  const [faqs, setFaqs] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [faqTitle, setFaqTitle] = useState('');
  const [faqDesc, setFaqDesc] = useState('');

  useEffect(() => {
    const about = getJSON(KEYS.about) || { title: '', desc: '' };
    setAboutTitle(about.title || '');
    setAboutDesc(about.desc || '');
    setFaqs(getJSON(KEYS.faq) || []);
  }, []);

  // About handlers
  const saveAbout = () => {
    setJSON(KEYS.about, { title: aboutTitle, desc: aboutDesc });
    setAboutSaved(true);
    setTimeout(() => setAboutSaved(false), 2000);
  };

  // FAQ handlers
  const saveFaqs = (newFaqs) => {
    setJSON(KEYS.faq, newFaqs);
    setFaqs(newFaqs);
  };

  const openModal = (id = null) => {
    if (id) {
      const item = faqs.find(f => f.id === id);
      if (item) {
        setEditId(id);
        setFaqTitle(item.title);
        setFaqDesc(item.desc);
      }
    } else {
      setEditId(null);
      setFaqTitle('');
      setFaqDesc('');
    }
    setModalOpen(true);
  };

  const handleSaveFaq = () => {
    if (!faqTitle.trim()) return;
    if (editId) {
      saveFaqs(faqs.map(f => f.id === editId ? { ...f, title: faqTitle, desc: faqDesc } : f));
    } else {
      saveFaqs([...faqs, { id: Date.now(), title: faqTitle, desc: faqDesc }]);
    }
    setModalOpen(false);
  };

  const deleteFaq = (id) => {
    if (!confirm('Delete this FAQ item?')) return;
    saveFaqs(faqs.filter(f => f.id !== id));
  };

  const labelStyle = { display: 'block', color: '#FF8C00', fontSize: '13px', fontWeight: 700, marginBottom: '6px', textTransform: 'uppercase' };

  return (
    <div>
      <h2 style={{ color: '#fff', fontSize: '24px', fontWeight: 700, marginBottom: '20px' }}>About & FAQ Manager</h2>

      {/* About Section */}
      <div style={adminCardStyle}>
        <h3 style={{ color: '#FF8C00', fontSize: '16px', marginBottom: '16px' }}>About Text</h3>
        <div style={{ marginBottom: '16px' }}>
          <label style={labelStyle}>Title</label>
          <input style={adminInputStyle} value={aboutTitle} onChange={e => setAboutTitle(e.target.value)} placeholder="About title" />
        </div>
        <div style={{ marginBottom: '16px' }}>
          <label style={labelStyle}>Description</label>
          <textarea
            style={{ ...adminInputStyle, minHeight: '120px', resize: 'vertical' }}
            value={aboutDesc}
            onChange={e => setAboutDesc(e.target.value)}
            placeholder="About description"
          />
        </div>
        <button onClick={saveAbout} style={adminBtnStyle}>
          {aboutSaved ? 'Saved!' : 'Save About'}
        </button>
      </div>

      {/* FAQ Section */}
      <div style={adminCardStyle}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h3 style={{ color: '#FF8C00', fontSize: '16px' }}>FAQ Items ({faqs.length})</h3>
          <button onClick={() => openModal()} style={adminBtnStyle}>+ Add FAQ</button>
        </div>

        {faqs.length === 0 ? (
          <p style={{ color: '#666' }}>No FAQ items yet.</p>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={adminThStyle}>Title</th>
                <th style={adminThStyle}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {faqs.map(faq => (
                <tr key={faq.id}>
                  <td style={adminTdStyle}>{faq.title}</td>
                  <td style={adminTdStyle}>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button onClick={() => openModal(faq.id)} style={{ ...adminBtnStyle, padding: '6px 14px', fontSize: '12px', background: '#333' }}>
                        Edit
                      </button>
                      <button onClick={() => deleteFaq(faq.id)} style={{ ...adminBtnStyle, padding: '6px 14px', fontSize: '12px', background: '#c0392b' }}>
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

      {/* FAQ Modal */}
      {modalOpen && (
        <div style={overlayStyle} onClick={() => setModalOpen(false)}>
          <div style={modalStyle} onClick={e => e.stopPropagation()}>
            <h3 style={{ color: '#FF8C00', fontSize: '18px', marginBottom: '20px' }}>
              {editId ? 'Edit FAQ' : 'Add FAQ'}
            </h3>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', color: '#ccc', fontSize: '13px', marginBottom: '6px' }}>Title</label>
              <input style={adminInputStyle} value={faqTitle} onChange={e => setFaqTitle(e.target.value)} placeholder="FAQ question" />
            </div>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', color: '#ccc', fontSize: '13px', marginBottom: '6px' }}>Description</label>
              <textarea
                style={{ ...adminInputStyle, minHeight: '100px', resize: 'vertical' }}
                value={faqDesc}
                onChange={e => setFaqDesc(e.target.value)}
                placeholder="FAQ answer"
              />
            </div>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button onClick={() => setModalOpen(false)} style={{ ...adminBtnStyle, background: '#333' }}>Cancel</button>
              <button onClick={handleSaveFaq} style={adminBtnStyle}>{editId ? 'Update' : 'Add'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
