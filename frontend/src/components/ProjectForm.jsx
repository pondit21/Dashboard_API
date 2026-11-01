import { useState } from 'react'
import { request } from '../api'
import Modal, { btnPrimary, inputClass } from './Modal'

export default function ProjectForm({ project, onClose, onSaved }) {
  const [name, setName] = useState(project?.name ?? '')
  const [description, setDescription] = useState(project?.description ?? '')
  const [error, setError] = useState('')

  async function submit(e) {
    e.preventDefault()
    try {
      const body = { name, description }
      const saved = project
        ? await request(`/projects/${project.id}`, { method: 'PUT', body })
        : await request('/projects', { method: 'POST', body })
      onSaved(saved)
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <Modal title={project ? 'Edit Project' : 'New Project'} onClose={onClose}>
      <form onSubmit={submit} className="space-y-3">
        <input className={inputClass} placeholder="Project name" value={name}
          onChange={(e) => setName(e.target.value)} required minLength={2} autoFocus />
        <textarea className={inputClass} rows={3} placeholder="Description" value={description}
          onChange={(e) => setDescription(e.target.value)} />
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button className={`${btnPrimary} w-full`}>Save</button>
      </form>
    </Modal>
  )
}