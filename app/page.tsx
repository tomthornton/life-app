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

export default function Home() {
  const [activeTab, setActiveTab] = useState<Tab>('home')
  const [user, setUser] = useState<User | null>(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem('mbs_user')
    if (stored) setUser(JSON.parse(stored))
    setReady(true)
  }, [])

  const handleAuth = (u: User) => setUser(u)

  const handleLogout = () => {
    localStorage.removeItem('mbs_user')
    setUser(null)
    setActiveTab('home')
  }

  if (!ready) return null

  if (!user) return <AuthScreen onAuth={handleAuth} />

  return (
    <main className="fixed inset-0 flex flex-col bg-[#0a0a10] overflow-hidden">
      <AppHeader
        activeTab={activeTab}
        userName={user.name}
        onProfilePress={() => setActiveTab('profile')}
        onTabPress={setActiveTab}
      />

      <div className="flex-1 overflow-y-auto no-scrollbar">
        {activeTab === 'home'    && <HomeTab setActiveTab={setActiveTab} />}
        {activeTab === 'mind'    && <MindTab />}
        {activeTab === 'body'    && <BodyTab />}
        {activeTab === 'spirit'  && <SpiritTab />}
        {activeTab === 'profile' && <ProfileTab userName={user.name} setUserName={(name) => {
          const updated = { ...user, name }
          setUser(updated)
          localStorage.setItem('mbs_user', JSON.stringify(updated))
        }} onLogout={handleLogout} />}
      </div>

      <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />
    </main>
  )
}
