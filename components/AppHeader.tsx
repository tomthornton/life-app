'use client'

import { User } from 'lucide-react'
import { Tab } from '@/app/page'

const TAB_LABELS: Record<Tab, string> = {
  home: 'Home',
  mind: 'Mind',
  body: 'Body',
  spirit: 'Spirit',
  profile: 'Profile',
}

const TAB_COLORS: Record<Tab, string> = {
  home:    '#e2e8f0',
  mind:    '#6366f1',
  body:    '#22c55e',
  spirit:  '#f59e0b',
  profile: '#94a3b8',
}

export default function AppHeader({
  activeTab,
  userName,
  onProfilePress,
}: {
  activeTab: Tab
  userName: string
  onProfilePress: () => void
}) {
  const greeting = () => {
    const h = new Date().getHours()
    if (h < 12) return 'Good morning'
    if (h < 17) return 'Good afternoon'
    return 'Good evening'
  }

  const color = TAB_COLORS[activeTab]

  return (
    <div className="safe-top relative overflow-hidden bg-[#0a0a10]">
      {/* Ambient glow blobs */}
      <div
        className="absolute -top-10 -left-10 w-48 h-48 rounded-full blur-3xl opacity-20 transition-all duration-700"
        style={{ background: color }}
      />
      <div
        className="absolute -top-10 right-0 w-40 h-40 rounded-full blur-3xl opacity-10 transition-all duration-700"
        style={{ background: color }}
      />

      {/* Border shimmer */}
      <div
        className="absolute bottom-0 left-0 right-0 h-px transition-all duration-700"
        style={{ background: `linear-gradient(to right, transparent, ${color}80, transparent)` }}
      />

      <div className="relative px-5 pt-6 pb-5">
        {/* Top row: wordmark + greeting + profile */}
        <div className="flex items-start justify-between mb-4">
          {/* MBS Wordmark */}
          <div>
            <span
              className="font-black tracking-tighter block"
              style={{
                fontSize: '2.6rem',
                lineHeight: 1,
                background: 'linear-gradient(135deg, #6366f1 0%, #22c55e 50%, #f59e0b 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                filter: 'drop-shadow(0 0 20px rgba(99,102,241,0.4))',
              }}
            >
              MBS
            </span>
            <p className="text-[10px] font-semibold tracking-[0.2em] text-white/25 uppercase mt-1">
              Mind · Body · Spirit
            </p>
          </div>

          {/* Right: greeting + profile button */}
          <div className="flex items-start gap-3">
            <div className="text-right">
              <p className="text-xs text-white/30 font-medium">
                {new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
              </p>
              <p className="text-sm font-semibold text-white mt-0.5">
                {greeting()}, {userName.split(' ')[0]}
              </p>
            </div>

            {/* Profile button */}
            <button
              onClick={onProfilePress}
              className="w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200 mt-0.5"
              style={{
                background: activeTab === 'profile' ? `${color}20` : 'rgba(255,255,255,0.07)',
                border: `1px solid ${activeTab === 'profile' ? `${color}50` : 'rgba(255,255,255,0.08)'}`,
              }}
            >
              <User
                size={16}
                style={{ color: activeTab === 'profile' ? color : 'rgba(255,255,255,0.5)' }}
              />
            </button>
          </div>
        </div>

        {/* Active tab pill */}
        <div className="flex items-center gap-2">
          <div className="h-px flex-1 opacity-20" style={{ background: color }} />
          <span
            className="text-[11px] font-bold tracking-widest uppercase px-3 py-1 rounded-full border transition-all duration-500"
            style={{
              color,
              borderColor: `${color}50`,
              background: `${color}15`,
            }}
          >
            {TAB_LABELS[activeTab]}
          </span>
          <div className="h-px flex-1 opacity-20" style={{ background: color }} />
        </div>
      </div>
    </div>
  )
}
