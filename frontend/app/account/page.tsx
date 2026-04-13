"use client"

import React from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { User } from 'lucide-react'
import ProtectedRoute from '@/components/ProtectedRoute'

export default function AccountPage() {
  const { user } = useAuth()

  return (
    <ProtectedRoute>
      <main className="dotted-card h-full overflow-hidden bg-gray-50 px-4 py-4">
        <div className="mx-auto flex h-full max-w-4xl flex-col overflow-hidden">
          <div className="mb-4 flex-shrink-0">
            <h1 className="text-3xl font-bold text-gray-900">Account</h1>
            <p className="mt-2 text-gray-600">View your account information.</p>
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

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">User ID</label>
                  <div className="px-4 py-2 border border-gray-200 rounded-lg bg-gray-50">
                    {user?.id || 'N/A'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </ProtectedRoute>
  )
}
