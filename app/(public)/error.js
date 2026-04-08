'use client';

export default function PublicError({ error, reset }) {
  return (
    <section style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#121212',
      color: '#fff',
      fontFamily: 'Montserrat, sans-serif',
      padding: '20px',
      textAlign: 'center',
    }}>
      <div style={{
        background: 'rgba(255, 140, 0, 0.1)',
        border: '1px solid rgba(255, 140, 0, 0.3)',
        borderRadius: '50%',
        width: '80px',
        height: '80px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: '30px',
      }}>
        <svg viewBox="0 0 24 24" width="40" height="40" fill="none" stroke="#FF8C00" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
      </div>
      <h1 style={{ fontSize: '28px', fontWeight: 800, marginBottom: '15px', textTransform: 'uppercase', letterSpacing: '2px' }}>
        Bir Hata Oluştu
      </h1>
      <p style={{ color: '#aaa', fontSize: '16px', marginBottom: '30px', maxWidth: '500px', lineHeight: 1.6 }}>
        Sayfa yüklenirken beklenmeyen bir hata oluştu. Lütfen tekrar deneyin.
      </p>
      <button
        onClick={() => reset()}
        style={{
          background: '#FF8C00',
          color: '#fff',
          border: 'none',
          padding: '14px 35px',
          fontSize: '16px',
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '1px',
          borderRadius: '5px',
          cursor: 'pointer',
        }}
      >
        Tekrar Dene
      </button>
    </section>
  );
}
