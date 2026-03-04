export type Tab = 'home' | 'mind' | 'body' | 'spirit' | 'profile'

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
    { id: 'today',     label: 'Today',     icon: '📋' },
    { id: 'train',     label: 'Train',     icon: '🏋️' },
    { id: 'nutrition', label: 'Nutrition', icon: '🥗' },
    { id: 'progress',  label: 'Progress',  icon: '📈' },
  ],
  spirit:  [
    { id: 'daily',     label: 'Daily',     icon: '📖' },
    { id: 'gratitude', label: 'Gratitude', icon: '🙏' },
    { id: 'prayer',    label: 'Prayer',    icon: '✝️' },
    { id: 'chat',      label: 'Reflect',   icon: '💬' },
  ],
}
