'use client'

import { useState, useRef, useEffect } from 'react'
import CrossIcon from '@/components/icons/CrossIcon'
import SubTabBar from '@/components/SubTabBar'

type SpiritMode = 'daily' | 'gratitude' | 'prayer' | 'chat'

type GratitudeEntry = { id: string; date: string; items: string[] }
type PrayerEntry = { id: string; date: string; text: string; answered: boolean }
type Message = { role: 'user' | 'assistant'; content: string }

function useLocalStorage<T>(key: string, initial: T) {
  const [val, setVal] = useState<T>(() => {
    if (typeof window === 'undefined') return initial
    try { return JSON.parse(localStorage.getItem(key) || 'null') ?? initial } catch { return initial }
  })
  const set = (v: T) => { setVal(v); localStorage.setItem(key, JSON.stringify(v)) }
  return [val, set] as const
}

const TODAY_KEY = new Date().toISOString().split('T')[0]

const DAILY_CONTENT = {
  verse: { reference: 'Philippians 4:13', text: 'I can do all things through Christ who strengthens me.' ,
    reflection: "You're building something new — a version of yourself, your habits, your life. This verse isn't about arrogance. It's about knowing you don't have to do it alone. Lean in." },
  reading: { title: 'On Starting Before You Feel Ready',
    body: `Most people wait to feel ready. They wait for the perfect moment, the right resources, the confidence that comes from having done it before. That moment never comes.\n\nThe people who move forward do it scared. They start messy, iterate fast, and figure it out as they go.\n\nYou don't need more preparation. You need more reps.\n\nWhat's one small thing you can do today that future-you will thank you for?` },
  prayer: `Lord, thank you for this day and the opportunities it holds.\n\nGive me clarity to know what matters. Give me discipline to pursue it. And give me peace when things don't go as planned.\n\nHelp me to be present — with myself, with the people I love, and with You.\n\nAmen.`,
}

const MODES = [
  { id: 'daily'     as SpiritMode, label: 'Daily',     icon: '📖' },
  { id: 'gratitude' as SpiritMode, label: 'Gratitude', icon: '🙏' },
  { id: 'prayer'    as SpiritMode, label: 'Prayer',    icon: '✝️' },
  { id: 'chat'      as SpiritMode, label: 'Reflect',   icon: '💬' },
]

function Chevron({ open }: { open: boolean }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
      className={`transition-transform flex-shrink-0 ${open ? 'rotate-180' : ''}`}>
      <path d="M6 9l6 6 6-6" />
    </svg>
  )
}

