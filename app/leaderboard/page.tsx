'use client'

import { useState } from 'react'
import { useAppStore } from '@/lib/store'
import { MOCK_MURID } from '@/lib/mock-data'
import { cn } from '@/lib/utils'
import {
  Trophy, Medal, Award, Star, Gift, Crown, Zap,
  TrendingUp, TrendingDown, Minus, ChevronRight, X, Check
} from 'lucide-react'

const periods = [
  { id: 'minggu', label: 'Minggu Ini' },
  { id: 'bulan', label: 'Bulan Ini' },
  { id: 'semester', label: 'Semester' },
]

const rewards = [
  { id: 'r1', nama: 'Voucher Kantin 10rb', poin: 100, icon: '🎫', stok: 5 },
  { id: 'r2', nama: 'Pulpen Premium', poin: 150, icon: '🖊️', stok: 10 },
  { id: 'r3', nama: 'Buku Tulis Set', poin: 200, icon: '📚', stok: 8 },
  { id: 'r4', nama: 'Voucher Buku 50rb', poin: 350, icon: '📖', stok: 3 },
  { id: 'r5', nama: 'Flash Drive 16GB', poin: 500, icon: '💾', stok: 2 },
  { id: 'r6', nama: 'Headphone Wireless', poin: 1000, icon: '🎧', stok: 1 },
]

const badges = [
  { id: 'b1', nama: 'Early Bird', icon: '🌅', desc: 'Login sebelum jam 6 pagi', unlocked: true },
  { id: 'b2', nama: 'Tepat Waktu', icon: '⏰', desc: 'Kumpul 5 tugas tepat waktu', unlocked: true },
  { id: 'b3', nama: 'Rajin Bertanya', icon: '❓', desc: 'Bertanya 10x di diskusi', unlocked: true },
  { id: 'b4', nama: 'Helper', icon: '🤝', desc: 'Membantu 5 teman', unlocked: false },
  { id: 'b5', nama: 'Perfect Score', icon: '💯', desc: 'Nilai 100 di pre-test', unlocked: false },
  { id: 'b6', nama: 'Streak Master', icon: '🔥', desc: 'Login 30 hari berturut-turut', unlocked: false },
]

