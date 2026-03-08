'use client'

import { useState, useEffect } from 'react'
import { useAppStore } from '@/lib/store'
import { getNilaiByMurid, getAllNilai, getMateri } from '@/lib/supabase-service'
import { GRADE_DATA_MURID } from '@/lib/mock-data'
import { formatDate, nilaiToHuruf, cn } from '@/lib/utils'
import {
  BarChart2, TrendingUp, Award, BookOpen, Search, Download,
  ChevronDown, Edit2, Check, X
} from 'lucide-react'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar
} from 'recharts'

const radarData = [
  { subject: 'Matematika', value: 85, fullMark: 100 },
  { subject: 'Fisika', value: 78, fullMark: 100 },
  { subject: 'Kimia', value: 82, fullMark: 100 },
  { subject: 'Biologi', value: 88, fullMark: 100 },
  { subject: 'B. Indonesia', value: 90, fullMark: 100 },
  { subject: 'B. Inggris', value: 85, fullMark: 100 },
]

export default function NilaiPage() {
  const { role } = useAppStore()
  const [search, setSearch] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editValue, setEditValue] = useState<number>(0)
  const [myNilai, setMyNilai] = useState<{
    id: string; muridId: string; muridNama: string; materiId: string
    tipe: string; nilaiAngka: number; nilaiHuruf: string; feedback: string; dinilaiPada: Date
  }[]>([])
  const [allNilai, setAllNilai] = useState<typeof myNilai>([])
  const [materiMap, setMateriMap] = useState<Record<string, string>>({})

  useEffect(() => {
    getNilaiByMurid('m1').then(setMyNilai).catch(console.error)
    getAllNilai().then(setAllNilai).catch(console.error)
    getMateri().then(list => {
      const map: Record<string, string> = {}
      list.forEach(m => { map[m.id] = m.judul })
      setMateriMap(map)
    }).catch(console.error)
  }, [])

  // Calculate stats for murid
  const avgNilai = myNilai.length > 0
    ? Math.round(myNilai.reduce((acc, n) => acc + n.nilaiAngka, 0) / myNilai.length)
    : 0
  const highestNilai = myNilai.length > 0 ? Math.max(...myNilai.map(n => n.nilaiAngka)) : 0
  const lowestNilai = myNilai.length > 0 ? Math.min(...myNilai.map(n => n.nilaiAngka)) : 0

  // Filter for guru view
  const filteredNilai = search
    ? allNilai.filter(n => n.muridNama.toLowerCase().includes(search.toLowerCase()))
    : allNilai

  const handleEdit = (id: string, currentValue: number) => {
    setEditingId(id)
    setEditValue(currentValue)
  }

  const handleSave = (id: string) => {
    // In real app, this would update the database
    setEditingId(null)
  }

  if (role === 'murid') {
    return (
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold font-display text-slate-900">Nilai Saya</h1>
          <p className="text-slate-500 text-sm mt-1">Pantau perkembangan nilai dan prestasi akademik Anda</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl p-4 border border-slate-200">
            <div className="w-10 h-10 rounded-lg bg-indigo-500 flex items-center justify-center mb-3">
              <BarChart2 size={20} className="text-white" />
            </div>
            <p className="text-2xl font-bold text-slate-900 font-display">{avgNilai}</p>
            <p className="text-sm text-slate-500">Rata-rata Nilai</p>
          </div>
          <div className="bg-white rounded-xl p-4 border border-slate-200">
            <div className="w-10 h-10 rounded-lg bg-emerald-500 flex items-center justify-center mb-3">
              <TrendingUp size={20} className="text-white" />
            </div>
            <p className="text-2xl font-bold text-slate-900 font-display">{highestNilai}</p>
            <p className="text-sm text-slate-500">Nilai Tertinggi</p>
          </div>
          <div className="bg-white rounded-xl p-4 border border-slate-200">
            <div className="w-10 h-10 rounded-lg bg-amber-500 flex items-center justify-center mb-3">
              <Award size={20} className="text-white" />
            </div>
            <p className="text-2xl font-bold text-slate-900 font-display">{nilaiToHuruf(avgNilai)}</p>
            <p className="text-sm text-slate-500">Grade Rata-rata</p>
          </div>
          <div className="bg-white rounded-xl p-4 border border-slate-200">
            <div className="w-10 h-10 rounded-lg bg-violet-500 flex items-center justify-center mb-3">
              <BookOpen size={20} className="text-white" />
            </div>
            <p className="text-2xl font-bold text-slate-900 font-display">{myNilai.length}</p>
            <p className="text-sm text-slate-500">Total Penilaian</p>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Line Chart - Grade Trend */}
          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <h2 className="font-semibold text-slate-900 mb-4">Tren Nilai 6 Bulan Terakhir</h2>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={GRADE_DATA_MURID}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="bulan" tick={{ fontSize: 12 }} stroke="#64748b" />
                  <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} stroke="#64748b" />
                  <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0' }} />
                  <Legend />
                  <Line type="monotone" dataKey="matematika" name="Matematika" stroke="#4F46E5" strokeWidth={2} dot={{ r: 4 }} />
                  <Line type="monotone" dataKey="fisika" name="Fisika" stroke="#10B981" strokeWidth={2} dot={{ r: 4 }} />
                  <Line type="monotone" dataKey="kimia" name="Kimia" stroke="#F59E0B" strokeWidth={2} dot={{ r: 4 }} />
                  <Line type="monotone" dataKey="biologi" name="Biologi" stroke="#8B5CF6" strokeWidth={2} dot={{ r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Radar Chart - Subject Performance */}
          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <h2 className="font-semibold text-slate-900 mb-4">Performa per Mata Pelajaran</h2>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={radarData}>
                  <PolarGrid stroke="#e2e8f0" />
                  <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11 }} stroke="#64748b" />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 10 }} stroke="#64748b" />
                  <Radar name="Nilai" dataKey="value" stroke="#4F46E5" fill="#4F46E5" fillOpacity={0.3} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Grade History */}
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100">
            <h2 className="font-semibold text-slate-900">Riwayat Nilai</h2>
          </div>
          <div className="divide-y divide-slate-100">
            {myNilai.length > 0 ? myNilai.map((nilai) => {
              const materiJudul = materiMap[nilai.materiId] || 'Materi'
              return (
                <div key={nilai.id} className="px-5 py-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-slate-900">{materiJudul}</p>
                      <p className="text-sm text-slate-500 mt-0.5">
                        {nilai.tipe.charAt(0).toUpperCase() + nilai.tipe.slice(1)} - {formatDate(nilai.dinilaiPada)}
                      </p>
                      {nilai.feedback && (
                        <p className="text-sm text-slate-600 mt-2 bg-slate-50 rounded-lg p-3">
                          {nilai.feedback}
                        </p>
                      )}
                    </div>
                    <div className={cn(
                      'inline-flex items-center gap-2 px-3 py-1.5 rounded-lg',
                      nilai.nilaiAngka >= 85 ? 'bg-emerald-100 text-emerald-700' :
                      nilai.nilaiAngka >= 70 ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'
                    )}>
                      <span className="text-lg font-bold">{nilai.nilaiAngka}</span>
                      <span className="text-sm font-medium">({nilai.nilaiHuruf})</span>
                    </div>
                  </div>
                </div>
              )
            }) : (
              <div className="px-5 py-12 text-center text-slate-500">
                Belum ada nilai
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
            {role === 'guru' ? 'Data Nilai' : 'Nilai Anak'}
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            {role === 'guru' ? 'Kelola nilai siswa untuk setiap materi' : 'Pantau perkembangan nilai anak Anda'}
          </p>
        </div>
        {role === 'guru' && (
          <button className="inline-flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors">
            <Download size={18} />
            <span>Export Data</span>
          </button>
        )}
      </div>

      {/* Orangtua Warning Banner */}
      {role === 'orangtua' && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
          <p className="text-amber-800 text-sm">
            Anda sedang melihat data nilai <strong>Daffa Rizky</strong> (XI IPA 2)
          </p>
        </div>
      )}

      {/* Stats for Orangtua */}
      {role === 'orangtua' && (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white rounded-xl p-4 border border-slate-200">
              <div className="w-10 h-10 rounded-lg bg-indigo-500 flex items-center justify-center mb-3">
                <BarChart2 size={20} className="text-white" />
              </div>
              <p className="text-2xl font-bold text-slate-900 font-display">{avgNilai}</p>
              <p className="text-sm text-slate-500">Rata-rata Nilai</p>
            </div>
            <div className="bg-white rounded-xl p-4 border border-slate-200">
              <div className="w-10 h-10 rounded-lg bg-emerald-500 flex items-center justify-center mb-3">
                <TrendingUp size={20} className="text-white" />
              </div>
              <p className="text-2xl font-bold text-slate-900 font-display">{highestNilai}</p>
              <p className="text-sm text-slate-500">Nilai Tertinggi</p>
            </div>
            <div className="bg-white rounded-xl p-4 border border-slate-200">
              <div className="w-10 h-10 rounded-lg bg-amber-500 flex items-center justify-center mb-3">
                <Award size={20} className="text-white" />
              </div>
              <p className="text-2xl font-bold text-slate-900 font-display">{nilaiToHuruf(avgNilai)}</p>
              <p className="text-sm text-slate-500">Grade</p>
            </div>
            <div className="bg-white rounded-xl p-4 border border-slate-200">
              <div className="w-10 h-10 rounded-lg bg-violet-500 flex items-center justify-center mb-3">
                <BookOpen size={20} className="text-white" />
              </div>
              <p className="text-2xl font-bold text-slate-900 font-display">{myNilai.length}</p>
              <p className="text-sm text-slate-500">Total Penilaian</p>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <h2 className="font-semibold text-slate-900 mb-4">Tren Nilai 6 Bulan Terakhir</h2>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={GRADE_DATA_MURID}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="bulan" tick={{ fontSize: 12 }} stroke="#64748b" />
                  <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} stroke="#64748b" />
                  <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0' }} />
                  <Legend />
                  <Line type="monotone" dataKey="matematika" name="Matematika" stroke="#4F46E5" strokeWidth={2} />
                  <Line type="monotone" dataKey="fisika" name="Fisika" stroke="#10B981" strokeWidth={2} />
                  <Line type="monotone" dataKey="kimia" name="Kimia" stroke="#F59E0B" strokeWidth={2} />
                  <Line type="monotone" dataKey="biologi" name="Biologi" stroke="#8B5CF6" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </>
      )}

      {/* Search for Guru */}
      {role === 'guru' && (
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Cari nama murid..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>
      )}

      {/* Grade Table for Guru */}
      {role === 'guru' && (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100">
            <h2 className="font-semibold text-slate-900">Daftar Nilai Siswa</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Murid</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Materi</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Tipe</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Nilai</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Grade</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Tanggal</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredNilai.map((nilai) => {
                  const materiJudul = materiMap[nilai.materiId] || '-'
                  const isEditing = editingId === nilai.id
                  return (
                    <tr key={nilai.id} className="hover:bg-slate-50">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-xs font-semibold text-indigo-600">
                            {nilai.muridNama.split(' ').map(n => n[0]).join('').slice(0, 2)}
                          </div>
                          <span className="font-medium text-slate-900">{nilai.muridNama}</span>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-sm text-slate-600">{materiJudul}</td>
                      <td className="px-5 py-4">
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600">
                          {nilai.tipe}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        {isEditing ? (
                          <input
                            type="number"
                            min="0"
                            max="100"
                            value={editValue}
                            onChange={(e) => setEditValue(Math.min(100, Math.max(0, parseInt(e.target.value) || 0)))}
                            className="w-20 px-2 py-1 border border-indigo-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          />
                        ) : (
                          <span className={cn(
                            'font-semibold',
                            nilai.nilaiAngka >= 85 ? 'text-emerald-600' :
                            nilai.nilaiAngka >= 70 ? 'text-amber-600' : 'text-red-600'
                          )}>{nilai.nilaiAngka}</span>
                        )}
                      </td>
                      <td className="px-5 py-4">
                        <span className={cn(
                          'px-2 py-1 rounded-full text-xs font-medium',
                          nilai.nilaiAngka >= 85 ? 'bg-emerald-100 text-emerald-700' :
                          nilai.nilaiAngka >= 70 ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'
                        )}>
                          {isEditing ? nilaiToHuruf(editValue) : nilai.nilaiHuruf}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-sm text-slate-600">{formatDate(nilai.dinilaiPada)}</td>
                      <td className="px-5 py-4">
                        {isEditing ? (
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => handleSave(nilai.id)}
                              className="p-1.5 rounded-lg bg-emerald-100 text-emerald-600 hover:bg-emerald-200"
                            >
                              <Check size={14} />
                            </button>
                            <button
                              onClick={() => setEditingId(null)}
                              className="p-1.5 rounded-lg bg-red-100 text-red-600 hover:bg-red-200"
                            >
                              <X size={14} />
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => handleEdit(nilai.id, nilai.nilaiAngka)}
                            className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                          >
                            <Edit2 size={14} />
                          </button>
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Grade History for Orangtua */}
      {role === 'orangtua' && (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100">
            <h2 className="font-semibold text-slate-900">Riwayat Nilai Anak</h2>
          </div>
          <div className="divide-y divide-slate-100">
            {myNilai.map((nilai) => {
              const materiJudul = materiMap[nilai.materiId] || 'Materi'
              return (
                <div key={nilai.id} className="px-5 py-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-slate-900">{materiJudul}</p>
                      <p className="text-sm text-slate-500 mt-0.5">
                        {nilai.tipe.charAt(0).toUpperCase() + nilai.tipe.slice(1)} - {formatDate(nilai.dinilaiPada)}
                      </p>
                      {nilai.feedback && (
                        <p className="text-sm text-slate-600 mt-2 bg-slate-50 rounded-lg p-3">{nilai.feedback}</p>
                      )}
                    </div>
                    <div className={cn(
                      'inline-flex items-center gap-2 px-3 py-1.5 rounded-lg',
                      nilai.nilaiAngka >= 85 ? 'bg-emerald-100 text-emerald-700' :
                      nilai.nilaiAngka >= 70 ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'
                    )}>
                      <span className="text-lg font-bold">{nilai.nilaiAngka}</span>
                      <span className="text-sm font-medium">({nilai.nilaiHuruf})</span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
