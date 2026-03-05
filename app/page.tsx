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
import ThemeProvider from '@/components/ThemeProvider'
import { Tab, SUB_TABS } from '@/lib/tabs'

type User = { name: string; email: string }

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
  if (!user) return <ThemeProvider><AuthScreen onAuth={(u) => setUser(u)} /></ThemeProvider>

  return (
    <ThemeProvider>
    <main className="fixed inset-0 flex flex-col overflow-hidden" style={{ background: 'var(--color-bg)' }}>
      <AppHeader
        activeTab={activeTab}
        onProfilePress={() => handleTabChange('profile')}
      />

      <div className="flex-1 overflow-y-auto no-scrollbar">
        {activeTab === 'home'    && <HomeTab setActiveTab={handleTabChange} userName={user.name} />}
        {activeTab === 'mind'    && <MindTab mode={subTab} onModeChange={setSubTab} />}
        {activeTab === 'body'    && <BodyTab mode={subTab} onModeChange={setSubTab} />}
        {activeTab === 'spirit'  && <SpiritTab mode={subTab} onModeChange={setSubTab} />}
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
    </ThemeProvider>
  )
}
