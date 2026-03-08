'use client'
import { useState } from 'react'
import { useAppStore } from '@/lib/store'
import { ChevronUp, GraduationCap, BookOpen, Users } from 'lucide-react'

const roles = [
  { key: 'guru' as const, label: 'Guru', icon: GraduationCap, color: 'from-indigo-500 to-violet-600', desc: 'Pak Ahmad Fauzi' },
  { key: 'murid' as const, label: 'Murid', icon: BookOpen, color: 'from-emerald-500 to-teal-600', desc: 'Daffa Rizky' },
  { key: 'orangtua' as const, label: 'Orang Tua', icon: Users, color: 'from-amber-500 to-orange-600', desc: 'Bpk. Rizky Pratama' },
]

export function RoleSwitcher() {
  const { role, setRole } = useAppStore()
  const [open, setOpen] = useState(false)
  const current = roles.find(r => r.key === role)!

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {open && (
        <div className="mb-3 space-y-2 animate-fadeIn">
          {roles.map((r, i) => (
            <div key={r.key} onClick={() => { setRole(r.key); setOpen(false) }} className="flex items-center gap-2.5 cursor-pointer group" style={{ animationDelay: `${i * 50}ms` }}>
              <div className="ml-auto bg-white rounded-xl shadow-md border border-slate-200 px-3 py-2 text-right">
                <p className="text-xs font-semibold text-slate-800">{r.label}</p>
                <p className="text-xs text-slate-400">{r.desc}</p>
              </div>
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${r.color} flex items-center justify-center shadow-lg ${role === r.key ? 'ring-2 ring-white ring-offset-1' : ''}`}>
                <r.icon size={18} className="text-white" />
              </div>
            </div>
          ))}
        </div>
      )}
      <div className="flex items-center justify-end gap-2">
        {!open && (
          <div className="bg-white rounded-xl shadow-md border border-slate-200 px-3 py-2">
            <p className="text-xs font-semibold text-slate-700">Mode: <span className="text-indigo-600">{current.label}</span></p>
          </div>
        )}
        <button onClick={() => setOpen(!open)} className={`w-12 h-12 rounded-xl bg-gradient-to-br ${current.color} flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-200 ${open ? 'rotate-180' : ''}`}>
          {open ? <ChevronUp size={20} className="text-white" /> : <current.icon size={20} className="text-white" />}
        </button>
      </div>
    </div>
  )
}
