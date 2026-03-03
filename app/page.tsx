'use client'

import { useState, useEffect } from 'react'
import MindTab from '@/components/tabs/MindTab'
import BodyTab from '@/components/tabs/BodyTab'
import SpiritTab from '@/components/tabs/SpiritTab'
import ProfileTab from '@/components/tabs/ProfileTab'
import BottomNav from '@/components/BottomNav'
import MBSLogo from '@/components/MBSLogo'

export type Tab = 'mind' | 'body' | 'spirit' | 'profile'

const TAB_META: Record<Tab, { label: string; emoji: string; color: string }> = {
  mind:    { label: 'Mind',    emoji: '🧠', color: 'text-mind' },
  body:    { label: 'Body',    emoji: '💪', color: 'text-body' },
  spirit:  { label: 'Spirit',  emoji: '✝️',  color: 'text-spirit' },
  profile: { label: 'Profile', emoji: '👤', color: 'text-white' },
}

export default function Home() {
  const [activeTab, setActiveTab] = useState<Tab>('mind')
  const [userName, setUserName] = useState('Thomas')

  useEffect(() => {
    const saved = localStorage.getItem('mbs_name')
    if (saved) setUserName(saved)
  }, [])

  const meta = TAB_META[activeTab]

  const greeting = () => {
    const h = new Date().getHours()
    if (h < 12) return 'Good morning'
    if (h < 17) return 'Good afternoon'
    return 'Good evening'
  }

  return (
    <main className="fixed inset-0 flex flex-col bg-surface overflow-hidden">
      {/* Header */}
      <div className="safe-top bg-card border-b border-border">
        {/* Top row: logo + greeting + avatar */}
        <div className="flex items-center justify-between px-5 pt-5 pb-3">
          <div className="flex items-center gap-3">
            <MBSLogo size={38} />
            <div>
              <p className="text-[11px] text-white/40 font-medium tracking-widest uppercase leading-none">
                {greeting()},
              </p>
              <h1 className="text-lg font-bold text-white leading-tight mt-0.5">
                {userName}
              </h1>
            </div>
          </div>
          <div className="flex flex-col items-end gap-0.5">
            <p className="text-[10px] text-white/30 uppercase tracking-widest font-medium">
              {new Date().toLocaleDateString('en-US', { weekday: 'long' })}
            </p>
            <p className="text-sm font-semibold text-white/60">
              {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            </p>
          </div>
        </div>

        {/* Active tab label */}
        <div className="px-5 pb-4 flex items-center gap-2">
          <span className="text-xl">{meta.emoji}</span>
          <span className={`text-sm font-semibold ${meta.color}`}>{meta.label}</span>
          <div className="flex-1 h-px bg-white/5 ml-2" />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto no-scrollbar">
        {activeTab === 'mind'    && <MindTab />}
        {activeTab === 'body'    && <BodyTab />}
        {activeTab === 'spirit'  && <SpiritTab />}
        {activeTab === 'profile' && <ProfileTab userName={userName} setUserName={setUserName} />}
      </div>

      {/* Bottom Nav */}
      <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />
    </main>
  )
}
