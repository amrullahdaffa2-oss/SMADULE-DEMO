'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAppStore } from '@/lib/store'
import { MOCK_USERS } from '@/lib/mock-data'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard, BookOpen, Calendar, ClipboardList,
  CheckSquare, BarChart2, Users, Trophy, Bell, UserCheck,
  ChevronLeft, ChevronRight, GraduationCap, Sparkles
} from 'lucide-react'

const navItems = {
  guru: [
    { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { href: '/materi', icon: BookOpen, label: 'Materi' },
    { href: '/jadwal', icon: Calendar, label: 'Jadwal' },
    { href: '/tugas', icon: ClipboardList, label: 'Tugas' },
    { href: '/absensi', icon: CheckSquare, label: 'Absensi' },
    { href: '/nilai', icon: BarChart2, label: 'Nilai' },
    { href: '/pengajar', icon: Users, label: 'Pengajar' },
    { href: '/leaderboard', icon: Trophy, label: 'Leaderboard' },
    { href: '/notifikasi', icon: Bell, label: 'Notifikasi' },
  ],
  murid: [
    { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { href: '/materi', icon: BookOpen, label: 'Materi' },
    { href: '/jadwal', icon: Calendar, label: 'Jadwal' },
    { href: '/tugas', icon: ClipboardList, label: 'Tugas' },
    { href: '/absensi', icon: CheckSquare, label: 'Absensi Saya' },
    { href: '/nilai', icon: BarChart2, label: 'Nilai Saya' },
    { href: '/pengajar', icon: Users, label: 'Pengajar' },
    { href: '/leaderboard', icon: Trophy, label: 'Leaderboard' },
    { href: '/notifikasi', icon: Bell, label: 'Notifikasi' },
  ],
  orangtua: [
    { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { href: '/absensi', icon: CheckSquare, label: 'Absensi Anak' },
    { href: '/nilai', icon: BarChart2, label: 'Nilai Anak' },
    { href: '/tugas', icon: ClipboardList, label: 'Tugas Anak' },
    { href: '/pengajar', icon: Users, label: 'Pengajar' },
    { href: '/notifikasi', icon: Bell, label: 'Notifikasi' },
    { href: '/orang-tua', icon: UserCheck, label: 'Laporan' },
  ],
}

export function Sidebar() {
  const pathname = usePathname()
  const { role, sidebarOpen, setSidebarOpen } = useAppStore()
  const user = MOCK_USERS[role]
  const items = navItems[role]

  return (
    <>
      {sidebarOpen && (
        <div className="fixed inset-0 z-20 bg-black/40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}
      <aside className={cn(
        'fixed lg:relative left-0 top-0 h-full z-30 flex flex-col bg-white border-r border-slate-200 transition-all duration-300 shadow-sm',
        sidebarOpen ? 'w-64' : 'w-16',
        'hidden lg:flex'
      )}>
        <div className="flex items-center px-4 h-16 border-b border-slate-100">
          <Link
            href="/"
            className="flex items-center gap-2.5 min-w-0 hover:opacity-90 transition-opacity"
            aria-label="Kembali ke halaman utama"
          >
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shrink-0">
              <GraduationCap size={16} className="text-white" />
            </div>
            {sidebarOpen && (
              <span className="font-display font-bold text-lg text-slate-900 truncate block">SMADULE</span>
            )}
          </Link>
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="ml-auto p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors">
            {sidebarOpen ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
          </button>
        </div>
        {sidebarOpen && (
          <div className="mx-3 my-3 p-3 rounded-xl bg-gradient-to-br from-indigo-50 to-violet-50 border border-indigo-100">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-400 to-violet-500 flex items-center justify-center text-white font-semibold text-xs shrink-0">
                {user.avatar}
              </div>
              <div className="min-w-0">
                <p className="font-semibold text-sm text-slate-800 truncate">{user.nama}</p>
                <p className="text-xs text-slate-500 truncate">
                  {'mapel' in user ? user.mapel : 'kelas' in user ? user.kelas : 'Orang Tua'}
                </p>
              </div>
            </div>
          </div>
        )}
        <nav className="flex-1 px-2 py-2 space-y-0.5 overflow-y-auto">
          {items.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
            return (
              <Link key={item.href} href={item.href}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 group',
                  isActive ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-200' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                )}
                title={!sidebarOpen ? item.label : undefined}
              >
                <item.icon size={18} className={cn('shrink-0', isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-600')} />
                {sidebarOpen && <span className="truncate">{item.label}</span>}
              </Link>
            )
          })}
        </nav>
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
