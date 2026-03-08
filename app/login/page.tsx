'use client'

import { FormEvent, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { GraduationCap, Eye, EyeOff, AlertCircle, Loader2, BookOpen, Users, ArrowRight } from 'lucide-react'
import { signIn } from '@/lib/auth'
import { useAppStore } from '@/lib/store'

export default function LoginPage() {
  const router = useRouter()
  const { setAuthUser } = useAppStore()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    const result = await signIn(email, password)
    setLoading(false)
    if (result.error) {
      setError(result.error)
      return
    }
    if (result.user) {
      setAuthUser(result.user)
      if (result.user.role === 'guru') {
        router.replace('/guru/dashboard')
      } else {
        router.replace('/dashboard')
      }
    }
  }

  const handleDemoLogin = async (role: 'guru' | 'murid' | 'orangtua') => {
    setError('')
    setLoading(true)
    const demoCredentials: Record<string, { email: string; password: string }> = {
      guru: { email: 'ahmad.fauzi@smadule.id', password: 'demo1234' },
      murid: { email: 'daffa.rizky@smadule.id', password: 'demo1234' },
      orangtua: { email: 'bpk.rizky@smadule.id', password: 'demo1234' },
    }
    const cred = demoCredentials[role]
    setEmail(cred.email)
    setPassword(cred.password)
    const result = await signIn(cred.email, cred.password)
    setLoading(false)
    if (result.error) {
      // Demo accounts may not exist, set fake user for preview
      const demoUsers = {
        guru: { id: 'demo-guru', email: cred.email, role: 'guru' as const, name: 'Pak Ahmad Fauzi' },
        murid: { id: 'demo-murid', email: cred.email, role: 'murid' as const, name: 'Daffa Rizky' },
        orangtua: { id: 'demo-ortu', email: cred.email, role: 'orangtua' as const, name: 'Bpk. Rizky Pratama' },
      }
      setAuthUser(demoUsers[role])
      if (role === 'guru') {
        router.replace('/guru/dashboard')
      } else {
        router.replace('/dashboard')
      }
      return
    }
    if (result.user) {
      setAuthUser(result.user)
      if (result.user.role === 'guru') {
        router.replace('/guru/dashboard')
      } else {
        router.replace('/dashboard')
      }
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 flex">
      {/* Left panel – branding */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12 relative overflow-hidden">
        {/* Background shapes */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 rounded-full bg-indigo-500/10 blur-3xl" />
          <div className="absolute bottom-20 right-10 w-96 h-96 rounded-full bg-violet-500/10 blur-3xl" />
        </div>
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
              <GraduationCap size={20} className="text-white" />
            </div>
            <span className="font-display font-bold text-2xl text-white tracking-tight">SMADULE</span>
          </div>
          <p className="text-indigo-300 text-sm ml-[52px]">Platform Belajar Cerdas</p>
        </div>
        <div className="relative z-10 space-y-6">
          <h2 className="text-4xl font-display font-bold text-white leading-tight">
            Belajar Lebih<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-violet-400">
              Cerdas & Terstruktur
            </span>
          </h2>
          <p className="text-slate-400 text-base leading-relaxed max-w-sm">
            Platform pembelajaran digital untuk SMA — jadwal otomatis, tugas terintegrasi, dan pemantauan nilai real-time.
          </p>
          <div className="space-y-3">
            {[
              { icon: BookOpen, text: 'Akses materi & tugas kapan saja' },
              { icon: GraduationCap, text: 'Dashboard khusus guru & murid' },
              { icon: Users, text: 'Pantauan orang tua real-time' },
            ].map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-lg bg-indigo-500/20 flex items-center justify-center shrink-0">
                  <Icon size={14} className="text-indigo-400" />
                </div>
                <span className="text-slate-300 text-sm">{text}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="relative z-10 text-slate-600 text-xs">
          © 2026 SMADULE. All rights reserved.
        </div>
      </div>

      {/* Right panel – form */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center">
              <GraduationCap size={18} className="text-white" />
            </div>
            <span className="font-display font-bold text-xl text-white">SMADULE</span>
          </div>

          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">
            <div className="mb-8">
              <h1 className="text-2xl font-display font-bold text-white mb-1">Selamat Datang</h1>
              <p className="text-slate-400 text-sm">Masuk ke akun Anda untuk melanjutkan</p>
            </div>

            {error && (
              <div className="flex items-start gap-2.5 bg-rose-500/10 border border-rose-500/20 rounded-xl px-4 py-3 mb-5">
                <AlertCircle size={16} className="text-rose-400 shrink-0 mt-0.5" />
                <p className="text-rose-300 text-sm">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">Email</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="nama@sekolah.id"
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-slate-500 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-slate-500 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all pr-12"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-200 transition-colors"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    <span>Sedang masuk...</span>
                  </>
                ) : (
                  <>
                    <span>Masuk</span>
                    <ArrowRight size={16} />
                  </>
                )}
              </button>
            </form>

            {/* Demo Accounts */}
            <div className="mt-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="flex-1 h-px bg-white/10" />
                <span className="text-slate-500 text-xs">Coba mode demo</span>
                <div className="flex-1 h-px bg-white/10" />
              </div>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { role: 'guru' as const, label: 'Guru', icon: GraduationCap, color: 'from-indigo-500/20 to-violet-500/20 hover:from-indigo-500/30 hover:to-violet-500/30 border-indigo-500/30' },
                  { role: 'murid' as const, label: 'Murid', icon: BookOpen, color: 'from-emerald-500/20 to-teal-500/20 hover:from-emerald-500/30 hover:to-teal-500/30 border-emerald-500/30' },
                  { role: 'orangtua' as const, label: 'Ortu', icon: Users, color: 'from-amber-500/20 to-orange-500/20 hover:from-amber-500/30 hover:to-orange-500/30 border-amber-500/30' },
                ].map(({ role, label, icon: Icon, color }) => (
                  <button
                    key={role}
                    disabled={loading}
                    onClick={() => handleDemoLogin(role)}
                    className={`flex flex-col items-center gap-1.5 py-3 px-2 rounded-xl bg-gradient-to-br ${color} border transition-all duration-200 disabled:opacity-50`}
                  >
                    <Icon size={18} className="text-white/80" />
                    <span className="text-white/70 text-xs font-medium">{label}</span>
                  </button>
                ))}
              </div>
            </div>

            <p className="mt-6 text-center text-sm text-slate-500">
              Belum punya akun?{' '}
              <Link href="/signup" className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors">
                Daftar sekarang
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
