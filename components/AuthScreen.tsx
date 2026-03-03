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
      if (!stored) return setError("No account found. Sign up first.")
      const user: User = JSON.parse(stored)
      if (user.email !== email.trim()) return setError('Email not found.')
      onAuth(user)
    }
  }

  return (
    <div className="fixed inset-0 bg-[#0a0a10] flex flex-col overflow-hidden">
      {/* Background glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-80 h-80 rounded-full blur-3xl opacity-20 pointer-events-none"
        style={{ background: 'radial-gradient(circle, #6366f1, #22c55e, #f59e0b)' }} />
      <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full blur-3xl opacity-10 pointer-events-none"
        style={{ background: '#6366f1' }} />
      <div className="absolute bottom-0 right-0 w-64 h-64 rounded-full blur-3xl opacity-10 pointer-events-none"
        style={{ background: '#f59e0b' }} />

      {/* Content */}
      <div className="relative flex-1 flex flex-col justify-between px-6 py-12 safe-top safe-bottom">

        {/* Top: logo + tagline */}
        <div className="flex flex-col items-center gap-3 mt-8">
          <MBSWordmark />
          <p className="text-white/30 text-sm tracking-widest uppercase font-medium">
            Mind · Body · Spirit
          </p>
        </div>

        {/* Middle: form */}
        <div className="flex flex-col gap-4">

          {/* Mode toggle */}
          <div className="flex bg-white/5 border border-white/8 rounded-2xl p-1">
            {(['login', 'signup'] as Mode[]).map((m) => (
              <button
                key={m}
                onClick={() => { setMode(m); setError('') }}
                className="flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200"
                style={mode === m
                  ? { background: 'rgba(255,255,255,0.1)', color: '#fff' }
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
              <div>
                <label className="text-[11px] text-white/40 uppercase tracking-widest font-medium block mb-1.5">Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Thomas Thornton"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-white/30 transition-colors"
                />
              </div>
            )}

            <div>
              <label className="text-[11px] text-white/40 uppercase tracking-widest font-medium block mb-1.5">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-white/30 transition-colors"
              />
            </div>

            <div>
              <label className="text-[11px] text-white/40 uppercase tracking-widest font-medium block mb-1.5">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                onKeyDown={(e) => e.key === 'Enter' && submit()}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-white/30 transition-colors"
              />
            </div>
          </div>

          {/* Error */}
          {error && (
            <p className="text-red-400 text-xs text-center">{error}</p>
          )}

          {/* Submit */}
          <button
            onClick={submit}
            className="w-full py-4 rounded-2xl text-sm font-bold text-white transition-all duration-200 active:scale-[0.98]"
            style={{
              background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
              boxShadow: '0 0 30px rgba(99,102,241,0.3)',
            }}
          >
            {mode === 'login' ? 'Log In' : 'Create Account'}
          </button>

          {/* Divider */}
          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-white/8" />
            <span className="text-white/20 text-xs">or</span>
            <div className="flex-1 h-px bg-white/8" />
          </div>

          {/* Quick login */}
          <button
            onClick={quickLogin}
            className="w-full py-4 rounded-2xl text-sm font-bold border transition-all duration-200 active:scale-[0.98]"
            style={{
              background: 'rgba(255,255,255,0.03)',
              borderColor: 'rgba(255,255,255,0.1)',
              color: 'rgba(255,255,255,0.6)',
            }}
          >
            Continue as Thomas
          </button>
        </div>

        {/* Bottom tagline */}
        <p className="text-center text-white/15 text-xs">
          Your life. Your growth. Every day.
        </p>
      </div>
    </div>
  )
}
