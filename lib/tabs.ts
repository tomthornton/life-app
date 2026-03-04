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
