'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useAppStore } from '@/lib/store'
import { MOCK_MATERI } from '@/lib/mock-data'
import { formatDate, getCountdown, formatCountdown, cn } from '@/lib/utils'
import {
  BookOpen, Clock, Calendar, CheckCircle, FileText, Play, Lock,
  Search, Filter, Plus, Edit, Eye, Users, ChevronRight
} from 'lucide-react'

const statusConfig = {
  active: { label: 'Aktif', color: 'bg-emerald-100 text-emerald-700', icon: Play },
  scheduled: { label: 'Terjadwal', color: 'bg-amber-100 text-amber-700', icon: Clock },
  closed: { label: 'Selesai', color: 'bg-slate-100 text-slate-600', icon: CheckCircle },
  draft: { label: 'Draft', color: 'bg-violet-100 text-violet-700', icon: FileText },
}

export default function MateriPage() {
  const { role } = useAppStore()
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState<string>('all')

  const filteredMateri = MOCK_MATERI.filter(m => {
    const matchSearch = m.judul.toLowerCase().includes(search.toLowerCase()) ||
      m.deskripsi.toLowerCase().includes(search.toLowerCase())
    const matchStatus = filterStatus === 'all' || m.status === filterStatus
    return matchSearch && matchStatus
  })

  const activeMateri = filteredMateri.filter(m => m.status === 'active')
  const scheduledMateri = filteredMateri.filter(m => m.status === 'scheduled')
  const closedMateri = filteredMateri.filter(m => m.status === 'closed')
  const draftMateri = filteredMateri.filter(m => m.status === 'draft')

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-display text-slate-900">Materi Pembelajaran</h1>
          <p className="text-slate-500 text-sm mt-1">
            {role === 'guru' ? 'Kelola materi pembelajaran untuk kelas Anda' : 'Akses semua materi pembelajaran'}
          </p>
        </div>
        {role === 'guru' && (
          <button className="inline-flex items-center gap-2 px-4 py-2.5 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-colors shadow-sm">
            <Plus size={18} />
            <span>Buat Materi Baru</span>
          </button>
        )}
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Cari materi..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>
        <div className="flex gap-2">
          {['all', 'active', 'scheduled', 'closed', 'draft'].map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={cn(
                'px-4 py-2.5 rounded-xl text-sm font-medium transition-colors',
                filterStatus === status
                  ? 'bg-indigo-600 text-white'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              )}
            >
              {status === 'all' ? 'Semua' : statusConfig[status as keyof typeof statusConfig]?.label}
            </button>
          ))}
        </div>
      </div>

      {/* Stats Cards for Guru */}
      {role === 'guru' && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Total Materi', value: MOCK_MATERI.length, icon: BookOpen, color: 'bg-indigo-500' },
            { label: 'Aktif', value: MOCK_MATERI.filter(m => m.status === 'active').length, icon: Play, color: 'bg-emerald-500' },
            { label: 'Terjadwal', value: MOCK_MATERI.filter(m => m.status === 'scheduled').length, icon: Clock, color: 'bg-amber-500' },
            { label: 'Draft', value: MOCK_MATERI.filter(m => m.status === 'draft').length, icon: FileText, color: 'bg-violet-500' },
          ].map((stat, i) => (
            <div key={i} className="bg-white rounded-xl p-4 border border-slate-200">
              <div className={cn('w-10 h-10 rounded-lg flex items-center justify-center mb-3', stat.color)}>
                <stat.icon size={20} className="text-white" />
              </div>
              <p className="text-2xl font-bold text-slate-900 font-display">{stat.value}</p>
              <p className="text-sm text-slate-500">{stat.label}</p>
            </div>
          ))}
        </div>
      )}

      {/* Active Materi */}
      {activeMateri.length > 0 && (
        <section>
          <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
            <Play size={18} className="text-emerald-500" />
            Materi Aktif
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {activeMateri.map((materi) => (
              <MateriCard key={materi.id} materi={materi} role={role} />
            ))}
          </div>
        </section>
      )}

      {/* Scheduled Materi */}
      {scheduledMateri.length > 0 && (
        <section>
          <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
            <Clock size={18} className="text-amber-500" />
            Materi Terjadwal
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {scheduledMateri.map((materi) => (
              <MateriCard key={materi.id} materi={materi} role={role} />
            ))}
          </div>
        </section>
      )}

      {/* Closed Materi */}
      {closedMateri.length > 0 && (
        <section>
          <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
            <CheckCircle size={18} className="text-slate-400" />
            Materi Selesai
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {closedMateri.map((materi) => (
              <MateriCard key={materi.id} materi={materi} role={role} />
            ))}
          </div>
        </section>
      )}

      {/* Draft Materi (Guru only) */}
      {role === 'guru' && draftMateri.length > 0 && (
        <section>
          <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
            <FileText size={18} className="text-violet-500" />
            Draft
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {draftMateri.map((materi) => (
              <MateriCard key={materi.id} materi={materi} role={role} />
            ))}
          </div>
        </section>
      )}

      {filteredMateri.length === 0 && (
        <div className="text-center py-12 bg-white rounded-xl border border-slate-200">
          <BookOpen size={48} className="mx-auto text-slate-300 mb-4" />
          <p className="text-slate-500">Tidak ada materi ditemukan</p>
        </div>
      )}
    </div>
  )
}

