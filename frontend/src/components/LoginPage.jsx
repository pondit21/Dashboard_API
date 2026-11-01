import { useState } from 'react'
import { login } from '../api'
import { btnPrimary, inputClass } from './Modal'

export default function LoginPage({ onSuccess }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function submit(e) {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      await login(username, password)
      onSuccess()
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <form onSubmit={submit} className="w-full max-w-sm rounded-3xl bg-white p-8 shadow-xl">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600 to-fuchsia-500 text-lg font-bold text-white">
          API
        </div>
        <h1 className="text-center text-xl font-bold text-slate-900">Welcome back</h1>
        <p className="mb-6 text-center text-sm text-slate-500">Sign in to your API Dashboard</p>

        <div className="space-y-3">
          <input className={inputClass} placeholder="Username" value={username}
            onChange={(e) => setUsername(e.target.value)} autoFocus required />
          <input className={inputClass} type="password" placeholder="Password" value={password}
            onChange={(e) => setPassword(e.target.value)} required />
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button className={`${btnPrimary} w-full`} disabled={loading}>
            {loading ? 'অপেক্ষা করুন...' : 'Sign in'}
          </button>
        </div>
      </form>
    </div>
  )
}