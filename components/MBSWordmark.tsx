'use client'

import { useEffect, useRef } from 'react'

const LETTERS = [
  { char: 'M', color: '#818cf8', glow: '#6366f1' },
  { char: 'B', color: '#4ade80', glow: '#22c55e' },
  { char: 'S', color: '#fbbf24', glow: '#f59e0b' },
]

export default function MBSWordmark() {
  const shimmerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = shimmerRef.current
    if (!el) return

    let frame: number
    let start: number | null = null
    const duration = 2800

    const animate = (ts: number) => {
      if (!start) start = ts
      const progress = ((ts - start) % (duration * 2)) / (duration * 2)
      // Pause between sweeps — only animate during first half
      const x = progress < 0.5
        ? -60 + (progress / 0.5) * 220
        : 200
      el.style.transform = `translateX(${x}%) skewX(-15deg)`
      el.style.opacity = progress < 0.5 ? '1' : '0'
      frame = requestAnimationFrame(animate)
    }

    frame = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(frame)
  }, [])

  return (
    <div className="relative inline-flex items-end overflow-visible select-none">
      {/* Letters */}
      <div className="flex items-end gap-0" style={{ fontFamily: 'var(--font-bebas)', fontSize: '3.2rem', lineHeight: 1, letterSpacing: '0.06em' }}>
        {LETTERS.map(({ char, color, glow }) => (
          <span
            key={char}
            style={{
              color,
              textShadow: [
                `0 0 10px ${glow}cc`,
                `0 0 25px ${glow}88`,
                `0 0 50px ${glow}44`,
                `0 0 80px ${glow}22`,
              ].join(', '),
            }}
          >
            {char}
          </span>
        ))}
      </div>

      {/* Shimmer sweep */}
      <div
        className="absolute inset-0 pointer-events-none overflow-hidden rounded-sm"
        style={{ mixBlendMode: 'screen' }}
      >
        <div
          ref={shimmerRef}
          className="absolute inset-0 w-1/3"
          style={{
            background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.55) 50%, transparent 100%)',
            willChange: 'transform',
          }}
        />
      </div>
    </div>
  )
}
