import { useCallback, useEffect, useMemo, useState } from 'react'
import { clearToken, getToken, request } from './api'
import ApiForm from './components/ApiForm'
import ApiRow from './components/ApiRow'
import LoginPage from './components/LoginPage'
import ProjectForm from './components/ProjectForm'
import QuickAdd from './components/QuickAdd'
import SummaryDonut from './components/SummaryDonut'
import TrafficChart from './components/TrafficChart'

export default function App() {
  const [authed, setAuthed] = useState(!!getToken())
  const [projects, setProjects] = useState([])
  const [apis, setApis] = useState([])
  const [selected, setSelected] = useState('all') // 'all' বা project id
  const [query, setQuery] = useState('')
  const [modal, setModal] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    const onLogout = () => setAuthed(false)
    window.addEventListener('logout', onLogout)
    return () => window.removeEventListener('logout', onLogout)
  }, [])

  const load = useCallback(async () => {
    try {
      const [p, a] = await Promise.all([request('/projects'), request('/apis')])
      setProjects(p)
      setApis(a)
      setSelected((cur) => (cur === 'all' || p.some((x) => x.id === cur) ? cur : 'all'))
    } catch (e) {
      setError(e.message)
    }
  }, [])

  useEffect(() => { if (authed) load() }, [authed, load])

  const projectName = useMemo(
    () => Object.fromEntries(projects.map((p) => [p.id, p.name])), [projects])
  const current = projects.find((p) => p.id === selected)

  const scoped = apis.filter((a) => selected === 'all' || a.project_id === selected)
  const visible = scoped.filter((a) =>
    `${a.name} ${a.path} ${a.description}`.toLowerCase().includes(query.toLowerCase()))

  async function run(fn) {
    try { await fn(); await load() } catch (e) { setError(e.message) }
  }

  const toggle = (a) => run(() => request(`/apis/${a.id}/toggle`, { method: 'PATCH' }))
  const removeApi = (a) =>
    window.confirm(`"${a.name}" মুছবেন?`) &&
    run(() => request(`/apis/${a.id}`, { method: 'DELETE' }))
  const removeProject = () =>
    window.confirm(`"${current.name}" এবং এর সব API মুছে যাবে। নিশ্চিত?`) &&
    run(() => request(`/projects/${current.id}`, { method: 'DELETE' }))

  function logout() {
    clearToken()
    setAuthed(false)
  }

  if (!authed) return <LoginPage onSuccess={() => setAuthed(true)} />

  const navBase = 'flex w-full items-center justify-between rounded-xl px-4 py-2.5 text-left text-sm transition'

  return (
    <div className="mx-auto flex min-h-screen max-w-[1400px] gap-6 p-4 md:p-6">
      {/* Sidebar */}
      <aside className="hidden w-60 shrink-0 flex-col rounded-3xl bg-white/70 p-5 shadow-sm md:flex">
        <div className="mb-8 flex flex-col items-center gap-2">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600 to-fuchsia-500 font-bold text-white">
            API
          </div>
        </div>

        <button onClick={() => setSelected('all')}
          className={`${navBase} ${selected === 'all' ? 'bg-violet-100 font-medium text-violet-700' : 'text-slate-600 hover:bg-violet-50'}`}>
          <span>Dashboard</span>
          <span className="text-xs">{apis.length}</span>
        </button>

        <p className="mb-2 mt-6 px-4 text-xs font-semibold uppercase tracking-wider text-slate-400">Projects</p>
        <nav className="flex-1 space-y-1 overflow-y-auto">
          {projects.map((p) => (
            <button key={p.id} onClick={() => setSelected(p.id)}
              className={`${navBase} ${selected === p.id ? 'bg-violet-100 font-medium text-violet-700' : 'text-slate-600 hover:bg-violet-50'}`}>
              <span className="truncate">{p.name}</span>
              <span className="ml-2 text-xs">{p.api_count}</span>
            </button>
          ))}
        </nav>

        <button onClick={() => setModal({ type: 'project' })}
          className="mt-3 rounded-xl border border-dashed border-violet-300 py-2.5 text-sm text-violet-700 hover:bg-violet-50">
          + New Project
        </button>
        <button onClick={logout} className="mt-3 text-sm text-slate-500 hover:text-slate-800">
          Logout
        </button>
      </aside>

      {/* Main */}
      <main className="min-w-0 flex-1">
        <header className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">{current?.name ?? 'Dashboard'}</h1>
            <p className="text-sm text-slate-500">
              {current?.description || "Welcome to API's Modern Admin Dashboard"}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <input value={query} onChange={(e) => setQuery(e.target.value)}
              placeholder="🔍 Search everything..."
              className="w-56 rounded-full bg-white px-4 py-2 text-sm outline-none ring-1 ring-violet-100 focus:ring-violet-400" />
            <button onClick={logout} className="text-sm text-slate-500 md:hidden">Logout</button>
          </div>
        </header>

        {error && (
          <div className="mb-4 flex justify-between rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
            <button onClick={() => setError('')}>✕</button>
          </div>
        )}

        <div className="grid gap-6 xl:grid-cols-[1fr_320px]">
          <TrafficChart />
          <SummaryDonut apis={scoped} />
        </div>

        <div className="mt-6 grid gap-6 xl:grid-cols-[1fr_320px]">
          <section className="rounded-3xl bg-white p-6 shadow-sm">
            <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
              <h2 className="font-semibold text-slate-900">Your API's ({visible.length})</h2>
              {current && (
                <div className="flex gap-3 text-sm">
                  <button onClick={() => setModal({ type: 'project', project: current })}
                    className="text-violet-700 hover:underline">Edit Project</button>
                  <button onClick={removeProject} className="text-red-600 hover:underline">
                    Delete Project
                  </button>
                </div>
              )}
            </div>

            {visible.length ? (
              visible.map((a) => (
                <ApiRow key={a.id} item={a} projectName={projectName[a.project_id]}
                  onToggle={() => toggle(a)}
                  onEdit={() => setModal({ type: 'api', item: a })}
                  onDelete={() => removeApi(a)} />
              ))
            ) : (
              <p className="py-10 text-center text-sm text-slate-400">
                কোনো API নেই। ডানের কার্ড থেকে নতুন API যোগ করুন।
              </p>
            )}
          </section>

          <QuickAdd projects={projects}
            defaultProjectId={typeof selected === 'number' ? selected : ''} onAdded={load} />
        </div>
      </main>

      {modal?.type === 'project' && (
        <ProjectForm project={modal.project} onClose={() => setModal(null)}
          onSaved={(p) => { setModal(null); setSelected(p.id); load() }} />
      )}
      {modal?.type === 'api' && (
        <ApiForm item={modal.item} onClose={() => setModal(null)}
          onSaved={() => { setModal(null); load() }} />
      )}
    </div>
  )
}