'use client'

import { useState } from 'react'
import MindTab from '@/components/tabs/MindTab'
import BodyTab from '@/components/tabs/BodyTab'
import SpiritTab from '@/components/tabs/SpiritTab'
import BottomNav from '@/components/BottomNav'

export type Tab = 'mind' | 'body' | 'spirit'

export default function Home() {
  const [activeTab, setActiveTab] = useState<Tab>('mind')

  return (
    <main className="fixed inset-0 flex flex-col bg-surface overflow-hidden">
      {/* Header */}
      <div className="safe-top bg-surface/80 backdrop-blur-sm border-b border-border px-5 pt-4 pb-3">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-white/40 uppercase tracking-widest font-medium">
              {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
            </p>
            <h1 className="text-xl font-bold text-white mt-0.5">
              {activeTab === 'mind' && '🧠 Mind'}
              {activeTab === 'body' && '💪 Body'}
              {activeTab === 'spirit' && '✝️ Spirit'}
            </h1>
          </div>
          <div className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-sm font-bold">
            T
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto no-scrollbar">
        {activeTab === 'mind' && <MindTab />}
        {activeTab === 'body' && <BodyTab />}
        {activeTab === 'spirit' && <SpiritTab />}
      </div>

      {/* Bottom Nav */}
      <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />
    </main>
  )
}
