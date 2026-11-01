const RINGS = [
  { r: 80, color: '#6d28d9' },
  { r: 62, color: '#db2777' },
  { r: 44, color: '#38bdf8' },
]

export default function SummaryDonut({ apis }) {
  const total = apis.length || 1
  const values = [
    { label: 'Active', n: apis.filter((a) => a.status === 'active').length },
    { label: 'Inactive', n: apis.filter((a) => a.status === 'inactive').length },
    { label: 'GET APIs', n: apis.filter((a) => a.method === 'GET').length },
  ]

  return (
    <div className="rounded-3xl bg-white p-6 shadow-sm">
      <h2 className="font-semibold text-slate-900">Summary</h2>
      <div className="relative mx-auto mt-2 h-48 w-48">
        <svg viewBox="0 0 200 200" className="-rotate-90">
          {RINGS.map(({ r, color }, i) => {
            const c = 2 * Math.PI * r
            return (
              <g key={r}>
                <circle cx="100" cy="100" r={r} fill="none" stroke="#ede9fe" strokeWidth="12" />
                <circle cx="100" cy="100" r={r} fill="none" stroke={color} strokeWidth="12"
                  strokeLinecap="round" strokeDasharray={c}
                  strokeDashoffset={c * (1 - values[i].n / total)} />
              </g>
            )
          })}
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-bold text-slate-900">{apis.length}</span>
          <span className="text-xs text-slate-400">Total APIs</span>
        </div>
      </div>
      <div className="mt-3 flex justify-center gap-4 text-xs text-slate-600">
        {values.map((v, i) => (
          <span key={v.label} className="flex items-center gap-1">
            <i className="h-2 w-2 rounded-full" style={{ background: RINGS[i].color }} />
            {v.label} ({v.n})
          </span>
        ))}
      </div>
    </div>
  )
}