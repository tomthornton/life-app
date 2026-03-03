export default function MBSWordmark({ glowColor }: { glowColor?: string }) {
  return (
    <span
      className="text-white select-none"
      style={{
        fontFamily: "'Atomic Age', var(--font-bebas), cursive",
        fontSize: '2.6rem',
        lineHeight: 1,
        letterSpacing: '0.05em',
        textShadow: glowColor ? `0 0 30px ${glowColor}50` : undefined,
      }}
    >
      MBS
    </span>
  )
}
