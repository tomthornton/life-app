'use client'

import { User } from 'lucide-react'
import { Tab } from '@/lib/tabs'
import MBSWordmark from '@/components/MBSWordmark'

const TAB_COLORS: Record<Tab, string> = {
  home:    '#e2e8f0',
  mind:    '#6366f1',
  body:    '#22c55e',
  spirit:  '#f59e0b',
  profile: '#94a3b8',
}

export default function AppHeader({
  activeTab,
  onProfilePress,
}: {
  activeTab: Tab
  onProfilePress: () => void
}) {
  const color = TAB_COLORS[activeTab]

  return (
    <div className="safe-top relative overflow-hidden bg-[#0a0a10]">
      {/* Ambient glow */}
      <div className="absolute -top-10 -left-10 w-56 h-56 rounded-full blur-3xl opacity-[0.18] transition-all duration-700 pointer-events-none"
        style={{ background: color }} />
      <div className="absolute -top-6 right-4 w-32 h-32 rounded-full blur-3xl opacity-[0.08] transition-all duration-700 pointer-events-none"
        style={{ background: color }} />

      <div className="relative px-5 pt-5 pb-4 flex items-center justify-between">
        <MBSWordmark glowColor={color} />

        <div className="flex items-center gap-3">
          <p className="text-xs font-medium" style={{ color: 'rgba(255,255,255,0.3)' }}>
            {new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
          </p>
          <button onClick={onProfilePress}
            className="w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200"
            style={{
              background: activeTab === 'profile' ? `${color}20` : 'rgba(255,255,255,0.07)',
              border: `1px solid ${activeTab === 'profile' ? `${color}50` : 'rgba(255,255,255,0.08)'}`,
            }}>
            <User size={16} style={{ color: activeTab === 'profile' ? color : 'rgba(255,255,255,0.5)' }} />
          </button>
        </div>
      </div>

      {/* Bottom border shimmer */}
      <div className="absolute bottom-0 left-0 right-0 h-px transition-all duration-700"
        style={{ background: `linear-gradient(to right, transparent, ${color}60, transparent)` }} />
    </div>
  )
}
