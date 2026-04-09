import { createClient } from './supabase-client'

// ─── HELPERS ────────────────────────────────────────────────

function supabase() {
  return createClient()
}

export function getPublicUrl(path) {
  if (!path) return ''
  const { data } = supabase().storage.from('media').getPublicUrl(path)
  return data.publicUrl
}

export async function uploadMedia(folder, file) {
  const ext = file.name?.split('.').pop() || 'jpg'
  const path = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2, 6)}.${ext}`
  const { error } = await supabase().storage.from('media').upload(path, file)
  if (error) throw error
  return path
}

export async function uploadMediaBlob(folder, blob, ext = 'jpg') {
  const path = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2, 6)}.${ext}`
  const { error } = await supabase().storage.from('media').upload(path, blob, { contentType: blob.type || `image/${ext}` })
  if (error) throw error
  return path
}

export async function deleteMedia(path) {
  if (!path) return
  const { error } = await supabase().storage.from('media').remove([path])
  if (error) console.error('deleteMedia error:', error)
}

// ─── PROGRAMS ───────────────────────────────────────────────

export async function getPrograms() {
  const { data, error } = await supabase().from('programs').select('*').order('sort_order')
  if (error) throw error
  return data || []
}

export async function upsertProgram({ id, name, description, image_path, sort_order }) {
  if (id) {
    const { error } = await supabase().from('programs').update({ name, description, image_path }).eq('id', id)
    if (error) throw error
  } else {
    const { error } = await supabase().from('programs').insert({ name, description, image_path, sort_order: sort_order ?? 0 })
    if (error) throw error
  }
}

export async function deleteProgram(id) {
  const { error } = await supabase().from('programs').delete().eq('id', id)
  if (error) throw error
}

// ─── QUOTES ─────────────────────────────────────────────────

export async function getQuotes() {
  const { data, error } = await supabase().from('quotes').select('*').order('created_at', { ascending: false })
  if (error) throw error
  return data || []
}

export async function insertQuote({ name, age, gender, phone, duration, campaign, extras }) {
  const { error } = await supabase().from('quotes').insert({
    name, age: age ? parseInt(age) : null, gender, phone, duration, campaign,
    extras: Array.isArray(extras) ? extras : (extras ? extras.split(', ').filter(Boolean) : [])
  })
  if (error) throw error
}

export async function updateQuoteStatus(id, handledBy) {
  const { error } = await supabase().from('quotes').update({ status: 'called', handled_by: handledBy }).eq('id', id)
  if (error) throw error
}

export async function deleteQuote(id) {
  const { error } = await supabase().from('quotes').delete().eq('id', id)
  if (error) throw error
}

// ─── TRIALS ─────────────────────────────────────────────────

export async function getTrials() {
  const { data, error } = await supabase().from('trials').select('*').order('request_date', { ascending: false })
  if (error) throw error
  return data || []
}

export async function insertTrial({ name, gender, phone, trial_date }) {
  const { error } = await supabase().from('trials').insert({ name, gender, phone, trial_date })
  if (error) throw error
}

export async function updateTrialStatus(id, handledBy) {
  const { error } = await supabase().from('trials').update({ status: 'called', handled_by: handledBy }).eq('id', id)
  if (error) throw error
}

export async function deleteTrial(id) {
  const { error } = await supabase().from('trials').delete().eq('id', id)
  if (error) throw error
}

// ─── FACILITIES ─────────────────────────────────────────────

export async function getFacilities() {
  const { data, error } = await supabase().from('facilities').select('*').order('sort_order')
  if (error) throw error
  return data || []
}

export async function upsertFacility({ id, title, description, image_path }) {
  if (id) {
    const { error } = await supabase().from('facilities').update({ title, description, image_path }).eq('id', id)
    if (error) throw error
  } else {
    const { error } = await supabase().from('facilities').insert({ title, description, image_path, sort_order: 0 })
    if (error) throw error
  }
}

export async function deleteFacility(id) {
  const { error } = await supabase().from('facilities').delete().eq('id', id)
  if (error) throw error
}

// ─── SLIDER ─────────────────────────────────────────────────

