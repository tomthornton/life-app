'use client'

import { useState } from 'react'
import { Dumbbell, Droplets, Trophy, Lightbulb } from 'lucide-react'
import TabPageHeader from '@/components/TabPageHeader'


type BodyMode = 'workout' | 'health' | 'hydration' | 'records'

type Exercise = { name: string; sets: number; reps: string; done: boolean }
type WorkoutDay = { day: string; focus: string; shortFocus: string; color: string; exercises: Exercise[] }
type PR = { exercise: string; value: string; date: string }

function useLocalStorage<T>(key: string, initial: T) {
  const [val, setVal] = useState<T>(() => {
    if (typeof window === 'undefined') return initial
    try { return JSON.parse(localStorage.getItem(key) || 'null') ?? initial } catch { return initial }
  })
  const set = (v: T) => { setVal(v); localStorage.setItem(key, JSON.stringify(v)) }
  return [val, set] as const
}

const HEALTH_TIPS = [
  { title: "Prioritize Protein", body: "Aim for 0.7–1g of protein per pound of bodyweight. It's the single biggest lever for body composition. Most people are chronically under.", icon: "🥩" },
  { title: "Walk More", body: "10,000 steps isn't magic — but walking 30–60 min daily dramatically improves insulin sensitivity, mood, and cardiovascular health with zero recovery cost.", icon: "🚶" },
  { title: "Sleep is a Performance Drug", body: "7–9 hours isn't optional. Sleep debt tanks testosterone, raises cortisol, kills recovery, and wrecks decision-making. Protect it aggressively.", icon: "😴" },
  { title: "Sunlight in the Morning", body: "Get outside within an hour of waking. Morning light sets your circadian rhythm, boosts mood, and improves sleep quality that night.", icon: "☀️" },
  { title: "Cold Water Works", body: "Cold showers or cold plunges after training can reduce soreness and inflammation. Even 30 seconds cold at the end of a shower has a real effect.", icon: "🧊" },
  { title: "Stress = Stored Fat", body: "Chronic elevated cortisol signals your body to store fat, especially visceral. Manage stress as seriously as you manage diet and training.", icon: "🧘" },
  { title: "Don't Skip Warm-Ups", body: "5–10 minutes of movement prep before training reduces injury risk dramatically and improves performance. Your heaviest set should never be your first.", icon: "🔥" },
]

const TODAY_TIP = HEALTH_TIPS[new Date().getDate() % HEALTH_TIPS.length]

const WORKOUT_WEEK: WorkoutDay[] = [
  { day: 'Monday', focus: 'Push — Chest / Shoulders / Triceps', shortFocus: 'Push Day', color: 'text-red-400', exercises: [
    { name: 'Bench Press', sets: 4, reps: '8-10', done: false },
    { name: 'Overhead Press', sets: 3, reps: '10', done: false },
    { name: 'Incline Dumbbell Press', sets: 3, reps: '10-12', done: false },
    { name: 'Lateral Raises', sets: 3, reps: '15', done: false },
    { name: 'Tricep Pushdowns', sets: 3, reps: '12-15', done: false },
  ]},
  { day: 'Tuesday', focus: 'Pull — Back / Biceps', shortFocus: 'Pull Day', color: 'text-blue-400', exercises: [
    { name: 'Pull-Ups', sets: 4, reps: '6-10', done: false },
    { name: 'Barbell Row', sets: 4, reps: '8', done: false },
    { name: 'Cable Row', sets: 3, reps: '10-12', done: false },
    { name: 'Face Pulls', sets: 3, reps: '15', done: false },
    { name: 'Hammer Curls', sets: 3, reps: '12', done: false },
  ]},
  { day: 'Wednesday', focus: 'Rest / Active Recovery', shortFocus: 'Rest Day', color: 'text-white/40', exercises: [] },
  { day: 'Thursday', focus: 'Legs — Quads / Hamstrings / Glutes', shortFocus: 'Leg Day', color: 'text-yellow-400', exercises: [
    { name: 'Squat', sets: 4, reps: '6-8', done: false },
    { name: 'Romanian Deadlift', sets: 3, reps: '10', done: false },
    { name: 'Leg Press', sets: 3, reps: '12', done: false },
    { name: 'Leg Curl', sets: 3, reps: '12', done: false },
    { name: 'Calf Raises', sets: 4, reps: '20', done: false },
  ]},
  { day: 'Friday', focus: 'Push + Core', shortFocus: 'Push + Core', color: 'text-orange-400', exercises: [
    { name: 'Dips', sets: 4, reps: '8-10', done: false },
    { name: 'Cable Fly', sets: 3, reps: '12', done: false },
    { name: 'Arnold Press', sets: 3, reps: '10', done: false },
    { name: 'Plank', sets: 3, reps: '60s', done: false },
    { name: 'Ab Rollout', sets: 3, reps: '10', done: false },
  ]},
  { day: 'Saturday', focus: 'Pull + Cardio', shortFocus: 'Back Day', color: 'text-purple-400', exercises: [
    { name: 'Deadlift', sets: 4, reps: '5', done: false },
    { name: 'Lat Pulldown', sets: 3, reps: '10', done: false },
    { name: '20 min Cardio', sets: 1, reps: '20 min', done: false },
  ]},
  { day: 'Sunday', focus: 'Rest', shortFocus: 'Rest Day', color: 'text-white/40', exercises: [] },
]

