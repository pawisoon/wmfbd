import { useLocale } from '../i18n/LocaleContext'

export function DelayGauge({ delayChance }) {
  const { t } = useLocale()
  const color = delayChance < 30 ? '#22c55e' : delayChance < 60 ? '#f59e0b' : '#ef4444'
  const label = delayChance < 30 ? t('lookingGood') : delayChance < 60 ? t('moderateRisk') : t('highRisk')

  const size = 200
  const cx = size / 2
  const cy = size / 2
  const r = 78
  const strokeWidth = 12
  const startAngle = 225
  const sweepAngle = 270

  function polarToCartesian(angle) {
    const rad = ((angle - 90) * Math.PI) / 180
    return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) }
  }

  function arcPath(from, to) {
    const start = polarToCartesian(from)
    const end = polarToCartesian(to)
    const large = to - from > 180 ? 1 : 0
    return `M ${start.x} ${start.y} A ${r} ${r} 0 ${large} 1 ${end.x} ${end.y}`
  }

  const trackEnd = startAngle + sweepAngle
  const valueEnd = startAngle + (sweepAngle * delayChance) / 100

  return (
    <div className="flex flex-col items-center gap-1">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="overflow-visible">
          <path
            d={arcPath(startAngle, trackEnd)}
            fill="none"
            stroke="#ffffff12"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
          />
          {delayChance > 0 && (
            <path
              d={arcPath(startAngle, valueEnd)}
              fill="none"
              stroke={color}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              style={{ filter: `drop-shadow(0 0 8px ${color}60)` }}
            />
          )}
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-5xl font-bold tracking-tight" style={{ color }}>
            {delayChance}%
          </span>
          <span className="text-[10px] text-gray-500 mt-1 uppercase tracking-wide font-medium whitespace-nowrap">
            {t('delayChance')}
          </span>
        </div>
      </div>
      <span className="text-sm font-medium" style={{ color }}>{label}</span>
    </div>
  )
}
