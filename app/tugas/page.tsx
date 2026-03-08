'use client'

import { useEffect, useState } from 'react'
import { Clock, AlertCircle, CheckCircle2, ClipboardList } from 'lucide-react'
import { getTugas } from '@/lib/supabase-service'
import { cn } from '@/lib/utils'

type Tugas = {
  id: string; judul: string; materiId: string; deskripsi: string
  deadline: Date; nilaiMaks: number; sudahKumpul: boolean
  tipe: 'essay' | 'quiz' | 'proyek' | 'ulangan'
}

export default function TugasPage() {
  const [tugas, setTugas] = useState<Tugas[]>([])

  useEffect(() => {
    getTugas().then(setTugas).catch(console.error)
  }, [])

  // Categorize tasks
  const needToDo = tugas.filter(t => !t.sudahKumpul && new Date(t.deadline) > new Date())
  const completed = tugas.filter(t => t.sudahKumpul)
  const overdue = tugas.filter(t => !t.sudahKumpul && new Date(t.deadline) <= new Date())

  // Calculate stats
  const stats = [
    { label: 'Perlu Dikerjakan', value: needToDo.length, color: 'bg-amber-100', textColor: 'text-amber-700' },
    { label: 'Sudah Dikumpul', value: completed.length, color: 'bg-emerald-100', textColor: 'text-emerald-700' },
    { label: 'Terlambat', value: overdue.length, color: 'bg-red-100', textColor: 'text-red-700' },
  ]

  const getRemainingDaysColor = (daysRemaining: number) => {
    if (daysRemaining <= 1) return 'bg-red-100 text-red-700'
    if (daysRemaining <= 3) return 'bg-amber-100 text-amber-700'
    return 'bg-slate-100 text-slate-700'
  }

  const getTaskTypeLabel = (type: string) => {
    switch (type) {
      case 'essay':
        return 'Essay'
      case 'quiz':
        return 'Quiz'
      case 'proyek':
        return 'Proyek'
      case 'ulangan':
        return 'Ulangan'
      default:
        return type
    }
  }

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <section>
        <h1 className="text-3xl font-bold font-display text-slate-900">Daftar Tugas</h1>
        <p className="text-slate-600 mt-2">Kelola dan pantau progres semua tugas kamu</p>
      </section>

      {/* Stats Cards */}
      <section className="grid grid-cols-3 gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className={cn('rounded-2xl p-4 border-2 border-transparent', stat.color)}>
            <p className={cn('text-sm font-medium', stat.textColor)}>{stat.label}</p>
            <p className={cn('text-3xl font-bold font-display mt-1', stat.textColor)}>{stat.value}</p>
          </div>
        ))}
      </section>

      {/* Perlu Dikerjakan Section */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <Clock className="w-5 h-5 text-amber-600" />
          <h2 className="text-xl font-semibold text-slate-900 font-display">Perlu Dikerjakan</h2>
        </div>
        {needToDo.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl border border-slate-100">
            <p className="text-slate-500">Tidak ada tugas yang perlu dikerjakan. Selamat! 🎉</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {needToDo.map((task) => {
              const daysRemaining = Math.ceil((new Date(task.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
              return (
                <div key={task.id} className="bg-white rounded-2xl border border-slate-100 p-6 card-hover">
                  <div className="flex gap-4">
                    {/* Icon */}
                    <div className="flex items-start">
                      <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-amber-100">
                        <ClipboardList className="w-6 h-6 text-amber-600" />
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h3 className="font-semibold text-slate-900">{task.judul}</h3>
                          <p className="text-sm text-slate-500 mt-1">{getTaskTypeLabel(task.tipe)}</p>
                        </div>
                        <span className={cn(
                          'text-xs font-medium px-2 py-1 rounded whitespace-nowrap',
                          getRemainingDaysColor(daysRemaining)
                        )}>
                          {daysRemaining <= 0 ? 'Terlambat' : `${daysRemaining} hari`}
                        </span>
                      </div>

                      {/* Description */}
                      <p className="text-sm text-slate-600 mt-3 line-clamp-1">{task.deskripsi}</p>

                      {/* Footer */}
                      <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-100">
                        <p className="text-xs text-slate-500">Deadline: {new Date(task.deadline).toLocaleDateString('id-ID')}</p>
                        <button className="px-4 py-2 bg-indigo-500 text-white text-sm font-medium rounded-lg hover:bg-indigo-600 transition">
                          Kumpulkan
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </section>

      {/* Terlambat Section */}
      {overdue.length > 0 && (
        <section>
          <div className="flex items-center gap-2 mb-4">
            <AlertCircle className="w-5 h-5 text-red-600" />
            <h2 className="text-xl font-semibold text-slate-900 font-display">Terlambat</h2>
          </div>
          <div className="grid gap-4">
            {overdue.map((task) => (
              <div key={task.id} className="bg-red-50 rounded-2xl border-2 border-red-100 p-6">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <h3 className="font-semibold text-red-900">{task.judul}</h3>
                    <p className="text-sm text-red-700 mt-1">Deadline: {new Date(task.deadline).toLocaleDateString('id-ID')}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Sudah Dikumpul Section */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          <h2 className="text-xl font-semibold text-slate-900 font-display">Sudah Dikumpulkan</h2>
        </div>
        {completed.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl border border-slate-100">
            <p className="text-slate-500">Belum ada tugas yang dikumpulkan</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {completed.map((task) => (
              <div key={task.id} className="bg-white rounded-2xl border border-slate-100 p-6 opacity-75">
                <div className="flex gap-4">
                  {/* Icon */}
                  <div className="flex items-start">
                    <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-emerald-100">
                      <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-slate-900">{task.judul}</h3>
                    <p className="text-sm text-slate-600 mt-1">
                      {getTaskTypeLabel(task.tipe)} • Maks: {task.nilaiMaks}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
