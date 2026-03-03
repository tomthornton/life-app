export default function MBSWordmark({ glowColor }: { glowColor?: string }) {
  return (
    <span
      className="text-white select-none"
      style={{
        fontFamily: 'var(--font-bebas)',
        fontSize: '3rem',
        lineHeight: 1,
        letterSpacing: '0.08em',
        textShadow: glowColor ? `0 0 30px ${glowColor}50` : undefined,
      }}
    >
      MBS
    </span>
  )
}
