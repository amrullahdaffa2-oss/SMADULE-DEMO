'use client'
import { create } from 'zustand'
import { MOCK_NOTIFIKASI, MOCK_MATERI, MOCK_DISKUSI, MOCK_ABSENSI } from './mock-data'

type Role = 'guru' | 'murid' | 'orangtua'

interface AppStore {
  role: Role
  setRole: (role: Role) => void
  notifikasi: typeof MOCK_NOTIFIKASI
  markNotifRead: (id: string) => void
  markAllRead: () => void
  absensi: typeof MOCK_ABSENSI
  markAttendance: (materiId: string, materiJudul: string) => void
  diskusi: typeof MOCK_DISKUSI
  addDiskusi: (materiId: string, konten: string, authorNama: string, authorRole: 'guru' | 'murid') => void
  upvoteDiskusi: (id: string) => void
  sidebarOpen: boolean
  setSidebarOpen: (open: boolean) => void
  muridPoin: number
  addPoin: (poin: number) => void
}

export const useAppStore = create<AppStore>((set, get) => ({
  role: 'murid',
  setRole: (role) => set({ role }),
  notifikasi: MOCK_NOTIFIKASI,
  markNotifRead: (id) => set(state => ({
    notifikasi: state.notifikasi.map(n => n.id === id ? { ...n, dibaca: true } : n)
  })),
  markAllRead: () => set(state => ({
    notifikasi: state.notifikasi.map(n => ({ ...n, dibaca: true }))
  })),
  absensi: MOCK_ABSENSI,
  markAttendance: (materiId, materiJudul) => {
    const existing = get().absensi.find(a => a.materiId === materiId && a.muridId === 'm1')
    if (!existing) {
      set(state => ({
        absensi: [...state.absensi, {
          id: `a${Date.now()}`, muridId: 'm1', muridNama: 'Daffa Rizky',
          materiId, materiJudul, waktuHadir: new Date(), durasi: 0,
          statusTugas: 'belum', completedPretest: false
        }]
      }))
    }
  },
  diskusi: MOCK_DISKUSI,
  addDiskusi: (materiId, konten, authorNama, authorRole) => set(state => ({
    diskusi: [...state.diskusi, {
      id: `d${Date.now()}`, materiId, authorId: authorRole === 'guru' ? 'g1' : 'm1',
      authorNama, authorRole, konten, upvotes: 0, isPinned: false,
      createdAt: new Date(), replies: []
    }]
  })),
  upvoteDiskusi: (id) => set(state => ({
    diskusi: state.diskusi.map(d => d.id === id ? { ...d, upvotes: d.upvotes + 1 } : d)
  })),
  sidebarOpen: true,
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  muridPoin: 420,
  addPoin: (poin) => set(state => ({ muridPoin: state.muridPoin + poin })),
}))
