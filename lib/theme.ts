export type ThemeId = 'default' | 'antique' | 'future'

export const THEMES: Record<ThemeId, {
  id: ThemeId
  name: string
  era: string
  description: string
  preview: { bg: string; card: string; accent: string; text: string }
}> = {
  default: {
    id: 'default',
    name: 'Present',
    era: '2026',
    description: 'Dark & modern',
    preview: { bg: '#0a0a10', card: '#1a1a24', accent: '#6366f1', text: '#ffffff' },
  },
  antique: {
    id: 'antique',
    name: 'Victorian',
    era: '1800s',
    description: 'Aged parchment & ink',
    preview: { bg: '#1c0f07', card: '#2e1b0e', accent: '#b8860b', text: '#e8d5a3' },
  },
  future: {
    id: 'future',
    name: 'Horizon',
    era: '2126',
    description: 'One century forward',
    preview: { bg: '#000610', card: '#001228', accent: '#00d4ff', text: '#b8e8ff' },
  },
}
