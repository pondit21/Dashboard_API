import { useState } from 'react'
import { request } from '../api'

const field = 'w-full rounded-lg bg-white px-3 py-2.5 text-sm text-slate-800 outline-none'

export default function QuickAdd({ projects, defaultProjectId, onAdded }) {
  const [form, setForm] = useState({ name: '', method: 'GET', path: '' })
  const [projectId, setProjectId] = useState('')
  const [error, setError] = useState('')
  const pid = projectId || defaultProjectId || ''
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value })

  async function submit(e) {
    e.preventDefault()
    if (!pid) return setError('আগে একটা প্রজেক্ট বানান বা বেছে নিন')
    try {
      await request(`/projects/${pid}/apis`, {
        method: 'POST',
        body: { ...form, status: 'active' },
      })
      setForm({ name: '', method: 'GET', path: '' })
      setError('')
      onAdded()
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <form onSubmit={submit} className="rounded-3xl bg-violet-800 p-6 text-white shadow-sm">
      <h2 className="mb-4 font-semibold">Add New API</h2>
      <div className="space-y-3">
        <input className={field} placeholder="API name" value={form.name}
          onChange={set('name')} required minLength={2} />
        <div className="flex gap-2">
          <select className={`${field} w-28`} value={form.method} onChange={set('method')}>
            {['GET', 'POST', 'PUT', 'PATCH', 'DELETE'].map((m) => <option key={m}>{m}</option>)}
          </select>
          <input className={field} placeholder="/students/{id}" value={form.path}
            onChange={set('path')} required />
        </div>
        <div className="flex gap-2">
          <select className={field} value={pid} onChange={(e) => setProjectId(e.target.value)} required>
            <option value="" disabled>Select Project</option>
            {projects.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
          <button className="rounded-lg bg-sky-400 px-5 text-sm font-semibold text-white hover:bg-sky-500">
            Add
          </button>
        </div>
        {error && <p className="text-sm text-pink-200">{error}</p>}
      </div>
    </form>
  )
}