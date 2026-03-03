'use client'

import { Tab } from '@/app/page'

const tabs: { id: Tab; label: string; emoji: string; color: string }[] = [
  { id: 'mind',    label: 'Mind',    emoji: '🧠', color: 'text-mind' },
  { id: 'body',    label: 'Body',    emoji: '💪', color: 'text-body' },
  { id: 'spirit',  label: 'Spirit',  emoji: '✝️',  color: 'text-spirit' },
  { id: 'profile', label: 'Profile', emoji: '👤', color: 'text-white' },
]

export default function BottomNav({
  activeTab,
  setActiveTab,
}: {
  activeTab: Tab
  setActiveTab: (tab: Tab) => void
}) {
  return (
    <nav className="safe-bottom bg-card border-t border-border">
      <div className="flex items-center justify-around py-2">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all ${
                isActive ? 'opacity-100' : 'opacity-35'
              }`}
            >
              <span className="text-xl">{tab.emoji}</span>
              <span className={`text-[10px] font-semibold tracking-wide ${isActive ? tab.color : 'text-white'}`}>
                {tab.label.toUpperCase()}
              </span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}
