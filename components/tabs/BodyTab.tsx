'use client'

import { useState } from 'react'
import TabPageHeader from '@/components/TabPageHeader'

type BodyMode = 'today' | 'train' | 'nutrition' | 'progress'

type WorkoutDay = {
  day: string
  focus: string
  shortFocus: string
  type: 'push' | 'pull' | 'legs' | 'rest' | 'cardio'
  exercises: { name: string; sets: number; reps: string; done: boolean }[]
}

function useLocalStorage<T>(key: string, initial: T) {
  const [val, setVal] = useState<T>(() => {
    if (typeof window === 'undefined') return initial
    try { return JSON.parse(localStorage.getItem(key) || 'null') ?? initial } catch { return initial }
  })
  const set = (v: T) => { setVal(v); localStorage.setItem(key, JSON.stringify(v)) }
  return [val, set] as const
}

const TODAY_KEY = new Date().toISOString().split('T')[0]
const DAYS = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday']
const TODAY_NAME = DAYS[new Date().getDay() === 0 ? 6 : new Date().getDay() - 1]

const WORKOUT_WEEK: WorkoutDay[] = [
  { day: 'Monday', focus: 'Chest · Shoulders · Triceps', shortFocus: 'Push', type: 'push', exercises: [
    { name: 'Bench Press', sets: 4, reps: '8-10', done: false },
    { name: 'Overhead Press', sets: 3, reps: '10', done: false },
    { name: 'Incline Dumbbell Press', sets: 3, reps: '10-12', done: false },
    { name: 'Lateral Raises', sets: 3, reps: '15', done: false },
    { name: 'Tricep Pushdowns', sets: 3, reps: '12-15', done: false },
  ]},
  { day: 'Tuesday', focus: 'Back · Biceps', shortFocus: 'Pull', type: 'pull', exercises: [
    { name: 'Pull-Ups', sets: 4, reps: '6-10', done: false },
    { name: 'Barbell Row', sets: 4, reps: '8', done: false },
    { name: 'Cable Row', sets: 3, reps: '10-12', done: false },
    { name: 'Face Pulls', sets: 3, reps: '15', done: false },
    { name: 'Hammer Curls', sets: 3, reps: '12', done: false },
  ]},
  { day: 'Wednesday', focus: 'Active Recovery', shortFocus: 'Rest', type: 'rest', exercises: [] },
  { day: 'Thursday', focus: 'Quads · Hamstrings · Glutes', shortFocus: 'Legs', type: 'legs', exercises: [
    { name: 'Squat', sets: 4, reps: '6-8', done: false },
    { name: 'Romanian Deadlift', sets: 3, reps: '10', done: false },
    { name: 'Leg Press', sets: 3, reps: '12', done: false },
    { name: 'Leg Curl', sets: 3, reps: '12', done: false },
    { name: 'Calf Raises', sets: 4, reps: '20', done: false },
  ]},
  { day: 'Friday', focus: 'Chest · Shoulders · Core', shortFocus: 'Push + Core', type: 'push', exercises: [
    { name: 'Dips', sets: 4, reps: '8-10', done: false },
    { name: 'Cable Fly', sets: 3, reps: '12', done: false },
    { name: 'Arnold Press', sets: 3, reps: '10', done: false },
    { name: 'Plank', sets: 3, reps: '60s', done: false },
    { name: 'Ab Rollout', sets: 3, reps: '10', done: false },
  ]},
  { day: 'Saturday', focus: 'Back + Cardio', shortFocus: 'Pull + Cardio', type: 'cardio', exercises: [
    { name: 'Deadlift', sets: 4, reps: '5', done: false },
    { name: 'Lat Pulldown', sets: 3, reps: '10', done: false },
    { name: '20 min Cardio', sets: 1, reps: '20 min', done: false },
  ]},
  { day: 'Sunday', focus: 'Rest & Recover', shortFocus: 'Rest', type: 'rest', exercises: [] },
]

