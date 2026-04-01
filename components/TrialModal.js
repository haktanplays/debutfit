'use client';
import { useState, useMemo } from 'react';
import { useModal } from '@/components/ModalProvider';
import { getJSON, setJSON, KEYS } from '@/lib/storage';

export default function TrialModal() {
  const { trialOpen, setTrialOpen } = useModal();
  const [name, setName] = useState('');
  const [gender, setGender] = useState('');
  const [phone, setPhone] = useState('');
  const [date, setDate] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  // Generate 7-day date options starting from today
  const dateOptions = useMemo(() => {
    if (!trialOpen) return [];
    const today = new Date();
    const options = [];
    for (let i = 0; i < 7; i++) {
      const nextDate = new Date();
      nextDate.setDate(today.getDate() + i);
      const dd = String(nextDate.getDate()).padStart(2, '0');
      const mm = String(nextDate.getMonth() + 1).padStart(2, '0');
      const yyyy = nextDate.getFullYear();
      const dateStr = `${dd}/${mm}/${yyyy}`;
      let label = dateStr;
      if (i === 0) label += ' (Bugün)';
      else if (i === 1) label += ' (Yarın)';
      options.push({ value: dateStr, label });
    }
    return options;
  }, [trialOpen]);

  const resetForm = () => {
    setName('');
    setGender('');
    setPhone('');
    setDate('');
    setShowSuccess(false);
  };

  const handleClose = () => {
    setTrialOpen(false);
    setTimeout(() => resetForm(), 300);
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) handleClose();
  };

  const handlePhoneChange = (e) => {
    setPhone(e.target.value.replace(/[^0-9+]/g, ''));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const now = new Date();
    const requestDateStr =
      now.toLocaleDateString('tr-TR') +
      ', ' +
      now.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });

    const newTrial = {
      id: Date.now(),
      requestDate: requestDateStr,
      name,
      gender,
      phone,
      date,
      status: 'new',
    };

    const trials = getJSON(KEYS.trials) || [];
    trials.push(newTrial);
    setJSON(KEYS.trials, trials);

    setShowSuccess(true);
    setTimeout(() => handleClose(), 4000);
  };

  if (!trialOpen) return null;

  return (
    <div className="modal" style={{ display: 'flex' }} onClick={handleBackdropClick}>
      <div className="modal-content quote-modal-content">
        <span className="close trial-close" onClick={handleClose}>&times;</span>

        <div className="lead-form-section">
          <h2 className="gradient-text-modal" style={{ fontSize: '28px', marginBottom: '10px' }}>
            Tesisimizi Deneyin
          </h2>
          <p style={{ color: '#ccc', marginBottom: '30px', fontSize: '15px' }}>
            1 günlük ücretsiz deneme hakkınızı kullanmak ve salonumuzu keşfetmek için formu doldurun.
          </p>

          {/* Success Message */}
          {showSuccess && (
            <div className="success-message" style={{ display: 'flex' }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
              Talebiniz başarıyla alındı! Deneme randevunuzu onaylamak için en kısa sürede sizi arayacağız.
            </div>
          )}

          {/* Form */}
          {!showSuccess && (
            <form onSubmit={handleSubmit}>
              <div className="input-group">
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} required autoComplete="off" />
                <label>İsim Soyisim</label>
                <span className="bar"></span>
              </div>

              <div className="input-group select-group">
                <select value={gender} onChange={(e) => setGender(e.target.value)} required>
                  <option value="" disabled hidden></option>
                  <option value="kadin">Kadın</option>
                  <option value="erkek">Erkek</option>
                </select>
                <label className="static-label">Cinsiyet</label>
                <span className="bar"></span>
              </div>

              <div className="input-group">
                <input type="tel" value={phone} onChange={handlePhoneChange} required maxLength="15" />
                <label>İletişim Numarası</label>
                <span className="bar"></span>
              </div>

              <div className="input-group select-group">
                <select value={date} onChange={(e) => setDate(e.target.value)} required>
                  <option value="" disabled hidden></option>
                  {dateOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
                <label className="static-label">Deneme Tarihi</label>
                <span className="bar"></span>
              </div>

              <button type="submit" className="login-submit-btn">Randevu Al</button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
