"use client"

import React, { useState } from 'react'
import { FileUpload } from '@/components/file-upload'
import { VideoList } from '@/components/video-list'
import { Upload } from 'lucide-react'
import { toast } from 'sonner'
import ProtectedRoute from '@/components/ProtectedRoute'

export default function DashboardPage() {
  const [refreshKey, setRefreshKey] = useState(0)

  const handleUploadComplete = () => {
    setRefreshKey((k) => k + 1)
    toast.success('Video uploaded successfully!')
  }

  const handleVideoDeleted = () => {
    setRefreshKey((k) => k + 1)
  }

  return (
    <ProtectedRoute>
      <main className="dotted-card h-full overflow-hidden bg-gray-50 px-4 py-4">
        <div className="mx-auto flex h-full max-w-6xl flex-col overflow-hidden">
          <div className="mb-4 flex-shrink-0">
            <h1 className="text-3xl font-bold text-gray-900">My Videos</h1>
            <p className="mt-2 text-gray-600">Upload and manage your video transcriptions.</p>
          </div>

          <div className="flex min-h-0 flex-1 items-start overflow-hidden px-4 py-4 sm:px-6">
            <div className="w-full space-y-8">
              <section className="rounded-2xl border border-gray-300/40 bg-white/60 p-6 backdrop-blur-md">
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Upload className="w-5 h-5" />
                  Upload New Video
                </h2>
                <FileUpload onUploadComplete={handleUploadComplete} />
              </section>

              <section>
                <h2 className="text-lg font-semibold mb-4">Your Videos</h2>
                <VideoList key={refreshKey} onVideoDeleted={handleVideoDeleted} />
              </section>
            </div>
          </div>
        </div>
      </main>
    </ProtectedRoute>
  )
}