function MateriCard({ materi, role }: { materi: typeof MOCK_MATERI[0], role: string }) {
  const status = statusConfig[materi.status as keyof typeof statusConfig]
  const StatusIcon = status.icon
  const countdown = materi.status === 'scheduled' ? getCountdown(materi.scheduleDate) : null

  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-md transition-shadow group">
      <div className="p-5">
        <div className="flex items-start justify-between gap-3 mb-3">
          <span className={cn('inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium', status.color)}>
            <StatusIcon size={12} />
            {status.label}
          </span>
          {role === 'guru' && (
            <button className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 opacity-0 group-hover:opacity-100 transition-all">
              <Edit size={16} />
            </button>
          )}
        </div>
        
        <h3 className="font-semibold text-slate-900 mb-2 line-clamp-2">{materi.judul}</h3>
        <p className="text-sm text-slate-500 line-clamp-2 mb-4">{materi.deskripsi}</p>

        <div className="flex items-center gap-4 text-xs text-slate-400 mb-4">
          <span className="flex items-center gap-1">
            <Calendar size={12} />
            {formatDate(materi.scheduleDate)}
          </span>
          {materi.files.length > 0 && (
            <span className="flex items-center gap-1">
              <FileText size={12} />
              {materi.files.length} file
            </span>
          )}
        </div>

        {countdown && (
          <div className="bg-amber-50 rounded-lg px-3 py-2 mb-4">
            <p className="text-xs text-amber-700 font-medium">Dimulai dalam {formatCountdown(countdown)}</p>
          </div>
        )}

        <div className="flex items-center gap-2">
          {materi.status === 'active' && (
            <Link
              href={`/materi/${materi.id}`}
              className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 transition-colors"
            >
              <Play size={16} />
              {role === 'murid' ? 'Buka Materi' : 'Lihat'}
            </Link>
          )}
          {materi.status === 'scheduled' && role === 'murid' && (
            <button
              disabled
              className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-100 text-slate-400 rounded-xl text-sm font-medium cursor-not-allowed"
            >
              <Lock size={16} />
              Belum Tersedia
            </button>
          )}
          {materi.status === 'scheduled' && role === 'guru' && (
            <Link
              href={`/materi/${materi.id}`}
              className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-amber-500 text-white rounded-xl text-sm font-medium hover:bg-amber-600 transition-colors"
            >
              <Eye size={16} />
              Preview
            </Link>
          )}
          {materi.status === 'closed' && (
            <Link
              href={`/materi/${materi.id}`}
              className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-100 text-slate-600 rounded-xl text-sm font-medium hover:bg-slate-200 transition-colors"
            >
              <Eye size={16} />
              Lihat Arsip
            </Link>
          )}
          {materi.status === 'draft' && role === 'guru' && (
            <button className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-violet-500 text-white rounded-xl text-sm font-medium hover:bg-violet-600 transition-colors">
              <Edit size={16} />
              Edit Draft
            </button>
          )}
          {role === 'guru' && materi.status === 'active' && (
            <Link
              href={`/materi/${materi.id}/absensi`}
              className="inline-flex items-center justify-center p-2.5 bg-slate-100 text-slate-600 rounded-xl hover:bg-slate-200 transition-colors"
              title="Lihat Absensi"
            >
              <Users size={16} />
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}
