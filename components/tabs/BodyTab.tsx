'use client'

import { useState } from 'react'

type Exercise = {
  name: string
  sets: number
  reps: string
  note?: string
  done: boolean
}

type WorkoutDay = {
  day: string
  focus: string
  exercises: Exercise[]
}

// Placeholder workout — will be AI-generated and pulled from Supabase
const WORKOUT_WEEK: WorkoutDay[] = [
  {
    day: 'Monday',
    focus: 'Push (Chest / Shoulders / Triceps)',
    exercises: [
      { name: 'Bench Press', sets: 4, reps: '8-10', done: false },
      { name: 'Overhead Press', sets: 3, reps: '10', done: false },
      { name: 'Incline Dumbbell Press', sets: 3, reps: '10-12', done: false },
      { name: 'Lateral Raises', sets: 3, reps: '15', done: false },
      { name: 'Tricep Pushdowns', sets: 3, reps: '12-15', done: false },
    ],
  },
  {
    day: 'Tuesday',
    focus: 'Pull (Back / Biceps)',
    exercises: [
      { name: 'Pull-Ups', sets: 4, reps: '6-10', done: false },
      { name: 'Barbell Row', sets: 4, reps: '8', done: false },
      { name: 'Cable Row', sets: 3, reps: '10-12', done: false },
      { name: 'Face Pulls', sets: 3, reps: '15', done: false },
      { name: 'Hammer Curls', sets: 3, reps: '12', done: false },
    ],
  },
  {
    day: 'Wednesday',
    focus: 'Rest / Active Recovery',
    exercises: [],
  },
  {
    day: 'Thursday',
    focus: 'Legs',
    exercises: [
      { name: 'Squat', sets: 4, reps: '6-8', done: false },
      { name: 'Romanian Deadlift', sets: 3, reps: '10', done: false },
      { name: 'Leg Press', sets: 3, reps: '12', done: false },
      { name: 'Leg Curl', sets: 3, reps: '12', done: false },
      { name: 'Calf Raises', sets: 4, reps: '20', done: false },
    ],
  },
  {
    day: 'Friday',
    focus: 'Push + Core',
    exercises: [
      { name: 'Dips', sets: 4, reps: '8-10', done: false },
      { name: 'Cable Fly', sets: 3, reps: '12', done: false },
      { name: 'Arnold Press', sets: 3, reps: '10', done: false },
      { name: 'Plank', sets: 3, reps: '60s', done: false },
      { name: 'Ab Rollout', sets: 3, reps: '10', done: false },
    ],
  },
  {
    day: 'Saturday',
    focus: 'Pull + Cardio',
    exercises: [
      { name: 'Deadlift', sets: 4, reps: '5', done: false },
      { name: 'Lat Pulldown', sets: 3, reps: '10', done: false },
      { name: '20 min Cardio', sets: 1, reps: '20 min', done: false },
    ],
  },
  {
    day: 'Sunday',
    focus: 'Rest',
    exercises: [],
  },
]

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
const TODAY = DAYS[new Date().getDay() === 0 ? 6 : new Date().getDay() - 1]

export default function BodyTab() {
  const [week, setWeek] = useState(WORKOUT_WEEK)
  const [selectedDay, setSelectedDay] = useState(TODAY)

  const selectedWorkout = week.find((w) => w.day === selectedDay)!

  const toggleExercise = (exerciseName: string) => {
    setWeek((prev) =>
      prev.map((day) =>
        day.day === selectedDay
          ? {
              ...day,
              exercises: day.exercises.map((ex) =>
                ex.name === exerciseName ? { ...ex, done: !ex.done } : ex
              ),
            }
          : day
      )
    )
  }

  const completedCount = selectedWorkout.exercises.filter((e) => e.done).length
  const totalCount = selectedWorkout.exercises.length

  return (
    <div className="px-4 py-4 space-y-4">
      {/* Day selector */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
        {DAYS.map((day) => {
          const workout = week.find((w) => w.day === day)!
          const isRest = workout.exercises.length === 0
          const isDone =
            !isRest &&
            workout.exercises.length > 0 &&
            workout.exercises.every((e) => e.done)
          const isActive = selectedDay === day
          const isToday = day === TODAY

          return (
            <button
              key={day}
              onClick={() => setSelectedDay(day)}
              className={`flex-shrink-0 flex flex-col items-center gap-1 px-3 py-2 rounded-xl border transition-all ${
                isActive
                  ? 'bg-body/20 border-body text-body'
                  : 'bg-card border-border text-white/50'
              }`}
            >
              <span className="text-xs font-semibold">{day.slice(0, 3)}</span>
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                  isDone
                    ? 'bg-body text-white'
                    : isRest
                    ? 'bg-white/10 text-white/30'
                    : isToday
                    ? 'bg-white/20 text-white'
                    : 'bg-white/5 text-white/30'
                }`}
              >
                {isDone ? '✓' : isRest ? '—' : day.slice(0, 1)}
              </div>
            </button>
          )
        })}
      </div>

      {/* Workout header */}
      <div className="bg-card border border-border rounded-2xl p-4">
        <p className="text-xs text-white/40 uppercase tracking-widest font-medium mb-1">
          {selectedDay}
        </p>
        <h2 className="text-lg font-bold text-white">{selectedWorkout.focus}</h2>
        {totalCount > 0 && (
          <div className="mt-3">
            <div className="flex justify-between text-xs text-white/50 mb-1.5">
              <span>{completedCount}/{totalCount} exercises</span>
              <span>{Math.round((completedCount / totalCount) * 100)}%</span>
            </div>
            <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-body rounded-full transition-all"
                style={{ width: `${(completedCount / totalCount) * 100}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Exercises */}
      {selectedWorkout.exercises.length === 0 ? (
        <div className="text-center py-12 text-white/30">
          <div className="text-4xl mb-3">😴</div>
          <p className="font-medium">Rest day. You earned it.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {selectedWorkout.exercises.map((exercise) => (
            <button
              key={exercise.name}
              onClick={() => toggleExercise(exercise.name)}
              className={`w-full flex items-center gap-4 p-4 rounded-2xl border transition-all text-left ${
                exercise.done
                  ? 'bg-body/10 border-body/40'
                  : 'bg-card border-border'
              }`}
            >
              <div
                className={`w-6 h-6 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-all ${
                  exercise.done
                    ? 'bg-body border-body'
                    : 'border-white/20'
                }`}
              >
                {exercise.done && (
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 6L9 17 4 12" />
                  </svg>
                )}
              </div>
              <div className="flex-1">
                <p className={`font-semibold text-sm ${exercise.done ? 'text-white/50 line-through' : 'text-white'}`}>
                  {exercise.name}
                </p>
                {exercise.note && (
                  <p className="text-xs text-white/40 mt-0.5">{exercise.note}</p>
                )}
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-white/70">{exercise.sets} × {exercise.reps}</p>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* All done */}
      {totalCount > 0 && completedCount === totalCount && (
        <div className="bg-body/10 border border-body/30 rounded-2xl p-4 text-center">
          <p className="text-body font-bold">🎉 Workout complete. Nice work.</p>
        </div>
      )}
    </div>
  )
}
