'use client';
import { useState, useEffect } from 'react';
import { useModal } from '@/components/ModalProvider';
import { getFormOptions, insertQuote, trackClick } from '@/lib/db';

export default function QuoteModal() {
  const { quoteOpen, setQuoteOpen } = useModal();
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [phone, setPhone] = useState('');
  const [duration, setDuration] = useState('');
  const [selectedCampaign, setSelectedCampaign] = useState('');
  const [selectedExtras, setSelectedExtras] = useState([]);
  const [showSuccess, setShowSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [durations, setDurations] = useState([]);
  const [campaigns, setCampaigns] = useState([]);
  const [extras, setExtras] = useState([]);

  useEffect(() => {
    if (quoteOpen) {
      async function loadOptions() {
        try {
          setDurations(await getFormOptions('duration'));
          setCampaigns(await getFormOptions('campaign'));
          setExtras(await getFormOptions('extra'));
        } catch (err) { console.error(err); }
      }
      loadOptions();
    }
  }, [quoteOpen]);

  const resetForm = () => {
    setName('');
    setAge('');
    setGender('');
    setPhone('');
    setDuration('');
    setSelectedCampaign('');
    setSelectedExtras([]);
    setShowSuccess(false);
  };

  const handleClose = () => {
    setQuoteOpen(false);
    setTimeout(() => resetForm(), 300);
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) handleClose();
  };

  const handlePhoneChange = (e) => {
    const val = e.target.value.replace(/[^0-9]/g, '');
    if (val.length <= 10) setPhone(val);
  };

  const handleCampaignClick = (campaignName) => {
    setSelectedCampaign((prev) => (prev === campaignName ? '' : campaignName));
  };

  const handleExtraClick = (extraName) => {
    setSelectedExtras((prev) =>
      prev.includes(extraName)
        ? prev.filter((e) => e !== extraName)
        : [...prev, extraName]
    );
  };

  const handleCallClick = () => { trackClick('call'); };
  const handleWhatsAppClick = () => { trackClick('whatsapp'); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await insertQuote({
        name,
        age,
        gender,
        phone: '+90 ' + phone,
        duration,
        campaign: selectedCampaign,
        extras: selectedExtras,
      });
      setShowSuccess(true);
      setTimeout(() => handleClose(), 4000);
    } catch (err) { console.error(err); alert('Bir hata oluştu.'); } finally { setSubmitting(false); }
  };

  if (!quoteOpen) return null;

  return (
    <div className="modal" style={{ display: 'flex' }} role="dialog" aria-modal="true" aria-labelledby="quote-modal-title" onClick={handleBackdropClick}>
      <div className="modal-content quote-modal-content">
        <button className="close quote-close" type="button" aria-label="Kapat" onClick={handleClose}>&times;</button>

        {/* Direct Contact Section */}
        <div className="direct-contact-section">
          <h2 id="quote-modal-title" className="gradient-text-modal" style={{ fontSize: '26px', marginBottom: '25px' }}>
            Bizimle İletişime Geç
          </h2>
          <div className="contact-buttons">
            <a href="tel:+905555555555" className="contact-btn call-btn" onClick={handleCallClick}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
              </svg>
              Hemen Ara
            </a>
            <a href="https://wa.me/905555555555" target="_blank" rel="noopener noreferrer" className="contact-btn whatsapp-btn" onClick={handleWhatsAppClick}>
              <svg viewBox="0 0 24 24" fill="currentColor" stroke="none" width="22" height="22">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
              </svg>
              WhatsApp
            </a>
          </div>
        </div>

        {/* Divider */}
        <div className="modal-divider"><span>VEYA</span></div>

        {/* Lead Form Section */}
        <div className="lead-form-section">
          <h3 style={{ color: '#fff', marginBottom: '25px', fontWeight: 600 }}>
            Benimle İletişime Geçilsin
          </h3>

          {/* Success Message */}
          {showSuccess && (
            <div className="success-message" style={{ display: 'flex' }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
              Talebiniz başarıyla alındı! En kısa sürede belirteceğiniz numara üzerinden sizinle iletişime geçeceğiz.
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

              <div className="form-row">
                <div className="input-group half">
                  <input type="number" value={age} onChange={(e) => setAge(e.target.value)} required />
                  <label>Yaş</label>
                  <span className="bar"></span>
                </div>
                <div className="input-group half">
                  <select value={gender} onChange={(e) => setGender(e.target.value)} required>
                    <option value="" disabled hidden></option>
                    <option value="kadin">Kadın</option>
                    <option value="erkek">Erkek</option>
                  </select>
                  <label>Cinsiyet</label>
                  <span className="bar"></span>
                </div>
              </div>

              <div className="input-group" style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: 0, top: '10px', color: '#fff', fontSize: '16px' }}>+90</span>
                <input
                  type="tel"
                  value={phone}
                  onChange={handlePhoneChange}
                  required
                  maxLength="10"
                  style={{ paddingLeft: '35px' }}
                />
                <label style={{ left: '35px' }}>İletişim Numarası (5XX...)</label>
                <span className="bar"></span>
              </div>

              <div className="input-group">
                <select value={duration} onChange={(e) => setDuration(e.target.value)} required>
                  <option value="" disabled hidden></option>
                  {durations.map((d) => (
                    <option key={d.id} value={d.name}>{d.name}</option>
                  ))}
                </select>
                <label>İstenen Üyelik Süresi</label>
                <span className="bar"></span>
              </div>

              {/* Campaigns - Single Select Tags */}
              {campaigns.length > 0 && (
                <div className="form-options-section">
                  <p className="section-label">Yararlanabileceğiniz Kampanyalar (Sadece 1 adet seçebilirsiniz)</p>
                  <div className="tags-container">
                    {campaigns.map((c) => (
                      <div
                        key={c.id || c.name}
                        className={`selectable-tag${selectedCampaign === c.name ? ' selected' : ''}`}
                        onClick={() => handleCampaignClick(c.name)}
                      >
                        {c.name}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Extras - Multi Select Tags */}
              {extras.length > 0 && (
                <div className="form-options-section">
                  <p className="section-label">Ek Olarak İstediğiniz Hizmetler</p>
                  <div className="tags-container">
                    {extras.map((ex) => (
                      <div
                        key={ex.id || ex.name}
                        className={`selectable-tag${selectedExtras.includes(ex.name) ? ' selected' : ''}`}
                        onClick={() => handleExtraClick(ex.name)}
                      >
                        {ex.name}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <button type="submit" className="login-submit-btn" style={{ marginTop: '20px' }} disabled={submitting}>{submitting ? 'Gönderiliyor...' : 'Teklif Al'}</button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
