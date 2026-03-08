'use client'

import { useState, useEffect } from 'react'
import { useAppStore } from '@/lib/store'
import { getPengajar } from '@/lib/supabase-service'
import { cn } from '@/lib/utils'
import {
  Users, Search, MessageCircle, Phone, Mail, X, Send,
  Circle, BookOpen, GraduationCap
} from 'lucide-react'

const statusConfig = {
  online: { label: 'Online', color: 'bg-emerald-500' },
  mengajar: { label: 'Mengajar', color: 'bg-amber-500' },
  offline: { label: 'Offline', color: 'bg-slate-400' },
}

export default function PengajarPage() {
  const { role } = useAppStore()
  const [search, setSearch] = useState('')
  const [filterMapel, setFilterMapel] = useState<string>('all')
  const [chatOpen, setChatOpen] = useState<string | null>(null)
  const [messages, setMessages] = useState<Record<string, { text: string; from: 'user' | 'guru'; time: Date }[]>>({})
  const [inputMessage, setInputMessage] = useState('')
  const [allPengajar, setAllPengajar] = useState<{
    id: string; nama: string; mapel: string; kelas: string[]
    wa: string; email: string; avatar: string; status: string
    spesialisasi: string; color: string
  }[]>([])

  useEffect(() => {
    getPengajar().then(setAllPengajar).catch(console.error)
  }, [])

  const mapelList = [...new Set(allPengajar.map(p => p.mapel))]

  const filteredPengajar = allPengajar.filter(p => {
    const matchSearch = p.nama.toLowerCase().includes(search.toLowerCase()) ||
      p.mapel.toLowerCase().includes(search.toLowerCase())
    const matchMapel = filterMapel === 'all' || p.mapel === filterMapel
    return matchSearch && matchMapel
  })

  const handleSendMessage = (guruId: string) => {
    if (!inputMessage.trim()) return

    const newMessages = {
      ...messages,
      [guruId]: [
        ...(messages[guruId] || []),
        { text: inputMessage, from: 'user' as const, time: new Date() }
      ]
    }
    setMessages(newMessages)
    setInputMessage('')

    // Simulate auto-reply after 1 second
    setTimeout(() => {
      const guru = allPengajar.find(g => g.id === guruId)
      setMessages(prev => ({
        ...prev,
        [guruId]: [
          ...(prev[guruId] || []),
          {
            text: `Terima kasih atas pesan Anda. Saya akan membalas secepatnya. - ${guru?.nama}`,
            from: 'guru' as const,
            time: new Date()
          }
        ]
      }))
    }, 1000)
  }

  const selectedGuru = allPengajar.find(g => g.id === chatOpen)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold font-display text-slate-900">Daftar Pengajar</h1>
        <p className="text-slate-500 text-sm mt-1">
          {role === 'guru' ? 'Kolega pengajar di SMADULE' : 'Hubungi guru untuk konsultasi dan pertanyaan'}
        </p>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Cari nama guru atau mata pelajaran..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>
        <select
          value={filterMapel}
          onChange={(e) => setFilterMapel(e.target.value)}
          className="px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="all">Semua Mata Pelajaran</option>
          {mapelList.map(mapel => (
            <option key={mapel} value={mapel}>{mapel}</option>
          ))}
        </select>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-xl p-4 border border-slate-200">
          <div className="w-10 h-10 rounded-lg bg-indigo-500 flex items-center justify-center mb-3">
            <Users size={20} className="text-white" />
          </div>
          <p className="text-2xl font-bold text-slate-900 font-display">{allPengajar.length}</p>
          <p className="text-sm text-slate-500">Total Pengajar</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-slate-200">
          <div className="w-10 h-10 rounded-lg bg-emerald-500 flex items-center justify-center mb-3">
            <Circle size={20} className="text-white fill-white" />
          </div>
          <p className="text-2xl font-bold text-slate-900 font-display">
            {allPengajar.filter(p => p.status === 'online').length}
          </p>
          <p className="text-sm text-slate-500">Online Sekarang</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-slate-200">
          <div className="w-10 h-10 rounded-lg bg-amber-500 flex items-center justify-center mb-3">
            <GraduationCap size={20} className="text-white" />
          </div>
          <p className="text-2xl font-bold text-slate-900 font-display">
            {allPengajar.filter(p => p.status === 'mengajar').length}
          </p>
          <p className="text-sm text-slate-500">Sedang Mengajar</p>
        </div>
      </div>

      {/* Teacher Cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredPengajar.map((guru) => {
          const status = statusConfig[guru.status as keyof typeof statusConfig]
          return (
            <div key={guru.id} className="bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-md transition-shadow">
              <div className="p-5">
                <div className="flex items-start gap-4">
                  <div
                    className="w-14 h-14 rounded-xl flex items-center justify-center text-white font-bold text-lg shrink-0"
                    style={{ backgroundColor: guru.color }}
                  >
                    {guru.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-slate-900 truncate">{guru.nama}</h3>
                      <span className={cn('w-2.5 h-2.5 rounded-full shrink-0', status.color)} title={status.label} />
                    </div>
                    <p className="text-sm text-indigo-600 font-medium">{guru.mapel}</p>
                    <p className="text-xs text-slate-500 mt-1">{guru.spesialisasi}</p>
                  </div>
                </div>

                <div className="mt-4 flex items-center gap-2 text-xs text-slate-500">
                  <BookOpen size={14} />
                  <span>Kelas {guru.kelas.join(', ')}</span>
                </div>

                <div className="mt-4 flex items-center gap-2">
                  <button
                    onClick={() => setChatOpen(guru.id)}
                    className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors"
                  >
                    <MessageCircle size={16} />
                    Chat
                  </button>
                  <a
                    href={`https://wa.me/${guru.wa}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center p-2 bg-emerald-100 text-emerald-600 rounded-lg hover:bg-emerald-200 transition-colors"
                    title="WhatsApp"
                  >
                    <Phone size={16} />
                  </a>
                  <a
                    href={`mailto:${guru.email}`}
                    className="inline-flex items-center justify-center p-2 bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200 transition-colors"
                    title="Email"
                  >
                    <Mail size={16} />
                  </a>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {filteredPengajar.length === 0 && (
        <div className="text-center py-12 bg-white rounded-xl border border-slate-200">
          <Users size={48} className="mx-auto text-slate-300 mb-4" />
          <p className="text-slate-500">Tidak ada pengajar ditemukan</p>
        </div>
      )}

      {/* Chat Modal */}
      {chatOpen && selectedGuru && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/50" onClick={() => setChatOpen(null)} />
          <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden">
            {/* Header */}
            <div className="flex items-center gap-3 px-5 py-4 border-b border-slate-100">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold text-sm"
                style={{ backgroundColor: selectedGuru.color }}
              >
                {selectedGuru.avatar}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-slate-900">{selectedGuru.nama}</p>
                <p className="text-xs text-slate-500">{selectedGuru.mapel}</p>
              </div>
              <button
                onClick={() => setChatOpen(null)}
                className="p-2 rounded-lg hover:bg-slate-100 text-slate-400"
              >
                <X size={20} />
              </button>
            </div>

            {/* Messages */}
            <div className="h-80 overflow-y-auto p-4 space-y-3">
              {(!messages[selectedGuru.id] || messages[selectedGuru.id].length === 0) ? (
                <div className="text-center text-slate-400 text-sm py-8">
                  Mulai percakapan dengan {selectedGuru.nama}
                </div>
              ) : (
                messages[selectedGuru.id].map((msg, i) => (
                  <div
                    key={i}
                    className={cn(
                      'max-w-[80%] px-4 py-2.5 rounded-2xl text-sm',
                      msg.from === 'user'
                        ? 'ml-auto bg-indigo-600 text-white rounded-br-md'
                        : 'bg-slate-100 text-slate-900 rounded-bl-md'
                    )}
                  >
                    {msg.text}
                  </div>
                ))
              )}
            </div>

            {/* Input */}
            <div className="px-4 py-3 border-t border-slate-100">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendMessage(selectedGuru.id)}
                  placeholder="Ketik pesan..."
                  className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <button
                  onClick={() => handleSendMessage(selectedGuru.id)}
                  className="p-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors"
                >
                  <Send size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
