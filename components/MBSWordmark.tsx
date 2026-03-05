export default function MBSWordmark({ glowColor }: { glowColor?: string }) {
  return (
    <span
      className="select-none"
      style={{
        fontFamily: 'var(--font-logo)',
        fontSize: '2.8rem',
        lineHeight: 1,
        letterSpacing: '0.05em',
        color: 'var(--color-text)',
        textShadow: glowColor ? `0 0 30px ${glowColor}50` : undefined,
      }}
    >
      MBS
    </span>
  )
}
