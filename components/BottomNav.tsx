'use client'

import { Brain, Dumbbell, House } from 'lucide-react'
import { Tab } from '@/lib/tabs'
import CrossIcon from '@/components/icons/CrossIcon'

const tabs: {
  id: Tab
  label: string
  renderIcon: (active: boolean, color: string, glow: string) => React.ReactNode
  activeColor: string
  glowColor: string
}[] = [
  {
    id: 'home',
    label: 'Home',
    renderIcon: (active, color, glow) => (
      <House
        size={22}
        strokeWidth={active ? 2 : 1.5}
        style={{
          color: active ? color : 'rgba(255,255,255,0.3)',
          filter: active ? `drop-shadow(0 0 6px ${glow})` : 'none',
          transition: 'all 0.3s',
        }}
      />
    ),
    activeColor: '#e2e8f0',
    glowColor: 'rgba(226,232,240,0.4)',
  },
  {
    id: 'mind',
    label: 'Mind',
    renderIcon: (active, color, glow) => (
      <Brain
        size={22}
        strokeWidth={active ? 2 : 1.5}
        style={{
          color: active ? color : 'rgba(255,255,255,0.3)',
          filter: active ? `drop-shadow(0 0 6px ${glow})` : 'none',
          transition: 'all 0.3s',
        }}
      />
    ),
    activeColor: '#6366f1',
    glowColor: 'rgba(99,102,241,0.4)',
  },
  {
    id: 'body',
    label: 'Body',
    renderIcon: (active, color, glow) => (
      <Dumbbell
        size={22}
        strokeWidth={active ? 2 : 1.5}
        style={{
          color: active ? color : 'rgba(255,255,255,0.3)',
          filter: active ? `drop-shadow(0 0 6px ${glow})` : 'none',
          transition: 'all 0.3s',
        }}
      />
    ),
    activeColor: '#22c55e',
    glowColor: 'rgba(34,197,94,0.4)',
  },
  {
    id: 'spirit',
    label: 'Spirit',
    renderIcon: (active, color, glow) => (
      <CrossIcon
        size={22}
        color={active ? color : 'rgba(255,255,255,0.3)'}
        style={{
          filter: active ? `drop-shadow(0 0 6px ${glow})` : 'none',
          transition: 'all 0.3s',
        }}
      />
    ),
    activeColor: '#f59e0b',
    glowColor: 'rgba(245,158,11,0.4)',
  },
]

export default function BottomNav({
  activeTab,
  setActiveTab,
}: {
  activeTab: Tab
  setActiveTab: (tab: Tab) => void
}) {
  return (
    <nav className="safe-bottom border-t border-white/5" style={{ background: 'var(--color-surface)' }}>
      <div className="flex items-center justify-around px-2 py-2">
        {tabs.map(({ id, label, renderIcon, activeColor, glowColor }) => {
          const isActive = activeTab === id
          return (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className="relative flex flex-col items-center gap-1.5 px-5 py-2.5 rounded-2xl transition-all duration-300"
              style={isActive ? { background: `${activeColor}15` } : {}}
            >

              {renderIcon(isActive, activeColor, glowColor)}
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
