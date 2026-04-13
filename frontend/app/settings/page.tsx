"use client"

import React, { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { User, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import ProtectedRoute from '@/components/ProtectedRoute'

export default function SettingsPage() {
  const { user, logout } = useAuth()
  const [loading, setLoading] = useState(false)

  const handleLogout = async () => {
    setLoading(true)
    try {
      logout()
      toast.success('Logged out successfully')
    } catch {
      toast.error('Logout failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <ProtectedRoute>
      <main className="dotted-card h-full overflow-hidden bg-gray-50 px-4 py-4">
        <div className="mx-auto flex h-full max-w-4xl flex-col overflow-hidden">
          <div className="mb-4 flex-shrink-0">
            <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
            <p className="mt-2 text-gray-600">Manage your account settings.</p>
          </div>

          <div className="flex-1 overflow-auto px-4 py-4 sm:px-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <User className="w-5 h-5" />
                Account Information
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <div className="px-4 py-2 border border-gray-200 rounded-lg bg-gray-50">
                    {user?.name || 'N/A'}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <div className="px-4 py-2 border border-gray-200 rounded-lg bg-gray-50">
                    {user?.email || 'N/A'}
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <button
                    onClick={handleLogout}
                    disabled={loading}
                    className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors disabled:opacity-50 flex items-center gap-2"
                  >
                    {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                    Logout
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </ProtectedRoute>
  )
}
