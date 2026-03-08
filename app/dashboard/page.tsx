'use client'

import { useState, useEffect } from 'react'
import { BarChart, Bar, LineChart, Line, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { BookOpen, Users, Briefcase, Activity, AlertCircle, CheckCircle2, Clock, TrendingUp } from 'lucide-react'
import { StatCard } from '@/components/dashboard/StatCard'
import { useAppStore } from '@/lib/store'
import { MOCK_MATERI, MOCK_TUGAS, MOCK_ABSENSI, MOCK_NILAI, GRADE_DATA_MURID, ATTENDANCE_WEEKLY } from '@/lib/mock-data'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

export default function DashboardPage() {
  const role = useAppStore(s => s.role)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  // Guru Dashboard
  if (role === 'guru') {
    const activeMaterials = MOCK_MATERI.filter(m => m.status === 'active').length
    const totalStudents = 32
    const activeTasks = MOCK_TUGAS.filter(t => !t.sudahKumpul).length
    const attendanceRate = 87

    const materi = MOCK_MATERI.slice(0, 5)
    const absensi = MOCK_ABSENSI.slice(0, 5)

    return (
      <div className="space-y-6 animate-fadeIn">
        {/* Welcome */}
        <section>
          <p className="text-slate-500 text-sm font-medium">Selamat datang</p>
          <h1 className="text-3xl font-bold font-display text-slate-900 mt-1">Dashboard Guru</h1>
          <p className="text-slate-600 mt-2">Pak Ahmad Fauzi 👋</p>
        </section>

        {/* Stats Grid */}
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard icon={BookOpen} label="Materi Aktif" value={activeMaterials} color="bg-indigo-500" />
          <StatCard icon={Users} label="Total Murid" value={totalStudents} color="bg-emerald-500" />
          <StatCard icon={Briefcase} label="Tugas Berjalan" value={activeTasks} color="bg-amber-500" />
          <StatCard icon={Activity} label="Rata Kehadiran" value={`${attendanceRate}%`} sub="Minggu ini" color="bg-rose-500" />
        </section>

        {/* Charts */}
        <section className="grid lg:grid-cols-2 gap-6">
          {/* Attendance Chart */}
          <div className="bg-white rounded-2xl border border-slate-100 p-6">
            <h2 className="font-semibold text-slate-900 font-display mb-4">Kehadiran Mingguan</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={ATTENDANCE_WEEKLY}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="name" stroke="#94a3b8" style={{ fontSize: '12px' }} />
                <YAxis stroke="#94a3b8" style={{ fontSize: '12px' }} />
                <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px' }} />
                <Legend />
                <Bar dataKey="hadir" fill="#4F46E5" radius={[8, 8, 0, 0]} />
                <Bar dataKey="absen" fill="#EC4899" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Materials Status */}
          <div className="bg-white rounded-2xl border border-slate-100 p-6">
            <h2 className="font-semibold text-slate-900 font-display mb-4">Status Materi</h2>
            <div className="space-y-3">
              {materi.map((m) => (
                <div key={m.id} className="flex items-center justify-between gap-3 p-3 bg-slate-50 rounded-lg">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-slate-900">{m.judul}</p>
                    <p className="text-xs text-slate-500">{m.mapel}</p>
                  </div>
                  <Badge className={cn(
                    'text-xs font-medium',
                    m.status === 'active' && 'bg-emerald-100 text-emerald-700',
                    m.status === 'scheduled' && 'bg-amber-100 text-amber-700',
                    m.status === 'closed' && 'bg-slate-100 text-slate-700',
                    m.status === 'draft' && 'bg-violet-100 text-violet-700'
                  )}>
                    {m.status === 'active' && 'Aktif'}
                    {m.status === 'scheduled' && 'Terjadwal'}
                    {m.status === 'closed' && 'Selesai'}
                    {m.status === 'draft' && 'Draft'}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Attendance Table */}
        <section className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
            <h2 className="font-semibold text-slate-900 font-display">Absensi Terkini</h2>
            <a href="/absensi" className="text-sm text-indigo-600 font-medium hover:text-indigo-700">Lihat semua →</a>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 border-b border-slate-100">
                <tr>
                  <th className="px-6 py-3 text-left font-medium text-slate-600">Nama Murid</th>
                  <th className="px-6 py-3 text-left font-medium text-slate-600">Materi</th>
                  <th className="px-6 py-3 text-left font-medium text-slate-600">Waktu Hadir</th>
                  <th className="px-6 py-3 text-left font-medium text-slate-600">Durasi</th>
                  <th className="px-6 py-3 text-left font-medium text-slate-600">Pre-Test</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {absensi.map((a) => (
                  <tr key={a.id} className="hover:bg-slate-50">
                    <td className="px-6 py-3 text-slate-900 font-medium">{a.muridNama}</td>
                    <td className="px-6 py-3 text-slate-600">{a.materiJudul}</td>
                    <td className="px-6 py-3 text-slate-600">{new Date(a.waktuHadir).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}</td>
                    <td className="px-6 py-3 text-slate-600">{a.durasi} menit</td>
                    <td className="px-6 py-3">
                      <span className={cn(
                        'text-xs font-medium px-2 py-1 rounded',
                        a.completedPretest ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                      )}>
                        {a.completedPretest ? 'Selesai' : 'Pending'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    )
  }

  // Orang Tua Dashboard
  if (role === 'orangtua') {
    const attendancePercentage = 87
    const averageScore = 82.5
    const completedTasks = 12
    const totalTasks = 15

    const gradeHistory = [
      { month: 'Agu', math: 78, physics: 80, biology: 75 },
      { month: 'Sep', math: 80, physics: 82, biology: 78 },
      { month: 'Okt', math: 82, physics: 84, biology: 80 },
      { month: 'Nov', math: 85, physics: 86, biology: 83 },
      { month: 'Des', math: 87, physics: 88, biology: 85 },
      { month: 'Jan', math: 89, physics: 89, biology: 87 },
    ]

    const radarData = [
      { subject: 'Matematika', value: 85 },
      { subject: 'Fisika', value: 87 },
      { subject: 'Kimia', value: 82 },
      { subject: 'Biologi', value: 84 },
      { subject: 'B. Indonesia', value: 83 },
      { subject: 'B. Inggris', value: 81 },
    ]

    return (
      <div className="space-y-6 animate-fadeIn">
        {/* Warning Banner */}
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0" />
          <div>
            <p className="font-medium text-amber-900">Mode Orang Tua — Tampilan Hanya Lihat</p>
            <p className="text-sm text-amber-700 mt-0.5">Anda dapat melihat laporan akademik dan perkembangan anak Anda.</p>
          </div>
        </div>

        {/* Title */}
        <section>
          <h1 className="text-3xl font-bold font-display text-slate-900">Laporan Daffa Rizky</h1>
        </section>

        {/* Stats Grid */}
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard icon={Activity} label="Kehadiran" value={`${attendancePercentage}%`} color="bg-indigo-500" />
          <StatCard icon={TrendingUp} label="Rata-rata Nilai" value={averageScore} color="bg-emerald-500" />
          <StatCard icon={CheckCircle2} label="Tugas Selesai" value={`${completedTasks}/${totalTasks}`} color="bg-amber-500" />
          <StatCard icon={Users} label="Ranking Kelas" value="#3" sub="Dari 40 siswa" color="bg-rose-500" />
        </section>

        {/* Charts */}
        <section className="grid lg:grid-cols-2 gap-6">
          {/* Grade History */}
          <div className="bg-white rounded-2xl border border-slate-100 p-6">
            <h2 className="font-semibold text-slate-900 font-display mb-4">Perkembangan Nilai (6 Bulan)</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={gradeHistory}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" stroke="#94a3b8" style={{ fontSize: '12px' }} />
                <YAxis stroke="#94a3b8" style={{ fontSize: '12px' }} domain={[70, 100]} />
                <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px' }} />
                <Legend />
                <Line type="monotone" dataKey="math" stroke="#4F46E5" strokeWidth={2} dot={{ fill: '#4F46E5', r: 4 }} name="Matematika" />
                <Line type="monotone" dataKey="physics" stroke="#10B981" strokeWidth={2} dot={{ fill: '#10B981', r: 4 }} name="Fisika" />
                <Line type="monotone" dataKey="biology" stroke="#F59E0B" strokeWidth={2} dot={{ fill: '#F59E0B', r: 4 }} name="Biologi" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Performance Radar */}
          <div className="bg-white rounded-2xl border border-slate-100 p-6">
            <h2 className="font-semibold text-slate-900 font-display mb-4">Performa per Mata Pelajaran</h2>
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart data={radarData}>
                <PolarGrid stroke="#f1f5f9" />
                <PolarAngleAxis dataKey="subject" stroke="#94a3b8" style={{ fontSize: '12px' }} />
                <PolarRadiusAxis stroke="#94a3b8" style={{ fontSize: '12px' }} domain={[0, 100]} />
                <Radar name="Nilai" dataKey="value" stroke="#4F46E5" fill="#4F46E5" fillOpacity={0.5} />
                <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px' }} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </section>
      </div>
    )
  }

  // Murid Dashboard (default)
  const totalPoints = 420
  const rank = '#3'
  const attendance = 95
  const activeTasks = MOCK_TUGAS.filter(t => !t.sudahKumpul).length
  const preTestDone = true

  const gradeHistory = [
    { month: 'Agu', math: 78, physics: 80 },
    { month: 'Sep', math: 80, physics: 82 },
    { month: 'Okt', math: 82, physics: 84 },
    { month: 'Nov', math: 85, physics: 86 },
    { month: 'Des', math: 87, physics: 88 },
    { month: 'Jan', math: 89, physics: 89 },
  ]

  const nearDeadlineTask = MOCK_TUGAS.filter(t => !t.sudahKumpul).slice(0, 3)
  const activeMaterials = MOCK_MATERI.filter(m => m.status === 'active')

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Welcome */}
      <section>
        <h1 className="text-3xl font-bold font-display text-slate-900">Dashboard Murid</h1>
        <p className="text-slate-600 mt-2">Semangat belajar, Daffa! 🚀</p>
      </section>

      {/* Stats Grid */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={TrendingUp} label="Total Poin" value={totalPoints} sub={`Ranking ${rank}`} color="bg-indigo-500" />
        <StatCard icon={Activity} label="Kehadiran" value={`${attendance}%`} color="bg-emerald-500" />
        <StatCard icon={Briefcase} label="Tugas Aktif" value={activeTasks} color="bg-amber-500" />
        <StatCard icon={CheckCircle2} label="Pre-Test" value={preTestDone ? 'Selesai' : 'Pending'} color="bg-rose-500" />
      </section>

      {/* Main Content Grid */}
      <section className="grid lg:grid-cols-3 gap-6">
        {/* Grade Chart - Left Column */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 p-6">
          <h2 className="font-semibold text-slate-900 font-display mb-4">Perkembangan Nilai</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={gradeHistory}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="month" stroke="#94a3b8" style={{ fontSize: '12px' }} />
              <YAxis stroke="#94a3b8" style={{ fontSize: '12px' }} domain={[70, 100]} />
              <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px' }} />
              <Legend />
              <Line type="monotone" dataKey="math" stroke="#4F46E5" strokeWidth={2} dot={{ fill: '#4F46E5', r: 4 }} name="Matematika" />
              <Line type="monotone" dataKey="physics" stroke="#10B981" strokeWidth={2} dot={{ fill: '#10B981', r: 4 }} name="Fisika" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Nearby Deadlines - Right Column */}
        <div className="bg-white rounded-2xl border border-slate-100 p-6">
          <h2 className="font-semibold text-slate-900 font-display mb-4">Deadline Dekat</h2>
          <div className="space-y-3">
            {nearDeadlineTask.map((task) => (
              <div key={task.id} className="p-3 bg-slate-50 rounded-lg">
                <p className="text-sm font-medium text-slate-900">{task.judul}</p>
                <div className="flex items-center gap-2 mt-2 text-xs text-slate-600">
                  <Clock className="w-3 h-3" />
                  <span>{new Date(task.deadline).toLocaleDateString('id-ID')}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Active Materials */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-slate-900 font-display">Materi Aktif</h2>
          <a href="/materi" className="text-sm text-indigo-600 font-medium hover:text-indigo-700">Lihat semua →</a>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {activeMaterials.map((material) => (
            <a key={material.id} href={`/materi/${material.id}`} className="bg-white rounded-2xl border border-slate-100 p-6 card-hover">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <Badge className="bg-emerald-100 text-emerald-700 mb-3 text-xs">AKTIF</Badge>
                  <p className="font-semibold text-slate-900">{material.judul}</p>
                  <p className="text-sm text-slate-500 mt-1">{material.mapel}</p>
                </div>
              </div>
            </a>
          ))}
        </div>
      </section>
    </div>
  )
}
