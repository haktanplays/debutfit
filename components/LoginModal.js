'use client';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useModal } from '@/components/ModalProvider';

export default function LoginModal() {
  const { loginOpen, setLoginOpen } = useModal();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [errorColor, setErrorColor] = useState('#FFD700');
  const usernameRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    if (loginOpen && usernameRef.current) {
      setTimeout(() => usernameRef.current.focus(), 100);
    }
  }, [loginOpen]);

  const handleClose = () => {
    setLoginOpen(false);
    setUsername('');
    setPassword('');
    setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (username === 'admin' && password === 'admin') {
      setErrorColor('#00C06B');
      setError('Giriş başarılı! Yönlendiriliyorsunuz...');
      setTimeout(() => {
        router.push('/admin');
        handleClose();
      }, 1500);
    } else {
      setErrorColor('#FFD700');
      setError('Hatalı kullanıcı adı veya şifre!');
      setPassword('');
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
            <input type="text" ref={usernameRef} value={username} onChange={(e) => setUsername(e.target.value)} required autoComplete="off" />
            <label>Kullanıcı Adı</label>
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
