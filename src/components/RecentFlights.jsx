import { useLocale } from '../i18n/LocaleContext'

export function RecentFlights({ flights, onSelect, onClear }) {
  const { t } = useLocale()
  if (!flights.length) return null

  return (
    <div className="w-full max-w-xl mx-auto mt-4">
      <div className="flex items-center justify-between mb-2 px-0.5">
        <span className="text-xs text-gray-600 uppercase tracking-wider font-medium">{t('recent')}</span>
        <button
          onClick={onClear}
          className="text-xs text-gray-600 hover:text-gray-400 transition-colors"
        >
          {t('clearAll')}
        </button>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
        {flights.map((flight, i) => (
          <RecentChip key={i} flight={flight} onSelect={onSelect} />
        ))}
      </div>
    </div>
  )
}

function RecentChip({ flight, onSelect }) {
  const dep = flight?.departure?.airport
  const arr = flight?.arrival?.airport
  const num = flight?.number || flight?.callSign
  const airline = flight?.airline?.iata

  return (
    <button
      onClick={() => onSelect(flight)}
      className="shrink-0 flex items-center gap-2 px-3 py-2 glass glass-hover rounded-xl text-left"
    >
      <div className="w-6 h-6 rounded-md bg-white/10 flex items-center justify-center text-[10px] font-bold text-gray-300 shrink-0">
        {airline || '✈'}
      </div>
      <div>
        <div className="text-white text-xs font-semibold leading-tight">{num}</div>
        <div className="text-gray-500 text-[10px] leading-tight">
          {dep?.iata || '?'} → {arr?.iata || '?'}
        </div>
      </div>
    </button>
  )
}
