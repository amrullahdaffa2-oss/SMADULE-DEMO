'use client'

import { useEffect, useState } from 'react'
import { BookOpen, Clock, CheckCircle2, Lock, Calendar } from 'lucide-react'
import { Countdown } from '@/components/dashboard/Countdown'
import { getMateri } from '@/lib/supabase-service'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

type Materi = {
  id: string; judul: string; mapel: string
  scheduleDate: Date; status: string
}

export default function JadwalPage() {
  const [materi, setMateri] = useState<Materi[]>([])

  useEffect(() => {
    getMateri().then(setMateri).catch(console.error)
  }, [])

  const sortedMaterials = [...materi].sort((a, b) => 
    new Date(a.scheduleDate).getTime() - new Date(b.scheduleDate).getTime()
  )

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'border-emerald-100'
      case 'scheduled':
        return 'border-amber-100'
      default:
        return 'border-slate-100'
    }
  }

  const getIconColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-emerald-100 text-emerald-600'
      case 'scheduled':
        return 'bg-amber-100 text-amber-600'
      case 'closed':
        return 'bg-slate-100 text-slate-600'
      default:
        return 'bg-slate-100 text-slate-400'
    }
  }

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-emerald-100 text-emerald-700'
      case 'scheduled':
        return 'bg-amber-100 text-amber-700'
      case 'closed':
        return 'bg-slate-100 text-slate-700'
      default:
        return 'bg-violet-100 text-violet-700'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return BookOpen
      case 'scheduled':
        return Clock
      case 'closed':
        return CheckCircle2
      default:
        return Lock
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active':
        return 'Aktif'
      case 'scheduled':
        return 'Terjadwal'
      case 'closed':
        return 'Selesai'
      default:
        return 'Draft'
    }
  }

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <section>
        <h1 className="text-3xl font-bold font-display text-slate-900">Jadwal Materi</h1>
        <p className="text-slate-600 mt-2">Timeline lengkap semua materi pembelajaran</p>
      </section>

      {/* Timeline */}
      <div className="relative">
        {/* Vertical line */}
        <div className="absolute left-6 lg:left-8 top-0 bottom-0 w-0.5 bg-slate-200" />

        {/* Timeline items */}
        <div className="space-y-6">
          {sortedMaterials.map((material, index) => {
            const StatusIcon = getStatusIcon(material.status)
            const scheduleDate = new Date(material.scheduleDate)

            return (
              <div
                key={material.id}
                className="relative animate-fadeIn"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Timeline dot */}
                <div className={cn(
                  'absolute left-0 lg:left-0 w-14 h-14 lg:w-16 lg:h-16 flex items-center justify-center',
                  'rounded-full border-4 border-slate-50 bg-white z-10'
                )}>
                  <div className={cn(
                    'flex items-center justify-center w-10 h-10 lg:w-12 lg:h-12 rounded-full',
                    getIconColor(material.status)
                  )}>
                    <StatusIcon className="w-5 h-5 lg:w-6 lg:h-6" />
                  </div>
                </div>

                {/* Content card */}
                <div className={cn(
                  'ml-20 lg:ml-24 bg-white rounded-2xl border-2 p-6 card-hover',
                  getStatusColor(material.status)
                )}>
                  {/* Status badge and title */}
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div>
                      <Badge className={cn('text-xs font-medium mb-2', getStatusBadgeColor(material.status))}>
                        {getStatusLabel(material.status)}
                      </Badge>
                      <h3 className="text-lg font-semibold text-slate-900">{material.judul}</h3>
                      <p className="text-sm text-slate-500 mt-1">{material.mapel}</p>
                    </div>
                  </div>

                  {/* Schedule info */}
                  <div className="flex items-center gap-2 text-slate-600 text-sm mb-4 mt-4">
                    <Calendar className="w-4 h-4 text-slate-400" />
                    <span>{scheduleDate.toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                  </div>

                  {/* Action */}
                  <div className="flex items-center justify-between">
                    {material.status === 'scheduled' ? (
                      <Countdown targetDate={scheduleDate} />
                    ) : material.status === 'active' ? (
                      <a href={`/materi/${material.id}`} className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500 text-white text-sm font-medium rounded-lg hover:bg-emerald-600 transition">
                        Buka →
                      </a>
                    ) : null}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
