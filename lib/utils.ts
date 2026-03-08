import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('id-ID', { 
    day: 'numeric', month: 'long', year: 'numeric' 
  }).format(new Date(date))
}

export function formatDateTime(date: Date): string {
  return new Intl.DateTimeFormat('id-ID', { 
    day: 'numeric', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit'
  }).format(new Date(date))
}

export function formatRelativeTime(date: Date): string {
  const now = new Date()
  const d = new Date(date)
  const diff = now.getTime() - d.getTime()
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)
  if (minutes < 1) return 'baru saja'
  if (minutes < 60) return `${minutes} menit lalu`
  if (hours < 24) return `${hours} jam lalu`
  if (days < 7) return `${days} hari lalu`
  return formatDate(d)
}

export function getCountdown(targetDate: Date): { days: number; hours: number; minutes: number; seconds: number } {
  const now = new Date()
  const target = new Date(targetDate)
  const diff = target.getTime() - now.getTime()
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 }
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
  const seconds = Math.floor((diff % (1000 * 60)) / 1000)
  return { days, hours, minutes, seconds }
}

export function formatCountdown(countdown: { days: number; hours: number; minutes: number; seconds: number }): string {
  const { days, hours, minutes, seconds } = countdown
  const parts: string[] = []

  if (days > 0) parts.push(`${days} hari`)
  if (hours > 0) parts.push(`${hours} jam`)
  if (minutes > 0) parts.push(`${minutes} menit`)
  if (seconds > 0 || parts.length === 0) parts.push(`${seconds} detik`)

  return parts.slice(0, 2).join(' ')
}

export function nilaiToHuruf(nilai: number): string {
  if (nilai >= 93) return 'A'
  if (nilai >= 85) return 'A-'
  if (nilai >= 80) return 'B+'
  if (nilai >= 75) return 'B'
  if (nilai >= 70) return 'B-'
  if (nilai >= 65) return 'C+'
  if (nilai >= 60) return 'C'
  if (nilai >= 55) return 'C-'
  if (nilai >= 50) return 'D'
  return 'E'
}

export function getStatusColor(status: string): string {
  switch (status) {
    case 'active': return 'bg-emerald-100 text-emerald-700 border-emerald-200'
    case 'scheduled': return 'bg-amber-100 text-amber-700 border-amber-200'
    case 'draft': return 'bg-slate-100 text-slate-600 border-slate-200'
    case 'closed': return 'bg-rose-100 text-rose-700 border-rose-200'
    default: return 'bg-slate-100 text-slate-600 border-slate-200'
  }
}

export function getStatusLabel(status: string): string {
  switch (status) {
    case 'active': return 'Aktif'
    case 'scheduled': return 'Terjadwal'
    case 'draft': return 'Draft'
    case 'closed': return 'Selesai'
    default: return status
  }
}
