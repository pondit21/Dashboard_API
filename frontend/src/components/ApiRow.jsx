const colors = {
  GET: 'from-emerald-500 to-teal-500',
  POST: 'from-blue-500 to-indigo-600',
  PUT: 'from-amber-400 to-orange-500',
  PATCH: 'from-fuchsia-500 to-purple-600',
  DELETE: 'from-rose-500 to-red-600',
}

function Wave({ seed, color }) {
  const pts = Array.from({ length: 24 }, (_, i) =>
    `${i * 5},${20 + Math.sin(i * 0.9 + seed) * 12 * Math.cos(i * 0.3)}`).join(' ')
  return (
    <svg viewBox="0 0 115 40" className="h-8 w-24">
      <polyline points={pts} fill="none" stroke={color} strokeWidth="2" strokeLinejoin="round" />
    </svg>
  )
}

export default function ApiRow({ item, projectName, onToggle, onEdit, onDelete }) {
  const active = item.status === 'active'
  return (
    <div className="flex flex-wrap items-center gap-4 border-b border-slate-100 py-3 last:border-0">
      <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br text-[10px] font-bold text-white ${colors[item.method]}`}>
        {item.method}
      </div>

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-slate-900">{item.name}</p>
        <p className="truncate text-xs text-slate-500">
          <code>{item.path}</code> · {projectName}
        </p>
      </div>

      <div className="hidden sm:block">
        <Wave seed={item.id} color={active ? '#7c3aed' : '#cbd5e1'} />
      </div>

      <button onClick={onToggle} title="Active / Inactive"
        className="flex items-center gap-2 text-xs text-slate-500">
        <span className={`relative h-5 w-9 rounded-full transition ${active ? 'bg-sky-400' : 'bg-slate-300'}`}>
          <span className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-all ${active ? 'left-[18px]' : 'left-0.5'}`} />
        </span>
        <span className="w-12 text-left">{active ? 'Active' : 'InActive'}</span>
      </button>

      <div className="flex gap-3 text-xs">
        <button onClick={onEdit} className="text-violet-700 hover:underline">Edit</button>
        <button onClick={onDelete} className="text-red-600 hover:underline">Delete</button>
      </div>
    </div>
  )
}