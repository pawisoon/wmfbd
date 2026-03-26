export function LoadingSkeleton() {
  return (
    <div className="glass p-6 w-full max-w-xl mx-auto animate-pulse">
      {/* Route header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-white/10" />
        <div className="space-y-1.5">
          <div className="h-4 w-24 bg-white/10 rounded" />
          <div className="h-3 w-36 bg-white/8 rounded" />
        </div>
      </div>

      {/* Gauge placeholder */}
      <div className="w-52 h-52 mx-auto rounded-full bg-white/8 mb-6" />

      {/* Bars */}
      {[85, 60, 40, 25].map((w, i) => (
        <div key={i} className="flex items-center gap-3 mb-3">
          <div className="w-28 h-3 bg-white/8 rounded" />
          <div className="flex-1 h-2 bg-white/8 rounded-full" />
          <div className="w-8 h-3 bg-white/8 rounded" />
        </div>
      ))}
    </div>
  )
}
