'use client'

import { usePathname } from 'next/navigation'
import { Sidebar } from './Sidebar'
import { Navbar } from './Navbar'
import { RoleSwitcher } from './RoleSwitcher'
import { useAppStore } from '@/lib/store'

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isLanding = pathname === '/'

  if (isLanding) {
    return (
      <div className="min-h-screen">
        {children}
        <RoleSwitcher />
      </div>
    )
  }

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
      <RoleSwitcher />
    </div>
  )
}
