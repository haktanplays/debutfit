'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useModal } from '@/components/ModalProvider';
import { getSliderItems, getSiteSetting, getFaqItems, getPublicUrl } from '@/lib/db';

export default function HomePage() {
  const { setQuoteOpen, setTrialOpen } = useModal();

  // --- Hero background ---
  const [heroBg, setHeroBg] = useState('');

  // --- Slider state ---
  const [slides, setSlides] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const heroSlideTimeout = useRef(null);
  const videoRefs = useRef({});

  // --- About ---
  const [aboutTitle, setAboutTitle] = useState('DEBUTFIT CLUB ATAKENT');
  const [aboutDesc, setAboutDesc] = useState('Modern mimari, son teknoloji ekipmanlar ve profesyonel eğitmen kadrosuyla donatılmış premium tesisimizi keşfedin.');

  // --- FAQ ---
  const [faqItems, setFaqItems] = useState([]);
  const [faqOpen, setFaqOpen] = useState({});

  // --- Loaded flag ---
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const heroBgData = await getSiteSetting('hero_bg');
        setHeroBg(heroBgData.image_path ? getPublicUrl(heroBgData.image_path) : '');

        const sliderData = await getSliderItems();
        const mappedSlides = sliderData.map(item => ({
          type: item.media_type,
          src: getPublicUrl(item.file_path),
          title: '',
          videoWidth: 0,
          videoHeight: 0
        }));

        // Video metadata'larını slider render'dan ÖNCE preload et
        await Promise.all(mappedSlides.map((slide) => {
          if (slide.type === 'video') {
            return new Promise((resolve) => {
              const vid = document.createElement('video');
              vid.preload = 'metadata';
              vid.src = slide.src;
              const cleanup = () => { vid.onloadedmetadata = null; vid.onerror = null; vid.src = ''; };
              const timer = setTimeout(() => { cleanup(); resolve(); }, 8000);
              vid.onloadedmetadata = () => {
                slide.videoWidth = vid.videoWidth;
                slide.videoHeight = vid.videoHeight;
                clearTimeout(timer);
                cleanup();
                resolve();
              };
              vid.onerror = () => { clearTimeout(timer); cleanup(); resolve(); };
            });
          }
          return Promise.resolve();
        }));

        setSlides(mappedSlides);

        const about = await getSiteSetting('about');
        if (about.title) setAboutTitle(about.title);
        if (about.desc) setAboutDesc(about.desc);

        const faqData = await getFaqItems();
        setFaqItems(faqData.map(f => ({ q: f.question, a: f.answer })));
      } catch (err) { console.error(err); }
      setLoaded(true);
    }
    load();
  }, []);

  // --- Slider auto-advance logic ---
  const advanceSlide = useCallback(() => {
    if (slides.length === 0) return;
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  }, [slides.length]);

  const startSlideTimer = useCallback((index) => {
    if (heroSlideTimeout.current) {
      clearTimeout(heroSlideTimeout.current);
      heroSlideTimeout.current = null;
    }
    if (slides.length <= 1 && slides[0] && slides[0].type === 'video') {
      // Single video slide: just play it
      const vid = videoRefs.current[0];
      if (vid) {
        vid.currentTime = 0;
        vid.play().catch(() => {});
      }
      return;
    }
    if (slides.length === 0) return;

    const slide = slides[index];
    if (!slide) return;

    // Pause all videos and clear their onended handlers
    Object.values(videoRefs.current).forEach((v) => {
      if (v) {
        v.pause();
        v.onended = null;
        v.currentTime = 0;
      }
    });

    if (slide.type === 'video') {
      const vid = videoRefs.current[index];
      if (vid) {
        vid.currentTime = 0;
        vid.play().catch(() => {});
        vid.onended = () => advanceSlide();
      }
    } else {
      heroSlideTimeout.current = setTimeout(() => {
        advanceSlide();
      }, 4000);
    }
  }, [slides, advanceSlide]);

  useEffect(() => {
    if (slides.length > 0 && loaded) {
      startSlideTimer(currentSlide);
    }
    return () => {
      if (heroSlideTimeout.current) clearTimeout(heroSlideTimeout.current);
      Object.values(videoRefs.current).forEach((v) => {
        if (v) v.onended = null;
      });
    };
  }, [currentSlide, slides, loaded, startSlideTimer]);

  // --- FAQ toggle ---
  function toggleFaq(index) {
    setFaqOpen((prev) => ({ ...prev, [index]: !prev[index] }));
  }

  if (!loaded) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-color)' }}>
      <div style={{
        width: '40px', height: '40px',
        border: '3px solid rgba(255, 255, 255, 0.1)',
        borderTopColor: '#FF8C00',
        borderRadius: '50%',
        animation: 'spin 0.8s linear infinite',
      }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );

  return (
    <>
      {/* ===== HERO SECTION ===== */}
      <section
        id="home"
        className="hero"
        style={heroBg ? { backgroundImage: `url(${heroBg})` } : undefined}
      >
        <div className="hero-overlay"></div>
        <div className="hero-container">
          <div className="hero-text" data-aos="fade-right" data-aos-duration="1000">
            <div className="modern-badge">Neden DebutFit Club?</div>
            <h1 className="modern-title">
              Sıradanlığı Bırak, <br />
              <span className="highlight-text">Zirveye Ulaş.</span>
            </h1>
            <p>
              Biz sadece bir spor salonu değiliz; hedeflerine en hızlı şekilde ulaşman için tasarlanmış, en üst düzey (premium) yaşam tarzı merkeziyiz.
            </p>
            <div className="hero-buttons">
              <div className="primary-action-wrapper">
                <button className="cta-btn" onClick={() => setQuoteOpen(true)}>
                  Fiyat Teklifi Al
                </button>
                <a
                  href="#"
                  className="trial-link"
                  onClick={(e) => { e.preventDefault(); setTrialOpen(true); }}
                >
                  Veya Tesisimizi Ücretsiz Deneyin
                </a>
              </div>
              <Link href="/tesis" className="secondary-btn">
                Tesisimizi Keşfet
              </Link>
            </div>
          </div>

          {/* Hero Slider */}
          <div
            className="hero-stats"
            id="heroSliderContainer"
            data-aos="fade-left"
            data-aos-duration="1000"
            data-aos-delay="200"
          >
            {slides.length > 0 && (
              <>
                <div className="hero-slider-wrapper">
                  {slides.map((slide, i) => (
                    <div
                      key={i}
                      className={`hero-slide${i === currentSlide ? ' active' : ''}`}
                    >
                      {slide.type === 'video' ? (
                        <video
                          ref={(el) => { videoRefs.current[i] = el; }}
                          src={slide.src}
                          muted
                          playsInline
                          preload="metadata"
                        />
                      ) : (
                        <img
                          src={slide.src}
                          alt={slide.title || 'DebutFit'}
                        />
                      )}
                      {slide.title && (
                        <div className="hero-slide-caption glass-panel">
                          <span>{slide.title}</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Nav arrows */}
                {slides.length > 1 && (
                  <>
                    <button
                      className="slider-arrow slider-prev"
                      aria-label="Önceki slayt"
                      onClick={() => {
                        setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
                      }}
                    >
                      &#10094;
                    </button>
                    <button
                      className="slider-arrow slider-next"
                      aria-label="Sonraki slayt"
                      onClick={() => {
                        setCurrentSlide((prev) => (prev + 1) % slides.length);
                      }}
                    >
                      &#10095;
                    </button>
                  </>
                )}

                {/* Dot indicators */}
                {slides.length > 1 && (
                  <div className="slider-dots">
                    {slides.map((_, i) => (
                      <button
                        key={i}
                        className={`dot${i === currentSlide ? ' active' : ''}`}
                        aria-label={`Slayt ${i + 1}`}
                        onClick={() => setCurrentSlide(i)}
                      />
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </section>

      {/* ===== ABOUT SECTION ===== */}
      <section id="about" className="facility-section">
        <div className="container">
          <div className="section-header" data-aos="fade-up" data-aos-duration="800">
            <h2 id="dynamicAboutTitle">{aboutTitle}</h2>
            <p id="dynamicAboutDesc">{aboutDesc}</p>
            <div className="header-line"></div>
          </div>

          {/* FAQ Accordion */}
          <div className="faq-container" data-aos="fade-up" data-aos-delay="200">
            {faqItems.map((item, index) => (
              <div
                key={index}
                className={`faq-item${faqOpen[index] ? ' open' : ''}`}
              >
                <button
                  className={`faq-title${faqOpen[index] ? ' active' : ''}`}
                  type="button"
                  onClick={() => toggleFaq(index)}
                  aria-expanded={!!faqOpen[index]}
                  aria-controls={`faq-content-${index}`}
                >
                  <span>{item.q}</span>
                  <span className="faq-icon" aria-hidden="true">{faqOpen[index] ? '\u2212' : '+'}</span>
                </button>
                <div className="faq-content" id={`faq-content-${index}`} role="region">
                  <p>{item.a}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== PROGRAMS SECTION ===== */}
      <section id="programs" className="services-summary-section">
        <div className="container">
          <div className="section-header" data-aos="fade-up" data-aos-duration="800">
            <h2>ÖNE ÇIKAN <span className="highlight">PROGRAMLAR</span></h2>
            <p>Hedefin ne olursa olsun, sana uygun bir antrenman programımız mutlaka var.</p>
            <div className="header-line"></div>
          </div>

          <div className="services-grid">
            {/* Fitness */}
            <div className="service-card" data-aos="fade-up" data-aos-delay="100">
              <Image
                src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=2070&auto=format&fit=crop"
                alt="Fitness"
                className="card-bg-img"
                fill
                sizes="(max-width: 576px) 100vw, (max-width: 992px) 50vw, 25vw"
              />
              <div className="card-overlay"></div>
              <div className="card-content">
                <div className="icon-wrapper">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="service-icon">
                    <path d="M6.5 6.5h11M6.5 17.5h11M3.5 11v2M20.5 11v2M5.5 8.5v7M18.5 8.5v7M9 5v14M15 5v14" />
                  </svg>
                </div>
                <h3>Fitness & Vücut Geliştirme</h3>
                <p>Serbest ağırlıklar ve en yeni makinelerle kas kütleni artır veya sıkılaş.</p>
              </div>
            </div>

            {/* Kick Boks */}
            <div className="service-card" data-aos="fade-up" data-aos-delay="200">
              <Image
                src="https://images.unsplash.com/photo-1599058945522-28d584b6f0ff?q=80&w=2069&auto=format&fit=crop"
                alt="Kick Boks"
                className="card-bg-img"
                fill
                sizes="(max-width: 576px) 100vw, (max-width: 992px) 50vw, 25vw"
              />
              <div className="card-overlay"></div>
              <div className="card-content">
                <div className="icon-wrapper">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="service-icon">
                    <circle cx="12" cy="12" r="10" />
                    <circle cx="12" cy="12" r="6" />
                    <circle cx="12" cy="12" r="2" />
                  </svg>
                </div>
                <h3>Kick Boks & MMA</h3>
                <p>Kondisyonunu zirveye taşı, stresi at ve profesyonellerden dövüş sanatlarını öğren.</p>
              </div>
            </div>

            {/* Pilates & Yoga */}
            <div className="service-card" data-aos="fade-up" data-aos-delay="300">
              <Image
                src="https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=2120&auto=format&fit=crop"
                alt="Yoga Pilates"
                className="card-bg-img"
                fill
                sizes="(max-width: 576px) 100vw, (max-width: 992px) 50vw, 25vw"
              />
              <div className="card-overlay"></div>
              <div className="card-content">
                <div className="icon-wrapper">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="service-icon">
                    <path d="M12 2.5a4.5 4.5 0 0 0-4.5 4.5v1h9v-1a4.5 4.5 0 0 0-4.5-4.5zM7 10h10v4a5 5 0 0 1-10 0v-4zM4 14.5a3.5 3.5 0 0 0 7 0M13 14.5a3.5 3.5 0 0 0 7 0" />
                  </svg>
                </div>
                <h3>Pilates & Yoga</h3>
                <p>Esnekliğini artır, postürünü düzelt ve zihin-beden dengeni mükemmelleştir.</p>
              </div>
            </div>

            {/* Personal Training */}
            <div className="service-card" data-aos="fade-up" data-aos-delay="400">
              <Image
                src="https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=2070&auto=format&fit=crop"
                alt="Personal Training"
                className="card-bg-img"
                fill
                sizes="(max-width: 576px) 100vw, (max-width: 992px) 50vw, 25vw"
              />
              <div className="card-overlay"></div>
              <div className="card-content">
                <div className="icon-wrapper">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="service-icon">
                    <circle cx="12" cy="13" r="8" />
                    <path d="M12 9v4l2 2M10 3h4M12 3v2" />
                  </svg>
                </div>
                <h3>Personal Training</h3>
                <p>Sadece sana özel hazırlanan beslenme ve antrenman programlarıyla kesin sonuç al.</p>
              </div>
            </div>
          </div>

          <div className="services-footer" data-aos="fade-in" data-aos-delay="500">
            <Link href="/programlar" className="login-btn-animated" style={{ display: 'inline-block', textDecoration: 'none' }}>
              Tüm Programları İncele
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
