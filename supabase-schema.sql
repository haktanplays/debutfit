-- ============================================================
-- DEBUTFIT SUPABASE SCHEMA
-- Run this entire script in Supabase Dashboard > SQL Editor
-- ============================================================

-- 1. PROGRAMS
CREATE TABLE programs (
  id         BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  name       TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  image_path TEXT,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2. QUOTES (price-quote requests from customers)
CREATE TABLE quotes (
  id          BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  name        TEXT NOT NULL,
  age         INT,
  gender      TEXT,
  phone       TEXT NOT NULL,
  duration    TEXT,
  campaign    TEXT,
  extras      TEXT[] DEFAULT '{}',
  status      TEXT NOT NULL DEFAULT 'new',
  handled_by  TEXT
);

-- 3. TRIALS (free trial requests)
CREATE TABLE trials (
  id           BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  request_date TIMESTAMPTZ NOT NULL DEFAULT now(),
  name         TEXT NOT NULL,
  gender       TEXT,
  phone        TEXT NOT NULL,
  trial_date   TEXT NOT NULL,
  status       TEXT NOT NULL DEFAULT 'new',
  handled_by   TEXT
);

-- 4. FACILITIES (tesis)
CREATE TABLE facilities (
  id          BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  title       TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  image_path  TEXT,
  sort_order  INT NOT NULL DEFAULT 0,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 5. SLIDER items
CREATE TABLE slider_items (
  id         BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  media_type TEXT NOT NULL CHECK (media_type IN ('image', 'video')),
  file_path  TEXT NOT NULL,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 6. FAQ items
CREATE TABLE faq_items (
  id          BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  question    TEXT NOT NULL,
  answer      TEXT NOT NULL DEFAULT '',
  sort_order  INT NOT NULL DEFAULT 0,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 7. GALLERY ALBUMS
CREATE TABLE gallery_albums (
  id          BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  title       TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  author      TEXT,
  cover_path  TEXT,
  sort_order  INT NOT NULL DEFAULT 0,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 8. GALLERY PHOTOS
CREATE TABLE gallery_photos (
  id         BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  album_id   BIGINT NOT NULL REFERENCES gallery_albums(id) ON DELETE CASCADE,
  file_path  TEXT NOT NULL,
  sort_order INT NOT NULL DEFAULT 0
);

-- 9. FORM OPTIONS (durations, campaigns, extras)
CREATE TABLE form_options (
  id         BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  category   TEXT NOT NULL CHECK (category IN ('duration', 'campaign', 'extra')),
  name       TEXT NOT NULL,
  sort_order INT NOT NULL DEFAULT 0
);

-- 10. SITE SETTINGS (key-value for contact, about, hero_bg)
CREATE TABLE site_settings (
  key        TEXT PRIMARY KEY,
  value      JSONB NOT NULL DEFAULT '{}'::jsonb,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 11. CLICK ANALYTICS
CREATE TABLE click_analytics (
  id         BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  event_type TEXT NOT NULL CHECK (event_type IN ('call', 'whatsapp')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Pre-seed site_settings
INSERT INTO site_settings (key, value) VALUES
  ('contact', '{
    "address": "Atakent Mah. Spor Cad. No:1, Küçükçekmece / İstanbul",
    "phones": ["+90 555 555 55 55"],
    "whatsapp": "905555555555",
    "instagram": "debutfit",
    "tiktok": "debutfit",
    "map": ""
  }'::jsonb),
  ('about', '{"title": "", "desc": ""}'::jsonb),
  ('hero_bg', '{"image_path": ""}'::jsonb)
ON CONFLICT (key) DO NOTHING;

-- Seed default durations
INSERT INTO form_options (category, name, sort_order) VALUES
  ('duration', '6 Aylık Üyelik', 0),
  ('duration', '9 Aylık Üyelik', 1),
  ('duration', '1 Yıllık Üyelik', 2);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

ALTER TABLE programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE quotes ENABLE ROW LEVEL SECURITY;
ALTER TABLE trials ENABLE ROW LEVEL SECURITY;
ALTER TABLE facilities ENABLE ROW LEVEL SECURITY;
ALTER TABLE slider_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE faq_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery_albums ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery_photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE form_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE click_analytics ENABLE ROW LEVEL SECURITY;

-- PUBLIC-READABLE TABLES
CREATE POLICY "Public read" ON programs FOR SELECT USING (true);
CREATE POLICY "Public read" ON facilities FOR SELECT USING (true);
CREATE POLICY "Public read" ON slider_items FOR SELECT USING (true);
CREATE POLICY "Public read" ON faq_items FOR SELECT USING (true);
CREATE POLICY "Public read" ON gallery_albums FOR SELECT USING (true);
CREATE POLICY "Public read" ON gallery_photos FOR SELECT USING (true);
CREATE POLICY "Public read" ON form_options FOR SELECT USING (true);
CREATE POLICY "Public read" ON site_settings FOR SELECT USING (true);

-- ADMIN WRITE for public-readable tables
CREATE POLICY "Admin insert" ON programs FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Admin update" ON programs FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Admin delete" ON programs FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "Admin insert" ON facilities FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Admin update" ON facilities FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Admin delete" ON facilities FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "Admin insert" ON slider_items FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Admin update" ON slider_items FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Admin delete" ON slider_items FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "Admin insert" ON faq_items FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Admin update" ON faq_items FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Admin delete" ON faq_items FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "Admin insert" ON gallery_albums FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Admin update" ON gallery_albums FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Admin delete" ON gallery_albums FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "Admin insert" ON gallery_photos FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Admin update" ON gallery_photos FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Admin delete" ON gallery_photos FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "Admin insert" ON form_options FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Admin update" ON form_options FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Admin delete" ON form_options FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "Admin update" ON site_settings FOR UPDATE USING (auth.role() = 'authenticated');

-- FORM SUBMISSIONS (public can insert, admin can read/update/delete)
CREATE POLICY "Public insert" ON quotes FOR INSERT WITH CHECK (true);
CREATE POLICY "Admin read" ON quotes FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Admin update" ON quotes FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Admin delete" ON quotes FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "Public insert" ON trials FOR INSERT WITH CHECK (true);
CREATE POLICY "Admin read" ON trials FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Admin update" ON trials FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Admin delete" ON trials FOR DELETE USING (auth.role() = 'authenticated');

-- CLICK ANALYTICS (public can insert, admin can read/delete)
CREATE POLICY "Public insert" ON click_analytics FOR INSERT WITH CHECK (true);
CREATE POLICY "Admin read" ON click_analytics FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Admin delete" ON click_analytics FOR DELETE USING (auth.role() = 'authenticated');

-- ============================================================
-- STORAGE BUCKET
-- ============================================================
INSERT INTO storage.buckets (id, name, public)
VALUES ('media', 'media', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Public read media" ON storage.objects
  FOR SELECT USING (bucket_id = 'media');

CREATE POLICY "Admin upload media" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'media' AND auth.role() = 'authenticated');

CREATE POLICY "Admin update media" ON storage.objects
  FOR UPDATE USING (bucket_id = 'media' AND auth.role() = 'authenticated');

CREATE POLICY "Admin delete media" ON storage.objects
  FOR DELETE USING (bucket_id = 'media' AND auth.role() = 'authenticated');
