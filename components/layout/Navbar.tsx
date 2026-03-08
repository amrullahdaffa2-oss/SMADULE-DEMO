'use client'
import { FormEvent, useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useAppStore } from '@/lib/store'
import { formatRelativeTime } from '@/lib/utils'
import { Bell, Menu, Search, X, LogOut, User, Settings } from 'lucide-react'

const PAGE_TITLES: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/materi': 'Materi Pelajaran',
  '/jadwal': 'Jadwal Belajar',
  '/tugas': 'Tugas',
  '/absensi': 'Absensi',
  '/nilai': 'Nilai',
  '/pengajar': 'Direktori Pengajar',
  '/leaderboard': 'Leaderboard',
  '/notifikasi': 'Notifikasi',
  '/orang-tua': 'Dashboard Orang Tua',
}

const ROLE_BADGE = {
  guru: { label: '🎓 Guru', color: 'bg-indigo-100 text-indigo-700' },
  murid: { label: '📚 Murid', color: 'bg-emerald-100 text-emerald-700' },
  orangtua: { label: '👨‍👩‍👧 Orang Tua', color: 'bg-amber-100 text-amber-700' },
}

export function Navbar() {
  const pathname = usePathname()
  const router = useRouter()
  const { role, notifikasi, markNotifRead, markAllRead, setSidebarOpen, sidebarOpen, authUser, signOutUser } = useAppStore()
  const [showNotif, setShowNotif] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const unreadCount = notifikasi.filter(n => !n.dibaca).length
  const title = PAGE_TITLES[pathname] || PAGE_TITLES[`/${pathname.split('/')[1]}`] || 'SMADULE'
  const badge = ROLE_BADGE[role]
  const initial = authUser?.name
    ? authUser.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
    : '??'

  const handleLogout = async () => {
    await signOutUser()
    router.replace('/login')
  }

  const handleSearchSubmit = (e: FormEvent) => {
    e.preventDefault()
    const q = searchQuery.trim()
    if (!q) return
    router.push(`/materi?q=${encodeURIComponent(q)}`)
  }

  return (
    <header className="sticky top-0 z-20 h-16 flex items-center px-6 bg-white/80 backdrop-blur-sm border-b border-slate-200 gap-4">
      <button onClick={() => setSidebarOpen(!sidebarOpen)} className="lg:hidden p-2 rounded-lg hover:bg-slate-100 text-slate-500">
        <Menu size={20} />
      </button>
      <h1 className="font-display font-semibold text-slate-800 text-lg hidden sm:block">{title}</h1>
      <div className="flex-1" />
      <form
        onSubmit={handleSearchSubmit}
        className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-slate-100 rounded-xl text-sm text-slate-400 hover:bg-slate-200 transition-colors w-56"
      >
        <Search size={14} />
        <input
          type="text"
          placeholder="Cari materi..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1 bg-transparent border-none outline-none text-xs text-slate-700 placeholder:text-slate-400"
        />
      </form>
      <span className={`hidden sm:inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold ${badge.color}`} suppressHydrationWarning>
        {badge.label}
      </span>
      <div className="relative">
        <button onClick={() => setShowNotif(!showNotif)} className="relative p-2 rounded-xl hover:bg-slate-100 text-slate-500 hover:text-slate-700 transition-colors" suppressHydrationWarning>
          <Bell size={20} />
          {unreadCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </button>
        {showNotif && (
          <div className="absolute right-0 top-12 w-80 bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden z-50 animate-fadeIn">
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
              <h3 className="font-semibold text-slate-800">Notifikasi</h3>
              <div className="flex items-center gap-2">
                {unreadCount > 0 && (
                  <button onClick={markAllRead} className="text-xs text-indigo-600 hover:text-indigo-700 font-medium">
                    Tandai semua baca
                  </button>
                )}
                <button onClick={() => setShowNotif(false)} className="p-1 rounded hover:bg-slate-100">
                  <X size={14} className="text-slate-400" />
                </button>
              </div>
            </div>
            <div className="max-h-80 overflow-y-auto divide-y divide-slate-50">
              {notifikasi.slice(0, 7).map(n => (
                <div key={n.id} onClick={() => markNotifRead(n.id)} className={`px-4 py-3 hover:bg-slate-50 cursor-pointer transition-colors ${!n.dibaca ? 'bg-indigo-50/40' : ''}`}>
                  <div className="flex gap-2.5">
                    <span className="text-lg mt-0.5">{n.icon}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-semibold text-slate-800 truncate">{n.judul}</p>
                        {!n.dibaca && <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0" />}
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">{n.pesan}</p>
                      <p className="text-xs text-slate-400 mt-1">{formatRelativeTime(n.waktu)}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="px-4 py-2.5 border-t border-slate-100 text-center">
              <Link href="/notifikasi" onClick={() => setShowNotif(false)} className="text-xs text-indigo-600 font-medium hover:text-indigo-700">
                Lihat semua notifikasi →
              </Link>
            </div>
          </div>
        )}
      </div>
      {/* User menu */}
      <div className="relative">
        <button
          onClick={() => setShowUserMenu(!showUserMenu)}
          className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-400 to-violet-500 flex items-center justify-center text-white font-semibold text-xs shrink-0 hover:shadow-md hover:shadow-indigo-300 transition-all"
        >
          {initial}
        </button>
        {showUserMenu && (
          <div className="absolute right-0 top-11 w-56 bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden z-50 animate-fadeIn">
            <div className="px-4 py-3 border-b border-slate-100">
              <p className="font-semibold text-sm text-slate-800 truncate">{authUser?.name ?? 'Pengguna'}</p>
              <p className="text-xs text-slate-400 truncate">{authUser?.email}</p>
            </div>
            <div className="p-1">
              <button className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm text-slate-600 hover:bg-slate-50 transition-colors">
                <User size={15} className="text-slate-400" />
                Profil Saya
              </button>
              <button className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm text-slate-600 hover:bg-slate-50 transition-colors">
                <Settings size={15} className="text-slate-400" />
                Pengaturan
              </button>
              <div className="my-1 h-px bg-slate-100" />
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm text-rose-600 hover:bg-rose-50 transition-colors"
              >
                <LogOut size={15} />
                Keluar
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
