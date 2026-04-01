'use client';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useModal } from '@/components/ModalProvider';
import { createClient } from '@/lib/supabase-client';

export default function LoginModal() {
  const { loginOpen, setLoginOpen } = useModal();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [errorColor, setErrorColor] = useState('#FFD700');
  const emailRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    if (loginOpen && emailRef.current) {
      setTimeout(() => emailRef.current.focus(), 100);
    }
  }, [loginOpen]);

  const handleClose = () => {
    setLoginOpen(false);
    setEmail('');
    setPassword('');
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const supabase = createClient();
      const { error: authError } = await supabase.auth.signInWithPassword({ email, password });
      if (authError) {
        setErrorColor('#FFD700');
        setError('Hatalı e-posta veya şifre!');
        setPassword('');
      } else {
        setErrorColor('#00C06B');
        setError('Giriş başarılı! Yönlendiriliyorsunuz...');
        setTimeout(() => {
          window.location.href = '/admin';
        }, 1500);
      }
    } catch (err) {
      setErrorColor('#FFD700');
      setError('Bağlantı hatası: ' + err.message);
    }
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) handleClose();
  };

  if (!loginOpen) return null;

  return (
    <div className="modal" style={{ display: 'flex' }} onClick={handleBackdropClick}>
      <div className="modal-content">
        <span className="close" onClick={handleClose}>&times;</span>
        <div className="modal-logo-container">
          <img src="/images/DEBUTFiT.png" alt="DebutFit Club Logo" className="modal-logo" />
        </div>
        <h2 className="gradient-text-modal">Yönetici Girişi</h2>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <input type="email" ref={emailRef} value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="off" />
            <label>E-posta</label>
            <span className="bar"></span>
          </div>
          <div className="input-group">
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            <label>Şifre</label>
            <span className="bar"></span>
          </div>
          {error && <p className="error" style={{ display: 'block', color: errorColor }}>{error}</p>}
          <button type="submit" className="login-submit-btn">Giriş Yap</button>
        </form>
      </div>
    </div>
  );
}
