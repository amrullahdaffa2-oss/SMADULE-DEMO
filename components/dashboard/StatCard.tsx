import { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

interface StatCardProps {
  icon: LucideIcon
  label: string
  value: string | number
  sub?: string
  color?: string
}

export function StatCard({ icon: Icon, label, value, sub, color = 'bg-indigo-500' }: StatCardProps) {
  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-100 card-hover">
      <div className={cn('inline-flex items-center justify-center w-12 h-12 rounded-lg mb-4', color)}>
        <Icon className="w-6 h-6 text-white" />
      </div>
      <p className="text-slate-500 text-sm font-medium">{label}</p>
      <p className="text-3xl font-bold text-slate-900 font-display mt-2">{value}</p>
      {sub && <p className="text-emerald-600 text-xs font-medium mt-2">{sub}</p>}
    </div>
  )
}
