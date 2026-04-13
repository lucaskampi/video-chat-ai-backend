"use client"

import React from 'react'
import { Upload, FileAudio, Sparkles } from 'lucide-react'

export default function HowItWorks() {
  const steps = [
    {
      icon: Upload,
      title: 'Upload',
      description: 'Upload your audio or video file',
    },
    {
      icon: FileAudio,
      title: 'Transcribe',
      description: 'AI automatically transcribes your content',
    },
    {
      icon: Sparkles,
      title: 'Generate',
      description: 'Get AI-powered completions and insights',
    },
  ]

  return (
    <section id="how-it-works" className="py-16 px-4">
      <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        {steps.map((step, index) => (
          <div key={index} className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-blue-100 flex items-center justify-center">
              <step.icon className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
            <p className="text-gray-600">{step.description}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
