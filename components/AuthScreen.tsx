'use client'

import { useState } from 'react'
import MBSWordmark from '@/components/MBSWordmark'

type Mode = 'login' | 'signup'
type User = { name: string; email: string }

export default function AuthScreen({ onAuth }: { onAuth: (user: User) => void }) {
  const [mode, setMode] = useState<Mode>('login')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const quickLogin = () => {
    const user = { name: 'Thomas', email: 'thomas@mbs.app' }
    localStorage.setItem('mbs_user', JSON.stringify(user))
    onAuth(user)
  }

  const submit = () => {
    setError('')
    if (mode === 'signup') {
      if (!name.trim()) return setError('Name is required.')
      if (!email.trim()) return setError('Email is required.')
      if (password.length < 6) return setError('Password must be at least 6 characters.')
      const user = { name: name.trim(), email: email.trim() }
      localStorage.setItem('mbs_user', JSON.stringify(user))
      onAuth(user)
    } else {
      if (!email.trim() || !password.trim()) return setError('Please fill in all fields.')
      const stored = localStorage.getItem('mbs_user')
      if (!stored) return setError('No account found. Sign up first.')
      const user: User = JSON.parse(stored)
      if (user.email !== email.trim()) return setError('Email not found.')
      onAuth(user)
    }
  }

  return (
    <div className="fixed inset-0 flex flex-col overflow-hidden" style={{ background: 'var(--color-bg)' }}>

      {/* Background — layered color blobs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Top-left indigo */}
        <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full blur-3xl"
          style={{ background: 'radial-gradient(circle, rgba(99,102,241,0.35) 0%, transparent 70%)' }} />
        {/* Top-right amber */}
        <div className="absolute -top-12 -right-12 w-72 h-72 rounded-full blur-3xl"
          style={{ background: 'radial-gradient(circle, rgba(245,158,11,0.25) 0%, transparent 70%)' }} />
        {/* Bottom-center green */}
        <div className="absolute -bottom-20 left-1/2 -translate-x-1/2 w-96 h-64 rounded-full blur-3xl"
          style={{ background: 'radial-gradient(circle, rgba(34,197,94,0.2) 0%, transparent 70%)' }} />
        {/* Center subtle purple bloom */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full blur-3xl"
          style={{ background: 'radial-gradient(circle, rgba(139,92,246,0.12) 0%, transparent 70%)' }} />
        {/* Noise texture overlay */}
        <div className="absolute inset-0 opacity-[0.03]"
          style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\'/%3E%3C/svg%3E")', backgroundSize: '200px' }} />
      </div>

      {/* Content */}
      <div className="relative flex-1 flex flex-col justify-center px-6 safe-top safe-bottom" style={{ gap: '2rem' }}>

        {/* Logo block */}
        <div className="flex flex-col items-center gap-2">
          <span
            className="text-white select-none"
            style={{
              fontFamily: "'Atomic Age', cursive",
              fontSize: '5rem',
              lineHeight: 1,
              letterSpacing: '0.05em',
              textShadow: [
                '0 0 20px rgba(99,102,241,0.7)',
                '0 0 50px rgba(99,102,241,0.4)',
                '0 0 90px rgba(99,102,241,0.2)',
              ].join(', '),
            }}
          >
            MBS
          </span>
          <p className="text-white/25 text-xs tracking-[0.25em] uppercase font-medium">
            Mind · Body · Spirit
          </p>
        </div>

        {/* Form */}
        <div className="flex flex-col gap-4">

          {/* Mode toggle */}
          <div className="flex rounded-2xl p-1" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
            {(['login', 'signup'] as Mode[]).map((m) => (
              <button
                key={m}
                onClick={() => { setMode(m); setError('') }}
                className="flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200"
                style={mode === m
                  ? { background: 'rgba(255,255,255,0.09)', color: '#fff' }
                  : { color: 'rgba(255,255,255,0.3)' }
                }
              >
                {m === 'login' ? 'Log In' : 'Sign Up'}
              </button>
            ))}
          </div>

          {/* Fields */}
          <div className="flex flex-col gap-3">
            {mode === 'signup' && (
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Full name"
                className="w-full rounded-xl px-4 py-3.5 text-sm text-white placeholder:text-white/20 focus:outline-none transition-colors"
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}
              />
            )}
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="w-full rounded-xl px-4 py-3.5 text-sm text-white placeholder:text-white/20 focus:outline-none transition-colors"
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}
            />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              onKeyDown={(e) => e.key === 'Enter' && submit()}
              className="w-full rounded-xl px-4 py-3.5 text-sm text-white placeholder:text-white/20 focus:outline-none transition-colors"
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}
            />
          </div>

          {error && <p className="text-red-400 text-xs text-center">{error}</p>}

          {/* Submit */}
          <button
            onClick={submit}
            className="w-full py-4 rounded-2xl text-sm font-bold text-white transition-all active:scale-[0.98]"
            style={{
              background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
              boxShadow: '0 0 30px rgba(99,102,241,0.35), 0 4px 15px rgba(0,0,0,0.4)',
            }}
          >
            {mode === 'login' ? 'Log In' : 'Create Account'}
          </button>

          {/* Divider */}
          <div className="flex items-center gap-3">
            <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.07)' }} />
            <span className="text-white/20 text-xs">or</span>
            <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.07)' }} />
          </div>

          {/* Quick login */}
          <button
            onClick={quickLogin}
            className="w-full py-4 rounded-2xl text-sm font-bold transition-all active:scale-[0.98]"
            style={{
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.09)',
              color: 'rgba(255,255,255,0.5)',
            }}
          >
            Continue as Thomas
          </button>
        </div>
      </div>
    </div>
  )
}
