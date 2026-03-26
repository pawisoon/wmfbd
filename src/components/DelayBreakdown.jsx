/**
 * Horizontal bar breakdown of delay buckets.
 */
export function DelayBreakdown({ stats }) {
  const rows = [
    { label: 'On time', sublabel: '≤5 min', value: stats.onTime, color: '#22c55e' },
    { label: 'Minor delay', sublabel: '6–30 min', value: stats.minor, color: '#f59e0b' },
    { label: 'Moderate', sublabel: '31–60 min', value: stats.moderate, color: '#f97316' },
    { label: 'Severe', sublabel: '>60 min', value: stats.severe, color: '#ef4444' },
    ...(stats.cancelled > 0
      ? [{ label: 'Cancelled', sublabel: '', value: stats.cancelled, color: '#6b7280' }]
      : []),
  ]

  return (
    <div className="space-y-3 w-full">
      {rows.map(row => (
        <BreakdownRow key={row.label} {...row} />
      ))}
      <p className="text-xs text-gray-600 text-right pt-1">
        Based on {stats.total} flights · last 90 days
      </p>
    </div>
  )
}

function BreakdownRow({ label, sublabel, value, color }) {
  return (
    <div className="flex items-center gap-3">
      <div className="w-28 shrink-0">
        <span className="text-sm text-gray-300">{label}</span>
        {sublabel && <span className="text-xs text-gray-600 ml-1.5">{sublabel}</span>}
      </div>
      <div className="flex-1 h-2 bg-white/8 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{ width: `${value}%`, backgroundColor: color }}
        />
      </div>
      <span className="text-sm font-semibold w-10 text-right" style={{ color }}>
        {value}%
      </span>
    </div>
  )
}
