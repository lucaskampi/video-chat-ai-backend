"use client"

import React, { useState, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Hero from '@/components/Hero'
import HowItWorks from '@/components/HowItWorks'
import Pricing from '@/components/Pricing'
import { useAuth } from '@/contexts/AuthContext'
import { toast } from 'sonner'
import { uploadVideo } from '@/lib/api'

export default function Page() {
  const [fileName, setFileName] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()
  const { user } = useAuth()

  const handleFile = useCallback(async (file: File) => {
    setFileName(file.name)
    setUploading(true)
    try {
      await uploadVideo(file)
      toast.success('Video uploaded successfully!')
      router.push('/dashboard')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Upload failed')
      setFileName(null)
    } finally {
      setUploading(false)
    }
  }, [router])

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    await handleFile(file)
  }

  function handleDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault()
    setDragActive(false)
    const file = e.dataTransfer.files?.[0]
    if (file) handleFile(file)
  }

  function handleDragOver(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault()
    setDragActive(true)
  }

  function handleDragLeave() {
    setDragActive(false)
  }

  function openFilePicker() {
    fileInputRef.current?.click()
  }

  const handleUpload = () => {
    if (!fileName) return
    
    if (!user) {
      toast.error('Please sign in to upload videos')
      router.push('/login')
      return
    }

    const input = fileInputRef.current
    if (input?.files?.[0]) {
      handleFile(input.files[0])
    }
  }

  return (
    <>
      <main id="top" className="max-w-4xl mx-auto p-6 pt-40">
        <Hero
          dragActive={dragActive}
          fileName={fileName}
          uploading={uploading}
          fileInputRef={fileInputRef}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onFileChange={handleFileChange}
          onOpenFilePicker={openFilePicker}
          onUpload={handleUpload}
        />
      </main>

      <HowItWorks />
      <Pricing />
    </>
  )
}
