'use client'

import { useState, useRef, useEffect } from 'react'

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

type Message = { role: 'user' | 'assistant'; content: string }

export default function SpiritTab() {
  const [expanded, setExpanded] = useState<'verse' | 'reading' | 'prayer' | null>('verse')
  const [showChat, setShowChat] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: "What's on your heart? We can talk about today's verse, the reading, prayer — or anything spiritual you're working through." }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, showChat])

  const send = async () => {
    if (!input.trim() || loading) return
    const userMsg: Message = { role: 'user', content: input.trim() }
    setMessages((m) => [...m, userMsg])
    setInput('')
    setLoading(true)

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMsg.content, mode: 'spirit', context: DAILY_CONTENT }),
      })
      const data = await res.json()
      setMessages((m) => [...m, { role: 'assistant', content: data.reply }])
    } catch {
      setMessages((m) => [...m, { role: 'assistant', content: 'Something went wrong. Try again.' }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col">
      {/* Content cards */}
      <div className="px-4 py-4 space-y-3">

        {/* Verse */}
        <div
          className={`bg-card border rounded-2xl overflow-hidden transition-all cursor-pointer ${expanded === 'verse' ? 'border-spirit/50' : 'border-border'}`}
          onClick={() => setExpanded(expanded === 'verse' ? null : 'verse')}
        >
          <div className="flex items-center gap-3 p-4">
            <div className="text-2xl">📖</div>
            <div className="flex-1">
              <p className="text-[10px] text-white/40 uppercase tracking-widest font-medium">Verse of the Day</p>
              <p className="text-sm font-bold text-spirit mt-0.5">{DAILY_CONTENT.verse.reference}</p>
            </div>
            <Chevron open={expanded === 'verse'} />
          </div>
          {expanded === 'verse' && (
            <div className="px-4 pb-4 space-y-3">
              <blockquote className="text-base font-semibold text-white leading-snug border-l-2 border-spirit pl-4">
                "{DAILY_CONTENT.verse.text}"
              </blockquote>
              <p className="text-sm text-white/60 leading-relaxed">{DAILY_CONTENT.verse.reflection}</p>
            </div>
          )}
        </div>

        {/* Reading */}
        <div
          className={`bg-card border rounded-2xl overflow-hidden transition-all cursor-pointer ${expanded === 'reading' ? 'border-spirit/50' : 'border-border'}`}
          onClick={() => setExpanded(expanded === 'reading' ? null : 'reading')}
        >
          <div className="flex items-center gap-3 p-4">
            <div className="text-2xl">🌅</div>
            <div className="flex-1">
              <p className="text-[10px] text-white/40 uppercase tracking-widest font-medium">Daily Reflection</p>
              <p className="text-sm font-bold text-white mt-0.5">{DAILY_CONTENT.reading.title}</p>
            </div>
            <Chevron open={expanded === 'reading'} />
          </div>
          {expanded === 'reading' && (
            <div className="px-4 pb-4">
              <p className="text-sm text-white/70 leading-relaxed whitespace-pre-line">{DAILY_CONTENT.reading.body}</p>
            </div>
          )}
        </div>

        {/* Prayer */}
        <div
          className={`bg-card border rounded-2xl overflow-hidden transition-all cursor-pointer ${expanded === 'prayer' ? 'border-spirit/50' : 'border-border'}`}
          onClick={() => setExpanded(expanded === 'prayer' ? null : 'prayer')}
        >
          <div className="flex items-center gap-3 p-4">
            <div className="text-2xl">🙏</div>
            <div className="flex-1">
              <p className="text-[10px] text-white/40 uppercase tracking-widest font-medium">Morning Prayer</p>
              <p className="text-sm font-bold text-white mt-0.5">Today's Prayer</p>
            </div>
            <Chevron open={expanded === 'prayer'} />
          </div>
          {expanded === 'prayer' && (
            <div className="px-4 pb-4">
              <p className="text-sm text-white/70 leading-relaxed whitespace-pre-line italic">{DAILY_CONTENT.prayer}</p>
            </div>
          )}
        </div>

        {/* Nudge from Claw */}
        <div className="bg-spirit/10 border border-spirit/30 rounded-2xl p-4">
          <p className="text-[10px] text-spirit uppercase tracking-widest font-medium mb-1">From Claw</p>
          <p className="text-sm text-white/80 leading-relaxed">
            You're just getting started. That takes courage. Keep going.
          </p>
        </div>

        {/* Chat toggle */}
        <button
          onClick={() => setShowChat((v) => !v)}
          className={`w-full flex items-center justify-between p-4 rounded-2xl border transition-all ${
            showChat ? 'bg-spirit/10 border-spirit/40' : 'bg-card border-border'
          }`}
        >
          <div className="flex items-center gap-3">
            <span className="text-xl">💬</span>
            <div className="text-left">
              <p className="text-sm font-semibold text-white">Talk it through</p>
              <p className="text-xs text-white/40">Chat about what's on your heart</p>
            </div>
          </div>
          <Chevron open={showChat} />
        </button>
      </div>

      {/* Chat panel */}
      {showChat && (
        <div className="border-t border-border flex flex-col" style={{ height: '380px' }}>
          <div className="flex-1 overflow-y-auto no-scrollbar px-4 py-4 space-y-3">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-[82%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-spirit text-white rounded-br-sm'
                      : 'bg-card border border-border text-white/90 rounded-bl-sm'
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-card border border-border rounded-2xl rounded-bl-sm px-4 py-3">
                  <div className="flex gap-1.5">
                    {[0,1,2].map((i) => (
                      <div key={i} className="w-2 h-2 rounded-full bg-white/40 animate-bounce" style={{ animationDelay: `${i*0.15}s` }} />
                    ))}
                  </div>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>
          <div className="border-t border-border px-4 py-3 bg-card">
            <div className="flex gap-3 items-end">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send() } }}
                placeholder="What's on your heart?"
                rows={1}
                className="flex-1 bg-white/5 border border-border rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/30 resize-none focus:outline-none focus:border-spirit transition-colors"
              />
              <button
                onClick={send}
                disabled={!input.trim() || loading}
                className="w-10 h-10 rounded-xl bg-spirit flex items-center justify-center disabled:opacity-40 transition-opacity flex-shrink-0"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 2L11 13M22 2L15 22 11 13 2 9l20-7z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function Chevron({ open }: { open: boolean }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
      className={`transition-transform flex-shrink-0 ${open ? 'rotate-180' : ''}`}>
      <path d="M6 9l6 6 6-6" />
    </svg>
  )
}
