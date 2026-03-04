'use client'

import { useState, useRef, useEffect } from 'react'


type ChatMode = 'chat' | 'therapy' | 'journal' | 'mood'

type Message = { role: 'user' | 'assistant'; content: string }
type JournalEntry = { id: string; date: string; text: string }
type MoodEntry = { date: string; score: number; note: string }

const MOODS = [
  { score: 1, emoji: '😞', label: 'Rough' },
  { score: 2, emoji: '😕', label: 'Low' },
  { score: 3, emoji: '😐', label: 'Okay' },
  { score: 4, emoji: '🙂', label: 'Good' },
  { score: 5, emoji: '😁', label: 'Great' },
]

const TODAY = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })
const TODAY_KEY = new Date().toISOString().split('T')[0]

function useLocalStorage<T>(key: string, initial: T) {
  const [val, setVal] = useState<T>(() => {
    if (typeof window === 'undefined') return initial
    try { return JSON.parse(localStorage.getItem(key) || 'null') ?? initial } catch { return initial }
  })
  const set = (v: T) => { setVal(v); localStorage.setItem(key, JSON.stringify(v)) }
  return [val, set] as const
}

export default function MindTab({ mode: modeProp }: { mode?: string }) {
  const mode = (modeProp ?? 'chat') as ChatMode

  // Chat
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: "Hey Thomas. What's on your mind?" }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  // Journal
  const [journals, setJournals] = useLocalStorage<JournalEntry[]>('mbs_journal', [])
  const [journalDraft, setJournalDraft] = useState('')
  const [viewEntry, setViewEntry] = useState<JournalEntry | null>(null)

  // Mood
  const [moods, setMoods] = useLocalStorage<MoodEntry[]>('mbs_mood', [])
  const [selectedMood, setSelectedMood] = useState<number | null>(null)
  const [moodNote, setMoodNote] = useState('')
  const todayMood = moods.find(m => m.date === TODAY_KEY)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendChat = async () => {
    if (!input.trim() || loading) return
    const userMsg: Message = { role: 'user', content: input.trim() }
    setMessages(m => [...m, userMsg])
    setInput('')
    setLoading(true)
    try {
      const res = await fetch('/api/chat', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMsg.content, mode }),
      })
      const data = await res.json()
      setMessages(m => [...m, { role: 'assistant', content: data.reply }])
    } catch {
      setMessages(m => [...m, { role: 'assistant', content: 'Something went wrong.' }])
    } finally { setLoading(false) }
  }

  const saveJournal = () => {
    if (!journalDraft.trim()) return
    const entry: JournalEntry = { id: Date.now().toString(), date: TODAY_KEY, text: journalDraft.trim() }
    setJournals([entry, ...journals])
    setJournalDraft('')
  }

  const saveMood = () => {
    if (!selectedMood) return
    const entry: MoodEntry = { date: TODAY_KEY, score: selectedMood, note: moodNote.trim() }
    setMoods([...moods.filter(m => m.date !== TODAY_KEY), entry])
    setMoodNote('')
  }

  return (
    <div className="flex flex-col h-full">

      {/* ── CHAT / THERAPY ── */}
      {(mode === 'chat' || mode === 'therapy') && (
        <div className="flex flex-col flex-1">
          <div className="flex-1 overflow-y-auto no-scrollbar px-4 py-4 space-y-4">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-mind text-white rounded-br-sm'
                    : 'bg-card border border-border text-white/90 rounded-bl-sm'
                }`}>{msg.content}</div>
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
              <textarea value={input} onChange={e => setInput(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendChat() } }}
                placeholder={mode === 'therapy' ? "What's weighing on you?" : "Message Claw..."}
                rows={1}
                className="flex-1 bg-white/5 border border-border rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/30 resize-none focus:outline-none focus:border-mind transition-colors" />
              <button onClick={sendChat} disabled={!input.trim() || loading}
                className="w-10 h-10 rounded-xl bg-mind flex items-center justify-center disabled:opacity-40 flex-shrink-0">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 2L11 13M22 2L15 22 11 13 2 9l20-7z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── JOURNAL ── */}
      {mode === 'journal' && (
        <div className="flex-1 overflow-y-auto no-scrollbar px-4 py-4 space-y-4">
          {/* Write */}
          <div className="bg-card border border-border rounded-2xl overflow-hidden">
            <div className="px-4 pt-4 pb-2 border-b border-border">
              <p className="text-[10px] text-white/30 uppercase tracking-widest font-semibold">{TODAY}</p>
            </div>
            <textarea
              value={journalDraft}
              onChange={e => setJournalDraft(e.target.value)}
              placeholder="What's on your mind today? Write freely — this is just for you."
              rows={5}
              className="w-full bg-transparent px-4 py-3 text-sm text-white placeholder:text-white/20 resize-none focus:outline-none leading-relaxed"
            />
            <div className="px-4 pb-4">
              <button onClick={saveJournal} disabled={!journalDraft.trim()}
                className="px-4 py-2 rounded-xl bg-mind text-white text-xs font-semibold disabled:opacity-30 transition-opacity">
                Save Entry
              </button>
            </div>
          </div>

          {/* Past entries */}
          {journals.length > 0 && (
            <div>
              <p className="text-[10px] text-white/30 uppercase tracking-widest font-semibold px-1 mb-2">Past Entries</p>
              <div className="space-y-2">
                {journals.map(entry => (
                  <button key={entry.id} onClick={() => setViewEntry(viewEntry?.id === entry.id ? null : entry)}
                    className="w-full text-left bg-card border border-border rounded-2xl p-4 transition-all">
                    <p className="text-[10px] text-white/30 uppercase tracking-widest font-medium mb-1">{entry.date}</p>
                    <p className="text-sm text-white/70 leading-relaxed line-clamp-2">{entry.text}</p>
                    {viewEntry?.id === entry.id && (
                      <p className="text-sm text-white/80 leading-relaxed mt-2 pt-2 border-t border-border whitespace-pre-wrap">{entry.text}</p>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── MOOD ── */}
      {mode === 'mood' && (
        <div className="flex-1 overflow-y-auto no-scrollbar px-4 py-4 space-y-4">
          {todayMood ? (
            <div className="bg-card border border-mind/30 rounded-2xl p-5 text-center">
              <p className="text-4xl mb-2">{MOODS.find(m => m.score === todayMood.score)?.emoji}</p>
              <p className="text-white font-bold">{MOODS.find(m => m.score === todayMood.score)?.label}</p>
              <p className="text-white/40 text-xs mt-1">Checked in today</p>
              {todayMood.note && <p className="text-white/60 text-sm mt-3 italic">"{todayMood.note}"</p>}
              <button onClick={() => setMoods(moods.filter(m => m.date !== TODAY_KEY))}
                className="mt-3 text-xs text-white/25 underline">Update</button>
            </div>
          ) : (
            <div className="bg-card border border-border rounded-2xl p-5 space-y-5">
              <div>
                <p className="text-white font-bold text-base mb-1">How are you feeling today?</p>
                <p className="text-white/40 text-xs">{TODAY}</p>
              </div>
              <div className="flex justify-between">
                {MOODS.map(m => (
                  <button key={m.score} onClick={() => setSelectedMood(m.score)}
                    className="flex flex-col items-center gap-1.5 p-3 rounded-2xl transition-all"
                    style={selectedMood === m.score
                      ? { background: 'rgba(99,102,241,0.2)', border: '1px solid rgba(99,102,241,0.4)' }
                      : { background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }
                    }>
                    <span className="text-2xl">{m.emoji}</span>
                    <span className="text-[10px] text-white/50 font-medium">{m.label}</span>
                  </button>
                ))}
              </div>
              <textarea value={moodNote} onChange={e => setMoodNote(e.target.value)}
                placeholder="Add a note... (optional)"
                rows={2}
                className="w-full bg-white/5 border border-border rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/20 resize-none focus:outline-none" />
              <button onClick={saveMood} disabled={!selectedMood}
                className="w-full py-3.5 rounded-xl bg-mind text-white text-sm font-bold disabled:opacity-30">
                Save Check-in
              </button>
            </div>
          )}

          {/* Mood history */}
          {moods.length > 0 && (
            <div>
              <p className="text-[10px] text-white/30 uppercase tracking-widest font-semibold px-1 mb-2">Recent</p>
              <div className="bg-card border border-border rounded-2xl overflow-hidden">
                {[...moods].reverse().slice(0, 7).map((m, i, arr) => (
                  <div key={m.date} className={`flex items-center gap-3 px-4 py-3 ${i < arr.length - 1 ? 'border-b border-border' : ''}`}>
                    <span className="text-xl">{MOODS.find(x => x.score === m.score)?.emoji}</span>
                    <div className="flex-1">
                      <p className="text-xs text-white/50">{m.date}</p>
                      {m.note && <p className="text-xs text-white/30 italic mt-0.5">"{m.note}"</p>}
                    </div>
                    <div className="flex gap-0.5">
                      {[1,2,3,4,5].map(s => (
                        <div key={s} className="w-1.5 h-1.5 rounded-full" style={{ background: s <= m.score ? '#6366f1' : 'rgba(255,255,255,0.1)' }} />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
