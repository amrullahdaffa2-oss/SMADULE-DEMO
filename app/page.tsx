'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  GraduationCap,
  Sparkles,
  ChevronRight,
  Clock,
  CheckCircle,
  Users,
  BookOpen,
  Zap,
  Brain,
  BarChart3,
  Gamepad2,
  Bell,
  Eye,
  Heart,
  Star,
  ArrowRight,
} from 'lucide-react'

export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-white/80 backdrop-blur-md border-b border-slate-200'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-6xl mx-auto px-4 lg:px-6 py-4 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center w-9 h-9 rounded-lg gradient-bg">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-bold font-display gradient-text">SMADULE</span>
          </div>

          {/* Nav Links */}
          <div className="hidden md:flex items-center gap-8">
            <Link href="#fitur" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition">
              Fitur
            </Link>
            <Link href="#cara-kerja" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition">
              Cara Kerja
            </Link>
            <Link href="#testimoni" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition">
              Testimoni
            </Link>
          </div>

          {/* CTA Button */}
          <Link
            href="/login"
            className="px-5 py-2 text-sm font-medium bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
          >
            Masuk
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-16 px-4 lg:px-6 bg-gradient-to-br from-slate-50 via-indigo-50 to-violet-50">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Column */}
            <div className="animate-fadeIn">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-100/50 border border-indigo-200 mb-6">
                <Sparkles className="w-4 h-4 text-indigo-600" />
                <span className="text-sm font-medium text-indigo-700">Powered by Claude AI</span>
              </div>

              {/* Heading */}
              <h1 className="text-5xl lg:text-6xl font-bold font-display text-slate-900 mb-6 leading-tight">
                Platform Belajar <span className="gradient-text">Cerdas</span> untuk Era Digital
              </h1>

              {/* Description */}
              <p className="text-lg text-slate-600 mb-8 leading-relaxed">
                SMADULE menghadirkan solusi pembelajaran terintegrasi dengan AI, gamifikasi, dan analitik real-time untuk memaksimalkan potensi siswa SMA.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <Link
                  href="/login"
                  className="px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition flex items-center justify-center gap-2"
                >
                  Mulai Sekarang <ArrowRight className="w-4 h-4" />
                </Link>
                <button className="px-6 py-3 border-2 border-slate-300 text-slate-700 font-medium rounded-lg hover:border-slate-400 hover:bg-slate-50 transition">
                  Lihat Fitur
                </button>
              </div>

              {/* User Avatars */}
              <div className="flex items-center gap-3">
                <div className="flex -space-x-3">
                  {[
                    { bg: 'bg-indigo-500', text: 'DA' },
                    { bg: 'bg-emerald-500', text: 'AR' },
                    { bg: 'bg-amber-500', text: 'MJ' },
                    { bg: 'bg-rose-500', text: 'SK' },
                  ].map((avatar, i) => (
                    <div
                      key={i}
                      className={`w-8 h-8 rounded-full ${avatar.bg} text-white text-xs font-bold flex items-center justify-center border-2 border-white`}
                    >
                      {avatar.text}
                    </div>
                  ))}
                </div>
                <p className="text-sm text-slate-600">
                  <span className="font-semibold text-slate-900">500+</span> murid dan{' '}
                  <span className="font-semibold text-slate-900">50+</span> guru sudah bergabung
                </p>
              </div>
            </div>

            {/* Right Column - Dashboard Card Mockup */}
            <div className="hidden lg:block animate-fadeIn" style={{ animationDelay: '0.2s' }}>
              <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-200 p-6 space-y-6">
                {/* User Header */}
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-500">Halo,</p>
                    <p className="text-xl font-bold text-slate-900 font-display">Daffa Rizky</p>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-indigo-500 text-white font-bold flex items-center justify-center text-lg">
                    DR
                  </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { label: 'Poin', value: '420' },
                    { label: 'Ranking', value: '#3' },
                    { label: 'Kehadiran', value: '95%' },
                  ].map((stat, i) => (
                    <div key={i} className="bg-slate-50 rounded-lg p-3 text-center">
                      <p className="text-xs text-slate-500 mb-1">{stat.label}</p>
                      <p className="text-lg font-bold text-slate-900 font-display">{stat.value}</p>
                    </div>
                  ))}
                </div>

                {/* Materi List */}
                <div className="space-y-2 border-t border-slate-200 pt-4">
                  <p className="text-xs font-semibold text-slate-500 uppercase">Materi Terbaru</p>
                  {[
                    { title: 'Integral Tak Tentu', subject: 'Matematika', status: '75%' },
                    { title: 'Hukum Newton III', subject: 'Fisika', status: '100%' },
                    { title: 'Puisi Angkatan 45', subject: 'B. Indonesia', status: '40%' },
                  ].map((materi, i) => (
                    <div key={i} className="flex items-center justify-between p-2 bg-slate-50 rounded-lg">
                      <div>
                        <p className="text-xs font-medium text-slate-900">{materi.title}</p>
                        <p className="text-xs text-slate-500">{materi.subject}</p>
                      </div>
                      <span className="text-xs font-semibold text-indigo-600">{materi.status}</span>
                    </div>
                  ))}
                </div>

                {/* AI Banner */}
                <div className="bg-gradient-to-r from-violet-100 to-indigo-100 rounded-xl p-3 border border-indigo-200">
                  <p className="text-xs font-medium text-indigo-900">🤖 AI Pre-Test dimulai dalam 2 jam</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 lg:px-6 bg-gradient-to-r from-indigo-600 to-violet-600">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: Users, value: '500+', label: 'Murid Aktif' },
              { icon: GraduationCap, value: '50+', label: 'Pengajar' },
              { icon: BookOpen, value: '1.000+', label: 'Materi' },
              { icon: CheckCircle, value: '95%', label: 'Tingkat Kehadiran' },
            ].map((stat, i) => (
              <div key={i} className="text-center text-white">
                <stat.icon className="w-12 h-12 mx-auto mb-3 opacity-90" />
                <p className="text-4xl font-bold font-display mb-2">{stat.value}</p>
                <p className="text-indigo-100 text-sm">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="fitur" className="py-16 px-4 lg:px-6 bg-slate-50">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-100/50 border border-indigo-200 mb-4">
              <Zap className="w-4 h-4 text-indigo-600" />
              <span className="text-sm font-medium text-indigo-700">Fitur Unggulan</span>
            </div>
            <h2 className="text-4xl font-bold font-display text-slate-900 mb-4">
              Semua yang dibutuhkan dalam satu platform
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Kelola pembelajaran dengan tools lengkap yang dirancang khusus untuk kebutuhan sekolah menengah atas
            </p>
          </div>

          {/* Feature Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Clock, title: 'Jadwal Otomatis', desc: 'Kelola jadwal pelajaran dengan mudah dan sinkron real-time', color: 'indigo' },
              { icon: CheckCircle, title: 'Absensi Cerdas', desc: 'Sistem kehadiran terintegrasi dengan notifikasi otomatis', color: 'emerald' },
              { icon: Brain, title: 'AI Pre-Test', desc: 'Pre-test cerdas dengan AI untuk persiapan optimal', color: 'violet' },
              { icon: BarChart3, title: 'Analitik Nilai', desc: 'Pantau progress dengan analytics dashboard lengkap', color: 'amber' },
              { icon: Gamepad2, title: 'Gamifikasi', desc: 'Sistem poin dan ranking untuk motivasi belajar', color: 'rose' },
              { icon: Bell, title: 'Notifikasi Pintar', desc: 'Pengingat tepat waktu untuk tugas dan jadwal', color: 'teal' },
              { icon: Eye, title: 'Mode Fokus', desc: 'Kurangi distraksi dengan mode fokus terpilih', color: 'slate' },
              { icon: Heart, title: 'Portal Orang Tua', desc: 'Pantau perkembangan anak secara langsung dan detail', color: 'pink' },
            ].map((feature, i) => (
              <div
                key={i}
                className="bg-white rounded-xl p-6 border border-slate-200 hover:shadow-lg transition-shadow group cursor-pointer"
              >
                <div className={`inline-flex items-center justify-center w-12 h-12 rounded-lg bg-${feature.color}-100 mb-4 group-hover:scale-110 transition-transform`}>
                  <feature.icon className={`w-6 h-6 text-${feature.color}-600`} />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">{feature.title}</h3>
                <p className="text-sm text-slate-600">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="cara-kerja" className="py-16 px-4 lg:px-6">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold font-display text-slate-900 mb-4">Cara Kerja SMADULE</h2>
            <p className="text-lg text-slate-600">Tiga langkah mudah untuk memulai revolusi pembelajaran</p>
          </div>

          {/* Steps */}
          <div className="grid md:grid-cols-3 gap-8 relative">
            {/* Connector Lines (Desktop Only) */}
            <div className="hidden md:block absolute top-16 left-0 right-0 h-1 bg-gradient-to-r from-slate-200 via-indigo-300 to-slate-200" />

            {[
              { step: '01', icon: GraduationCap, title: 'Guru Input Materi', desc: 'Guru memasukkan materi pembelajaran ke dalam platform dengan mudah' },
              { step: '02', icon: Clock, title: 'Jadwal Aktif Otomatis', desc: 'Sistem secara otomatis mengaktifkan jadwal dan notifikasi untuk siswa' },
              { step: '03', icon: Brain, title: 'Murid Belajar & Berkembang', desc: 'Siswa belajar dengan gamifikasi, AI assistance, dan real-time feedback' },
            ].map((item, i) => (
              <div key={i} className="relative">
                <div className="relative z-10 bg-white rounded-xl p-8 border border-slate-200 text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-xl gradient-bg text-white mb-6 mx-auto">
                    <item.icon className="w-8 h-8" />
                  </div>
                  <span className="inline-block px-3 py-1 text-xs font-bold text-white bg-indigo-600 rounded-full mb-4">
                    {item.step}
                  </span>
                  <h3 className="text-xl font-bold text-slate-900 mb-3 font-display">{item.title}</h3>
                  <p className="text-slate-600 text-sm">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimoni" className="py-16 px-4 lg:px-6 bg-slate-50">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold font-display text-slate-900 mb-4">Apa Kata Mereka</h2>
            <p className="text-lg text-slate-600">Testimoni dari pengguna SMADULE di seluruh Indonesia</p>
          </div>

          {/* Testimonials Grid */}
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: 'Pak Budi Santoso',
                role: 'Guru Fisika',
                content: 'SMADULE benar-benar mengubah cara saya mengajar. Analitik real-time membantu saya memahami pemahaman setiap siswa dengan lebih baik.',
              },
              {
                name: 'Aulia Putri',
                role: 'Murid Kelas XI',
                content: 'Platform ini sangat menyenangkan! Gamifikasi membuat belajar tidak membosankan, dan AI Pre-Test membantu saya persiap ujian.',
              },
              {
                name: 'Bpk. Hendra Wijaya',
                role: 'Orang Tua Murid',
                content: 'Saya senang bisa memantau progress anak melalui portal orang tua. Transparansi seperti ini sangat diperlukan.',
              },
            ].map((testimonial, i) => (
              <div key={i} className="bg-white rounded-xl p-8 border border-slate-200">
                {/* Stars */}
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, j) => (
                    <Star key={j} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>

                {/* Quote */}
                <p className="text-slate-700 italic mb-6">"{testimonial.content}"</p>

                {/* Author */}
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-indigo-500 text-white font-bold flex items-center justify-center">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900 text-sm">{testimonial.name}</p>
                    <p className="text-xs text-slate-500">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 lg:px-6 bg-gradient-to-r from-indigo-600 to-violet-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold font-display text-white mb-6">Siap Revolusi Cara Belajar?</h2>
          <p className="text-lg text-indigo-100 mb-8">
            Bergabunglah dengan ratusan sekolah yang telah mempercayai SMADULE untuk transformasi digital pendidikan
          </p>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-indigo-600 font-semibold rounded-lg hover:bg-indigo-50 transition text-lg"
          >
            Coba Demo Sekarang <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-8 px-4 lg:px-6">
        <div className="max-w-6xl mx-auto flex flex-col items-center justify-center gap-4 text-center">
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg gradient-bg">
              <GraduationCap className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-white">SMADULE</span>
          </div>
          <p className="text-sm">© 2024 SMADULE. Platform Belajar Cerdas untuk Era Digital.</p>
        </div>
      </footer>
    </div>
  )
}