const TYPE_COLOR: Record<string, string> = {
  push: '#f87171', pull: '#60a5fa', legs: '#facc15',
  rest: 'rgba(255,255,255,0.3)', cardio: '#a78bfa',
}

const NUTRITION: Record<string, { label: string; focus: string; tips: string[]; avoid: string[] }> = {
  push:    { label: 'Training Day', focus: 'High protein, moderate carbs', tips: ['Eat 20-40g protein within 2hrs of training', 'Complex carbs before the session for energy', 'Hydrate well — aim for 3L today'], avoid: ['Processed sugar', 'Heavy fat before training'] },
  pull:    { label: 'Training Day', focus: 'High protein, moderate carbs', tips: ['Back training taxes the CNS — fuel it', 'Post-workout shake or chicken + rice', 'Electrolytes matter on heavy pulling days'], avoid: ['Training fasted on pull day', 'Skipping post-workout nutrition'] },
  legs:    { label: 'Heavy Training Day', focus: 'Highest carbs of the week', tips: ['Legs burn the most glycogen — load up on carbs', 'Eat your biggest meal 2-3hrs before squats', 'Post-leg nutrition is critical for recovery'], avoid: ['Low carb on leg day', 'Training legs on an empty stomach'] },
  cardio:  { label: 'Cardio Day', focus: 'Lean protein + light carbs', tips: ['Lighter day — moderate calories', 'Focus on nutrient density today', 'Good day to eat a little leaner'], avoid: ['Heavy meals before cardio', 'Skipping protein'] },
  rest:    { label: 'Rest Day', focus: 'Recovery nutrition', tips: ['Protein is still important on rest days', 'Slightly lower carbs than training days', 'Prioritize anti-inflammatory foods: salmon, berries, greens'], avoid: ['Junk food — your body is repairing right now', 'Overeating just because it\'s rest day'] },
}

const WEIGHT_ENTRIES_DEFAULT: { date: string; weight: number }[] = []

