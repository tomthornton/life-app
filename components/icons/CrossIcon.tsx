export default function CrossIcon({
  size = 22,
  color = 'currentColor',
  strokeWidth = 1.5,
  style,
}: {
  size?: number
  color?: string
  strokeWidth?: number
  style?: React.CSSProperties
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      style={style}
    >
      {/* Vertical beam */}
      <rect x="9.5" y="2" width="5" height="20" rx="1.5" fill={color} />
      {/* Horizontal beam */}
      <rect x="2" y="7.5" width="20" height="5" rx="1.5" fill={color} />
    </svg>
  )
}
