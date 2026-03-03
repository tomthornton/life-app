'use client'

import { useState, useEffect } from 'react'
import MindTab from '@/components/tabs/MindTab'
import BodyTab from '@/components/tabs/BodyTab'
import SpiritTab from '@/components/tabs/SpiritTab'
import ProfileTab from '@/components/tabs/ProfileTab'
import BottomNav from '@/components/BottomNav'
import AppHeader from '@/components/AppHeader'

export type Tab = 'mind' | 'body' | 'spirit' | 'profile'

export default function Home() {
  const [activeTab, setActiveTab] = useState<Tab>('mind')
  const [userName, setUserName] = useState('Thomas')

  useEffect(() => {
    const saved = localStorage.getItem('mbs_name')
    if (saved) setUserName(saved)
  }, [])

  return (
    <main className="fixed inset-0 flex flex-col bg-[#0a0a10] overflow-hidden">
      <AppHeader activeTab={activeTab} userName={userName} />

      <div className="flex-1 overflow-y-auto no-scrollbar">
        {activeTab === 'mind'    && <MindTab />}
        {activeTab === 'body'    && <BodyTab />}
        {activeTab === 'spirit'  && <SpiritTab />}
        {activeTab === 'profile' && <ProfileTab userName={userName} setUserName={setUserName} />}
      </div>

      <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />
    </main>
  )
}
