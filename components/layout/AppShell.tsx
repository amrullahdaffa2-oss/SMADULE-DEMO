'use client'

import { useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { Sidebar } from './Sidebar'
import { Navbar } from './Navbar'
import { useAppStore } from '@/lib/store'
import { getAuthUser } from '@/lib/auth'
import { Loader2 } from 'lucide-react'

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const { authUser, isAuthLoading, setAuthUser, loadNotifikasi, loadAbsensi } = useAppStore()

  const isAuthPage = pathname === '/login' || pathname === '/signup'
  const isLanding = pathname === '/'
  const isGuruPage = pathname.startsWith('/guru')
  const isPublic = isAuthPage || isLanding || isGuruPage

  // Initialize auth on mount
  useEffect(() => {
    getAuthUser().then(user => {
      setAuthUser(user)
    })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Load data after auth is resolved for student/parent pages
  useEffect(() => {
    if (authUser && !isAuthPage && !isGuruPage && !isLanding) {
      loadNotifikasi()
      loadAbsensi()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authUser])

  // Auth redirects after loading
  useEffect(() => {
    if (isAuthLoading) return
    if (!authUser && !isPublic) {
      router.replace('/login')
    }
    if (authUser?.role === 'guru' && !isGuruPage && !isAuthPage && !isLanding) {
      router.replace('/guru/dashboard')
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authUser, isAuthLoading, pathname])

  // --- Auth pages: render with NO shell ---
  if (isAuthPage) {
    return <>{children}</>
  }

  // --- Guru pages: GuruLayout handles its own shell ---
  if (isGuruPage) {
    return <>{children}</>
  }

  // --- Landing page ---
  if (isLanding) {
    return <div className="min-h-screen">{children}</div>
  }

  // --- Loading state ---
  if (isAuthLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 size={32} className="animate-spin text-indigo-600" />
          <p className="text-slate-500 text-sm">Memuat...</p>
        </div>
      </div>
    )
  }

  if (!authUser) return null

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar />
        <main className="flex-1 overflow-y-auto">
          <div className="p-6 animate-fadeIn">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}

