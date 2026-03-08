'use client'

import { FormEvent, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  GraduationCap, Eye, EyeOff, AlertCircle, Loader2,
  ArrowRight, BookOpen, BarChart2, Users, Shield,
} from 'lucide-react'
import { signIn } from '@/lib/auth'
import { useAppStore } from '@/lib/store'

export default function GuruLoginPage() {
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
      setError('Email atau password salah. Pastikan akun Anda sudah terdaftar sebagai guru.')
      return
    }
    if (result.user?.role !== 'guru') {
      setError('Akun ini bukan akun guru. Silakan gunakan portal murid.')
      return
    }
    setAuthUser(result.user)
    router.replace('/guru/dashboard')
  }

  const handleDemo = async () => {
    setError('')
    setLoading(true)
    // Try real login first
    const result = await signIn('ahmad.fauzi@smadule.id', 'demo1234')
    setLoading(false)
    if (!result.error && result.user) {
      setAuthUser(result.user)
    } else {
      // Fallback demo user
      setAuthUser({ id: 'demo-guru', email: 'ahmad.fauzi@smadule.id', role: 'guru', name: 'Pak Ahmad Fauzi' })
    }
    router.replace('/guru/dashboard')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 flex">
      {/* Left branding */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 rounded-full bg-indigo-500/10 blur-3xl" />
          <div className="absolute bottom-20 right-10 w-96 h-96 rounded-full bg-violet-500/10 blur-3xl" />
          {/* Decorative grid */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(99,102,241,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(99,102,241,0.03)_1px,transparent_1px)] bg-[size:40px_40px]" />
        </div>

        <div className="relative z-10 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
            <GraduationCap size={20} className="text-white" />
          </div>
          <div>
            <span className="font-display font-bold text-2xl text-white tracking-tight block">SMADULE</span>
            <span className="text-indigo-400 text-xs font-semibold uppercase tracking-widest">Portal Guru</span>
          </div>
        </div>

        <div className="relative z-10 space-y-8">
          <div>
            <h2 className="text-4xl font-display font-bold text-white leading-tight mb-4">
              Kelola Kelas dengan{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-violet-400">
                Lebih Efisien
              </span>
            </h2>
            <p className="text-slate-400 leading-relaxed max-w-sm">
              Portal khusus tenaga pengajar. Kelola materi, absensi, nilai, dan tugas seluruh siswa dari satu tempat.
            </p>
          </div>

          <div className="space-y-3">
            {[
              { icon: BookOpen, title: 'Manajemen Materi', desc: 'Upload & jadwalkan konten belajar' },
              { icon: BarChart2, title: 'Analitik Nilai', desc: 'Pantau perkembangan setiap siswa' },
              { icon: Users, title: 'Data Murid', desc: 'Kelola absensi & progress kelas' },
              { icon: Shield, title: 'Akses Khusus Guru', desc: 'Portal aman terpisah dari murid' },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="flex items-center gap-3.5">
                <div className="w-9 h-9 rounded-xl bg-indigo-500/15 border border-indigo-500/20 flex items-center justify-center shrink-0">
                  <Icon size={16} className="text-indigo-400" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">{title}</p>
                  <p className="text-xs text-slate-500">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10 text-slate-600 text-xs">
          © 2026 SMADULE — Khusus Tenaga Pengajar
        </div>
      </div>

      {/* Right form */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="flex items-center gap-2.5 mb-8 lg:hidden">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center">
              <GraduationCap size={18} className="text-white" />
            </div>
            <div>
              <span className="font-display font-bold text-xl text-white block">SMADULE</span>
              <span className="text-indigo-400 text-[10px] font-semibold uppercase tracking-widest">Portal Guru</span>
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">
            {/* Header */}
            <div className="mb-7">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/15 border border-indigo-500/25 mb-4">
                <Shield size={12} className="text-indigo-400" />
                <span className="text-indigo-300 text-xs font-semibold">Akses Tenaga Pengajar</span>
              </div>
              <h1 className="text-2xl font-display font-bold text-white mb-1">Masuk ke Portal Guru</h1>
              <p className="text-slate-400 text-sm">Gunakan email sekolah Anda untuk masuk</p>
            </div>

            {error && (
              <div className="flex items-start gap-2.5 bg-rose-500/10 border border-rose-500/20 rounded-xl px-4 py-3 mb-5">
                <AlertCircle size={16} className="text-rose-400 shrink-0 mt-0.5" />
                <p className="text-rose-300 text-sm">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">Email Sekolah</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="nama@smadule.id"
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-slate-500 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                />
              </div>
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-sm font-medium text-slate-300">Password</label>
                  <button type="button" className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors">
                    Lupa password?
                  </button>
                </div>
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
                className="w-full py-3 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2"
              >
                {loading ? (
                  <><Loader2 size={16} className="animate-spin" /><span>Memverifikasi...</span></>
                ) : (
                  <><span>Masuk ke Portal Guru</span><ArrowRight size={16} /></>
                )}
              </button>
            </form>

            {/* Demo */}
            <div className="mt-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="flex-1 h-px bg-white/10" />
                <span className="text-slate-500 text-xs">atau</span>
                <div className="flex-1 h-px bg-white/10" />
              </div>
              <button
                onClick={handleDemo}
                disabled={loading}
                className="w-full py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-slate-300 text-sm font-medium rounded-xl transition-all flex items-center justify-center gap-2"
              >
                <GraduationCap size={15} className="text-indigo-400" />
                Coba Demo — Pak Ahmad Fauzi
              </button>
            </div>

            {/* Links */}
            <div className="mt-6 flex flex-col gap-2 text-center">
              <p className="text-sm text-slate-500">
                Belum terdaftar?{' '}
                <Link href="/guru/signup" className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors">
                  Daftar akun guru
                </Link>
              </p>
              <p className="text-xs text-slate-600">
                Bukan guru?{' '}
                <Link href="/login" className="text-slate-400 hover:text-slate-300 transition-colors">
                  Masuk sebagai murid/orang tua
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
