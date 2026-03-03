'use client'

type SubTab = {
  id: string
  label: string
  icon: string
}

export default function SubTabBar({
  tabs,
  active,
  onChange,
  color = '#6366f1',
}: {
  tabs: SubTab[]
  active: string
  onChange: (id: string) => void
  color?: string
}) {
  return (
    <div
      className="flex gap-1 px-3 py-2.5 border-b border-white/5"
      style={{ background: 'rgba(255,255,255,0.02)' }}
    >
      {tabs.map((tab) => {
        const isActive = active === tab.id
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-[11px] font-bold tracking-wide transition-all duration-200 active:scale-[0.97]"
            style={
              isActive
                ? {
                    background: `${color}20`,
                    color: color,
                    boxShadow: `inset 0 0 0 1px ${color}35`,
                  }
                : {
                    color: 'rgba(255,255,255,0.25)',
                  }
            }
          >
            <span style={{ fontSize: '13px' }}>{tab.icon}</span>
            <span className="uppercase">{tab.label}</span>
          </button>
        )
      })}
    </div>
  )
}
