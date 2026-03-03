'use client'

import { useState } from 'react'
import MBSLogo from '@/components/MBSLogo'

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
      { label: 'Theme', value: 'Dark', icon: '🌙' },
      { label: 'Content', value: 'AI-powered', icon: '✨' },
    ],
  },
]

export default function ProfileTab({
  userName,
  setUserName,
}: {
  userName: string
  setUserName: (name: string) => void
}) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(userName)

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
                <input
                  autoFocus
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && save()}
                  className="flex-1 bg-white/10 border border-border rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-mind"
                />
                <button onClick={save} className="px-3 py-2 bg-mind rounded-xl text-white text-xs font-semibold">Save</button>
              </div>
            ) : (
              <div>
                <h2 className="text-xl font-bold text-white">{userName}</h2>
                <p className="text-xs text-white/40 mt-0.5">Mind · Body · Spirit</p>
              </div>
            )}
          </div>
          {!editing && (
            <button
              onClick={() => { setDraft(userName); setEditing(true) }}
              className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
                <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Settings sections */}
      {SETTINGS_SECTIONS.map((section) => (
        <div key={section.title}>
          <p className="text-[10px] text-white/30 uppercase tracking-widest font-medium px-1 mb-2">
            {section.title}
          </p>
          <div className="bg-card border border-border rounded-2xl overflow-hidden">
            {section.items.map((item, i) => (
              <div
                key={item.label}
                className={`flex items-center justify-between px-4 py-3.5 ${
                  i < section.items.length - 1 ? 'border-b border-border' : ''
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-base">{item.icon}</span>
                  <span className="text-sm text-white/70">{item.label}</span>
                </div>
                <span className="text-sm text-white/40">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* MBS branding */}
      <div className="flex flex-col items-center gap-3 py-6">
        <MBSLogo size={48} />
        <div className="text-center">
          <p className="text-sm font-bold text-white">Mind · Body · Spirit</p>
          <p className="text-xs text-white/30 mt-0.5">Powered by Claw × OpenClaw</p>
        </div>
      </div>
    </div>
  )
}
