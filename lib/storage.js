const KEYS = {
  programs: 'debutPrograms',
  quotes: 'debutQuotes',
  trials: 'debutTrials',
  tesis: 'debutTesis',
  contact: 'debutContact',
  slider: 'debutSlider',
  heroBg: 'debutHeroBg',
  about: 'debutAbout',
  faq: 'debutFaq',
  galeri: 'debutGaleri',
  formDurations: 'debutFormDurations',
  formCampaigns: 'debutFormCampaigns',
  formExtras: 'debutFormExtras',
  callClicks: 'debutCallClicks',
  wpClicks: 'debutWpClicks',
};

const DEFAULT_CONTACT = {
  address: "Atakent Mah. Spor Cad. No:1, Küçükçekmece / İstanbul",
  phones: ["+90 555 555 55 55"],
  whatsapp: "905555555555",
  instagram: "debutfit",
  tiktok: "debutfit",
  map: '<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3010.158552192138!2d28.7847494!3d41.0218151!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14caa447df089849%3A0x67396a8dc5b121b6!2sAtakent%2C%20K%C3%BC%C3%A7%C3%BCk%C3%A7ekmece%2F%C4%B0stanbul!5e0!3m2!1str!2str!4v1700000000000!5m2!1str!2str" width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>'
};

const DEFAULT_DURATIONS = [
  {id: 1, name: "6 Aylık Üyelik"},
  {id: 2, name: "9 Aylık Üyelik"},
  {id: 3, name: "1 Yıllık Üyelik"}
];

export { KEYS, DEFAULT_CONTACT, DEFAULT_DURATIONS };

export function getJSON(key) {
  if (typeof window === 'undefined') return null;
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  } catch { return null; }
}

export function setJSON(key, value) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(key, JSON.stringify(value));
}

export function getInt(key) {
  if (typeof window === 'undefined') return 0;
  return parseInt(localStorage.getItem(key)) || 0;
}

export function setInt(key, value) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(key, String(value));
}

export function getString(key) {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(key);
}

export function setString(key, value) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(key, value);
}

export function getContact() {
  return getJSON(KEYS.contact) || DEFAULT_CONTACT;
}

export function getDurations() {
  return getJSON(KEYS.formDurations) || DEFAULT_DURATIONS;
}
