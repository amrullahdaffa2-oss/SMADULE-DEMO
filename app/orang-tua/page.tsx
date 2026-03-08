'use client'

import { useEffect, useState } from 'react'
import { useAppStore } from '@/lib/store'
import { getNilaiByMurid, getMateri, getTugas } from '@/lib/supabase-service'
import { GRADE_DATA_MURID, ATTENDANCE_WEEKLY } from '@/lib/mock-data'
import { formatDate, nilaiToHuruf, cn } from '@/lib/utils'
import {
  BarChart2, TrendingUp, Award, Calendar, BookOpen, ClipboardList,
  AlertTriangle, CheckCircle, Clock, Users
} from 'lucide-react'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
  BarChart, Bar, PieChart, Pie, Cell
} from 'recharts'

const COLORS = ['#10B981', '#F59E0B', '#EF4444', '#6366F1']

export default function OrangTuaPage() {
  const { role, absensi } = useAppStore()
  const [childNilai, setChildNilai] = useState<{
    id: string; muridId: string; materiId: string; tipe: string
    nilaiAngka: number; nilaiHuruf: string; feedback: string; dinilaiPada: Date
  }[]>([])
  const [childTugas, setChildTugas] = useState<{
    id: string; judul: string; sudahKumpul: boolean; deadline: Date
  }[]>([])
  const [allMateri, setAllMateri] = useState<{ id: string; judul: string; status: string }[]>([])
  const [totalMateriAktif, setTotalMateriAktif] = useState(0)

  useEffect(() => {
    getNilaiByMurid('m1').then(setChildNilai).catch(console.error)
    getTugas().then(setChildTugas).catch(console.error)
    getMateri().then(list => {
      setAllMateri(list)
      setTotalMateriAktif(list.filter(m => m.status === 'active' || m.status === 'closed').length)
    }).catch(console.error)
  }, [])

  // If not orangtua, redirect or show message
  if (role !== 'orangtua') {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Users size={48} className="mx-auto text-slate-300 mb-4" />
          <p className="text-slate-500">Halaman ini khusus untuk mode Orang Tua</p>
        </div>
      </div>
    )
  }

  // Child data (Daffa Rizky - m1)
  const childAbsensi = absensi.filter(a => a.muridId === 'm1')

  // Calculate stats
  const avgNilai = childNilai.length > 0
    ? Math.round(childNilai.reduce((acc, n) => acc + n.nilaiAngka, 0) / childNilai.length)
    : 0
  const totalMateri = totalMateriAktif
  const kehadiranPersen = totalMateri > 0 ? Math.round((childAbsensi.length / totalMateri) * 100) : 0
  const tugasBelumSelesai = childTugas.filter(t => !t.sudahKumpul && new Date(t.deadline) > new Date()).length
  const tugasTerlambat = childTugas.filter(t => !t.sudahKumpul && new Date(t.deadline) < new Date()).length

  // Grade distribution for pie chart
  const gradeDistribution = [
    { name: 'A (85-100)', value: childNilai.filter(n => n.nilaiAngka >= 85).length },
    { name: 'B (70-84)', value: childNilai.filter(n => n.nilaiAngka >= 70 && n.nilaiAngka < 85).length },
    { name: 'C (60-69)', value: childNilai.filter(n => n.nilaiAngka >= 60 && n.nilaiAngka < 70).length },
    { name: 'D (<60)', value: childNilai.filter(n => n.nilaiAngka < 60).length },
  ].filter(g => g.value > 0)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold font-display text-slate-900">Laporan Anak</h1>
        <p className="text-slate-500 text-sm mt-1">Pantau perkembangan akademik anak Anda secara real-time</p>
      </div>

      {/* Child Info Banner */}
      <div className="bg-gradient-to-r from-indigo-600 to-violet-600 rounded-2xl p-6 text-white">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-xl bg-white/20 flex items-center justify-center text-2xl font-bold">
            DR
          </div>
          <div>
            <h2 className="text-xl font-bold">Daffa Rizky</h2>
            <p className="text-indigo-200">XI IPA 2 - SMA Negeri 1</p>
          </div>
        </div>
      </div>

      {/* Warning Banner (if any issues) */}
      {(tugasTerlambat > 0 || kehadiranPersen < 80) && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-amber-800">Perhatian</p>
            <ul className="text-sm text-amber-700 mt-1 space-y-1">
              {tugasTerlambat > 0 && (
                <li>Ada {tugasTerlambat} tugas yang belum dikumpulkan (sudah melewati deadline)</li>
              )}
              {kehadiranPersen < 80 && (
                <li>Tingkat kehadiran di bawah 80% ({kehadiranPersen}%)</li>
              )}
            </ul>
          </div>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 border border-slate-200">
          <div className="w-10 h-10 rounded-lg bg-indigo-500 flex items-center justify-center mb-3">
            <BarChart2 size={20} className="text-white" />
          </div>
          <p className="text-2xl font-bold text-slate-900 font-display">{avgNilai}</p>
          <p className="text-sm text-slate-500">Rata-rata Nilai</p>
          <p className="text-xs text-slate-400 mt-1">Grade: {nilaiToHuruf(avgNilai)}</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-slate-200">
          <div className={cn(
            'w-10 h-10 rounded-lg flex items-center justify-center mb-3',
            kehadiranPersen >= 80 ? 'bg-emerald-500' : 'bg-amber-500'
          )}>
            <CheckCircle size={20} className="text-white" />
          </div>
          <p className="text-2xl font-bold text-slate-900 font-display">{kehadiranPersen}%</p>
          <p className="text-sm text-slate-500">Kehadiran</p>
          <p className="text-xs text-slate-400 mt-1">{childAbsensi.length}/{totalMateri} materi</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-slate-200">
          <div className={cn(
            'w-10 h-10 rounded-lg flex items-center justify-center mb-3',
            tugasBelumSelesai === 0 ? 'bg-emerald-500' : 'bg-amber-500'
          )}>
            <ClipboardList size={20} className="text-white" />
          </div>
          <p className="text-2xl font-bold text-slate-900 font-display">{tugasBelumSelesai}</p>
          <p className="text-sm text-slate-500">Tugas Pending</p>
          <p className="text-xs text-slate-400 mt-1">{childTugas.filter(t => t.sudahKumpul).length} selesai</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-slate-200">
          <div className="w-10 h-10 rounded-lg bg-violet-500 flex items-center justify-center mb-3">
            <Award size={20} className="text-white" />
          </div>
          <p className="text-2xl font-bold text-slate-900 font-display">#3</p>
          <p className="text-sm text-slate-500">Ranking Kelas</p>
          <p className="text-xs text-slate-400 mt-1">420 poin</p>
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

        {/* Pie Chart - Grade Distribution */}
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <h2 className="font-semibold text-slate-900 mb-4">Distribusi Nilai</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={gradeDistribution}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                  labelLine={false}
                >
                  {gradeDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Weekly Attendance Chart */}
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

      {/* Recent Grades */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100">
          <h2 className="font-semibold text-slate-900">Nilai Terbaru</h2>
        </div>
        <div className="divide-y divide-slate-100">
          {childNilai.length > 0 ? childNilai.slice(0, 5).map((nilai) => {
            const materi = allMateri.find(m => m.id === nilai.materiId)
            return (
              <div key={nilai.id} className="px-5 py-4 flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-slate-900">{materi?.judul || 'Materi'}</p>
                  <p className="text-sm text-slate-500">
                    {nilai.tipe.charAt(0).toUpperCase() + nilai.tipe.slice(1)} - {formatDate(nilai.dinilaiPada)}
                  </p>
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
            )
          }) : (
            <div className="px-5 py-12 text-center text-slate-500">
              Belum ada nilai
            </div>
          )}
        </div>
      </div>

      {/* Pending Tasks */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100">
          <h2 className="font-semibold text-slate-900">Tugas yang Perlu Dikerjakan</h2>
        </div>
        <div className="divide-y divide-slate-100">
          {childTugas.filter(t => !t.sudahKumpul).length > 0 ? (
            childTugas.filter(t => !t.sudahKumpul).map((tugas) => {
              const isOverdue = new Date(tugas.deadline) < new Date()
              return (
                <div key={tugas.id} className={cn(
                  'px-5 py-4 flex items-center justify-between',
                  isOverdue && 'bg-red-50'
                )}>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-slate-900">{tugas.judul}</p>
                    <p className="text-sm text-slate-500">{tugas.deskripsi}</p>
                  </div>
                  <div className="text-right">
                    <p className={cn(
                      'text-sm font-medium',
                      isOverdue ? 'text-red-600' : 'text-amber-600'
                    )}>
                      {isOverdue ? 'Terlambat' : 'Deadline'}
                    </p>
                    <p className="text-xs text-slate-500">{formatDate(tugas.deadline)}</p>
                  </div>
                </div>
              )
            })
          ) : (
            <div className="px-5 py-12 text-center text-emerald-600">
              <CheckCircle size={32} className="mx-auto mb-2" />
              <p className="font-medium">Semua tugas sudah selesai!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
