'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { FormEvent, useState } from 'react'
import { useAppStore } from '@/lib/store'
import { cn } from '@/lib/utils'
import { formatRelativeTime } from '@/lib/utils'
import {
  LayoutDashboard, BookOpen, Calendar, ClipboardList,
  CheckSquare, BarChart2, Users, Trophy, Bell,
  ChevronLeft, ChevronRight, GraduationCap, Sparkles,
  Search, Menu, X, LogOut, User, Settings,
} from 'lucide-react'

const guruNavItems = [
  { href: '/guru/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/guru/materi', icon: BookOpen, label: 'Materi' },
  { href: '/guru/jadwal', icon: Calendar, label: 'Jadwal' },
  { href: '/guru/tugas', icon: ClipboardList, label: 'Tugas' },
  { href: '/guru/absensi', icon: CheckSquare, label: 'Absensi' },
  { href: '/guru/nilai', icon: BarChart2, label: 'Nilai' },
  { href: '/guru/murid', icon: Users, label: 'Murid' },
  { href: '/guru/leaderboard', icon: Trophy, label: 'Leaderboard' },
  { href: '/guru/notifikasi', icon: Bell, label: 'Notifikasi' },
]

const PAGE_TITLES: Record<string, string> = {
  '/guru/dashboard': 'Dashboard Guru',
  '/guru/materi': 'Manajemen Materi',
  '/guru/jadwal': 'Jadwal Mengajar',
  '/guru/tugas': 'Manajemen Tugas',
  '/guru/absensi': 'Data Absensi',
  '/guru/nilai': 'Data Nilai Siswa',
  '/guru/murid': 'Data Murid',
  '/guru/leaderboard': 'Leaderboard',
  '/guru/notifikasi': 'Notifikasi',
}

function GuruSidebar() {
  const pathname = usePathname()
  const { sidebarOpen, setSidebarOpen, authUser } = useAppStore()

  const initial = authUser?.name
    ? authUser.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
    : 'GR'

  return (
    <>
      {sidebarOpen && (
        <div className="fixed inset-0 z-20 bg-black/40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}
      <aside
        className={cn(
          'fixed lg:relative left-0 top-0 h-full z-30 flex flex-col bg-white border-r border-slate-200 transition-all duration-300 shadow-sm',
          sidebarOpen ? 'flex lg:flex w-64' : 'hidden lg:flex w-16',
        )}
      >
        {/* Logo */}
        <div className="flex items-center px-4 h-16 border-b border-slate-100">
          <Link href="/guru/dashboard" className="flex items-center gap-2.5 min-w-0 hover:opacity-90 transition-opacity">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shrink-0">
              <GraduationCap size={16} className="text-white" />
            </div>
            {sidebarOpen && (
              <div className="min-w-0">
                <span className="font-display font-bold text-base text-slate-900 truncate block">SMADULE</span>
                <span className="text-[10px] text-indigo-600 font-semibold uppercase tracking-wider">Portal Guru</span>
              </div>
            )}
          </Link>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="ml-auto p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
          >
            {sidebarOpen ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
          </button>
        </div>

        {/* User Card */}
        {sidebarOpen && (
          <div className="mx-3 my-3 p-3 rounded-xl bg-gradient-to-br from-indigo-50 to-violet-50 border border-indigo-100">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white font-semibold text-xs shrink-0">
                {initial}
              </div>
              <div className="min-w-0">
                <p className="font-semibold text-sm text-slate-800 truncate">{authUser?.name ?? 'Guru'}</p>
                <p className="text-xs text-indigo-600 font-medium">Tenaga Pengajar</p>
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 px-2 py-2 space-y-0.5 overflow-y-auto">
          {guruNavItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 group',
                  isActive
                    ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-200'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                )}
                title={!sidebarOpen ? item.label : undefined}
              >
                <item.icon
                  size={18}
                  className={cn('shrink-0', isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-600')}
                />
                {sidebarOpen && <span className="truncate">{item.label}</span>}
              </Link>
            )
          })}
        </nav>

        {/* AI Banner */}
        {sidebarOpen && (
          <div className="m-3 p-3 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white">
            <div className="flex items-center gap-2 mb-1">
              <Sparkles size={14} />
              <span className="text-xs font-semibold">AI Powered</span>
            </div>
            <p className="text-xs text-indigo-200">Pre-Test & Ringkasan otomatis dengan Claude AI</p>
          </div>
        )}
      </aside>
    </>
  )
}

function GuruNavbar() {
  const pathname = usePathname()
  const router = useRouter()
  const { sidebarOpen, setSidebarOpen, notifikasi, markNotifRead, markAllRead, authUser, signOutUser } = useAppStore()
  const [showNotif, setShowNotif] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const unreadCount = notifikasi.filter(n => !n.dibaca).length
  const title = PAGE_TITLES[pathname] || 'Portal Guru'

  const initial = authUser?.name
    ? authUser.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
    : 'GR'

  const handleSearchSubmit = (e: FormEvent) => {
    e.preventDefault()
    const q = searchQuery.trim()
    if (!q) return
    router.push(`/guru/materi?q=${encodeURIComponent(q)}`)
  }

  const handleLogout = async () => {
    await signOutUser()
    router.replace('/login')
  }

  return (
    <header className="sticky top-0 z-20 h-16 flex items-center px-6 bg-white/80 backdrop-blur-sm border-b border-slate-200 gap-4">
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="lg:hidden p-2 rounded-lg hover:bg-slate-100 text-slate-500"
      >
        <Menu size={20} />
      </button>
      <h1 className="font-display font-semibold text-slate-800 text-lg hidden sm:block">{title}</h1>
      <div className="flex-1" />

      {/* Search */}
      <form
        onSubmit={handleSearchSubmit}
        className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-slate-100 rounded-xl text-sm text-slate-400 hover:bg-slate-200 transition-colors w-56"
      >
        <Search size={14} />
        <input
          type="text"
          placeholder="Cari materi..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          className="flex-1 bg-transparent border-none outline-none text-xs text-slate-700 placeholder:text-slate-400"
        />
      </form>

      {/* Role badge */}
      <span className="hidden sm:inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold bg-indigo-100 text-indigo-700">
        🎓 Guru
      </span>

      {/* Notifications */}
      <div className="relative">
        <button
          onClick={() => setShowNotif(!showNotif)}
          className="relative p-2 rounded-xl hover:bg-slate-100 text-slate-500 hover:text-slate-700 transition-colors"
        >
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
                <div
                  key={n.id}
                  onClick={() => markNotifRead(n.id)}
                  className={`px-4 py-3 hover:bg-slate-50 cursor-pointer transition-colors ${!n.dibaca ? 'bg-indigo-50/40' : ''}`}
                >
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
              <Link href="/guru/notifikasi" onClick={() => setShowNotif(false)} className="text-xs text-indigo-600 font-medium hover:text-indigo-700">
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
          className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white font-semibold text-xs shrink-0 hover:shadow-md hover:shadow-indigo-300 transition-all"
        >
          {initial}
        </button>
        {showUserMenu && (
          <div className="absolute right-0 top-11 w-56 bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden z-50 animate-fadeIn">
            <div className="px-4 py-3 border-b border-slate-100">
              <p className="font-semibold text-sm text-slate-800 truncate">{authUser?.name ?? 'Guru'}</p>
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

export function GuruShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      <GuruSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <GuruNavbar />
        <main className="flex-1 overflow-y-auto">
          <div className="p-6 animate-fadeIn">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
