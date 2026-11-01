import { useMemo, useState } from 'react'

const TABS = ['Date', 'Week', 'Month', 'Year']
const W = 640, H = 220, PAD = 8

// নমুনা ডাটা (demo)
function series(seed, n) {
  return Array.from({ length: n }, (_, i) =>
    1.5 + Math.sin(i * 0.7 + seed) * 0.8 + Math.cos(i * 0.33 + seed * 2) * 0.4)
}

function path(values) {
  const max = 3, step = (W - PAD * 2) / (values.length - 1)
  const pts = values.map((v, i) => [PAD + i * step, H - PAD - (v / max) * (H - PAD * 2)])
  return pts.reduce((d, [x, y], i) => {
    if (i === 0) return `M${x},${y}`
    const [px, py] = pts[i - 1], cx = (px + x) / 2
    return `${d} C${cx},${py} ${cx},${y} ${x},${y}`
  }, '')
}

export default function TrafficChart() {
  const [tab, setTab] = useState('Week')
  const n = { Date: 12, Week: 16, Month: 24, Year: 30 }[tab]
  const lines = useMemo(() => [series(1, n), series(3, n), series(5, n)], [n])
  const colors = ['#6d28d9', '#9ca3af', '#1f2937']

  return (
    <div className="rounded-3xl bg-white p-6 shadow-sm">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="font-semibold text-slate-900">Traffic</h2>
        <div className="flex gap-4 text-sm">
          {TABS.map((t) => (
            <button key={t} onClick={() => setTab(t)}
              className={`pb-1 ${tab === t ? 'border-b-2 border-violet-700 font-medium text-violet-700' : 'text-slate-500'}`}>
              {t}
            </button>
          ))}
        </div>
      </div>

      <svg viewBox={`0 0 ${W} ${H}`} className="h-56 w-full">
        {[0, 1, 2, 3].map((i) => (
          <line key={i} x1="0" x2={W}
            y1={PAD + i * ((H - PAD * 2) / 3)} y2={PAD + i * ((H - PAD * 2) / 3)}
            stroke="#f1f5f9" />
        ))}
        {lines.map((v, i) => (
          <path key={i} d={path(v)} fill="none" stroke={colors[i]} strokeWidth="2" strokeLinecap="round" />
        ))}
      </svg>
      <p className="mt-1 text-right text-xs text-slate-400">নমুনা ডাটা (demo)</p>
    </div>
  )
}