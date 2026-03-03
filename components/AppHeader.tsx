'use client'

import { User } from 'lucide-react'
import { Tab } from '@/app/page'
import CrossIcon from '@/components/icons/CrossIcon'
import { Brain, Dumbbell, House } from 'lucide-react'

const TABS: { id: Tab; label: string; color: string }[] = [
  { id: 'home',   label: 'Home',   color: '#e2e8f0' },
  { id: 'mind',   label: 'Mind',   color: '#6366f1' },
  { id: 'body',   label: 'Body',   color: '#22c55e' },
  { id: 'spirit', label: 'Spirit', color: '#f59e0b' },
]

const TAB_COLORS: Record<Tab, string> = {
  home:    '#e2e8f0',
  mind:    '#6366f1',
  body:    '#22c55e',
  spirit:  '#f59e0b',
  profile: '#94a3b8',
}

function TabIcon({ id, size = 11 }: { id: Tab; size?: number }) {
  if (id === 'spirit') return <CrossIcon size={size} color="currentColor" />
  if (id === 'mind')   return <Brain size={size} strokeWidth={2.5} />
  if (id === 'body')   return <Dumbbell size={size} strokeWidth={2.5} />
  return <House size={size} strokeWidth={2.5} />
}

export default function AppHeader({
  activeTab,
  userName,
  onProfilePress,
  onTabPress,
}: {
  activeTab: Tab
  userName: string
  onProfilePress: () => void
  onTabPress: (tab: Tab) => void
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
      {/* Ambient glow */}
      <div
        className="absolute -top-10 -left-10 w-56 h-56 rounded-full blur-3xl opacity-[0.18] transition-all duration-700 pointer-events-none"
        style={{ background: color }}
      />
      <div
        className="absolute -top-6 right-4 w-32 h-32 rounded-full blur-3xl opacity-[0.08] transition-all duration-700 pointer-events-none"
        style={{ background: color }}
      />

      <div className="relative px-5 pt-6 pb-0">
        {/* Top row */}
        <div className="flex items-center justify-between mb-4">
          {/* MBS Wordmark — Bebas Neue, white, no gradient */}
          <span
            className="text-white select-none"
            style={{
              fontFamily: 'var(--font-bebas)',
              fontSize: '3rem',
              lineHeight: 1,
              letterSpacing: '0.04em',
              textShadow: `0 0 30px ${color}60`,
            }}
          >
            MBS
          </span>

          {/* Right: greeting + profile */}
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-[10px] text-white/30 font-medium leading-none">
                {new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
              </p>
              <p className="text-sm font-semibold text-white mt-1">
                {greeting()}, {userName.split(' ')[0]}
              </p>
            </div>
            <button
              onClick={onProfilePress}
              className="w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200"
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

        {/* Tab switcher */}
        <div className="flex items-center gap-1 pb-0">
          {TABS.map((tab) => {
            const isActive = activeTab === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => onTabPress(tab.id)}
                className="flex items-center gap-1.5 px-3 py-2.5 transition-all duration-300 relative"
              >
                {/* Active underline */}
                <span
                  className="absolute bottom-0 left-3 right-3 h-0.5 rounded-full transition-all duration-300"
                  style={{
                    background: isActive ? tab.color : 'transparent',
                    boxShadow: isActive ? `0 0 8px ${tab.color}` : 'none',
                  }}
                />

                <span
                  className="transition-all duration-300"
                  style={{ color: isActive ? tab.color : 'rgba(255,255,255,0.25)' }}
                >
                  <TabIcon id={tab.id} size={11} />
                </span>

                <span
                  className="text-[11px] font-bold tracking-widest uppercase transition-all duration-300"
                  style={{ color: isActive ? tab.color : 'rgba(255,255,255,0.25)' }}
                >
                  {tab.label}
                </span>
              </button>
            )
          })}

          {/* Bottom border */}
          <div className="flex-1 border-b border-white/5" />
        </div>
      </div>
    </div>
  )
}
