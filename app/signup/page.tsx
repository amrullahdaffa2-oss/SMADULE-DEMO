'use client'

import { FormEvent, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  GraduationCap, Eye, EyeOff, AlertCircle, Loader2,
  BookOpen, Users, CheckCircle, ArrowRight,
} from 'lucide-react'
import { signUp } from '@/lib/auth'
import { useAppStore } from '@/lib/store'
import { cn } from '@/lib/utils'

type StudentRole = 'murid' | 'orangtua'

export default function SignupPage() {
  const router = useRouter()
  const { setAuthUser } = useAppStore()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [role, setRole] = useState<StudentRole>('murid')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (password !== confirmPassword) {
      setError('Password dan konfirmasi password tidak cocok.')
      return
    }
    if (password.length < 8) {
      setError('Password minimal 8 karakter.')
      return
    }
    setError('')
    setLoading(true)
    const result = await signUp(email, password, role, name)
    setLoading(false)
    if (result.error) {
      const msg = result.error.toLowerCase()
      if (msg.includes('rate') || msg.includes('over_email') || msg.includes('email')) {
        setError('Terlalu banyak permintaan email. Tunggu beberapa menit dan coba lagi, atau minta admin menonaktifkan konfirmasi email di Supabase Dashboard.')
      } else {
        setError(result.error)
      }
      return
    }
    if (result.user) {
      setAuthUser(result.user)
      router.replace('/dashboard')
      return
    }
    setSuccess(true)
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 flex items-center justify-center p-6">
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-10 max-w-md w-full text-center shadow-2xl">
          <div className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-5">
            <CheckCircle size={32} className="text-emerald-400" />
          </div>
          <h2 className="text-2xl font-display font-bold text-white mb-2">Pendaftaran Berhasil!</h2>
          <p className="text-slate-400 text-sm mb-6">
            Kami telah mengirimkan email konfirmasi ke <strong className="text-white">{email}</strong>. 
            Silakan cek inbox Anda dan klik tautan konfirmasi sebelum masuk.
          </p>
          <Link
            href="/login"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-semibold rounded-xl transition-all hover:shadow-lg hover:shadow-indigo-500/30"
          >
            Ke Halaman Masuk
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex items-center gap-2 mb-8 justify-center">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center">
            <GraduationCap size={18} className="text-white" />
          </div>
          <span className="font-display font-bold text-xl text-white">SMADULE</span>
        </div>

        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">
          <div className="mb-7">
            <h1 className="text-2xl font-display font-bold text-white mb-1">Buat Akun Baru</h1>
            <p className="text-slate-400 text-sm">Bergabung dengan ribuan pelajar di SMADULE</p>
          </div>

          {error && (
            <div className="flex items-start gap-2.5 bg-rose-500/10 border border-rose-500/20 rounded-xl px-4 py-3 mb-5">
              <AlertCircle size={16} className="text-rose-400 shrink-0 mt-0.5" />
              <p className="text-rose-300 text-sm">{error}</p>
            </div>
          )}

          {/* Role Selection */}
          <div className="mb-5">
            <label className="block text-sm font-medium text-slate-300 mb-2">Daftar sebagai</label>
            <div className="grid grid-cols-2 gap-3">
              {([
                { value: 'murid', label: 'Murid', icon: BookOpen, desc: 'Pelajar aktif' },
                { value: 'orangtua', label: 'Orang Tua', icon: Users, desc: 'Pantau anak' },
              ] as const).map(({ value, label, icon: Icon, desc }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setRole(value)}
                  className={cn(
                    'flex items-center gap-3 p-3.5 rounded-xl border transition-all duration-200 text-left',
                    role === value
                      ? 'bg-indigo-500/20 border-indigo-500/50 shadow-indigo-500/10 shadow-md'
                      : 'bg-white/5 border-white/10 hover:border-white/20'
                  )}
                >
                  <div className={cn(
                    'w-9 h-9 rounded-lg flex items-center justify-center shrink-0',
                    role === value ? 'bg-indigo-500/30' : 'bg-white/10'
                  )}>
                    <Icon size={16} className={role === value ? 'text-indigo-300' : 'text-slate-400'} />
                  </div>
                  <div>
                    <p className={cn('text-sm font-semibold', role === value ? 'text-white' : 'text-slate-300')}>{label}</p>
                    <p className="text-xs text-slate-500">{desc}</p>
                  </div>
                </button>
              ))}
            </div>
            <p className="mt-2.5 text-xs text-slate-500 flex items-center gap-1.5">
              <GraduationCap size={12} className="text-indigo-400" />
              Akun guru didaftarkan oleh administrator sekolah.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Nama Lengkap</label>
              <input
                type="text"
                required
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Masukkan nama lengkap"
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-slate-500 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="nama@email.com"
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
                  placeholder="Min. 8 karakter"
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
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Konfirmasi Password</label>
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                placeholder="Ulangi password"
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-slate-500 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2"
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  <span>Mendaftar...</span>
                </>
              ) : (
                <>
                  <span>Buat Akun</span>
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-500">
            Sudah punya akun?{' '}
            <Link href="/login" className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors">
              Masuk sekarang
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
