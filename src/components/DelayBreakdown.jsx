import { useLocale } from '../i18n/LocaleContext'

export function DelayBreakdown({ stats }) {
  const { t } = useLocale()

  const rows = [
    { labelKey: 'onTime',      sublabel: '≤5 min',    value: stats.onTime,    color: '#22c55e' },
    { labelKey: 'minorDelay',  sublabel: '6–30 min',  value: stats.minor,     color: '#f59e0b' },
    { labelKey: 'moderate',    sublabel: '31–60 min', value: stats.moderate,  color: '#f97316' },
    { labelKey: 'severe',      sublabel: '>60 min',   value: stats.severe,    color: '#ef4444' },
    ...(stats.cancelled > 0
      ? [{ labelKey: 'cancelled', sublabel: '', value: stats.cancelled, color: '#6b7280' }]
      : []),
  ]

  return (
    <div className="w-full">
      <div
        className="items-center gap-x-3 gap-y-3"
        style={{ display: 'grid', gridTemplateColumns: 'max-content 1fr 2.5rem' }}
      >
        {rows.map(row => (
          <BreakdownRow key={row.labelKey} label={t(row.labelKey)} sublabel={row.sublabel} value={row.value} color={row.color} />
        ))}
      </div>
      <p className="text-xs text-gray-600 text-right pt-1">
        {t('basedOn')} {stats.total} {t('flights')} · {t('last90')}
      </p>
    </div>
  )
}

function BreakdownRow({ label, sublabel, value, color }) {
  return (
    <>
      <div className="whitespace-nowrap">
        <span className="text-sm text-gray-300">{label}</span>
        {sublabel && <span className="text-xs text-gray-600 ml-1.5">{sublabel}</span>}
      </div>
      <div className="h-2 bg-white/8 rounded-full overflow-hidden flex justify-end">
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{ width: `${value}%`, backgroundColor: color }}
        />
      </div>
      <span className="text-sm font-semibold text-right" style={{ color }}>
        {value}%
      </span>
    </>
  )
}
