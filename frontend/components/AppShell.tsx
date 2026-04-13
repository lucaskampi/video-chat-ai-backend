"use client"

import React from 'react'
import { usePathname } from 'next/navigation'
import Header from './Header'
import Footer from './Footer'
import DashboardHeader from './DashboardHeader'

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isDashboard = pathname.startsWith('/dashboard') || pathname.startsWith('/settings') || pathname.startsWith('/account')

  if (isDashboard) {
    return (
      <div className="dotted-card flex h-screen flex-col overflow-hidden bg-gray-50 text-gray-900">
        <DashboardHeader />
        <div className="flex-1 overflow-hidden pt-28">{children}</div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col bg-gray-50 text-gray-900">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  )
}
