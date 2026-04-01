'use client';
import Link from 'next/link';

export default function SatrancPage() {
  return (
    <section className="coming-soon-section" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: "url('https://images.unsplash.com/photo-1529699211952-734e80c4d42b?q=80&w=2071&auto=format&fit=crop') center/cover no-repeat", position: 'relative', padding: '20px' }}>
      <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(18, 18, 18, 0.85)', zIndex: 1 }}></div>
      <div style={{ position: 'relative', zIndex: 2, textAlign: 'center', maxWidth: '800px', marginTop: '80px' }}>
        <div className="modern-badge" data-aos="fade-down" style={{ display: 'inline-block', background: 'rgba(255, 140, 0, 0.15)', color: '#FF8C00', padding: '8px 16px', borderRadius: '30px', fontSize: '14px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '25px', border: '1px solid rgba(255, 140, 0, 0.3)' }}>Yeni Projemiz</div>
        <h1 style={{ fontSize: '54px', color: '#fff', fontWeight: 900, lineHeight: 1.2, marginBottom: '25px', textTransform: 'uppercase', letterSpacing: '2px' }} data-aos="zoom-in" data-aos-delay="100">
          DEBUT SATRANÇ <br /><span style={{ color: '#FF8C00' }}>ÇOK YAKINDA</span>
        </h1>
        <p style={{ fontSize: '18px', color: '#d1d1d1', lineHeight: 1.6, marginBottom: '40px', fontWeight: 300 }} data-aos="fade-up" data-aos-delay="200">
          Strateji, odaklanma ve zeka... Yeni satranç platformumuz ve kulübümüz çok yakında sizlerle buluşacak. Heyecan verici detaylar için hazırlıklarımız tüm hızıyla devam ediyor.
        </p>
        <Link href="/" className="login-btn-animated" style={{ display: 'inline-block', textDecoration: 'none' }} data-aos="fade-up" data-aos-delay="300">Ana Sayfaya Dön</Link>
      </div>
    </section>
  );
}
