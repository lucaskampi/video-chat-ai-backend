"use client"

import React, { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { Menu, Video, X, LogOut, User } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'

const Header: React.FC = () => {
  const router = useRouter()
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const { user, loading, logout } = useAuth()

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsMobileMenuOpen(false)
        setIsUserMenuOpen(false)
      }
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    setIsMobileMenuOpen(false)
    setIsUserMenuOpen(false)
  }, [pathname])

  const goHomeTop = () => {
    setIsMobileMenuOpen(false)
    if (pathname === '/') {
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }
    router.push('/')
    setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 120)
  }

  const handleGetStarted = () => {
    if (!user) {
      router.push('/login')
      return
    }
    router.push('/dashboard')
  }

  const handleLogout = () => {
    logout()
    setIsUserMenuOpen(false)
    router.push('/')
  }

  return (
    <header className="fixed top-7 left-0 right-0 z-50">
      <div className="flex justify-center">
        <div className="pointer-events-auto w-full max-w-4xl mx-auto px-4 sm:px-6 py-4 transition-all duration-300 rounded-full bg-gray-50/50 border border-gray-300/40 backdrop-blur-md shadow-sm">
          <nav className="flex items-center justify-between">
            <a
              href="/"
              onClick={(e) => {
                e.preventDefault()
                goHomeTop()
              }}
              className="flex items-center space-x-2 group flex-shrink-0"
            >
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-2 rounded-lg group-hover:scale-110 transition-transform">
                <Video className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="white" />
              </div>
              <span className="text-lg sm:text-xl font-bold text-black">VideoChat AI</span>
            </a>

            <div className="hidden lg:flex items-center space-x-6 xl:space-x-8">
              <button
                onClick={() => router.push('/#features')}
                className="text-gray-700 hover:text-black transition-colors whitespace-nowrap"
              >
                Features
              </button>
              <button
                onClick={() => router.push('/#how-it-works')}
                className="text-gray-700 hover:text-black transition-colors whitespace-nowrap"
              >
                How It Works
              </button>
            </div>

            <div className="hidden lg:flex items-center gap-3">
              {loading ? (
                <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse" />
              ) : user ? (
                <div className="relative">
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center gap-2 bg-black text-white px-3 py-1.5 rounded-full hover:bg-gray-900 transition-colors"
                  >
                    <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                      <User className="w-3 h-3 text-white" />
                    </div>
                    <span className="text-sm font-medium">{user.name}</span>
                  </button>

                  {isUserMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1">
                      <div className="px-4 py-2 border-b border-gray-100">
                        <p className="text-sm font-medium text-gray-900">{user.name}</p>
                        <p className="text-xs text-gray-500">{user.email}</p>
                      </div>
                      <a
                        href="/dashboard"
                        className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <Video className="w-4 h-4" />
                        My Videos
                      </a>
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                      >
                        <LogOut className="w-4 h-4" />
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={handleGetStarted}
                  className="bg-black hover:bg-gray-900 text-white px-4 py-2 rounded-lg whitespace-nowrap"
                >
                  Get Started
                </button>
              )}
            </div>

            <div className="flex lg:hidden items-center gap-2 sm:gap-3">
              {user && (
                <div className="flex items-center gap-1 bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs font-medium">
                  <span>{user.name}</span>
                </div>
              )}

              <button
                onClick={handleGetStarted}
                className="bg-black hover:bg-gray-900 text-white px-3 py-1.5 rounded-lg text-xs sm:text-sm whitespace-nowrap"
              >
                {user ? 'Dashboard' : 'Get Started'}
              </button>
              <button
                onClick={() => setIsMobileMenuOpen((v) => !v)}
                className="text-black p-1.5 sm:p-2 hover:bg-black/10 rounded-lg transition-colors"
                aria-label="Toggle menu"
              >
                {isMobileMenuOpen ? (
                  <X className="w-5 h-5 sm:w-6 sm:h-6" />
                ) : (
                  <Menu className="w-5 h-5 sm:w-6 sm:h-6" />
                )}
              </button>
            </div>
          </nav>

          {isMobileMenuOpen && (
            <div className="lg:hidden mt-4 pb-4 border-t border-black/10">
              <div className="flex flex-col space-y-3 pt-4">
                <button
                  onClick={() => router.push('/#features')}
                  className="text-gray-700 hover:text-black transition-colors px-2 py-2 hover:bg-black/5 rounded-lg text-left"
                >
                  Features
                </button>
                <button
                  onClick={() => router.push('/#how-it-works')}
                  className="text-gray-700 hover:text-black transition-colors px-2 py-2 hover:bg-black/5 rounded-lg text-left"
                >
                  How It Works
                </button>
                
                {user && (
                  <div className="border-t border-black/10 pt-3 mt-2">
                    <div className="px-2 py-2">
                      <p className="text-sm font-medium text-gray-900">{user.name}</p>
                      <p className="text-xs text-gray-500">{user.email}</p>
                    </div>
                    <a
                      href="/dashboard"
                      className="flex items-center gap-2 px-2 py-2 text-sm text-gray-700 hover:bg-black/5 rounded-lg"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <Video className="w-4 h-4" />
                      My Videos
                    </a>
                    <a
                      href="/settings"
                      className="block px-2 py-2 text-sm text-gray-700 hover:bg-black/5 rounded-lg"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Settings
                    </a>
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2 w-full text-left px-2 py-2 text-sm text-red-600 hover:bg-black/5 rounded-lg"
                    >
                      <LogOut className="w-4 h-4" />
                      Logout
                    </button>
                  </div>
                )}

                {!user && (
                  <div className="border-t border-black/10 pt-3 mt-2">
                    <button
                      onClick={() => {
                        setIsMobileMenuOpen(false)
                        handleGetStarted()
                      }}
                      className="block w-full text-left px-2 py-2 text-gray-700 hover:bg-black/5 rounded-lg"
                    >
                      Get Started
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}

export default Header