export async function getSliderItems() {
  const { data, error } = await supabase().from('slider_items').select('*').order('sort_order')
  if (error) throw error
  return data || []
}

export async function insertSliderItem({ media_type, file_path }) {
  const { error } = await supabase().from('slider_items').insert({ media_type, file_path, sort_order: 0 })
  if (error) throw error
}

export async function deleteSliderItem(id) {
  const { error } = await supabase().from('slider_items').delete().eq('id', id)
  if (error) throw error
}

// ─── FAQ ────────────────────────────────────────────────────

export async function getFaqItems() {
  const { data, error } = await supabase().from('faq_items').select('*').order('sort_order')
  if (error) throw error
  return data || []
}

export async function upsertFaqItem({ id, question, answer }) {
  if (id) {
    const { error } = await supabase().from('faq_items').update({ question, answer }).eq('id', id)
    if (error) throw error
  } else {
    const { error } = await supabase().from('faq_items').insert({ question, answer, sort_order: 0 })
    if (error) throw error
  }
}

export async function deleteFaqItem(id) {
  const { error } = await supabase().from('faq_items').delete().eq('id', id)
  if (error) throw error
}

// ─── GALLERY ────────────────────────────────────────────────

export async function getAlbums() {
  const { data, error } = await supabase().from('gallery_albums').select('*, gallery_photos(id, file_path, sort_order)').order('sort_order')
  if (error) throw error
  return data || []
}

export async function upsertAlbum({ id, title, description, author, cover_path }) {
  if (id) {
    const { error } = await supabase().from('gallery_albums').update({ title, description, author, cover_path }).eq('id', id)
    if (error) throw error
    return id
  } else {
    const { data, error } = await supabase().from('gallery_albums').insert({ title, description, author, cover_path, sort_order: 0 }).select('id').single()
    if (error) throw error
    return data.id
  }
}

export async function deleteAlbum(id) {
  const { error } = await supabase().from('gallery_albums').delete().eq('id', id)
  if (error) throw error
}

export async function addAlbumPhoto(albumId, filePath) {
  const { error } = await supabase().from('gallery_photos').insert({ album_id: albumId, file_path: filePath, sort_order: 0 })
  if (error) throw error
}

export async function deleteAlbumPhoto(photoId) {
  const { error } = await supabase().from('gallery_photos').delete().eq('id', photoId)
  if (error) throw error
}

// ─── FORM OPTIONS ───────────────────────────────────────────

export async function getFormOptions(category) {
  const { data, error } = await supabase().from('form_options').select('*').eq('category', category).order('sort_order')
  if (error) throw error
  return data || []
}

export async function addFormOption(category, name) {
  const { error } = await supabase().from('form_options').insert({ category, name, sort_order: 0 })
  if (error) throw error
}

export async function deleteFormOption(id) {
  const { error } = await supabase().from('form_options').delete().eq('id', id)
  if (error) throw error
}

export async function reorderFormOptions(ids) {
  for (let i = 0; i < ids.length; i++) {
    await supabase().from('form_options').update({ sort_order: i }).eq('id', ids[i])
  }
}

// ─── SITE SETTINGS ──────────────────────────────────────────

export async function getSiteSetting(key) {
  const { data, error } = await supabase().from('site_settings').select('value').eq('key', key).maybeSingle()
  if (error) throw error
  return data?.value || {}
}

export async function updateSiteSetting(key, value) {
  const { error } = await supabase().from('site_settings').update({ value, updated_at: new Date().toISOString() }).eq('key', key)
  if (error) throw error
}

// ─── CLICK ANALYTICS ────────────────────────────────────────

export async function trackClick(eventType) {
  const { error } = await supabase().from('click_analytics').insert({ event_type: eventType })
  if (error) console.error('trackClick error:', error)
}

export async function getClickCounts() {
  const { count: calls } = await supabase().from('click_analytics').select('*', { count: 'exact', head: true }).eq('event_type', 'call')
  const { count: whatsapp } = await supabase().from('click_analytics').select('*', { count: 'exact', head: true }).eq('event_type', 'whatsapp')
  return { calls: calls || 0, whatsapp: whatsapp || 0 }
}
