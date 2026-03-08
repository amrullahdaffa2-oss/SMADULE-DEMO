'use client'

import { useState, useEffect } from 'react'
import { getMurid } from '@/lib/supabase-service'
import { cn } from '@/lib/utils'
import { Users, Search, Star, Trophy, BookOpen, TrendingUp, X } from 'lucide-react'

type Murid = {
  id: string; nama: string; kelas: string; avatar: string
  poin: number; ranking: number; streak: number
  tugasSelesai: number; tugasTotal: number; kehadiran: number
}

export default function GuruMuridPage() {
  const [allMurid, setAllMurid] = useState<Murid[]>([])
  const [search, setSearch] = useState('')
  const [filterKelas, setFilterKelas] = useState('all')
  const [selected, setSelected] = useState<Murid | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getMurid()
      .then(data => setAllMurid(data as Murid[]))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const kelasList = ['all', ...Array.from(new Set(allMurid.map(m => m.kelas)))]

  const filtered = allMurid
    .filter(m => filterKelas === 'all' || m.kelas === filterKelas)
    .filter(m => !search || m.nama.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => b.poin - a.poin)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold font-display text-slate-900">Data Murid</h1>
        <p className="text-slate-500 text-sm mt-1">Kelola dan pantau perkembangan seluruh siswa</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Murid', value: allMurid.length, icon: Users, color: 'bg-indigo-500' },
          { label: 'Rata-rata Poin', value: allMurid.length ? Math.round(allMurid.reduce((s, m) => s + m.poin, 0) / allMurid.length) : 0, icon: Star, color: 'bg-amber-500' },
          { label: 'Poin Tertinggi', value: allMurid.length ? Math.max(...allMurid.map(m => m.poin)) : 0, icon: Trophy, color: 'bg-violet-500' },
          { label: 'Jumlah Kelas', value: kelasList.length - 1, icon: BookOpen, color: 'bg-emerald-500' },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="bg-white rounded-xl p-4 border border-slate-200">
            <div className={`w-10 h-10 rounded-lg ${color} flex items-center justify-center mb-3`}>
              <Icon size={20} className="text-white" />
            </div>
            <p className="text-2xl font-bold text-slate-900 font-display">{value}</p>
            <p className="text-sm text-slate-500">{label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex items-center gap-2 px-3 py-2 bg-white border border-slate-200 rounded-xl flex-1">
          <Search size={16} className="text-slate-400 shrink-0" />
          <input
            type="text"
            placeholder="Cari nama murid..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="flex-1 bg-transparent outline-none text-sm text-slate-700 placeholder:text-slate-400"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {kelasList.map(k => (
            <button
              key={k}
              onClick={() => setFilterKelas(k)}
              className={cn(
                'px-3 py-2 rounded-xl text-sm font-medium transition-colors',
                filterKelas === k
                  ? 'bg-indigo-600 text-white'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              )}
            >
              {k === 'all' ? 'Semua Kelas' : k}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
          <h2 className="font-semibold text-slate-900">Daftar Murid</h2>
          <span className="text-xs text-slate-400">{filtered.length} murid</span>
        </div>
        {loading ? (
          <div className="px-5 py-12 text-center text-slate-400 text-sm">Memuat data...</div>
        ) : filtered.length === 0 ? (
          <div className="px-5 py-12 text-center text-slate-400 text-sm">Tidak ada murid ditemukan</div>
        ) : (
          <div className="divide-y divide-slate-100">
            {filtered.map((murid, idx) => (
              <div
                key={murid.id}
                onClick={() => setSelected(murid)}
                className="px-5 py-4 flex items-center gap-4 hover:bg-slate-50 cursor-pointer transition-colors"
              >
                {/* Rank */}
                <div className={cn(
                  'w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0',
                  idx === 0 ? 'bg-amber-100 text-amber-600' :
                  idx === 1 ? 'bg-slate-100 text-slate-600' :
                  idx === 2 ? 'bg-orange-100 text-orange-600' :
                  'bg-slate-50 text-slate-400'
                )}>
                  {idx + 1}
                </div>
                {/* Avatar */}
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-400 to-violet-500 flex items-center justify-center text-white font-semibold text-sm shrink-0">
                  {murid.avatar || murid.nama.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()}
                </div>
                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-slate-900 truncate">{murid.nama}</p>
                  <p className="text-xs text-slate-500">{murid.kelas}</p>
                </div>
                {/* Poin */}
                <div className="flex items-center gap-1.5 text-amber-600 shrink-0">
                  <Star size={14} className="fill-amber-400 text-amber-400" />
                  <span className="text-sm font-semibold">{murid.poin.toLocaleString()}</span>
                </div>
                {/* Streak */}
                <div className="hidden sm:flex items-center gap-1.5 text-orange-500 shrink-0">
                  <TrendingUp size={14} />
                  <span className="text-sm font-medium">{murid.streak ?? 0}d</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Detail Panel */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden animate-fadeIn">
            <div className="bg-gradient-to-br from-indigo-500 to-violet-600 px-6 py-8 text-white relative">
              <button
                onClick={() => setSelected(null)}
                className="absolute top-4 right-4 p-1.5 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
              >
                <X size={16} />
              </button>
              <div className="w-16 h-16 rounded-full bg-white/20 border-2 border-white/40 flex items-center justify-center text-white font-bold text-xl mb-3">
                {selected.avatar || selected.nama.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()}
              </div>
              <h3 className="text-xl font-bold">{selected.nama}</h3>
              <p className="text-indigo-200 text-sm">{selected.kelas}</p>
            </div>
            <div className="p-6 grid grid-cols-2 gap-4">
              {[
                { label: 'Total Poin', value: selected.poin.toLocaleString(), icon: '⭐' },
                { label: 'Ranking', value: `#${filtered.findIndex(m => m.id === selected.id) + 1}`, icon: '🏆' },
                { label: 'Streak', value: `${selected.streak ?? 0} hari`, icon: '🔥' },
                { label: 'Kehadiran', value: `${selected.kehadiran ?? 0}%`, icon: '✅' },
                { label: 'Tugas Selesai', value: `${selected.tugasSelesai ?? 0}/${selected.tugasTotal ?? 0}`, icon: '📋' },
              ].map(({ label, value, icon }) => (
                <div key={label} className="bg-slate-50 rounded-xl p-3">
                  <p className="text-lg">{icon}</p>
                  <p className="text-lg font-bold text-slate-900 mt-1">{value}</p>
                  <p className="text-xs text-slate-500">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
