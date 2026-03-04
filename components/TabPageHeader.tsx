'use client'

import { Tab, SUB_TABS } from '@/lib/tabs'
import CrossIcon from '@/components/icons/CrossIcon'
import { Brain, Dumbbell, House } from 'lucide-react'

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

function TabIcon({ id, size = 13 }: { id: Tab; size?: number }) {
  if (id === 'spirit') return <CrossIcon size={size} color="currentColor" />
  if (id === 'mind')   return <Brain size={size} strokeWidth={2.5} />
  if (id === 'body')   return <Dumbbell size={size} strokeWidth={2.5} />
  return <House size={size} strokeWidth={2.5} />
}

export default function TabPageHeader({
  tab,
  subTab,
  onSubTabChange,
}: {
  tab: Tab
  subTab?: string
  onSubTabChange?: (id: string) => void
}) {
  const color = TAB_COLORS[tab]
  const subTabs = SUB_TABS[tab]

  return (
    <div className="px-4 pt-4 pb-3 border-b border-white/5 flex items-center gap-3">
      {/* Tab title */}
      <div className="flex items-center gap-2 flex-shrink-0" style={{ color }}>
        <TabIcon id={tab} size={14} />
        <span className="text-sm font-bold tracking-widest uppercase">{TAB_LABELS[tab]}</span>
      </div>

      {/* Divider */}
      {subTabs.length > 0 && (
        <div className="w-px h-4 flex-shrink-0" style={{ background: 'rgba(255,255,255,0.1)' }} />
      )}

      {/* Sub-tabs */}
      <div className="flex items-center gap-1 overflow-x-auto no-scrollbar flex-1">
        {subTabs.map((st) => {
          const isActive = subTab === st.id
          return (
            <button key={st.id} onClick={() => onSubTabChange?.(st.id)}
              className="flex-shrink-0 flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[10px] font-bold tracking-wide uppercase transition-all duration-200"
              style={isActive
                ? { background: `${color}20`, color, border: `1px solid ${color}35` }
                : { color: 'rgba(255,255,255,0.25)', border: '1px solid transparent' }
              }>
              <span style={{ fontSize: '12px' }}>{st.icon}</span>
              <span>{st.label}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
