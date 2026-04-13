"use client"

import React from 'react'
import { Video, User } from 'lucide-react'
import { usePathname, useRouter } from 'next/navigation'
import { useAuth } from '../contexts/AuthContext'

export default function DashboardHeader() {
  const router = useRouter()
  const pathname = usePathname()
  const { user, loading } = useAuth()

  const navItems = [
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'My Videos', href: '/dashboard' },
  ]

  return (
    <header className="fixed top-7 left-0 right-0 z-50">
      <div className="flex justify-center px-4">
        <div className="pointer-events-auto w-full max-w-5xl rounded-full border border-gray-300/40 bg-gray-50/50 px-4 py-4 shadow-sm backdrop-blur-md transition-all duration-300 sm:px-6">
          <nav className="flex items-center justify-between gap-4">
            <button
              onClick={() => router.push('/')}
              className="flex flex-shrink-0 items-center gap-2 text-left"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-sm transition-transform hover:scale-110">
                <Video className="h-4 w-4" fill="currentColor" />
              </div>
              <span className="text-xl font-bold text-black">VideoChat AI</span>
            </button>

            <nav className="hidden items-center gap-8 lg:flex">
              {navItems.map((item) => {
                const isActive = pathname === item.href

                return (
                  <button
                    key={item.href}
                    onClick={() => router.push(item.href)}
                    className={`text-sm font-medium transition-colors ${
                      isActive ? 'text-black' : 'text-gray-600 hover:text-black'
                    }`}
                  >
                    {item.label}
                  </button>
                )
              })}
            </nav>

            <div className="flex items-center gap-3">
              {loading ? (
                <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse" />
              ) : user ? (
                <button
                  onClick={() => router.push('/account')}
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-600 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-slate-700"
                >
                  {user.name.charAt(0).toUpperCase()}
                </button>
              ) : (
                <button
                  onClick={() => router.push('/login')}
                  className="bg-black hover:bg-gray-900 text-white px-4 py-2 rounded-lg text-sm"
                >
                  Sign In
                </button>
              )}
            </div>
          </nav>
        </div>
      </div>
    </header>
  )
}
