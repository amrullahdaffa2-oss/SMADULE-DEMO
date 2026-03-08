import { supabase } from './supabase'

// ============================================================
// PENGAJAR
// ============================================================
export async function getPengajar() {
  const { data, error } = await supabase.from('pengajar').select('*').order('nama')
  if (error) throw error
  return data ?? []
}

// ============================================================
// MURID
// ============================================================
export async function getMurid() {
  const { data, error } = await supabase.from('murid').select('*').order('ranking')
  if (error) throw error
  return data ?? []
}

export async function getMuridById(id: string) {
  const { data, error } = await supabase.from('murid').select('*').eq('id', id).single()
  if (error) throw error
  return data
}

export async function updateMuridPoin(id: string, poin: number) {
  const { data, error } = await supabase.from('murid').update({ poin }).eq('id', id).select().single()
  if (error) throw error
  return data
}

// ============================================================
// MATERI
// ============================================================
export async function getMateri() {
  const { data, error } = await supabase.from('materi').select('*').order('created_at', { ascending: false })
  if (error) throw error
  return (data ?? []).map(normalizeMateri)
}

export async function getMateriById(id: string) {
  const { data, error } = await supabase.from('materi').select('*').eq('id', id).single()
  if (error) throw error
  return normalizeMateri(data)
}

export async function createMateri(payload: {
  id?: string
  judul: string
  deskripsi: string
  konten: string
  mapel: string
  kelas: string
  guru: string
  schedule_date: string
  end_date: string
  status: string
  files: string[]
}) {
  const { data, error } = await supabase.from('materi').insert(payload).select().single()
  if (error) throw error
  return normalizeMateri(data)
}

export async function updateMateri(id: string, payload: Partial<{
  judul: string
  deskripsi: string
  konten: string
  status: string
  schedule_date: string
  end_date: string
  files: string[]
}>) {
  const { data, error } = await supabase.from('materi').update(payload).eq('id', id).select().single()
  if (error) throw error
  return normalizeMateri(data)
}

// ============================================================
// TUGAS
// ============================================================
export async function getTugas() {
  const { data, error } = await supabase.from('tugas').select('*').order('deadline')
  if (error) throw error
  return (data ?? []).map(normalizeTugas)
}

export async function getTugasByMateriId(materiId: string) {
  const { data, error } = await supabase.from('tugas').select('*').eq('materi_id', materiId).order('deadline')
  if (error) throw error
  return (data ?? []).map(normalizeTugas)
}

export async function markTugasKumpul(id: string) {
  const { data, error } = await supabase.from('tugas').update({ sudah_kumpul: true }).eq('id', id).select().single()
  if (error) throw error
  return normalizeTugas(data)
}

// ============================================================
// NILAI
// ============================================================
export async function getNilaiByMurid(muridId: string) {
  const { data, error } = await supabase.from('nilai').select('*').eq('murid_id', muridId).order('dinilai_pada', { ascending: false })
  if (error) throw error
  return (data ?? []).map(normalizeNilai)
}

export async function getAllNilai() {
  const { data, error } = await supabase.from('nilai').select('*').order('dinilai_pada', { ascending: false })
  if (error) throw error
  return (data ?? []).map(normalizeNilai)
}

export async function createNilai(payload: {
  murid_id: string
  murid_nama: string
  materi_id: string
  tipe: string
  nilai_angka: number
  nilai_huruf: string
  feedback: string
  dinilai_pada: string
}) {
  const { data, error } = await supabase.from('nilai').insert(payload).select().single()
  if (error) throw error
  return normalizeNilai(data)
}

// ============================================================
// ABSENSI
// ============================================================
export async function getAbsensi() {
  const { data, error } = await supabase.from('absensi').select('*').order('waktu_hadir', { ascending: false })
  if (error) throw error
  return (data ?? []).map(normalizeAbsensi)
}

export async function getAbsensiByMurid(muridId: string) {
  const { data, error } = await supabase.from('absensi').select('*').eq('murid_id', muridId).order('waktu_hadir', { ascending: false })
  if (error) throw error
  return (data ?? []).map(normalizeAbsensi)
}

export async function createAbsensi(payload: {
  murid_id: string
  murid_nama: string
  materi_id: string
  materi_judul: string
  durasi?: number
  status_tugas?: string
  completed_pretest?: boolean
}) {
  const { data, error } = await supabase.from('absensi').insert({
    id: `a${Date.now()}`,
    waktu_hadir: new Date().toISOString(),
    durasi: 0,
    status_tugas: 'belum',
    completed_pretest: false,
    ...payload,
  }).select().single()
  if (error) throw error
  return normalizeAbsensi(data)
}

export async function absensiExists(muridId: string, materiId: string) {
  const { data, error } = await supabase
    .from('absensi')
    .select('id')
    .eq('murid_id', muridId)
    .eq('materi_id', materiId)
    .maybeSingle()
  if (error) throw error
  return data !== null
}

