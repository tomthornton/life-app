'use client'

import { Tab } from '@/app/page'
import CrossIcon from '@/components/icons/CrossIcon'
import { Brain, Dumbbell, ChevronRight } from 'lucide-react'

const VERSE = {
  reference: 'Philippians 4:13',
  text: 'I can do all things through Christ who strengthens me.',
}

const QUOTES = [
  "You don't have to feel ready. You just have to start.",
  "Discipline is choosing between what you want now and what you want most.",
  "The version of you that you're building — he's worth the work.",
  "Faith without works is dead. So is a plan without action.",
  "Small steps taken consistently beat giant leaps taken once.",
  "You were made for more than you're currently settling for.",
  "The hard days are the ones that build the person.",
]

const WORKOUT_TODAY = (() => {
  const days = ['Rest', 'Push Day', 'Pull Day', 'Rest', 'Leg Day', 'Push + Core', 'Pull + Cardio']
  const d = new Date().getDay() // 0=Sun
  return days[d]
})()

const WORKOUT_WEEK_DONE = 2 // placeholder — will come from DB
const WORKOUT_WEEK_TOTAL = 5

const QUOTE = QUOTES[new Date().getDate() % QUOTES.length]

export default function HomeTab({ setActiveTab }: { setActiveTab: (t: Tab) => void }) {
  const isRestDay = WORKOUT_TODAY === 'Rest'

  return (
    <div className="px-4 py-5 space-y-4">

      {/* Daily verse — Spirit */}
      <div
        className="rounded-2xl overflow-hidden border border-amber-500/20 bg-amber-500/5"
        style={{ boxShadow: '0 0 40px rgba(245,158,11,0.05)' }}
      >
        <div className="px-4 py-3 border-b border-amber-500/10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CrossIcon size={14} color="#f59e0b" />
            <span className="text-[10px] font-bold tracking-widest uppercase text-amber-500/80">
              Verse of the Day
            </span>
          </div>
          <button
            onClick={() => setActiveTab('spirit')}
            className="flex items-center gap-0.5 text-[10px] text-amber-500/50 font-medium"
          >
            Spirit <ChevronRight size={10} />
          </button>
        </div>
        <div className="px-4 py-4">
          <p className="text-sm font-bold text-amber-400 mb-1">{VERSE.reference}</p>
          <p className="text-base text-white/90 font-medium leading-snug italic">
            "{VERSE.text}"
          </p>
        </div>
      </div>

      {/* Motivational quote — Mind */}
      <div
        className="rounded-2xl overflow-hidden border border-indigo-500/20 bg-indigo-500/5"
        style={{ boxShadow: '0 0 40px rgba(99,102,241,0.05)' }}
      >
        <div className="px-4 py-3 border-b border-indigo-500/10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Brain size={13} color="#6366f1" strokeWidth={2} />
            <span className="text-[10px] font-bold tracking-widest uppercase text-indigo-400/80">
              Today's Focus
            </span>
          </div>
          <button
            onClick={() => setActiveTab('mind')}
            className="flex items-center gap-0.5 text-[10px] text-indigo-400/50 font-medium"
          >
            Mind <ChevronRight size={10} />
          </button>
        </div>
        <div className="px-4 py-4">
          <p className="text-base text-white/90 font-medium leading-snug">
            "{QUOTE}"
          </p>
        </div>
      </div>

      {/* Body snapshot */}
      <div
        className="rounded-2xl overflow-hidden border border-green-500/20 bg-green-500/5"
        style={{ boxShadow: '0 0 40px rgba(34,197,94,0.05)' }}
      >
        <div className="px-4 py-3 border-b border-green-500/10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Dumbbell size={13} color="#22c55e" strokeWidth={2} />
            <span className="text-[10px] font-bold tracking-widest uppercase text-green-400/80">
              Body
            </span>
          </div>
          <button
            onClick={() => setActiveTab('body')}
            className="flex items-center gap-0.5 text-[10px] text-green-400/50 font-medium"
          >
            Workout <ChevronRight size={10} />
          </button>
        </div>
        <div className="px-4 py-4 flex items-center gap-5">
          {/* Ring */}
          <div className="relative w-16 h-16 flex-shrink-0">
            <svg width="64" height="64" viewBox="0 0 64 64" className="-rotate-90">
              <circle cx="32" cy="32" r="26" fill="none" stroke="rgba(34,197,94,0.1)" strokeWidth="6" />
              <circle
                cx="32" cy="32" r="26"
                fill="none"
                stroke="#22c55e"
                strokeWidth="6"
                strokeLinecap="round"
                strokeDasharray={`${2 * Math.PI * 26}`}
                strokeDashoffset={`${2 * Math.PI * 26 * (1 - WORKOUT_WEEK_DONE / WORKOUT_WEEK_TOTAL)}`}
                style={{ filter: 'drop-shadow(0 0 4px rgba(34,197,94,0.6))' }}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-xs font-bold text-white">{WORKOUT_WEEK_DONE}/{WORKOUT_WEEK_TOTAL}</span>
            </div>
          </div>

          <div className="flex-1">
            <p className="text-white font-bold text-sm">
              {isRestDay ? 'Rest Day 😴' : WORKOUT_TODAY}
            </p>
            <p className="text-white/40 text-xs mt-0.5">
              {isRestDay
                ? 'Recovery is part of the process.'
                : `${WORKOUT_WEEK_DONE} of ${WORKOUT_WEEK_TOTAL} workouts this week`}
            </p>
            {!isRestDay && (
              <div className="mt-2 h-1 bg-white/10 rounded-full overflow-hidden w-full">
                <div
                  className="h-full bg-green-500 rounded-full"
                  style={{ width: `${(WORKOUT_WEEK_DONE / WORKOUT_WEEK_TOTAL) * 100}%`, boxShadow: '0 0 6px rgba(34,197,94,0.6)' }}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Daily nudge from Claw */}
      <div className="rounded-2xl border border-white/5 bg-white/3 px-4 py-4">
        <p className="text-[10px] text-white/25 uppercase tracking-widest font-semibold mb-2">From Claw</p>
        <p className="text-sm text-white/60 leading-relaxed">
          Mind. Body. Spirit. Three systems, one person. Each day you invest in all three, you compound. Most people only work on one. You're doing all three.
        </p>
      </div>

    </div>
  )
}
