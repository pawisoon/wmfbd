import { useLiveStatus } from '../hooks/useLiveStatus'

const colorMap = {
  green: { dot: 'bg-green-400', text: 'text-green-400', ring: 'ring-green-400/30' },
  amber: { dot: 'bg-amber-400', text: 'text-amber-400', ring: 'ring-amber-400/30' },
  gray:  { dot: 'bg-gray-500',  text: 'text-gray-400',  ring: 'ring-gray-500/30' },
}

export function LiveStatus({ flightNumber, departureIata }) {
  const { status, lastUpdated } = useLiveStatus(flightNumber, departureIata)

  if (!status) {
    return (
      <div className="flex items-center gap-2 text-gray-600 text-xs">
        <span className="w-1.5 h-1.5 rounded-full bg-gray-600" />
        No live data found
      </div>
    )
  }

  const c = colorMap[status.color] || colorMap.gray

  return (
    <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full ring-1 ${c.ring} bg-white/5`}>
      {/* Pulsing dot */}
      <span className="relative flex w-2 h-2">
        <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${c.dot} opacity-60`} />
        <span className={`relative inline-flex rounded-full w-2 h-2 ${c.dot}`} />
      </span>
      <span className={`text-xs font-medium ${c.text}`}>
        {status.icon} {status.label}
      </span>
      {lastUpdated && (
        <span className="text-gray-600 text-xs">
          · {lastUpdated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </span>
      )}
    </div>
  )
}
