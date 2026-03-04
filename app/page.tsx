'use client'

import { useState, useEffect } from 'react'
import HomeTab from '@/components/tabs/HomeTab'
import MindTab from '@/components/tabs/MindTab'
import BodyTab from '@/components/tabs/BodyTab'
import SpiritTab from '@/components/tabs/SpiritTab'
import ProfileTab from '@/components/tabs/ProfileTab'
import BottomNav from '@/components/BottomNav'
import AppHeader from '@/components/AppHeader'
import AuthScreen from '@/components/AuthScreen'

export type Tab = 'home' | 'mind' | 'body' | 'spirit' | 'profile'

type User = { name: string; email: string }

export const SUB_TABS: Record<Tab, { id: string; label: string; icon: string }[]> = {
  home:    [],
  profile: [],
  mind:    [
    { id: 'chat',    label: 'Chat',    icon: '💬' },
    { id: 'therapy', label: 'Therapy', icon: '🛋️' },
    { id: 'journal', label: 'Journal', icon: '📓' },
    { id: 'mood',    label: 'Mood',    icon: '🌡️' },
  ],
  body:    [
    { id: 'workout',   label: 'Workout',   icon: '🏋️' },
    { id: 'health',    label: 'Health',    icon: '💡' },
    { id: 'hydration', label: 'Hydration', icon: '💧' },
    { id: 'records',   label: 'PRs',       icon: '🏆' },
  ],
  spirit:  [
    { id: 'daily',     label: 'Daily',     icon: '📖' },
    { id: 'gratitude', label: 'Gratitude', icon: '🙏' },
    { id: 'prayer',    label: 'Prayer',    icon: '✝️' },
    { id: 'chat',      label: 'Reflect',   icon: '💬' },
  ],
}

export default function Home() {
  const [activeTab, setActiveTab] = useState<Tab>('home')
  const [subTab, setSubTab] = useState<string>('chat')
  const [user, setUser] = useState<User | null>(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem('mbs_user')
    if (stored) setUser(JSON.parse(stored))
    setReady(true)
  }, [])

  // Reset sub-tab to first option when main tab changes
  const handleTabChange = (tab: Tab) => {
    setActiveTab(tab)
    const first = SUB_TABS[tab][0]?.id
    if (first) setSubTab(first)
  }

  if (!ready) return null
  if (!user) return <AuthScreen onAuth={(u) => setUser(u)} />

  return (
    <main className="fixed inset-0 flex flex-col bg-[#0a0a10] overflow-hidden">
      <AppHeader
        activeTab={activeTab}
        subTab={subTab}
        onSubTabChange={setSubTab}
        userName={user.name}
        onProfilePress={() => handleTabChange('profile')}
        onTabPress={handleTabChange}
      />

      <div className="flex-1 overflow-y-auto no-scrollbar">
        {activeTab === 'home'    && <HomeTab setActiveTab={handleTabChange} />}
        {activeTab === 'mind'    && <MindTab mode={subTab} />}
        {activeTab === 'body'    && <BodyTab mode={subTab} />}
        {activeTab === 'spirit'  && <SpiritTab mode={subTab} />}
        {activeTab === 'profile' && (
          <ProfileTab
            userName={user.name}
            setUserName={(name) => {
              const updated = { ...user, name }
              setUser(updated)
              localStorage.setItem('mbs_user', JSON.stringify(updated))
            }}
            onLogout={() => {
              localStorage.removeItem('mbs_user')
              setUser(null)
              setActiveTab('home')
            }}
          />
        )}
      </div>

      <BottomNav activeTab={activeTab} setActiveTab={handleTabChange} />
    </main>
  )
}
