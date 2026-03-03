'use client'

import { useState } from 'react'

// Placeholder — will be AI-curated and pulled from Supabase
const DAILY_CONTENT = {
  verse: {
    reference: 'Philippians 4:13',
    text: 'I can do all things through Christ who strengthens me.',
    reflection:
      "You're building something new — a new version of yourself, your habits, your life. This verse isn't about arrogance. It's about knowing that you don't have to do it alone. Lean in.",
  },
  reading: {
    title: 'On Starting Before You Feel Ready',
    body: `Most people wait to feel ready. They wait for the perfect moment, the right resources, the confidence that comes from having done it before. That moment never comes.

The people who move forward do it scared. They start messy, iterate fast, and figure it out as they go.

You don't need more preparation. You need more reps.

What's one small thing you can do today that future-you will thank you for?`,
  },
  prayer: `Lord, thank you for this day and the opportunities it holds.

Give me clarity to know what matters. Give me discipline to pursue it. And give me peace when things don't go as planned.

Help me to be present — with myself, with the people I love, and with You.

Amen.`,
}

export default function SpiritTab() {
  const [expanded, setExpanded] = useState<'verse' | 'reading' | 'prayer' | null>('verse')

  return (
    <div className="px-4 py-4 space-y-3">
      {/* Daily verse */}
      <div
        className={`bg-card border rounded-2xl overflow-hidden transition-all cursor-pointer ${
          expanded === 'verse' ? 'border-spirit/50' : 'border-border'
        }`}
        onClick={() => setExpanded(expanded === 'verse' ? null : 'verse')}
      >
        <div className="flex items-center gap-3 p-4">
          <div className="text-2xl">📖</div>
          <div className="flex-1">
            <p className="text-xs text-white/40 uppercase tracking-widest font-medium">Verse of the Day</p>
            <p className="text-sm font-bold text-spirit mt-0.5">{DAILY_CONTENT.verse.reference}</p>
          </div>
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="rgba(255,255,255,0.4)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={`transition-transform ${expanded === 'verse' ? 'rotate-180' : ''}`}
          >
            <path d="M6 9l6 6 6-6" />
          </svg>
        </div>
        {expanded === 'verse' && (
          <div className="px-4 pb-4 space-y-3">
            <blockquote className="text-lg font-semibold text-white leading-snug border-l-2 border-spirit pl-4">
              "{DAILY_CONTENT.verse.text}"
            </blockquote>
            <p className="text-sm text-white/60 leading-relaxed">{DAILY_CONTENT.verse.reflection}</p>
          </div>
        )}
      </div>

      {/* Daily reading */}
      <div
        className={`bg-card border rounded-2xl overflow-hidden transition-all cursor-pointer ${
          expanded === 'reading' ? 'border-spirit/50' : 'border-border'
        }`}
        onClick={() => setExpanded(expanded === 'reading' ? null : 'reading')}
      >
        <div className="flex items-center gap-3 p-4">
          <div className="text-2xl">🌅</div>
          <div className="flex-1">
            <p className="text-xs text-white/40 uppercase tracking-widest font-medium">Daily Reflection</p>
            <p className="text-sm font-bold text-white mt-0.5">{DAILY_CONTENT.reading.title}</p>
          </div>
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="rgba(255,255,255,0.4)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={`transition-transform ${expanded === 'reading' ? 'rotate-180' : ''}`}
          >
            <path d="M6 9l6 6 6-6" />
          </svg>
        </div>
        {expanded === 'reading' && (
          <div className="px-4 pb-4">
            <p className="text-sm text-white/70 leading-relaxed whitespace-pre-line">{DAILY_CONTENT.reading.body}</p>
          </div>
        )}
      </div>

      {/* Prayer */}
      <div
        className={`bg-card border rounded-2xl overflow-hidden transition-all cursor-pointer ${
          expanded === 'prayer' ? 'border-spirit/50' : 'border-border'
        }`}
        onClick={() => setExpanded(expanded === 'prayer' ? null : 'prayer')}
      >
        <div className="flex items-center gap-3 p-4">
          <div className="text-2xl">🙏</div>
          <div className="flex-1">
            <p className="text-xs text-white/40 uppercase tracking-widest font-medium">Morning Prayer</p>
            <p className="text-sm font-bold text-white mt-0.5">Today's Prayer</p>
          </div>
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="rgba(255,255,255,0.4)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={`transition-transform ${expanded === 'prayer' ? 'rotate-180' : ''}`}
          >
            <path d="M6 9l6 6 6-6" />
          </svg>
        </div>
        {expanded === 'prayer' && (
          <div className="px-4 pb-4">
            <p className="text-sm text-white/70 leading-relaxed whitespace-pre-line italic">{DAILY_CONTENT.prayer}</p>
          </div>
        )}
      </div>

      {/* Nudge from Claw */}
      <div className="bg-spirit/10 border border-spirit/30 rounded-2xl p-4">
        <p className="text-xs text-spirit uppercase tracking-widest font-medium mb-1">From Claw</p>
        <p className="text-sm text-white/80 leading-relaxed">
          You're just getting started. That takes courage. The app you're building — the life you're building — it's already in motion. Keep going.
        </p>
      </div>
    </div>
  )
}