const DEFAULT_PRS: PR[] = [
  { exercise: 'Bench Press', value: '', date: '' },
  { exercise: 'Squat', value: '', date: '' },
  { exercise: 'Deadlift', value: '', date: '' },
  { exercise: 'Overhead Press', value: '', date: '' },
  { exercise: 'Pull-Ups', value: '', date: '' },
]

const DAYS = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday']
const TODAY = DAYS[new Date().getDay() === 0 ? 6 : new Date().getDay() - 1]
const TODAY_KEY = new Date().toISOString().split('T')[0]
const DAILY_GOAL = 8 // glasses

const MODES = [
  { id: 'workout'   as BodyMode, label: 'Workout',    icon: '🏋️' },
  { id: 'health'    as BodyMode, label: 'Health',     icon: '💡' },
  { id: 'hydration' as BodyMode, label: 'Hydration',  icon: '💧' },
  { id: 'records'   as BodyMode, label: 'PRs',        icon: '🏆' },
]

export default function BodyTab({ mode: modeProp, onModeChange }: { mode?: string; onModeChange?: (m: string) => void }) {
  const mode = (modeProp ?? 'workout') as BodyMode
  const [week, setWeek] = useState(WORKOUT_WEEK)
  const [selectedDay, setSelectedDay] = useState(TODAY)
  const [hydration, setHydration] = useLocalStorage<Record<string,number>>('mbs_hydration', {})
  const [prs, setPrs] = useLocalStorage<PR[]>('mbs_prs', DEFAULT_PRS)
  const [editingPR, setEditingPR] = useState<string | null>(null)
  const [prDraft, setPrDraft] = useState('')

  const todayGlasses = hydration[TODAY_KEY] ?? 0
  const addGlass = () => setHydration({ ...hydration, [TODAY_KEY]: Math.min(todayGlasses + 1, DAILY_GOAL + 4) })
  const removeGlass = () => setHydration({ ...hydration, [TODAY_KEY]: Math.max(0, todayGlasses - 1) })

  const selectedWorkout = week.find(w => w.day === selectedDay)!
  const todayWorkout = week.find(w => w.day === TODAY)!
  const completedCount = selectedWorkout.exercises.filter(e => e.done).length
  const totalCount = selectedWorkout.exercises.length

  const toggleExercise = (name: string) => {
    setWeek(prev => prev.map(day => day.day === selectedDay
      ? { ...day, exercises: day.exercises.map(ex => ex.name === name ? { ...ex, done: !ex.done } : ex) }
      : day))
  }

  const savePR = (exercise: string) => {
    setPrs(prs.map(p => p.exercise === exercise
      ? { ...p, value: prDraft, date: TODAY_KEY }
      : p))
    setEditingPR(null)
    setPrDraft('')
  }

  return (
    <div className="flex flex-col">
      <TabPageHeader tab="body" subTab={mode} onSubTabChange={onModeChange} />

      {/* ── WORKOUT ── */}
      {mode === 'workout' && (
        <div className="px-4 py-4 space-y-4">
          {/* Today callout */}
          <div className="bg-gradient-to-r from-body/20 to-body/5 border border-body/30 rounded-2xl p-4 flex items-center gap-4">
            <div className="text-3xl">📅</div>
            <div>
              <p className="text-xs text-white/40 uppercase tracking-widest font-medium">Today</p>
              <p className={`text-lg font-bold mt-0.5 ${todayWorkout.color}`}>{todayWorkout.shortFocus}</p>
              <p className="text-xs text-white/50 mt-0.5">{todayWorkout.focus}</p>
            </div>
          </div>

          {/* Day selector */}
          <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
            {DAYS.map(day => {
              const w = week.find(x => x.day === day)!
              const isRest = w.exercises.length === 0
              const isDone = !isRest && w.exercises.every(e => e.done)
              const isActive = selectedDay === day
              return (
                <button key={day} onClick={() => setSelectedDay(day)}
                  className="flex-shrink-0 flex flex-col items-center gap-1 px-3 py-2 rounded-xl border transition-all"
                  style={isActive
                    ? { background: 'rgba(34,197,94,0.15)', borderColor: '#22c55e', color: '#22c55e' }
                    : { background: 'rgba(255,255,255,0.03)', borderColor: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.4)' }
                  }>
                  <span className="text-xs font-semibold">{day.slice(0,3)}</span>
                  <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
                    style={{ background: isDone ? '#22c55e' : 'rgba(255,255,255,0.07)', color: isDone ? '#fff' : 'rgba(255,255,255,0.3)' }}>
                    {isDone ? '✓' : isRest ? '—' : day[0]}
                  </div>
                </button>
              )
            })}
          </div>

          {/* Progress */}
          <div className="bg-card border border-border rounded-2xl p-4">
            <p className="text-xs text-white/40 uppercase tracking-widest font-medium mb-1">{selectedDay}</p>
            <h2 className="text-base font-bold text-white">{selectedWorkout.focus}</h2>
            {totalCount > 0 && (
              <div className="mt-3">
                <div className="flex justify-between text-xs text-white/50 mb-1.5">
                  <span>{completedCount}/{totalCount} exercises</span>
                  <span>{Math.round((completedCount / totalCount) * 100)}%</span>
                </div>
                <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-body rounded-full transition-all duration-500"
                    style={{ width: `${(completedCount / totalCount) * 100}%` }} />
                </div>
              </div>
            )}
          </div>

          {selectedWorkout.exercises.length === 0
            ? <div className="text-center py-12 text-white/30"><div className="text-4xl mb-3">😴</div><p>Rest day.</p></div>
            : <div className="space-y-2">
                {selectedWorkout.exercises.map(ex => (
                  <button key={ex.name} onClick={() => toggleExercise(ex.name)}
                    className="w-full flex items-center gap-4 p-4 rounded-2xl border transition-all text-left"
                    style={ex.done
                      ? { background: 'rgba(34,197,94,0.08)', borderColor: 'rgba(34,197,94,0.3)' }
                      : { background: 'rgba(255,255,255,0.02)', borderColor: 'rgba(255,255,255,0.08)' }
                    }>
                    <div className="w-6 h-6 rounded-full border-2 flex-shrink-0 flex items-center justify-center"
                      style={ex.done ? { background: '#22c55e', borderColor: '#22c55e' } : { borderColor: 'rgba(255,255,255,0.2)' }}>
                      {ex.done && <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17 4 12"/></svg>}
                    </div>
                    <p className={`flex-1 font-semibold text-sm ${ex.done ? 'text-white/40 line-through' : 'text-white'}`}>{ex.name}</p>
                    <p className="text-sm font-bold text-white/60">{ex.sets} × {ex.reps}</p>
                  </button>
                ))}
              </div>
          }
          {totalCount > 0 && completedCount === totalCount && (
            <div className="bg-body/10 border border-body/30 rounded-2xl p-4 text-center">
              <p className="text-body font-bold">🎉 Workout complete. Let's go.</p>
            </div>
          )}
        </div>
      )}

      {/* ── HEALTH TIPS ── */}
      {mode === 'health' && (
        <div className="px-4 py-4 space-y-3">
          <div className="bg-body/10 border border-body/30 rounded-2xl p-5">
            <div className="flex items-start gap-3">
              <span className="text-3xl">{TODAY_TIP.icon}</span>
              <div>
                <p className="text-[10px] text-body/70 uppercase tracking-widest font-semibold mb-1">Tip of the Day</p>
                <p className="text-base font-bold text-white mb-2">{TODAY_TIP.title}</p>
                <p className="text-sm text-white/65 leading-relaxed">{TODAY_TIP.body}</p>
              </div>
            </div>
          </div>

          <p className="text-[10px] text-white/30 uppercase tracking-widest font-semibold px-1 pt-2">More Tips</p>
          {HEALTH_TIPS.filter(t => t.title !== TODAY_TIP.title).map(tip => (
            <div key={tip.title} className="bg-card border border-border rounded-2xl p-4 flex gap-3">
              <span className="text-2xl flex-shrink-0">{tip.icon}</span>
              <div>
                <p className="text-sm font-bold text-white mb-1">{tip.title}</p>
                <p className="text-xs text-white/50 leading-relaxed">{tip.body}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── HYDRATION ── */}
      {mode === 'hydration' && (
        <div className="px-4 py-6 space-y-6">
          {/* Big display */}
          <div className="flex flex-col items-center gap-2">
            <div className="relative">
              <svg width="160" height="160" viewBox="0 0 160 160" className="-rotate-90">
                <circle cx="80" cy="80" r="68" fill="none" stroke="rgba(34,197,94,0.1)" strokeWidth="10" />
                <circle cx="80" cy="80" r="68" fill="none" stroke="#22c55e" strokeWidth="10" strokeLinecap="round"
                  strokeDasharray={`${2 * Math.PI * 68}`}
                  strokeDashoffset={`${2 * Math.PI * 68 * (1 - Math.min(todayGlasses / DAILY_GOAL, 1))}`}
                  style={{ filter: 'drop-shadow(0 0 8px rgba(34,197,94,0.6))', transition: 'stroke-dashoffset 0.5s ease' }} />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-4xl font-black text-white">{todayGlasses}</span>
                <span className="text-xs text-white/40">/ {DAILY_GOAL} glasses</span>
              </div>
            </div>
            <p className="text-sm font-semibold text-white/60">
              {todayGlasses === 0 ? "Start hydrating 💧" : todayGlasses < DAILY_GOAL ? `${DAILY_GOAL - todayGlasses} more to go` : "Hydration goal hit! 🎉"}
            </p>
          </div>

          {/* Controls */}
          <div className="flex gap-3">
            <button onClick={removeGlass}
              className="flex-1 py-4 rounded-2xl border border-white/10 text-white/50 text-xl font-bold transition-all active:scale-[0.97]"
              style={{ background: 'rgba(255,255,255,0.03)' }}>−</button>
            <button onClick={addGlass}
              className="flex-1 py-4 rounded-2xl text-white text-xl font-bold transition-all active:scale-[0.97]"
              style={{ background: 'linear-gradient(135deg, #22c55e, #16a34a)', boxShadow: '0 0 20px rgba(34,197,94,0.3)' }}>
              + Glass
            </button>
          </div>

          {/* Grid of glasses */}
          <div className="bg-card border border-border rounded-2xl p-4">
            <p className="text-[10px] text-white/30 uppercase tracking-widest font-semibold mb-3">Today's Progress</p>
            <div className="grid grid-cols-8 gap-2">
              {Array.from({ length: DAILY_GOAL }).map((_, i) => (
                <div key={i} className="aspect-square rounded-lg flex items-center justify-center text-lg transition-all"
                  style={{ background: i < todayGlasses ? 'rgba(34,197,94,0.2)' : 'rgba(255,255,255,0.04)',
                    filter: i < todayGlasses ? 'drop-shadow(0 0 4px rgba(34,197,94,0.4))' : 'none' }}>
                  {i < todayGlasses ? '💧' : '○'}
                </div>
              ))}
            </div>
          </div>

          <p className="text-center text-xs text-white/20">Tip: ~8 glasses (64 oz) is a solid daily baseline.</p>
        </div>
      )}

      {/* ── PERSONAL RECORDS ── */}
      {mode === 'records' && (
        <div className="px-4 py-4 space-y-3">
          <div className="bg-card border border-border rounded-2xl p-4 mb-2">
            <p className="text-sm text-white/50 leading-relaxed">Track your personal bests. Tap a lift to update your PR.</p>
          </div>
          {prs.map(pr => (
            <div key={pr.exercise} className="bg-card border border-border rounded-2xl overflow-hidden">
              <div className="flex items-center justify-between px-4 py-4">
                <div>
                  <p className="text-sm font-bold text-white">{pr.exercise}</p>
                  {pr.date && <p className="text-[10px] text-white/30 mt-0.5">{pr.date}</p>}
                </div>
                {editingPR === pr.exercise ? (
                  <div className="flex items-center gap-2">
                    <input autoFocus value={prDraft} onChange={e => setPrDraft(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && savePR(pr.exercise)}
                      placeholder="e.g. 225 lbs"
                      className="w-28 bg-white/10 border border-border rounded-xl px-3 py-2 text-sm text-white focus:outline-none text-right" />
                    <button onClick={() => savePR(pr.exercise)}
                      className="px-3 py-2 bg-body rounded-xl text-white text-xs font-bold">✓</button>
                  </div>
                ) : (
                  <button onClick={() => { setEditingPR(pr.exercise); setPrDraft(pr.value) }}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl transition-all"
                    style={{ background: pr.value ? 'rgba(245,158,11,0.15)' : 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
                    {pr.value
                      ? <><span className="text-amber-400 font-black text-lg">{pr.value}</span><Trophy size={14} className="text-amber-400" /></>
                      : <span className="text-white/30 text-sm">Set PR</span>
                    }
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
