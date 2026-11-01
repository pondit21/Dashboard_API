import { useState } from 'react'
import { request } from '../api'
import Modal, { btnPrimary, inputClass } from './Modal'

export default function ApiForm({ item, onClose, onSaved }) {
  const [form, setForm] = useState({
    name: item.name, method: item.method, path: item.path,
    description: item.description, status: item.status,
  })
  const [error, setError] = useState('')
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value })

  async function submit(e) {
    e.preventDefault()
    try {
      await request(`/apis/${item.id}`, { method: 'PUT', body: form })
      onSaved()
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <Modal title="Edit API" onClose={onClose}>
      <form onSubmit={submit} className="space-y-3">
        <input className={inputClass} value={form.name} onChange={set('name')} required minLength={2} />
        <div className="flex gap-2">
          <select className={`${inputClass} w-32`} value={form.method} onChange={set('method')}>
            {['GET', 'POST', 'PUT', 'PATCH', 'DELETE'].map((m) => <option key={m}>{m}</option>)}
          </select>
          <input className={inputClass} value={form.path} onChange={set('path')} required />
        </div>
        <select className={inputClass} value={form.status} onChange={set('status')}>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
        <textarea className={inputClass} rows={3} placeholder="Description"
          value={form.description} onChange={set('description')} />
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button className={`${btnPrimary} w-full`}>Save</button>
      </form>
    </Modal>
  )
}