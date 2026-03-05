'use client'

import { useState } from 'react'
import { useTheme } from '@/components/ThemeProvider'
import { THEMES, ThemeId } from '@/lib/theme'
import MBSWordmark from '@/components/MBSWordmark'

const SETTINGS_SECTIONS = [
  {
    title: 'OpenClaw',
    items: [
      { label: 'Connected', value: 'Claw (claude-sonnet)', icon: '🦾' },
      { label: 'Memory', value: 'Active', icon: '🧠' },
      { label: 'Heartbeats', value: 'Enabled', icon: '💓' },
    ],
  },
  {
    title: 'App',
    items: [
      { label: 'Version', value: '0.1.0', icon: '📦' },
      { label: 'Content', value: 'AI-powered', icon: '✨' },
    ],
  },
]

export default function ProfileTab({
  userName,
  setUserName,
  onLogout,
}: {
  userName: string
  setUserName: (name: string) => void
  onLogout?: () => void
}) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(userName)
  const { theme, setTheme } = useTheme()

  const save = () => {
    const name = draft.trim() || 'Thomas'
    setUserName(name)
    localStorage.setItem('mbs_name', name)
    setEditing(false)
  }

  return (
    <div className="px-4 py-4 space-y-4">

      {/* Profile card */}
      <div className="bg-card border border-border rounded-2xl p-5">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-mind via-body to-spirit flex items-center justify-center text-2xl font-bold text-white">
            {userName.slice(0, 1).toUpperCase()}
          </div>
          <div className="flex-1">
            {editing ? (
              <div className="flex gap-2 items-center">
                <input autoFocus value={draft} onChange={e => setDraft(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && save()}
                  className="flex-1 bg-white/10 border border-border rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-mind"
                  style={{ color: 'var(--color-text)' }} />
                <button onClick={save} className="px-3 py-2 bg-mind rounded-xl text-white text-xs font-semibold">Save</button>
              </div>
            ) : (
              <div>
                <h2 className="text-xl font-bold" style={{ color: 'var(--color-text)' }}>{userName}</h2>
                <p className="text-xs mt-0.5" style={{ color: 'var(--color-muted)' }}>Mind · Body · Spirit</p>
              </div>
            )}
          </div>
          {!editing && (
            <button onClick={() => { setDraft(userName); setEditing(true) }}
              className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
                <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Theme switcher */}
      <div>
        <p className="text-[10px] uppercase tracking-widest font-semibold px-1 mb-2" style={{ color: 'var(--color-muted)' }}>
          Theme
        </p>
        <div className="grid grid-cols-3 gap-2">
          {(Object.values(THEMES) as typeof THEMES[ThemeId][]).map(t => {
            const isActive = theme === t.id
            return (
              <button key={t.id} onClick={() => setTheme(t.id as ThemeId)}
                className="flex flex-col rounded-2xl overflow-hidden border transition-all active:scale-[0.97]"
                style={{
                  borderColor: isActive ? '#6366f1' : 'rgba(255,255,255,0.08)',
                  boxShadow: isActive ? '0 0 16px rgba(99,102,241,0.3)' : 'none',
                }}>
                {/* Mini preview */}
                <div className="h-14 relative overflow-hidden" style={{ background: t.preview.bg }}>
                  <div className="absolute bottom-1 left-1 right-1 h-4 rounded-lg"
                    style={{ background: t.preview.card, border: `1px solid ${t.preview.accent}30` }} />
                  <div className="absolute top-1 right-1 w-3 h-3 rounded-full"
                    style={{ background: t.preview.accent, boxShadow: `0 0 6px ${t.preview.accent}` }} />
                  <div className="absolute top-2 left-2 text-[8px] font-bold" style={{ color: t.preview.text, fontFamily: t.id === 'antique' ? 'serif' : t.id === 'future' ? 'monospace' : 'sans-serif' }}>
                    MBS
                  </div>
                </div>
                {/* Label */}
                <div className="px-2 py-2" style={{ background: t.preview.card }}>
                  <p className="text-[10px] font-black uppercase tracking-wide" style={{ color: isActive ? '#6366f1' : t.preview.text }}>
                    {t.name}
                  </p>
                  <p className="text-[9px] mt-0.5" style={{ color: `${t.preview.text}70` }}>{t.era}</p>
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* Settings sections */}
      {SETTINGS_SECTIONS.map(section => (
        <div key={section.title}>
          <p className="text-[10px] uppercase tracking-widest font-semibold px-1 mb-2" style={{ color: 'var(--color-muted)' }}>
            {section.title}
          </p>
          <div className="bg-card border border-border rounded-2xl overflow-hidden">
            {section.items.map((item, i) => (
              <div key={item.label}
                className={`flex items-center justify-between px-4 py-3.5 ${i < section.items.length - 1 ? 'border-b border-border' : ''}`}>
                <div className="flex items-center gap-3">
                  <span className="text-base">{item.icon}</span>
                  <span className="text-sm" style={{ color: 'var(--color-muted)' }}>{item.label}</span>
                </div>
                <span className="text-sm" style={{ color: 'var(--color-muted)', opacity: 0.6 }}>{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Logout */}
      {onLogout && (
        <button onClick={onLogout}
          className="w-full py-3.5 rounded-2xl border border-red-500/20 bg-red-500/5 text-red-400 text-sm font-semibold transition-all active:scale-[0.98]">
          Log Out
        </button>
      )}

      {/* Branding */}
      <div className="flex flex-col items-center gap-3 py-6">
        <MBSWordmark />
        <p className="text-xs mt-0.5" style={{ color: 'var(--color-muted)', opacity: 0.5 }}>Powered by Claw × OpenClaw</p>
      </div>
    </div>
  )
}
