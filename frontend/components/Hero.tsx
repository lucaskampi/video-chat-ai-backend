"use client"

import React from 'react'
import { FileAudio, FileVideo, Upload } from 'lucide-react'

type HeroProps = {
  dragActive: boolean
  fileName: string | null
  uploading: boolean
  fileInputRef: React.RefObject<HTMLInputElement | null>
  onDrop: (e: React.DragEvent<HTMLDivElement>) => void
  onDragOver: (e: React.DragEvent<HTMLDivElement>) => void
  onDragLeave: () => void
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onOpenFilePicker: () => void
  onUpload: () => void
}

export default function Hero({
  dragActive,
  fileName,
  uploading,
  fileInputRef,
  onDrop,
  onDragOver,
  onDragLeave,
  onFileChange,
  onOpenFilePicker,
  onUpload,
}: HeroProps) {
  return (
    <>
      <header className="text-center mb-8">
        <div className="text-sm text-gray-500">AI-powered video transcription</div>
        <h1 className="text-4xl font-extrabold mt-2">VideoChat AI</h1>
        <div className="mt-4 flex items-center justify-center gap-3 text-gray-500">
          <span className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-300/50 bg-white/70 shadow-sm backdrop-blur-md" aria-label="Audio file icon">
            <FileAudio className="h-4 w-4 text-gray-700" />
          </span>
          <span className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-300/50 bg-white/70 shadow-sm backdrop-blur-md" aria-label="Video file icon">
            <FileVideo className="h-4 w-4 text-gray-700" />
          </span>
        </div>
      </header>

      <section
        id="upload"
        className="rounded-3xl border border-gray-300/40 bg-gray-50/50 p-6 shadow-sm backdrop-blur-md transition-all duration-300 mb-6"
      >
        <div className="flex items-center gap-4 mb-4">
          <button className="rounded-full border border-gray-300/40 bg-white/70 px-4 py-2 backdrop-blur-md transition-colors hover:bg-white">
            <Upload className="w-4 h-4 mr-2 inline" />
            Upload File
          </button>
        </div>

        <label className="block text-sm font-medium text-gray-700 mb-2">Upload Audio or Video</label>
        <div
          onDrop={onDrop}
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onClick={onOpenFilePicker}
          className={`flex h-56 cursor-pointer items-center justify-center rounded-2xl border border-dashed p-4 text-center backdrop-blur-md transition-all duration-300 ${
            dragActive
              ? 'border-blue-300/70 bg-blue-50/70 shadow-sm'
              : 'border-gray-300/40 bg-white/60'
          }`}
        >
          <div>
            <div className="mb-2 font-medium">
              {uploading ? 'Uploading...' : 'Upload File'}
            </div>
            <div className="text-sm text-gray-500">
              Drag & drop or click here to select an audio or video file
            </div>
            <div className="mt-3 text-xs text-gray-400">MP3 · MP4 · WAV · M4A · WEBM</div>
            <input
              ref={fileInputRef}
              className="hidden"
              id="file-input"
              type="file"
              accept="audio/mpeg,audio/wav,audio/mp4,video/mp4,video/webm"
              onChange={onFileChange}
            />
          </div>
        </div>

        {fileName && (
          <div className="mt-4 flex items-center justify-between">
            <div className="flex items-center gap-2 px-3 py-2 bg-gray-100 rounded">
              <FileVideo className="w-4 h-4" />
              <span className="text-sm font-medium">{fileName}</span>
            </div>
            <button
              disabled={uploading}
              onClick={onUpload}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg disabled:opacity-50 hover:bg-blue-700 transition-colors"
            >
              {uploading ? 'Uploading...' : 'Upload & Transcribe'}
            </button>
          </div>
        )}
      </section>
    </>
  )
}