export default function LeaderboardPage() {
  const { role, muridPoin, addPoin } = useAppStore()
  const [period, setPeriod] = useState('minggu')
  const [redeemModal, setRedeemModal] = useState<typeof rewards[0] | null>(null)
  const [redeemedItems, setRedeemedItems] = useState<string[]>([])

  // Sort students by poin
  const sortedMurid = [...MOCK_MURID].sort((a, b) => b.poin - a.poin)
  const top3 = sortedMurid.slice(0, 3)
  const rest = sortedMurid.slice(3)

  // Current user
  const currentUser = MOCK_MURID.find(m => m.id === 'm1')
  const currentRank = sortedMurid.findIndex(m => m.id === 'm1') + 1

  const handleRedeem = (reward: typeof rewards[0]) => {
    if (muridPoin >= reward.poin && !redeemedItems.includes(reward.id)) {
      addPoin(-reward.poin)
      setRedeemedItems([...redeemedItems, reward.id])
      setRedeemModal(null)
    }
  }

  const getRankChange = (rank: number) => {
    // Simulated rank change
    const changes = [0, 1, -1, 2, 0, -2, 1, 0, -1, 0]
    return changes[rank - 1] || 0
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-display text-slate-900">Leaderboard</h1>
          <p className="text-slate-500 text-sm mt-1">Kompetisi sehat untuk semangat belajar</p>
        </div>
        
        {/* Period Filter */}
        <div className="flex gap-2">
          {periods.map((p) => (
            <button
              key={p.id}
              onClick={() => setPeriod(p.id)}
              className={cn(
                'px-4 py-2 rounded-xl text-sm font-medium transition-colors',
                period === p.id
                  ? 'bg-indigo-600 text-white'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              )}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Current User Stats (Murid only) */}
      {role === 'murid' && (
        <div className="bg-gradient-to-r from-indigo-600 to-violet-600 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-indigo-200 text-sm font-medium">Posisi Kamu</p>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-4xl font-bold font-display">#{currentRank}</span>
                <span className="text-indigo-200">dari {MOCK_MURID.length} murid</span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-indigo-200 text-sm font-medium">Total Poin</p>
              <div className="flex items-center gap-2 mt-1">
                <Zap size={24} className="text-amber-400" />
                <span className="text-4xl font-bold font-display">{muridPoin}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Podium - Top 3 */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <h2 className="font-semibold text-slate-900 mb-6 text-center">Top 3 Minggu Ini</h2>
        <div className="flex items-end justify-center gap-4">
          {/* 2nd Place */}
          <div className="text-center">
            <div className="w-16 h-16 mx-auto rounded-full bg-slate-200 flex items-center justify-center text-xl font-bold text-slate-600 mb-2 ring-4 ring-slate-300">
              {top3[1]?.avatar}
            </div>
            <p className="font-medium text-slate-900 text-sm">{top3[1]?.nama.split(' ')[0]}</p>
            <p className="text-xs text-slate-500">{top3[1]?.poin} poin</p>
            <div className="mt-2 w-20 h-24 bg-slate-200 rounded-t-xl flex items-center justify-center">
              <Medal size={32} className="text-slate-500" />
            </div>
          </div>

          {/* 1st Place */}
          <div className="text-center -mt-4">
            <div className="relative">
              <Crown size={24} className="absolute -top-6 left-1/2 -translate-x-1/2 text-amber-500" />
              <div className="w-20 h-20 mx-auto rounded-full bg-amber-100 flex items-center justify-center text-2xl font-bold text-amber-600 mb-2 ring-4 ring-amber-400">
                {top3[0]?.avatar}
              </div>
            </div>
            <p className="font-semibold text-slate-900">{top3[0]?.nama.split(' ')[0]}</p>
            <p className="text-sm text-amber-600 font-medium">{top3[0]?.poin} poin</p>
            <div className="mt-2 w-24 h-32 bg-amber-400 rounded-t-xl flex items-center justify-center">
              <Trophy size={40} className="text-white" />
            </div>
          </div>

          {/* 3rd Place */}
          <div className="text-center">
            <div className="w-16 h-16 mx-auto rounded-full bg-amber-100 flex items-center justify-center text-xl font-bold text-amber-700 mb-2 ring-4 ring-amber-300">
              {top3[2]?.avatar}
            </div>
            <p className="font-medium text-slate-900 text-sm">{top3[2]?.nama.split(' ')[0]}</p>
            <p className="text-xs text-slate-500">{top3[2]?.poin} poin</p>
            <div className="mt-2 w-20 h-20 bg-amber-200 rounded-t-xl flex items-center justify-center">
              <Award size={28} className="text-amber-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Full Ranking */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100">
          <h2 className="font-semibold text-slate-900">Ranking Lengkap</h2>
        </div>
        <div className="divide-y divide-slate-100">
          {sortedMurid.map((murid, index) => {
            const rank = index + 1
            const rankChange = getRankChange(rank)
            const isCurrentUser = murid.id === 'm1'
            return (
              <div
                key={murid.id}
                className={cn(
                  'px-5 py-4 flex items-center gap-4',
                  isCurrentUser && 'bg-indigo-50'
                )}
              >
                {/* Rank */}
                <div className="w-8 text-center">
                  {rank <= 3 ? (
                    <span className={cn(
                      'text-lg font-bold',
                      rank === 1 ? 'text-amber-500' :
                      rank === 2 ? 'text-slate-400' : 'text-amber-600'
                    )}>
                      {rank === 1 ? '🥇' : rank === 2 ? '🥈' : '🥉'}
                    </span>
                  ) : (
                    <span className="text-lg font-bold text-slate-400">#{rank}</span>
                  )}
                </div>

                {/* Rank Change */}
                <div className="w-6">
                  {rankChange > 0 ? (
                    <TrendingUp size={16} className="text-emerald-500" />
                  ) : rankChange < 0 ? (
                    <TrendingDown size={16} className="text-red-500" />
                  ) : (
                    <Minus size={16} className="text-slate-300" />
                  )}
                </div>

                {/* Avatar */}
                <div className={cn(
                  'w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold',
                  isCurrentUser ? 'bg-indigo-500 text-white' : 'bg-slate-100 text-slate-600'
                )}>
                  {murid.avatar}
                </div>

                {/* Name */}
                <div className="flex-1 min-w-0">
                  <p className={cn(
                    'font-medium truncate',
                    isCurrentUser ? 'text-indigo-600' : 'text-slate-900'
                  )}>
                    {murid.nama}
                    {isCurrentUser && <span className="text-xs ml-2">(Kamu)</span>}
                  </p>
                  <p className="text-xs text-slate-500">{murid.kelas}</p>
                </div>

                {/* Points */}
                <div className="flex items-center gap-1.5">
                  <Star size={16} className="text-amber-400 fill-amber-400" />
                  <span className="font-semibold text-slate-900">{murid.poin}</span>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Rewards Section (Murid only) */}
      {role === 'murid' && (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100">
            <h2 className="font-semibold text-slate-900 flex items-center gap-2">
              <Gift size={18} className="text-indigo-500" />
              Tukar Poin
            </h2>
          </div>
          <div className="p-4">
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {rewards.map((reward) => {
                const canRedeem = muridPoin >= reward.poin
                const isRedeemed = redeemedItems.includes(reward.id)
                return (
                  <div
                    key={reward.id}
                    className={cn(
                      'rounded-xl border p-4',
                      isRedeemed ? 'bg-emerald-50 border-emerald-200' :
                      canRedeem ? 'bg-white border-slate-200 hover:border-indigo-300 hover:shadow-sm cursor-pointer' :
                      'bg-slate-50 border-slate-200 opacity-60'
                    )}
                    onClick={() => canRedeem && !isRedeemed && setRedeemModal(reward)}
                  >
                    <div className="text-3xl mb-2">{reward.icon}</div>
                    <h3 className="font-medium text-slate-900">{reward.nama}</h3>
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center gap-1 text-sm">
                        <Star size={14} className="text-amber-400 fill-amber-400" />
                        <span className="font-semibold text-amber-600">{reward.poin}</span>
                      </div>
                      {isRedeemed ? (
                        <span className="text-xs text-emerald-600 font-medium flex items-center gap-1">
                          <Check size={12} /> Ditukar
                        </span>
                      ) : (
                        <span className="text-xs text-slate-500">Stok: {reward.stok}</span>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )}

      {/* Badges Section (Murid only) */}
      {role === 'murid' && (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100">
            <h2 className="font-semibold text-slate-900 flex items-center gap-2">
              <Award size={18} className="text-indigo-500" />
              Koleksi Badge
            </h2>
          </div>
          <div className="p-4">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              {badges.map((badge) => (
                <div
                  key={badge.id}
                  className={cn(
                    'text-center p-4 rounded-xl border',
                    badge.unlocked
                      ? 'bg-white border-slate-200'
                      : 'bg-slate-50 border-slate-200 opacity-50'
                  )}
                >
                  <div className={cn(
                    'text-3xl mb-2',
                    !badge.unlocked && 'grayscale'
                  )}>
                    {badge.icon}
                  </div>
                  <p className="font-medium text-slate-900 text-sm">{badge.nama}</p>
                  <p className="text-xs text-slate-500 mt-1">{badge.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Redeem Modal */}
      {redeemModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/50" onClick={() => setRedeemModal(null)} />
          <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 text-center">
            <div className="text-5xl mb-4">{redeemModal.icon}</div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">{redeemModal.nama}</h3>
            <p className="text-slate-500 mb-4">
              Tukarkan <span className="font-semibold text-amber-600">{redeemModal.poin} poin</span> untuk hadiah ini?
            </p>
            <p className="text-sm text-slate-400 mb-6">
              Sisa poin kamu: {muridPoin - redeemModal.poin}
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setRedeemModal(null)}
                className="flex-1 px-4 py-2.5 bg-slate-100 text-slate-700 rounded-xl font-medium hover:bg-slate-200 transition-colors"
              >
                Batal
              </button>
              <button
                onClick={() => handleRedeem(redeemModal)}
                className="flex-1 px-4 py-2.5 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-colors"
              >
                Tukar Sekarang
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
