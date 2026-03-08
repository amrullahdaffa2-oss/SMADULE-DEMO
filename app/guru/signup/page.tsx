'use client'

import { FormEvent, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  GraduationCap, Eye, EyeOff, AlertCircle, Loader2,
  ArrowRight, CheckCircle, Shield, BookOpen, Hash,
} from 'lucide-react'
import { signUp } from '@/lib/auth'
import { useAppStore } from '@/lib/store'

export default function GuruSignupPage() {
  const router = useRouter()
  const { setAuthUser } = useAppStore()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [inviteCode, setInviteCode] = useState('')
  const [mapel, setMapel] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  // Simple invite code check (in production this should be server-side)
  const VALID_INVITE_CODE = 'SMADULE-GURU-2026'

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (inviteCode.trim().toUpperCase() !== VALID_INVITE_CODE) {
      setError('Kode undangan tidak valid. Hubungi administrator sekolah.')
      return
    }
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
    const result = await signUp(email, password, 'guru', name, { mapel })
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
      router.replace('/guru/dashboard')
      return
    }
    // Fallback: email confirmation required
    setSuccess(true)
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 flex items-center justify-center p-6">
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-10 max-w-md w-full text-center shadow-2xl">
          <div className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-5">
            <CheckCircle size={32} className="text-emerald-400" />
          </div>
          <h2 className="text-2xl font-display font-bold text-white mb-2">Pendaftaran Terkirim!</h2>
          <p className="text-slate-400 text-sm mb-2">
            Email konfirmasi dikirim ke <strong className="text-white">{email}</strong>.
          </p>
          <p className="text-slate-500 text-xs mb-6">
            Setelah konfirmasi email, akun Anda akan ditinjau oleh admin sekolah sebelum diaktifkan.
          </p>
          <Link
            href="/guru/login"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-semibold rounded-xl transition-all hover:shadow-lg hover:shadow-indigo-500/30"
          >
            Ke Halaman Login Guru
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
        <div className="flex items-center gap-2.5 mb-8 justify-center">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center">
            <GraduationCap size={18} className="text-white" />
          </div>
          <div>
            <span className="font-display font-bold text-xl text-white block">SMADULE</span>
            <span className="text-indigo-400 text-[10px] font-semibold uppercase tracking-widest">Portal Guru</span>
          </div>
        </div>

        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">
          <div className="mb-7">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/15 border border-indigo-500/25 mb-4">
              <Shield size={12} className="text-indigo-400" />
              <span className="text-indigo-300 text-xs font-semibold">Registrasi Tenaga Pengajar</span>
            </div>
            <h1 className="text-2xl font-display font-bold text-white mb-1">Daftar Akun Guru</h1>
            <p className="text-slate-400 text-sm">Diperlukan kode undangan dari administrator sekolah</p>
          </div>

          {error && (
            <div className="flex items-start gap-2.5 bg-rose-500/10 border border-rose-500/20 rounded-xl px-4 py-3 mb-5">
              <AlertCircle size={16} className="text-rose-400 shrink-0 mt-0.5" />
              <p className="text-rose-300 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Invite Code */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">
                Kode Undangan <span className="text-rose-400">*</span>
              </label>
              <div className="relative">
                <Hash size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="text"
                  required
                  value={inviteCode}
                  onChange={e => setInviteCode(e.target.value)}
                  placeholder="SMADULE-GURU-XXXX"
                  className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-slate-500 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all font-mono"
                />
              </div>
              <p className="text-xs text-slate-600 mt-1.5">
                Untuk demo, gunakan kode: <span className="font-mono text-indigo-400 select-all">SMADULE-GURU-2026</span>
              </p>
            </div>

            <div className="h-px bg-white/10" />

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Nama Lengkap</label>
              <input
                type="text"
                required
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Contoh: Pak Ahmad Fauzi"
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-slate-500 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Mata Pelajaran</label>
              <div className="relative">
                <BookOpen size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="text"
                  required
                  value={mapel}
                  onChange={e => setMapel(e.target.value)}
                  placeholder="Contoh: Matematika"
                  className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-slate-500 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                />
              </div>
            </div>

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
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-200"
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
              className="w-full py-3 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg shadow-indigo-500/25 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2"
            >
              {loading ? (
                <><Loader2 size={16} className="animate-spin" /><span>Mendaftar...</span></>
              ) : (
                <><span>Daftar sebagai Guru</span><ArrowRight size={16} /></>
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-500">
            Sudah punya akun?{' '}
            <Link href="/guru/login" className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors">
              Masuk di sini
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
