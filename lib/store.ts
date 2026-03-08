'use client'
import { create } from 'zustand'
import { type AuthUser, signOut as sbSignOut } from './auth'
import {
  getNotifikasiByMurid,
  markNotifRead as sbMarkNotifRead,
  markAllNotifRead,
  getAbsensi,
  createAbsensi,
  absensiExists,
  getDiskusiByMateri,
  createDiskusi as sbCreateDiskusi,
  upvoteDiskusi as sbUpvoteDiskusi,
  updateMuridPoin,
} from './supabase-service'

type Role = 'guru' | 'murid' | 'orangtua'

type Notifikasi = {
  id: string; muridId: string; judul: string; pesan: string
  waktu: Date; dibaca: boolean; tipe: string; icon: string
}
type Absensi = {
  id: string; muridId: string; muridNama: string; materiId: string
  materiJudul: string; waktuHadir: Date; durasi: number
  statusTugas: 'belum' | 'sudah'; completedPretest: boolean
}
type DiskusiReply = {
  id: string; materiId: string; authorId: string; authorNama: string
  authorRole: 'guru' | 'murid'; konten: string; upvotes: number
  isPinned: boolean; parentId: string | null; createdAt: Date; replies: DiskusiReply[]
}
type Diskusi = DiskusiReply

interface AppStore {
  // Auth
  authUser: AuthUser | null
  isAuthLoading: boolean
  setAuthUser: (user: AuthUser | null) => void
  signOutUser: () => Promise<void>
  // Role
  role: Role
  setRole: (role: Role) => void
  notifikasi: Notifikasi[]
  loadNotifikasi: () => Promise<void>
  markNotifRead: (id: string) => void
  markAllRead: () => void
  absensi: Absensi[]
  loadAbsensi: () => Promise<void>
  markAttendance: (materiId: string, materiJudul: string) => Promise<void>
  diskusi: Diskusi[]
  loadDiskusi: (materiId: string) => Promise<void>
  addDiskusi: (materiId: string, konten: string, authorNama: string, authorRole: 'guru' | 'murid') => Promise<void>
  upvoteDiskusi: (id: string) => Promise<void>
  sidebarOpen: boolean
  setSidebarOpen: (open: boolean) => void
  muridPoin: number
  addPoin: (poin: number) => Promise<void>
}

export const useAppStore = create<AppStore>((set, get) => ({
  // Auth
  authUser: null,
  isAuthLoading: true,
  setAuthUser: (user) => set({ authUser: user, isAuthLoading: false, role: user?.role ?? 'murid' }),
  signOutUser: async () => {
    await sbSignOut()
    set({ authUser: null, isAuthLoading: false, role: 'murid' })
  },

  role: 'murid',
  setRole: (role) => set({ role }),

  notifikasi: [],
  loadNotifikasi: async () => {
    try {
      const data = await getNotifikasiByMurid('m1')
      set({ notifikasi: data })
    } catch (e) {
      console.error('loadNotifikasi', e)
    }
  },
  markNotifRead: (id) => {
    set(state => ({ notifikasi: state.notifikasi.map(n => n.id === id ? { ...n, dibaca: true } : n) }))
    sbMarkNotifRead(id).catch(console.error)
  },
  markAllRead: () => {
    set(state => ({ notifikasi: state.notifikasi.map(n => ({ ...n, dibaca: true })) }))
    markAllNotifRead('m1').catch(console.error)
  },

  absensi: [],
  loadAbsensi: async () => {
    try {
      const data = await getAbsensi()
      set({ absensi: data })
    } catch (e) {
      console.error('loadAbsensi', e)
    }
  },
  markAttendance: async (materiId, materiJudul) => {
    try {
      const exists = await absensiExists('m1', materiId)
      if (!exists) {
        const newRecord = await createAbsensi({
          murid_id: 'm1', murid_nama: 'Daffa Rizky',
          materi_id: materiId, materi_judul: materiJudul,
        })
        set(state => ({ absensi: [newRecord, ...state.absensi] }))
      }
    } catch (e) {
      console.error('markAttendance', e)
    }
  },

  diskusi: [],
  loadDiskusi: async (materiId) => {
    try {
      const data = await getDiskusiByMateri(materiId)
      set({ diskusi: data })
    } catch (e) {
      console.error('loadDiskusi', e)
    }
  },
  addDiskusi: async (materiId, konten, authorNama, authorRole) => {
    try {
      const newPost = await sbCreateDiskusi({
        materi_id: materiId,
        author_id: authorRole === 'guru' ? 'g1' : 'm1',
        author_nama: authorNama,
        author_role: authorRole,
        konten,
      })
      set(state => ({ diskusi: [{ ...newPost, replies: [] }, ...state.diskusi] }))
    } catch (e) {
      console.error('addDiskusi', e)
    }
  },
  upvoteDiskusi: async (id) => {
    try {
      await sbUpvoteDiskusi(id)
      set(state => ({
        diskusi: state.diskusi.map(d => d.id === id ? { ...d, upvotes: d.upvotes + 1 } : d)
      }))
    } catch (e) {
      console.error('upvoteDiskusi', e)
    }
  },

  sidebarOpen: true,
  setSidebarOpen: (open) => set({ sidebarOpen: open }),

  muridPoin: 420,
  addPoin: async (poin) => {
    const next = get().muridPoin + poin
    set({ muridPoin: next })
    try {
      await updateMuridPoin('m1', next)
    } catch (e) {
      console.error('addPoin', e)
    }
  },
}))
