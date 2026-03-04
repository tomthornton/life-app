'use client'

import { User } from 'lucide-react'
import { Tab, SUB_TABS } from '@/lib/tabs'
import CrossIcon from '@/components/icons/CrossIcon'
import { Brain, Dumbbell, House } from 'lucide-react'
import MBSWordmark from '@/components/MBSWordmark'

const TAB_COLORS: Record<Tab, string> = {
  home:    '#e2e8f0',
  mind:    '#6366f1',
  body:    '#22c55e',
  spirit:  '#f59e0b',
  profile: '#94a3b8',
}

const TAB_LABELS: Record<Tab, string> = {
  home: 'Home', mind: 'Mind', body: 'Body', spirit: 'Spirit', profile: 'Profile',
}

const MAIN_TABS: Tab[] = ['home', 'mind', 'body', 'spirit']

function TabIcon({ id, size = 11 }: { id: Tab; size?: number }) {
  if (id === 'spirit') return <CrossIcon size={size} color="currentColor" />
  if (id === 'mind')   return <Brain size={size} strokeWidth={2.5} />
  if (id === 'body')   return <Dumbbell size={size} strokeWidth={2.5} />
  return <House size={size} strokeWidth={2.5} />
}

export default function AppHeader({
  activeTab,
  subTab,
  onSubTabChange,
  userName,
  onProfilePress,
  onTabPress,
}: {
  activeTab: Tab
  subTab: string
  onSubTabChange: (id: string) => void
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
  const subTabs = SUB_TABS[activeTab]

  return (
    <div className="safe-top relative overflow-hidden bg-[#0a0a10]">
      {/* Ambient glow */}
      <div className="absolute -top-10 -left-10 w-56 h-56 rounded-full blur-3xl opacity-[0.18] transition-all duration-700 pointer-events-none"
        style={{ background: color }} />
      <div className="absolute -top-6 right-4 w-32 h-32 rounded-full blur-3xl opacity-[0.08] transition-all duration-700 pointer-events-none"
        style={{ background: color }} />

      <div className="relative px-5 pt-6 pb-0">
        {/* Top row: wordmark + date + profile */}
        <div className="flex items-center justify-between mb-4">
          <MBSWordmark glowColor={color} />
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-[10px] text-white/30 font-medium leading-none">
                {new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
              </p>
              <p className="mt-1 text-sm font-semibold" style={{ color: 'rgba(255,255,255,0.75)' }}>
                {greeting()}, {userName.split(' ')[0]}
              </p>
            </div>
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

        {/* Bottom row: tab title + sub-tabs (or greeting) */}
        <div className="flex items-center gap-0">
          {/* Main tab switcher */}
          <div className="flex items-center">
            {MAIN_TABS.map((tab) => {
              const isActive = activeTab === tab
              return (
                <button key={tab} onClick={() => onTabPress(tab)}
                  className="flex items-center justify-center gap-1.5 px-3 py-2.5 transition-all duration-300 relative"
                  style={{ color: isActive ? TAB_COLORS[tab] : 'rgba(255,255,255,0.22)' }}>
                  {isActive && (
                    <span className="absolute bottom-0 left-2 right-2 h-0.5 rounded-full transition-all duration-300"
                      style={{ background: color, boxShadow: `0 0 8px ${color}` }} />
                  )}
                  <TabIcon id={tab} size={11} />
                  <span className="text-[11px] font-bold tracking-widest uppercase">{TAB_LABELS[tab]}</span>
                </button>
              )
            })}
          </div>

          {/* Divider */}
          <div className="w-px h-5 mx-1 flex-shrink-0" style={{ background: 'rgba(255,255,255,0.08)' }} />

          {/* Right side: sub-tabs or greeting */}
          <div className="flex-1 flex items-center overflow-x-auto no-scrollbar gap-1 pl-1">
            {subTabs.length > 0 ? (
              subTabs.map((st) => {
                const isActive = subTab === st.id
                return (
                  <button key={st.id} onClick={() => onSubTabChange(st.id)}
                    className="flex-shrink-0 flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[10px] font-bold tracking-wide uppercase transition-all duration-200"
                    style={isActive
                      ? { background: `${color}22`, color, border: `1px solid ${color}35` }
                      : { color: 'rgba(255,255,255,0.22)', border: '1px solid transparent' }
                    }>
                    <span style={{ fontSize: '11px' }}>{st.icon}</span>
                    <span>{st.label}</span>
                  </button>
                )
              })
            ) : (
              activeTab !== 'profile' && (
                <p className="text-[11px] font-medium tracking-wide pl-1" style={{ color: 'rgba(255,255,255,0.3)' }}>
                  {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                </p>
              )
            )}
          </div>
        </div>

        {/* Bottom border */}
        <div className="border-b border-white/5" />
      </div>
    </div>
  )
}
