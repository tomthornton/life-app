'use client'

import { Brain, Dumbbell, Flame, User } from 'lucide-react'
import { Tab } from '@/app/page'

const tabs: {
  id: Tab
  label: string
  Icon: React.ElementType
  activeColor: string
  glowColor: string
}[] = [
  { id: 'mind',    label: 'Mind',    Icon: Brain,    activeColor: '#6366f1', glowColor: 'rgba(99,102,241,0.3)' },
  { id: 'body',    label: 'Body',    Icon: Dumbbell, activeColor: '#22c55e', glowColor: 'rgba(34,197,94,0.3)' },
  { id: 'spirit',  label: 'Spirit',  Icon: Flame,    activeColor: '#f59e0b', glowColor: 'rgba(245,158,11,0.3)' },
  { id: 'profile', label: 'Profile', Icon: User,     activeColor: '#94a3b8', glowColor: 'rgba(148,163,184,0.3)' },
]

export default function BottomNav({
  activeTab,
  setActiveTab,
}: {
  activeTab: Tab
  setActiveTab: (tab: Tab) => void
}) {
  return (
    <nav className="safe-bottom bg-[#0d0d16] border-t border-white/5">
      <div className="flex items-center justify-around px-2 py-2">
        {tabs.map(({ id, label, Icon, activeColor, glowColor }) => {
          const isActive = activeTab === id
          return (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className="relative flex flex-col items-center gap-1.5 px-5 py-2.5 rounded-2xl transition-all duration-300"
              style={
                isActive
                  ? { background: `${activeColor}15` }
                  : {}
              }
            >
              {/* Active indicator dot */}
              {isActive && (
                <span
                  className="absolute top-1.5 w-1 h-1 rounded-full"
                  style={{ background: activeColor, boxShadow: `0 0 6px ${activeColor}` }}
                />
              )}

              <Icon
                size={22}
                strokeWidth={isActive ? 2 : 1.5}
                style={{
                  color: isActive ? activeColor : 'rgba(255,255,255,0.3)',
                  filter: isActive ? `drop-shadow(0 0 6px ${glowColor})` : 'none',
                  transition: 'all 0.3s',
                }}
              />
              <span
                className="text-[10px] font-semibold tracking-wide transition-all duration-300"
                style={{ color: isActive ? activeColor : 'rgba(255,255,255,0.25)' }}
              >
                {label.toUpperCase()}
              </span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}