export default function BodyTab({ mode: modeProp, onModeChange }: { mode?: string; onModeChange?: (m: string) => void }) {
  const mode = (modeProp ?? 'today') as BodyMode
  const [week, setWeek] = useState(WORKOUT_WEEK)
  const [selectedDay, setSelectedDay] = useState(TODAY_NAME)
  const [weights, setWeights] = useLocalStorage<{ date: string; weight: number }[]>('mbs_weights', WEIGHT_ENTRIES_DEFAULT)
  const [weightDraft, setWeightDraft] = useState('')
  const [sessionFeel, setSessionFeel] = useLocalStorage<Record<string, number>>('mbs_session_feel', {})

  const todayWorkout = WORKOUT_WEEK.find(w => w.day === TODAY_NAME)!
  const selectedWorkout = week.find(w => w.day === selectedDay)!
  const completedCount = selectedWorkout.exercises.filter(e => e.done).length
  const totalCount = selectedWorkout.exercises.length
  const weekDone = week.filter(w => w.exercises.length > 0 && w.exercises.every(e => e.done)).length
  const weekTotal = week.filter(w => w.exercises.length > 0).length
  const isRestDay = todayWorkout.type === 'rest'
  const nutrition = NUTRITION[todayWorkout.type]

  const toggleExercise = (name: string) => {
    setWeek(prev => prev.map(day => day.day === selectedDay
      ? { ...day, exercises: day.exercises.map(ex => ex.name === name ? { ...ex, done: !ex.done } : ex) }
      : day))
  }

  const logWeight = () => {
    const w = parseFloat(weightDraft)
    if (isNaN(w) || w <= 0) return
    setWeights([...weights.filter(e => e.date !== TODAY_KEY), { date: TODAY_KEY, weight: w }])
    setWeightDraft('')
  }

  const recentWeights = [...weights].sort((a, b) => a.date.localeCompare(b.date)).slice(-10)
  const maxW = Math.max(...recentWeights.map(w => w.weight), 1)
  const minW = Math.min(...recentWeights.map(w => w.weight), 0)
  const range = maxW - minW || 1

  return (
    <div className="flex flex-col">
      <TabPageHeader tab="body" subTab={mode} onSubTabChange={onModeChange} />

      {/* ── TODAY ── */}
      {mode === 'today' && (
        <div className="px-4 py-4 space-y-4">

          {/* Hero: today's status */}
          <div className="rounded-2xl overflow-hidden border"
            style={{ background: `${TYPE_COLOR[todayWorkout.type]}10`, borderColor: `${TYPE_COLOR[todayWorkout.type]}30` }}>
            <div className="px-5 py-5">
              <p className="text-[10px] uppercase tracking-widest font-semibold text-white/40 mb-1">Today · {TODAY_NAME}</p>
              <p className="text-2xl font-black text-white">{todayWorkout.shortFocus}</p>
              <p className="text-sm mt-1" style={{ color: TYPE_COLOR[todayWorkout.type] }}>{todayWorkout.focus}</p>
            </div>
            {/* Week progress bar */}
            <div className="px-5 pb-5">
              <div className="flex justify-between text-[10px] text-white/30 mb-1.5">
                <span>Week progress</span>
                <span>{weekDone}/{weekTotal} sessions</span>
              </div>
              <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                <div className="h-full rounded-full transition-all duration-500"
                  style={{ width: `${weekTotal ? (weekDone/weekTotal)*100 : 0}%`, background: TYPE_COLOR[todayWorkout.type], boxShadow: `0 0 8px ${TYPE_COLOR[todayWorkout.type]}` }} />
              </div>
            </div>
          </div>

          {/* Recovery card */}
          <div className="bg-card border border-border rounded-2xl p-4">
            <p className="text-[10px] text-white/30 uppercase tracking-widest font-semibold mb-3">Recovery Status</p>
            <div className="flex gap-3">
              {[
                { label: 'Sleep', value: isRestDay ? '💤' : '😴', sub: 'Log tonight' },
                { label: 'Soreness', value: isRestDay ? '✅' : '⚡', sub: isRestDay ? 'Rest day' : 'Check in' },
                { label: 'Energy', value: '🔋', sub: 'How you feel' },
              ].map(item => (
                <div key={item.label} className="flex-1 text-center bg-white/3 rounded-xl py-3 border border-white/5">
                  <div className="text-2xl mb-1">{item.value}</div>
                  <p className="text-[10px] font-bold text-white/60">{item.label}</p>
                  <p className="text-[9px] text-white/25 mt-0.5">{item.sub}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Nutrition snapshot */}
          <div className="bg-card border border-border rounded-2xl p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-[10px] text-white/30 uppercase tracking-widest font-semibold">Nutrition Today</p>
              <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold"
                style={{ background: 'rgba(34,197,94,0.15)', color: '#22c55e' }}>{nutrition.label}</span>
            </div>
            <p className="text-sm font-bold text-white mb-3">{nutrition.focus}</p>
            <div className="flex gap-2">
              <button onClick={() => onModeChange?.('nutrition')}
                className="flex-1 py-2 rounded-xl text-xs font-semibold text-white/50 border border-white/8 bg-white/3">
                View full plan →
              </button>
              <button onClick={() => onModeChange?.('train')}
                className="flex-1 py-2 rounded-xl text-xs font-semibold text-white"
                style={{ background: '#22c55e22', border: '1px solid #22c55e44' }}>
                {isRestDay ? 'View week →' : 'Start workout →'}
              </button>
            </div>
          </div>

          {/* Claw insight */}
          <div className="rounded-2xl border border-white/5 bg-white/2 px-4 py-4">
            <p className="text-[10px] text-white/20 uppercase tracking-widest font-semibold mb-2">From Claw</p>
            <p className="text-sm text-white/55 leading-relaxed">
              {isRestDay
                ? "Rest days aren't optional — they're where you actually get stronger. Your muscles repair during recovery, not during the workout. Own the rest day."
                : "Consistency beats intensity every time. Show up, do the work, go home. The person who trains at 70% for 5 years beats the person who trains at 100% for 6 months."}
            </p>
          </div>
        </div>
      )}

      {/* ── TRAIN ── */}
      {mode === 'train' && (
        <div className="px-4 py-4 space-y-4">
          {/* Day selector */}
          <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
            {DAYS.map(day => {
              const w = week.find(x => x.day === day)!
              const isRest = w.exercises.length === 0
              const isDone = !isRest && w.exercises.every(e => e.done)
              const isActive = selectedDay === day
              const isToday = day === TODAY_NAME
              return (
                <button key={day} onClick={() => setSelectedDay(day)}
                  className="flex-shrink-0 flex flex-col items-center gap-1 px-3 py-2 rounded-xl border transition-all"
                  style={isActive
                    ? { background: `${TYPE_COLOR[w.type]}15`, borderColor: TYPE_COLOR[w.type] }
                    : { background: 'rgba(255,255,255,0.02)', borderColor: 'rgba(255,255,255,0.07)' }
                  }>
                  <span className="text-[10px] font-bold uppercase" style={{ color: isActive ? TYPE_COLOR[w.type] : 'rgba(255,255,255,0.3)' }}>
                    {day.slice(0,3)}
                  </span>
                  <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold"
                    style={isDone
                      ? { background: '#22c55e', color: '#fff' }
                      : isToday
                      ? { background: 'rgba(255,255,255,0.12)', color: '#fff' }
                      : { background: 'rgba(255,255,255,0.04)', color: 'rgba(255,255,255,0.25)' }
                    }>
                    {isDone ? '✓' : isRest ? '—' : day[0]}
                  </div>
                </button>
              )
            })}
          </div>

          {/* Session header */}
          <div className="rounded-2xl p-4 border"
            style={{ background: `${TYPE_COLOR[selectedWorkout.type]}08`, borderColor: `${TYPE_COLOR[selectedWorkout.type]}25` }}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-white/40 uppercase tracking-widest font-medium">{selectedDay}</p>
                <p className="text-lg font-black text-white mt-0.5">{selectedWorkout.shortFocus}</p>
                <p className="text-xs mt-0.5" style={{ color: TYPE_COLOR[selectedWorkout.type] }}>{selectedWorkout.focus}</p>
              </div>
              {totalCount > 0 && (
                <div className="relative w-14 h-14 flex-shrink-0">
                  <svg width="56" height="56" viewBox="0 0 56 56" className="-rotate-90">
                    <circle cx="28" cy="28" r="22" fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="5" />
                    <circle cx="28" cy="28" r="22" fill="none" strokeWidth="5" strokeLinecap="round"
                      stroke={TYPE_COLOR[selectedWorkout.type]}
                      strokeDasharray={`${2 * Math.PI * 22}`}
                      strokeDashoffset={`${2 * Math.PI * 22 * (1 - completedCount / totalCount)}`}
                      style={{ transition: 'stroke-dashoffset 0.5s ease', filter: `drop-shadow(0 0 4px ${TYPE_COLOR[selectedWorkout.type]})` }} />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-xs font-black text-white">{completedCount}/{totalCount}</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Exercises */}
          {selectedWorkout.exercises.length === 0 ? (
            <div className="text-center py-16 text-white/25">
              <p className="text-5xl mb-4">😴</p>
              <p className="font-semibold">Rest day. Let your body recover.</p>
              <p className="text-xs mt-2 text-white/15">Recovery is where growth actually happens.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {selectedWorkout.exercises.map((ex, i) => (
                <button key={ex.name} onClick={() => toggleExercise(ex.name)}
                  className="w-full flex items-center gap-4 p-4 rounded-2xl border transition-all text-left"
                  style={ex.done
                    ? { background: `${TYPE_COLOR[selectedWorkout.type]}10`, borderColor: `${TYPE_COLOR[selectedWorkout.type]}35` }
                    : { background: 'rgba(255,255,255,0.02)', borderColor: 'rgba(255,255,255,0.07)' }
                  }>
                  <div className="w-7 h-7 rounded-full border-2 flex-shrink-0 flex items-center justify-center font-bold text-xs transition-all"
                    style={ex.done
                      ? { background: TYPE_COLOR[selectedWorkout.type], borderColor: TYPE_COLOR[selectedWorkout.type], color: '#0a0a10' }
                      : { borderColor: 'rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.2)' }
                    }>
                    {ex.done ? '✓' : i + 1}
                  </div>
                  <div className="flex-1">
                    <p className={`font-semibold text-sm ${ex.done ? 'text-white/35 line-through' : 'text-white'}`}>{ex.name}</p>
                  </div>
                  <p className="text-sm font-bold text-white/50">{ex.sets} × {ex.reps}</p>
                </button>
              ))}
            </div>
          )}

          {/* Session complete */}
          {totalCount > 0 && completedCount === totalCount && !sessionFeel[TODAY_KEY] && (
            <div className="rounded-2xl border p-5" style={{ background: 'rgba(34,197,94,0.08)', borderColor: 'rgba(34,197,94,0.3)' }}>
              <p className="text-body font-bold text-center mb-3">🎉 Session complete! How'd it feel?</p>
              <div className="flex gap-2">
                {[{ v: 1, label: 'Tough 😤' }, { v: 2, label: 'Good 💪' }, { v: 3, label: 'Easy ⚡' }].map(f => (
                  <button key={f.v} onClick={() => setSessionFeel({ ...sessionFeel, [TODAY_KEY]: f.v })}
                    className="flex-1 py-2.5 rounded-xl text-xs font-bold text-white/70 border border-white/10 bg-white/5 transition-all">
                    {f.label}
                  </button>
                ))}
              </div>
            </div>
          )}
          {totalCount > 0 && completedCount === totalCount && sessionFeel[TODAY_KEY] && (
            <div className="rounded-2xl border p-4 text-center" style={{ background: 'rgba(34,197,94,0.08)', borderColor: 'rgba(34,197,94,0.2)' }}>
              <p className="text-body font-semibold text-sm">Session logged. Rest up. 💪</p>
            </div>
          )}
        </div>
      )}

      {/* ── NUTRITION ── */}
      {mode === 'nutrition' && (
        <div className="px-4 py-4 space-y-4">
          <div className="rounded-2xl p-5 border"
            style={{ background: 'rgba(34,197,94,0.06)', borderColor: 'rgba(34,197,94,0.2)' }}>
            <p className="text-[10px] text-body/70 uppercase tracking-widest font-semibold mb-1">
              {TODAY_NAME} · {nutrition.label}
            </p>
            <p className="text-xl font-black text-white">{nutrition.focus}</p>
          </div>

          <div className="bg-card border border-border rounded-2xl p-4">
            <p className="text-[10px] text-white/30 uppercase tracking-widest font-semibold mb-3">Do This Today</p>
            <div className="space-y-3">
              {nutrition.tips.map((tip, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                    style={{ background: 'rgba(34,197,94,0.2)' }}>
                    <span className="text-body text-[10px] font-black">{i + 1}</span>
                  </div>
                  <p className="text-sm text-white/75 leading-relaxed">{tip}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-card border border-border rounded-2xl p-4">
            <p className="text-[10px] text-white/30 uppercase tracking-widest font-semibold mb-3">Minimize Today</p>
            <div className="space-y-2">
              {nutrition.avoid.map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <span className="text-red-400 text-sm">✕</span>
                  <p className="text-sm text-white/55">{item}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-card border border-border rounded-2xl p-4">
            <p className="text-[10px] text-white/30 uppercase tracking-widest font-semibold mb-2">The Principle</p>
            <p className="text-sm text-white/55 leading-relaxed">
              This app doesn't count calories. It gives you the right framework for the right day. Eat real food, prioritize protein, and adjust carbs based on training intensity. That's 90% of it.
            </p>
          </div>
        </div>
      )}

      {/* ── PROGRESS ── */}
      {mode === 'progress' && (
        <div className="px-4 py-4 space-y-4">
          {/* Log weight */}
          <div className="bg-card border border-border rounded-2xl p-4">
            <p className="text-[10px] text-white/30 uppercase tracking-widest font-semibold mb-3">Log Today's Weight</p>
            <div className="flex gap-3">
              <input value={weightDraft} onChange={e => setWeightDraft(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && logWeight()}
                type="number" placeholder="e.g. 185"
                className="flex-1 bg-white/5 border border-border rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-body" />
              <span className="flex items-center text-sm text-white/40 pr-1">lbs</span>
              <button onClick={logWeight} disabled={!weightDraft}
                className="px-5 py-3 rounded-xl text-sm font-bold text-white disabled:opacity-30"
                style={{ background: '#22c55e', boxShadow: '0 0 15px rgba(34,197,94,0.3)' }}>
                Log
              </button>
            </div>
          </div>

          {/* Weight chart */}
          {recentWeights.length > 1 ? (
            <div className="bg-card border border-border rounded-2xl p-4">
              <p className="text-[10px] text-white/30 uppercase tracking-widest font-semibold mb-4">Weight Trend</p>
              <div className="relative" style={{ height: 120 }}>
                <svg width="100%" height="120" viewBox={`0 0 300 120`} preserveAspectRatio="none">
                  {/* Grid lines */}
                  {[0, 0.5, 1].map(t => (
                    <line key={t} x1="0" y1={t * 100} x2="300" y2={t * 100} stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
                  ))}
                  {/* Area fill */}
                  <path
                    d={`M ${recentWeights.map((w, i) => `${(i / (recentWeights.length - 1)) * 300},${100 - ((w.weight - minW) / range) * 90}`).join(' L ')} L 300,110 L 0,110 Z`}
                    fill="url(#bodyGrad)" opacity="0.3" />
                  {/* Line */}
                  <path
                    d={`M ${recentWeights.map((w, i) => `${(i / (recentWeights.length - 1)) * 300},${100 - ((w.weight - minW) / range) * 90}`).join(' L ')}`}
                    fill="none" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                    style={{ filter: 'drop-shadow(0 0 4px rgba(34,197,94,0.6))' }} />
                  {/* Dots */}
                  {recentWeights.map((w, i) => (
                    <circle key={i}
                      cx={(i / (recentWeights.length - 1)) * 300}
                      cy={100 - ((w.weight - minW) / range) * 90}
                      r="3.5" fill="#22c55e" stroke="#0a0a10" strokeWidth="2"
                      style={{ filter: 'drop-shadow(0 0 3px rgba(34,197,94,0.8))' }} />
                  ))}
                  <defs>
                    <linearGradient id="bodyGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#22c55e" />
                      <stop offset="100%" stopColor="transparent" />
                    </linearGradient>
                  </defs>
                </svg>
                {/* Min/max labels */}
                <div className="absolute top-0 right-0 text-[10px] text-white/30">{maxW} lbs</div>
                <div className="absolute bottom-5 right-0 text-[10px] text-white/30">{minW} lbs</div>
              </div>
              <div className="flex justify-between mt-2">
                <span className="text-[9px] text-white/20">{recentWeights[0]?.date}</span>
                <span className="text-[9px] text-white/20">{recentWeights[recentWeights.length - 1]?.date}</span>
              </div>
            </div>
          ) : (
            <div className="bg-card border border-border rounded-2xl p-8 text-center">
              <p className="text-3xl mb-3">📈</p>
              <p className="text-sm text-white/40">Log weight for a few days to see your trend.</p>
            </div>
          )}

          {/* History list */}
          {weights.length > 0 && (
            <div className="bg-card border border-border rounded-2xl overflow-hidden">
              <div className="px-4 py-3 border-b border-border">
                <p className="text-[10px] text-white/30 uppercase tracking-widest font-semibold">Log History</p>
              </div>
              {[...weights].reverse().slice(0, 7).map((e, i, arr) => (
                <div key={e.date} className={`flex items-center justify-between px-4 py-3 ${i < arr.length - 1 ? 'border-b border-border' : ''}`}>
                  <span className="text-xs text-white/40">{e.date}</span>
                  <span className="text-sm font-bold text-white">{e.weight} lbs</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
