'use client'

import { useAppStore } from '@/lib/store'
import { formatRelativeTime, cn } from '@/lib/utils'
import {
  Bell, CheckCheck, BookOpen, ClipboardList, Award, MessageCircle,
  Trophy, CheckCircle, Clock
} from 'lucide-react'

const typeConfig: Record<string, { icon: typeof Bell; color: string }> = {
  materi: { icon: BookOpen, color: 'bg-indigo-100 text-indigo-600' },
  tugas: { icon: ClipboardList, color: 'bg-amber-100 text-amber-600' },
  nilai: { icon: Award, color: 'bg-emerald-100 text-emerald-600' },
  gamifikasi: { icon: Trophy, color: 'bg-violet-100 text-violet-600' },
  diskusi: { icon: MessageCircle, color: 'bg-rose-100 text-rose-600' },
  absensi: { icon: CheckCircle, color: 'bg-teal-100 text-teal-600' },
}

export default function NotifikasiPage() {
  const { notifikasi, markNotifRead, markAllRead } = useAppStore()

  const unreadCount = notifikasi.filter(n => !n.dibaca).length
  const sortedNotifikasi = [...notifikasi].sort((a, b) => new Date(b.waktu).getTime() - new Date(a.waktu).getTime())

  // Group by date
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)

  const todayNotifs = sortedNotifikasi.filter(n => new Date(n.waktu) >= today)
  const yesterdayNotifs = sortedNotifikasi.filter(n => {
    const date = new Date(n.waktu)
    return date >= yesterday && date < today
  })
  const olderNotifs = sortedNotifikasi.filter(n => new Date(n.waktu) < yesterday)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold font-display text-slate-900">Notifikasi</h1>
          <p className="text-slate-500 text-sm mt-1">
            {unreadCount > 0 ? `${unreadCount} notifikasi belum dibaca` : 'Semua notifikasi sudah dibaca'}
          </p>
        </div>
        {unreadCount > 0 && (
          <button
            onClick={markAllRead}
            className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
          >
            <CheckCheck size={16} />
            Tandai Semua Dibaca
          </button>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 border border-slate-200">
          <div className="w-10 h-10 rounded-lg bg-indigo-500 flex items-center justify-center mb-3">
            <Bell size={20} className="text-white" />
          </div>
          <p className="text-2xl font-bold text-slate-900 font-display">{notifikasi.length}</p>
          <p className="text-sm text-slate-500">Total Notifikasi</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-slate-200">
          <div className="w-10 h-10 rounded-lg bg-amber-500 flex items-center justify-center mb-3">
            <Clock size={20} className="text-white" />
          </div>
          <p className="text-2xl font-bold text-slate-900 font-display">{unreadCount}</p>
          <p className="text-sm text-slate-500">Belum Dibaca</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-slate-200">
          <div className="w-10 h-10 rounded-lg bg-emerald-500 flex items-center justify-center mb-3">
            <CheckCircle size={20} className="text-white" />
          </div>
          <p className="text-2xl font-bold text-slate-900 font-display">{notifikasi.length - unreadCount}</p>
          <p className="text-sm text-slate-500">Sudah Dibaca</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-slate-200">
          <div className="w-10 h-10 rounded-lg bg-violet-500 flex items-center justify-center mb-3">
            <BookOpen size={20} className="text-white" />
          </div>
          <p className="text-2xl font-bold text-slate-900 font-display">
            {notifikasi.filter(n => n.tipe === 'materi').length}
          </p>
          <p className="text-sm text-slate-500">Materi Baru</p>
        </div>
      </div>

      {/* Today's Notifications */}
      {todayNotifs.length > 0 && (
        <section className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="px-5 py-3 bg-slate-50 border-b border-slate-100">
            <h2 className="font-semibold text-slate-700 text-sm">Hari Ini</h2>
          </div>
          <div className="divide-y divide-slate-100">
            {todayNotifs.map((notif) => (
              <NotifItem key={notif.id} notif={notif} onRead={markNotifRead} />
            ))}
          </div>
        </section>
      )}

      {/* Yesterday's Notifications */}
      {yesterdayNotifs.length > 0 && (
        <section className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="px-5 py-3 bg-slate-50 border-b border-slate-100">
            <h2 className="font-semibold text-slate-700 text-sm">Kemarin</h2>
          </div>
          <div className="divide-y divide-slate-100">
            {yesterdayNotifs.map((notif) => (
              <NotifItem key={notif.id} notif={notif} onRead={markNotifRead} />
            ))}
          </div>
        </section>
      )}

      {/* Older Notifications */}
      {olderNotifs.length > 0 && (
        <section className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="px-5 py-3 bg-slate-50 border-b border-slate-100">
            <h2 className="font-semibold text-slate-700 text-sm">Sebelumnya</h2>
          </div>
          <div className="divide-y divide-slate-100">
            {olderNotifs.map((notif) => (
              <NotifItem key={notif.id} notif={notif} onRead={markNotifRead} />
            ))}
          </div>
        </section>
      )}

      {notifikasi.length === 0 && (
        <div className="text-center py-12 bg-white rounded-xl border border-slate-200">
          <Bell size={48} className="mx-auto text-slate-300 mb-4" />
          <p className="text-slate-500">Belum ada notifikasi</p>
        </div>
      )}
    </div>
  )
}

function NotifItem({ notif, onRead }: { notif: any; onRead: (id: string) => void }) {
  const config = typeConfig[notif.tipe] || { icon: Bell, color: 'bg-slate-100 text-slate-600' }
  const Icon = config.icon

  return (
    <div
      className={cn(
        'px-5 py-4 flex items-start gap-4 cursor-pointer transition-colors hover:bg-slate-50',
        !notif.dibaca && 'bg-indigo-50/50'
      )}
      onClick={() => !notif.dibaca && onRead(notif.id)}
    >
      {/* Icon */}
      <div className={cn('w-10 h-10 rounded-lg flex items-center justify-center shrink-0', config.color)}>
        <span className="text-lg">{notif.icon}</span>
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <p className={cn(
            'font-medium',
            !notif.dibaca ? 'text-slate-900' : 'text-slate-600'
          )}>
            {notif.judul}
          </p>
          {!notif.dibaca && (
            <span className="w-2 h-2 rounded-full bg-indigo-500 shrink-0 mt-2" />
          )}
        </div>
        <p className="text-sm text-slate-500 mt-0.5">{notif.pesan}</p>
        <p className="text-xs text-slate-400 mt-2">{formatRelativeTime(notif.waktu)}</p>
      </div>
    </div>
  )
}
