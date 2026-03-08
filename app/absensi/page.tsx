'use client'

import { useState } from 'react'
import { useAppStore } from '@/lib/store'
import { MOCK_ABSENSI, MOCK_MATERI, MOCK_MURID, ATTENDANCE_WEEKLY } from '@/lib/mock-data'
import { formatDate, formatDateTime, cn } from '@/lib/utils'
import {
  CheckCircle, XCircle, Clock, Calendar, Users, TrendingUp,
  Search, Filter, Download, ChevronDown
} from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'

export default function AbsensiPage() {
  const { role, absensi } = useAppStore()
  const [selectedMateri, setSelectedMateri] = useState<string>('all')
  const [search, setSearch] = useState('')

  // For murid: filter to only their attendance (m1)
  const myAbsensi = role === 'murid'
    ? absensi.filter(a => a.muridId === 'm1')
    : absensi

  // Stats calculation
  const totalMateriAktif = MOCK_MATERI.filter(m => m.status === 'active' || m.status === 'closed').length
  const hadirCount = myAbsensi.length
  const kehadiranPersen = totalMateriAktif > 0 ? Math.round((hadirCount / totalMateriAktif) * 100) : 0

  // Filter for guru view
  const filteredAbsensi = selectedMateri === 'all'
    ? absensi
    : absensi.filter(a => a.materiId === selectedMateri)

  const searchedAbsensi = search
    ? filteredAbsensi.filter(a => a.muridNama.toLowerCase().includes(search.toLowerCase()))
    : filteredAbsensi

  // Group by materi for guru
  const absensiByMateri = MOCK_MATERI.filter(m => m.status === 'active' || m.status === 'closed').map(materi => {
    const absensiMateri = absensi.filter(a => a.materiId === materi.id)
    return {
      ...materi,
      totalHadir: absensiMateri.length,
      totalMurid: MOCK_MURID.length,
      persenHadir: Math.round((absensiMateri.length / MOCK_MURID.length) * 100)
    }
  })

  if (role === 'murid') {
    return (
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold font-display text-slate-900">Absensi Saya</h1>
          <p className="text-slate-500 text-sm mt-1">Riwayat kehadiran Anda pada setiap materi</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl p-4 border border-slate-200">
            <div className="w-10 h-10 rounded-lg bg-emerald-500 flex items-center justify-center mb-3">
              <CheckCircle size={20} className="text-white" />
            </div>
            <p className="text-2xl font-bold text-slate-900 font-display">{hadirCount}</p>
            <p className="text-sm text-slate-500">Total Hadir</p>
          </div>
          <div className="bg-white rounded-xl p-4 border border-slate-200">
            <div className="w-10 h-10 rounded-lg bg-indigo-500 flex items-center justify-center mb-3">
              <Calendar size={20} className="text-white" />
            </div>
            <p className="text-2xl font-bold text-slate-900 font-display">{totalMateriAktif}</p>
            <p className="text-sm text-slate-500">Total Materi</p>
          </div>
          <div className="bg-white rounded-xl p-4 border border-slate-200">
            <div className="w-10 h-10 rounded-lg bg-amber-500 flex items-center justify-center mb-3">
              <TrendingUp size={20} className="text-white" />
            </div>
            <p className="text-2xl font-bold text-slate-900 font-display">{kehadiranPersen}%</p>
            <p className="text-sm text-slate-500">Tingkat Kehadiran</p>
          </div>
          <div className="bg-white rounded-xl p-4 border border-slate-200">
            <div className="w-10 h-10 rounded-lg bg-violet-500 flex items-center justify-center mb-3">
              <Clock size={20} className="text-white" />
            </div>
            <p className="text-2xl font-bold text-slate-900 font-display">
              {myAbsensi.reduce((acc, a) => acc + (a.durasi || 0), 0)} menit
            </p>
            <p className="text-sm text-slate-500">Total Waktu Belajar</p>
          </div>
        </div>

        {/* Weekly Chart */}
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <h2 className="font-semibold text-slate-900 mb-4">Kehadiran Mingguan</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={ATTENDANCE_WEEKLY}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="minggu" tick={{ fontSize: 12 }} stroke="#64748b" />
                <YAxis tick={{ fontSize: 12 }} stroke="#64748b" />
                <Tooltip
                  contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0' }}
                />
                <Legend />
                <Bar dataKey="hadir" name="Hadir" fill="#10B981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="absen" name="Tidak Hadir" fill="#EF4444" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Attendance History */}
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100">
            <h2 className="font-semibold text-slate-900">Riwayat Kehadiran</h2>
          </div>
          <div className="divide-y divide-slate-100">
            {myAbsensi.length > 0 ? myAbsensi.map((item) => (
              <div key={item.id} className="px-5 py-4 flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
                  <CheckCircle size={20} className="text-emerald-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-slate-900 truncate">{item.materiJudul}</p>
                  <p className="text-sm text-slate-500">{formatDateTime(item.waktuHadir)}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-slate-900">{item.durasi} menit</p>
                  <p className="text-xs text-slate-500">durasi belajar</p>
                </div>
                <div className={cn(
                  'px-2.5 py-1 rounded-full text-xs font-medium',
                  item.completedPretest ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                )}>
                  {item.completedPretest ? 'Pre-test Selesai' : 'Belum Pre-test'}
                </div>
              </div>
            )) : (
              <div className="px-5 py-12 text-center text-slate-500">
                Belum ada riwayat kehadiran
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  // Guru & Orangtua View
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-display text-slate-900">
            {role === 'guru' ? 'Data Absensi' : 'Absensi Anak'}
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            {role === 'guru' ? 'Kelola kehadiran siswa pada setiap materi' : 'Pantau kehadiran anak Anda'}
          </p>
        </div>
        {role === 'guru' && (
          <button className="inline-flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors">
            <Download size={18} />
            <span>Export Data</span>
          </button>
        )}
      </div>

      {/* Stats for Guru */}
      {role === 'guru' && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl p-4 border border-slate-200">
            <div className="w-10 h-10 rounded-lg bg-indigo-500 flex items-center justify-center mb-3">
              <Users size={20} className="text-white" />
            </div>
            <p className="text-2xl font-bold text-slate-900 font-display">{MOCK_MURID.length}</p>
            <p className="text-sm text-slate-500">Total Murid</p>
          </div>
          <div className="bg-white rounded-xl p-4 border border-slate-200">
            <div className="w-10 h-10 rounded-lg bg-emerald-500 flex items-center justify-center mb-3">
              <CheckCircle size={20} className="text-white" />
            </div>
            <p className="text-2xl font-bold text-slate-900 font-display">{absensi.length}</p>
            <p className="text-sm text-slate-500">Total Kehadiran</p>
          </div>
          <div className="bg-white rounded-xl p-4 border border-slate-200">
            <div className="w-10 h-10 rounded-lg bg-amber-500 flex items-center justify-center mb-3">
              <Calendar size={20} className="text-white" />
            </div>
            <p className="text-2xl font-bold text-slate-900 font-display">
              {MOCK_MATERI.filter(m => m.status === 'active').length}
            </p>
            <p className="text-sm text-slate-500">Materi Aktif</p>
          </div>
          <div className="bg-white rounded-xl p-4 border border-slate-200">
            <div className="w-10 h-10 rounded-lg bg-violet-500 flex items-center justify-center mb-3">
              <TrendingUp size={20} className="text-white" />
            </div>
            <p className="text-2xl font-bold text-slate-900 font-display">
              {Math.round((absensi.length / (MOCK_MURID.length * MOCK_MATERI.filter(m => m.status === 'active' || m.status === 'closed').length || 1)) * 100)}%
            </p>
            <p className="text-sm text-slate-500">Rata-rata Kehadiran</p>
          </div>
        </div>
      )}

      {/* Filter & Search for Guru */}
      {role === 'guru' && (
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Cari nama murid..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
          <select
            value={selectedMateri}
            onChange={(e) => setSelectedMateri(e.target.value)}
            className="px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="all">Semua Materi</option>
            {MOCK_MATERI.filter(m => m.status === 'active' || m.status === 'closed').map(m => (
              <option key={m.id} value={m.id}>{m.judul}</option>
            ))}
          </select>
        </div>
      )}

      {/* Absensi by Materi Overview */}
      {role === 'guru' && (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {absensiByMateri.map((materi) => (
            <div key={materi.id} className="bg-white rounded-xl border border-slate-200 p-5">
              <h3 className="font-semibold text-slate-900 mb-2 line-clamp-1">{materi.judul}</h3>
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-slate-500">{materi.totalHadir}/{materi.totalMurid} hadir</span>
                <span className={cn(
                  'text-sm font-semibold',
                  materi.persenHadir >= 80 ? 'text-emerald-600' :
                  materi.persenHadir >= 60 ? 'text-amber-600' : 'text-red-600'
                )}>{materi.persenHadir}%</span>
              </div>
              <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className={cn(
                    'h-full rounded-full transition-all',
                    materi.persenHadir >= 80 ? 'bg-emerald-500' :
                    materi.persenHadir >= 60 ? 'bg-amber-500' : 'bg-red-500'
                  )}
                  style={{ width: `${materi.persenHadir}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Detailed Table for Guru */}
      {role === 'guru' && (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100">
            <h2 className="font-semibold text-slate-900">Detail Kehadiran</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Murid</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Materi</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Waktu Hadir</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Durasi</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Pre-test</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Tugas</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {searchedAbsensi.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-xs font-semibold text-indigo-600">
                          {item.muridNama.split(' ').map(n => n[0]).join('').slice(0, 2)}
                        </div>
                        <span className="font-medium text-slate-900">{item.muridNama}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-sm text-slate-600">{item.materiJudul}</td>
                    <td className="px-5 py-4 text-sm text-slate-600">{formatDateTime(item.waktuHadir)}</td>
                    <td className="px-5 py-4 text-sm text-slate-600">{item.durasi} menit</td>
                    <td className="px-5 py-4">
                      <span className={cn(
                        'px-2 py-1 rounded-full text-xs font-medium',
                        item.completedPretest ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'
                      )}>
                        {item.completedPretest ? 'Selesai' : 'Belum'}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span className={cn(
                        'px-2 py-1 rounded-full text-xs font-medium',
                        item.statusTugas === 'sudah' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                      )}>
                        {item.statusTugas === 'sudah' ? 'Dikumpulkan' : 'Belum'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Orangtua View - Show child's attendance */}
      {role === 'orangtua' && (
        <>
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
            <p className="text-amber-800 text-sm">
              Anda sedang melihat data kehadiran <strong>Daffa Rizky</strong> (XI IPA 2)
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: 'Total Hadir', value: myAbsensi.length, icon: CheckCircle, color: 'bg-emerald-500' },
              { label: 'Total Materi', value: totalMateriAktif, icon: Calendar, color: 'bg-indigo-500' },
              { label: 'Kehadiran', value: `${kehadiranPersen}%`, icon: TrendingUp, color: 'bg-amber-500' },
              { label: 'Waktu Belajar', value: `${myAbsensi.reduce((acc, a) => acc + (a.durasi || 0), 0)}m`, icon: Clock, color: 'bg-violet-500' },
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

          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <h2 className="font-semibold text-slate-900 mb-4">Kehadiran Mingguan</h2>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={ATTENDANCE_WEEKLY}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="minggu" tick={{ fontSize: 12 }} stroke="#64748b" />
                  <YAxis tick={{ fontSize: 12 }} stroke="#64748b" />
                  <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0' }} />
                  <Legend />
                  <Bar dataKey="hadir" name="Hadir" fill="#10B981" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="absen" name="Tidak Hadir" fill="#EF4444" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100">
              <h2 className="font-semibold text-slate-900">Riwayat Kehadiran Anak</h2>
            </div>
            <div className="divide-y divide-slate-100">
              {myAbsensi.map((item) => (
                <div key={item.id} className="px-5 py-4 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
                    <CheckCircle size={20} className="text-emerald-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-slate-900 truncate">{item.materiJudul}</p>
                    <p className="text-sm text-slate-500">{formatDateTime(item.waktuHadir)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-slate-900">{item.durasi} menit</p>
                    <p className="text-xs text-slate-500">durasi</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
