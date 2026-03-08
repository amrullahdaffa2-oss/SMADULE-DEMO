'use client'

import { useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { useAppStore } from '@/lib/store'
import { GuruShell } from '@/components/layout/GuruShell'
import { getAuthUser } from '@/lib/auth'
import { Loader2 } from 'lucide-react'

function GuruProtectedLayout({ children }: { children: React.ReactNode }) {
  const { authUser, isAuthLoading, setAuthUser, setRole, loadNotifikasi } = useAppStore()
  const router = useRouter()

  useEffect(() => {
    if (isAuthLoading) {
      getAuthUser().then(user => {
        setAuthUser(user)
        if (!user || user.role !== 'guru') {
          router.replace('/guru/login')
        } else {
          setRole('guru')
          loadNotifikasi()
        }
      })
    } else if (!authUser || authUser.role !== 'guru') {
      router.replace('/guru/login')
    } else {
      setRole('guru')
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (isAuthLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 size={32} className="animate-spin text-indigo-600" />
          <p className="text-slate-500 text-sm">Memuat portal guru...</p>
        </div>
      </div>
    )
  }

  if (!authUser || authUser.role !== 'guru') return null

  return <GuruShell>{children}</GuruShell>
}

export default function GuruLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isGuruAuthPage = pathname === '/guru/login' || pathname === '/guru/signup'

  if (isGuruAuthPage) {
    return <>{children}</>
  }

  return <GuruProtectedLayout>{children}</GuruProtectedLayout>
}


