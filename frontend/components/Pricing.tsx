"use client"

import React from 'react'
import { Check } from 'lucide-react'

export default function Pricing() {
  const plans = [
    {
      name: 'Free',
      price: '$0',
      features: ['5 transcriptions per month', 'Basic AI completions', 'Standard support'],
    },
    {
      name: 'Pro',
      price: '$19',
      features: ['Unlimited transcriptions', 'Advanced AI completions', 'Priority support', 'Export options'],
    },
  ]

  return (
    <section id="pricing" className="py-16 px-4 bg-white rounded-3xl border border-gray-200">
      <h2 className="text-3xl font-bold text-center mb-12">Simple Pricing</h2>
      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
        {plans.map((plan, index) => (
          <div key={index} className="rounded-2xl border border-gray-200 p-6 hover:border-blue-300 transition-colors">
            <h3 className="text-xl font-semibold mb-2">{plan.name}</h3>
            <p className="text-3xl font-bold mb-4">{plan.price}<span className="text-sm font-normal text-gray-500">/month</span></p>
            <ul className="space-y-2">
              {plan.features.map((feature, i) => (
                <li key={i} className="flex items-center gap-2 text-sm text-gray-600">
                  <Check className="w-4 h-4 text-green-500" />
                  {feature}
                </li>
              ))}
            </ul>
            <button className="mt-6 w-full py-2 px-4 rounded-lg bg-black text-white hover:bg-gray-900 transition-colors">
              Get Started
            </button>
          </div>
        ))}
      </div>
    </section>
  )
}
