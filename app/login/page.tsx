'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [role, setRole] = useState('viewer')
  const [isLogin, setIsLogin] = useState(true)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleAuth = async () => {
    setError('')
    setLoading(true)
    if (isLogin) {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) { setError(error.message); setLoading(false); return }
      router.push('/')
    } else {
      const { data, error } = await supabase.auth.signUp({ email, password })
      if (error) { setError(error.message); setLoading(false); return }
      if (data.user) {
        await supabase.from('users').insert({ id: data.user.id, email, name, role })
      }
      router.push('/')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
      <div className="bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-lg w-full max-w-md border border-gray-100 dark:border-gray-800">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-blue-600">✍️ BlogSpace</h1>
          <p className="text-gray-500 mt-2">{isLogin ? 'Welcome back!' : 'Create your account'}</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-4 text-sm">
            {error}
          </div>
        )}

        {!isLogin && (
          <>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Name</label>
              <input
                className="w-full border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Your name"
                value={name}
                onChange={e => setName(e.target.value)}
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Role</label>
              <select
                className="w-full border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={role}
                onChange={e => setRole(e.target.value)}
              >
                <option value="viewer">Viewer</option>
                <option value="author">Author</option>
              </select>
            </div>
          </>
        )}

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
          <input
            className="w-full border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="you@example.com"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Password</label>
          <input
            type="password"
            className="w-full border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="••••••••"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
        </div>

        <button
          onClick={handleAuth}
          disabled={loading}
          className="w-full bg-blue-600 text-white p-3 rounded-lg font-medium hover:bg-blue-700 transition disabled:opacity-50"
        >
          {loading ? 'Please wait...' : isLogin ? 'Login' : 'Sign Up'}
        </button>

        <p
          className="text-center mt-4 text-blue-500 cursor-pointer text-sm hover:underline"
          onClick={() => setIsLogin(!isLogin)}
        >
          {isLogin ? 'No account? Sign Up' : 'Have account? Login'}
        </p>
      </div>
    </div>
  )
}