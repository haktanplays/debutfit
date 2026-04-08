'use client';
import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { getAlbums, getPublicUrl } from '@/lib/db';

export default function GaleriPage() {
  const [galleries, setGalleries] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentPhotos, setCurrentPhotos] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    async function load() {
      try {
        setGalleries(await getAlbums());
      } catch (err) { console.error(err); }
      setLoaded(true);
    }
    load();
  }, []);

  const openLightbox = (albumId) => {
    const album = galleries.find(g => g.id === albumId);
    if (album?.gallery_photos?.length > 0) {
      setCurrentPhotos(album.gallery_photos.map(p => getPublicUrl(p.file_path)));
      setCurrentIndex(0);
      setLightboxOpen(true);
      document.body.style.overflow = 'hidden';
    }
  };

  const closeLightbox = useCallback(() => {
    setLightboxOpen(false);
    document.body.style.overflow = 'auto';
  }, []);

  const changePhoto = useCallback((direction) => {
    setCurrentIndex(prev => {
      let next = prev + direction;
      if (next < 0) next = currentPhotos.length - 1;
      if (next >= currentPhotos.length) next = 0;
      return next;
    });
  }, [currentPhotos.length]);

  useEffect(() => {
    const handleKey = (e) => {
      if (!lightboxOpen) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') changePhoto(1);
      if (e.key === 'ArrowLeft') changePhoto(-1);
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [lightboxOpen, closeLightbox, changePhoto]);

  if (!loaded) return null;

  return (
    <>
      <section className="gallery-page-section" style={{ minHeight: '100vh', paddingTop: '150px', paddingBottom: '100px' }}>
        <div className="container">
          <div className="section-header" data-aos="fade-up" data-aos-duration="800">
            <h2>FOTOĞRAF <span className="highlight">GALERİSİ</span></h2>
            <p>Etkinliklerimizden, antrenmanlarımızdan ve tesisimizden en özel kareler.</p>
            <div className="header-line"></div>
          </div>
          <div className="albums-grid" id="albumsGrid">
            {galleries.length === 0 ? (
              <p style={{ color: '#aaa', textAlign: 'center', gridColumn: '1/-1' }}>Henüz galeriye albüm eklenmemiş.</p>
            ) : (
              galleries.map((g, index) => {
                const delay = (index % 3) * 100;
                const coverImg = getPublicUrl(g.cover_path || (g.gallery_photos?.[0]?.file_path || ''));
                const photoCount = g.gallery_photos?.length || 0;
                return (
                  <div key={g.id} className="album-card" data-aos="fade-up" data-aos-delay={String(delay)} onClick={() => openLightbox(g.id)}>
                    <div className="album-img-wrapper" style={{ position: 'relative' }}>
                      <Image src={coverImg} alt={g.title} fill sizes="(max-width: 576px) 100vw, (max-width: 992px) 50vw, 33vw" style={{ objectFit: 'cover' }} />
                      <div className="album-overlay">
                        <span>{photoCount} Fotoğrafı Gör</span>
                      </div>
                    </div>
                    <div className="album-content">
                      <h3 className="album-title">{g.title}</h3>
                      <p className="album-desc">{g.description}</p>
                      {g.author && (
                        <span className="album-author">
                          <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: '5px', verticalAlign: 'middle' }}><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                          {g.author}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </section>

      {lightboxOpen && (
        <div className="lightbox" style={{ display: 'flex' }} role="dialog" aria-modal="true" aria-label="Fotoğraf görüntüleyici">
          <button className="close-lightbox" type="button" aria-label="Galeriyi kapat" onClick={closeLightbox}>&times;</button>
          <button className="lb-nav prev" aria-label="Önceki fotoğraf" onClick={() => changePhoto(-1)}>&#10094;</button>
          <img id="lightboxImage" src={currentPhotos[currentIndex]} alt="Galeri Fotoğrafı" />
          <button className="lb-nav next" aria-label="Sonraki fotoğraf" onClick={() => changePhoto(1)}>&#10095;</button>
          <div className="lb-counter">{currentIndex + 1} / {currentPhotos.length}</div>
        </div>
      )}
    </>
  );
}