export default function SpiritTab() {
  const [mode, setMode] = useState<SpiritMode>('daily')
  const [expanded, setExpanded] = useState<string | null>('verse')

  // Gratitude
  const [gratitude, setGratitude] = useLocalStorage<GratitudeEntry[]>('mbs_gratitude', [])
  const [drafts, setDrafts] = useState(['', '', ''])
  const todayGratitude = gratitude.find(g => g.date === TODAY_KEY)

  // Prayer
  const [prayers, setPrayers] = useLocalStorage<PrayerEntry[]>('mbs_prayers', [])
  const [prayerDraft, setPrayerDraft] = useState('')

  // Chat
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: "What's on your heart? We can talk about today's verse, the reading, prayer — or anything spiritual you're working through." }
  ])
  const [chatInput, setChatInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages])

  const saveGratitude = () => {
    const items = drafts.map(d => d.trim()).filter(Boolean)
    if (items.length === 0) return
    const entry: GratitudeEntry = { id: Date.now().toString(), date: TODAY_KEY, items }
    setGratitude([entry, ...gratitude.filter(g => g.date !== TODAY_KEY)])
    setDrafts(['', '', ''])
  }

  const addPrayer = () => {
    if (!prayerDraft.trim()) return
    const entry: PrayerEntry = { id: Date.now().toString(), date: TODAY_KEY, text: prayerDraft.trim(), answered: false }
    setPrayers([entry, ...prayers])
    setPrayerDraft('')
  }

  const toggleAnswered = (id: string) => {
    setPrayers(prayers.map(p => p.id === id ? { ...p, answered: !p.answered } : p))
  }

  const sendChat = async () => {
    if (!chatInput.trim() || loading) return
    const userMsg: Message = { role: 'user', content: chatInput.trim() }
    setMessages(m => [...m, userMsg])
    setChatInput('')
    setLoading(true)
    try {
      const res = await fetch('/api/chat', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMsg.content, mode: 'spirit', context: DAILY_CONTENT }),
      })
      const data = await res.json()
      setMessages(m => [...m, { role: 'assistant', content: data.reply }])
    } catch {
      setMessages(m => [...m, { role: 'assistant', content: 'Something went wrong.' }])
    } finally { setLoading(false) }
  }

  return (
    <div className="flex flex-col">
      <SubTabBar tabs={MODES} active={mode} onChange={(id) => setMode(id as SpiritMode)} color="#f59e0b" />

      {/* ── DAILY ── */}
      {mode === 'daily' && (
        <div className="px-4 py-4 space-y-3">
          {/* Verse */}
          {[
            { id: 'verse', icon: '📖', label: 'Verse of the Day', subtitle: DAILY_CONTENT.verse.reference,
              content: <div className="space-y-3">
                <blockquote className="text-base font-semibold text-white leading-snug border-l-2 border-spirit pl-4">"{DAILY_CONTENT.verse.text}"</blockquote>
                <p className="text-sm text-white/60 leading-relaxed">{DAILY_CONTENT.verse.reflection}</p>
              </div> },
            { id: 'reading', icon: '🌅', label: 'Daily Reflection', subtitle: DAILY_CONTENT.reading.title,
              content: <p className="text-sm text-white/70 leading-relaxed whitespace-pre-line">{DAILY_CONTENT.reading.body}</p> },
            { id: 'prayer', icon: '🙏', label: 'Morning Prayer', subtitle: "Today's Prayer",
              content: <p className="text-sm text-white/70 leading-relaxed whitespace-pre-line italic">{DAILY_CONTENT.prayer}</p> },
          ].map(card => (
            <div key={card.id} className={`bg-card border rounded-2xl overflow-hidden transition-all cursor-pointer ${expanded === card.id ? 'border-spirit/50' : 'border-border'}`}
              onClick={() => setExpanded(expanded === card.id ? null : card.id)}>
              <div className="flex items-center gap-3 p-4">
                <div className="text-2xl">{card.icon}</div>
                <div className="flex-1">
                  <p className="text-[10px] text-white/40 uppercase tracking-widest font-medium">{card.label}</p>
                  <p className="text-sm font-bold text-white mt-0.5">{card.subtitle}</p>
                </div>
                <Chevron open={expanded === card.id} />
              </div>
              {expanded === card.id && <div className="px-4 pb-4">{card.content}</div>}
            </div>
          ))}

          {/* Claw nudge */}
          <div className="bg-spirit/10 border border-spirit/30 rounded-2xl p-4">
            <p className="text-[10px] text-spirit uppercase tracking-widest font-medium mb-1">From Claw</p>
            <p className="text-sm text-white/80 leading-relaxed">You're just getting started. That takes courage. Keep going.</p>
          </div>
        </div>
      )}

      {/* ── GRATITUDE ── */}
      {mode === 'gratitude' && (
        <div className="px-4 py-4 space-y-4">
          {todayGratitude ? (
            <div className="bg-spirit/10 border border-spirit/30 rounded-2xl p-5">
              <p className="text-[10px] text-spirit uppercase tracking-widest font-semibold mb-3">Today's Gratitude</p>
              {todayGratitude.items.map((item, i) => (
                <div key={i} className="flex items-start gap-3 py-2 border-b border-white/5 last:border-0">
                  <span className="text-spirit font-bold text-sm mt-0.5">{i + 1}.</span>
                  <p className="text-white/80 text-sm leading-relaxed">{item}</p>
                </div>
              ))}
              <button onClick={() => setGratitude(gratitude.filter(g => g.date !== TODAY_KEY))}
                className="mt-3 text-xs text-white/25 underline">Update today's entry</button>
            </div>
          ) : (
            <div className="bg-card border border-border rounded-2xl p-5 space-y-4">
              <div>
                <p className="text-base font-bold text-white">What are you grateful for today?</p>
                <p className="text-xs text-white/40 mt-0.5">Name three things. Big or small.</p>
              </div>
              {drafts.map((d, i) => (
                <div key={i} className="flex items-center gap-3">
                  <span className="text-spirit font-bold text-sm w-4">{i + 1}.</span>
                  <input value={d} onChange={e => setDrafts(drafts.map((x, j) => j === i ? e.target.value : x))}
                    placeholder={['Something you have...', 'Someone in your life...', 'Something that happened...'][i]}
                    className="flex-1 bg-white/5 border border-border rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-spirit transition-colors" />
                </div>
              ))}
              <button onClick={saveGratitude} disabled={drafts.every(d => !d.trim())}
                className="w-full py-3.5 rounded-xl text-white text-sm font-bold disabled:opacity-30"
                style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)', boxShadow: '0 0 20px rgba(245,158,11,0.25)' }}>
                Save
              </button>
            </div>
          )}

          {/* Past entries */}
          {gratitude.filter(g => g.date !== TODAY_KEY).length > 0 && (
            <div>
              <p className="text-[10px] text-white/30 uppercase tracking-widest font-semibold px-1 mb-2">Past Entries</p>
              <div className="space-y-2">
                {gratitude.filter(g => g.date !== TODAY_KEY).slice(0, 5).map(entry => (
                  <div key={entry.id} className="bg-card border border-border rounded-2xl p-4">
                    <p className="text-[10px] text-white/30 uppercase tracking-widest font-medium mb-2">{entry.date}</p>
                    {entry.items.map((item, i) => (
                      <p key={i} className="text-sm text-white/60 py-0.5">• {item}</p>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── PRAYER JOURNAL ── */}
      {mode === 'prayer' && (
        <div className="px-4 py-4 space-y-4">
          {/* Add prayer */}
          <div className="bg-card border border-border rounded-2xl p-4 space-y-3">
            <p className="text-sm font-bold text-white">Add a Prayer Request</p>
            <textarea value={prayerDraft} onChange={e => setPrayerDraft(e.target.value)}
              placeholder="Write what's on your heart..."
              rows={3}
              className="w-full bg-white/5 border border-border rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/20 resize-none focus:outline-none focus:border-spirit transition-colors" />
            <button onClick={addPrayer} disabled={!prayerDraft.trim()}
              className="w-full py-3 rounded-xl text-white text-sm font-bold disabled:opacity-30"
              style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)', boxShadow: '0 0 20px rgba(245,158,11,0.2)' }}>
              Add Prayer
            </button>
          </div>

          {/* Active prayers */}
          {prayers.filter(p => !p.answered).length > 0 && (
            <div>
              <p className="text-[10px] text-white/30 uppercase tracking-widest font-semibold px-1 mb-2">Active Prayers</p>
              <div className="space-y-2">
                {prayers.filter(p => !p.answered).map(prayer => (
                  <div key={prayer.id} className="bg-card border border-spirit/20 rounded-2xl p-4 flex gap-3">
                    <CrossIcon size={14} color="#f59e0b" style={{ flexShrink: 0, marginTop: 2 }} />
                    <div className="flex-1">
                      <p className="text-sm text-white/80 leading-relaxed">{prayer.text}</p>
                      <p className="text-[10px] text-white/25 mt-1">{prayer.date}</p>
                    </div>
                    <button onClick={() => toggleAnswered(prayer.id)}
                      className="flex-shrink-0 px-2 py-1 rounded-lg text-[10px] font-semibold transition-all"
                      style={{ background: 'rgba(34,197,94,0.1)', color: 'rgba(34,197,94,0.6)', border: '1px solid rgba(34,197,94,0.2)' }}>
                      Answered
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Answered prayers */}
          {prayers.filter(p => p.answered).length > 0 && (
            <div>
              <p className="text-[10px] text-white/30 uppercase tracking-widest font-semibold px-1 mb-2">Answered 🙌</p>
              <div className="space-y-2">
                {prayers.filter(p => p.answered).map(prayer => (
                  <div key={prayer.id} className="bg-card border border-body/20 rounded-2xl p-4 flex gap-3 opacity-70">
                    <span className="text-body text-sm flex-shrink-0">✓</span>
                    <p className="text-sm text-white/50 leading-relaxed line-through">{prayer.text}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {prayers.length === 0 && (
            <div className="text-center py-8 text-white/25">
              <div className="text-4xl mb-3">🙏</div>
              <p className="text-sm">Your prayer journal is empty.<br />Add your first request above.</p>
            </div>
          )}
        </div>
      )}

      {/* ── REFLECT / CHAT ── */}
      {mode === 'chat' && (
        <div className="flex flex-col" style={{ height: 'calc(100vh - 220px)' }}>
          <div className="flex-1 overflow-y-auto no-scrollbar px-4 py-4 space-y-3">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[82%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                  msg.role === 'user'
                    ? 'text-white rounded-br-sm'
                    : 'bg-card border border-border text-white/90 rounded-bl-sm'
                }`} style={msg.role === 'user' ? { background: 'linear-gradient(135deg, #f59e0b, #d97706)' } : {}}>
                  {msg.content}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-card border border-border rounded-2xl rounded-bl-sm px-4 py-3">
                  <div className="flex gap-1.5">
                    {[0,1,2].map(i => <div key={i} className="w-2 h-2 rounded-full bg-white/40 animate-bounce" style={{ animationDelay: `${i*0.15}s` }} />)}
                  </div>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>
          <div className="border-t border-border px-4 py-3 bg-card">
            <div className="flex gap-3 items-end">
              <textarea value={chatInput} onChange={e => setChatInput(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendChat() } }}
                placeholder="What's on your heart?"
                rows={1}
                className="flex-1 bg-white/5 border border-border rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/30 resize-none focus:outline-none focus:border-spirit transition-colors" />
              <button onClick={sendChat} disabled={!chatInput.trim() || loading}
                className="w-10 h-10 rounded-xl flex items-center justify-center disabled:opacity-40 flex-shrink-0"
                style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)' }}>
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