// ============================================================
// DISKUSI
// ============================================================
export async function getDiskusiByMateri(materiId: string) {
  const { data, error } = await supabase
    .from('diskusi')
    .select('*')
    .eq('materi_id', materiId)
    .is('parent_id', null)
    .order('is_pinned', { ascending: false })
    .order('created_at', { ascending: false })
  if (error) throw error

  const threads = data ?? []
  // Fetch replies for each thread
  const withReplies = await Promise.all(
    threads.map(async (thread) => {
      const { data: replies } = await supabase
        .from('diskusi')
        .select('*')
        .eq('parent_id', thread.id)
        .order('created_at')
      return { ...normalizeDiskusi(thread), replies: (replies ?? []).map(r => normalizeDiskusi(r)) }
    })
  )
  return withReplies
}

export async function createDiskusi(payload: {
  materi_id: string
  author_id: string
  author_nama: string
  author_role: string
  konten: string
  parent_id?: string | null
}) {
  const { data, error } = await supabase.from('diskusi').insert({
    id: `d${Date.now()}`,
    upvotes: 0,
    is_pinned: false,
    parent_id: null,
    ...payload,
  }).select().single()
  if (error) throw error
  return normalizeDiskusi(data)
}

export async function upvoteDiskusi(id: string) {
  const { data: current } = await supabase.from('diskusi').select('upvotes').eq('id', id).single()
  const { data, error } = await supabase
    .from('diskusi')
    .update({ upvotes: (current?.upvotes ?? 0) + 1 })
    .eq('id', id)
    .select()
    .single()
  if (error) throw error
  return normalizeDiskusi(data)
}

// ============================================================
// NOTIFIKASI
// ============================================================
export async function getNotifikasiByMurid(muridId: string) {
  const { data, error } = await supabase
    .from('notifikasi')
    .select('*')
    .eq('murid_id', muridId)
    .order('waktu', { ascending: false })
  if (error) throw error
  return (data ?? []).map(normalizeNotifikasi)
}

export async function markNotifRead(id: string) {
  const { error } = await supabase.from('notifikasi').update({ dibaca: true }).eq('id', id)
  if (error) throw error
}

export async function markAllNotifRead(muridId: string) {
  const { error } = await supabase.from('notifikasi').update({ dibaca: true }).eq('murid_id', muridId)
  if (error) throw error
}

// ============================================================
// NORMALIZERS — convert snake_case DB rows to camelCase app types
// ============================================================
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function normalizeMateri(row: any) {
  return {
    id: row.id,
    judul: row.judul,
    deskripsi: row.deskripsi,
    konten: row.konten,
    mapel: row.mapel,
    kelas: row.kelas,
    guru: row.guru,
    scheduleDate: new Date(row.schedule_date),
    endDate: new Date(row.end_date),
    status: row.status as 'active' | 'scheduled' | 'closed' | 'draft',
    files: row.files ?? [],
    createdAt: new Date(row.created_at),
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function normalizeTugas(row: any) {
  return {
    id: row.id,
    judul: row.judul,
    materiId: row.materi_id,
    deskripsi: row.deskripsi,
    deadline: new Date(row.deadline),
    nilaiMaks: row.nilai_maks,
    sudahKumpul: row.sudah_kumpul,
    tipe: row.tipe as 'essay' | 'quiz' | 'proyek' | 'ulangan',
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function normalizeNilai(row: any) {
  return {
    id: row.id,
    muridId: row.murid_id,
    muridNama: row.murid_nama,
    materiId: row.materi_id,
    tipe: row.tipe as 'pretest' | 'tugas' | 'ulangan',
    nilaiAngka: row.nilai_angka,
    nilaiHuruf: row.nilai_huruf,
    feedback: row.feedback,
    dinilaiPada: new Date(row.dinilai_pada),
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function normalizeAbsensi(row: any) {
  return {
    id: row.id,
    muridId: row.murid_id,
    muridNama: row.murid_nama,
    materiId: row.materi_id,
    materiJudul: row.materi_judul,
    waktuHadir: new Date(row.waktu_hadir),
    durasi: row.durasi,
    statusTugas: row.status_tugas as 'belum' | 'sudah',
    completedPretest: row.completed_pretest,
  }
}

type DiskusiItem = {
  id: string
  materiId: string
  authorId: string
  authorNama: string
  authorRole: 'guru' | 'murid'
  konten: string
  upvotes: number
  isPinned: boolean
  parentId: string | null
  createdAt: Date
  replies: DiskusiItem[]
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function normalizeDiskusi(row: any): DiskusiItem {
  return {
    id: row.id,
    materiId: row.materi_id,
    authorId: row.author_id,
    authorNama: row.author_nama,
    authorRole: row.author_role as 'guru' | 'murid',
    konten: row.konten,
    upvotes: row.upvotes,
    isPinned: row.is_pinned,
    parentId: row.parent_id,
    createdAt: new Date(row.created_at),
    replies: [],
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function normalizeNotifikasi(row: any) {
  return {
    id: row.id,
    muridId: row.murid_id,
    judul: row.judul,
    pesan: row.pesan,
    waktu: new Date(row.waktu),
    dibaca: row.dibaca,
    tipe: row.tipe as 'materi' | 'tugas' | 'nilai' | 'absensi' | 'diskusi' | 'gamifikasi',
    icon: row.icon,
  }
}
