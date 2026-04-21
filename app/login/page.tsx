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
  const router = useRouter()

  const handleAuth = async () => {
    setError('')
    if (isLogin) {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) { setError(error.message); return }
      router.push('/')
    } else {
      const { data, error } = await supabase.auth.signUp({ email, password })
      if (error) { setError(error.message); return }
      if (data.user) {
        await supabase.from('users').insert({
          id: data.user.id,
          email,
          name,
          role
        })
      }
      router.push('/')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-96">
        <h1 className="text-2xl font-bold mb-6 text-center">
          {isLogin ? 'Login' : 'Sign Up'}
        </h1>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        {!isLogin && (
          <>
            <input
              className="w-full border p-2 rounded mb-3"
              placeholder="Name"
              value={name}
              onChange={e => setName(e.target.value)}
            />
            <select
              className="w-full border p-2 rounded mb-3"
              value={role}
              onChange={e => setRole(e.target.value)}
            >
              <option value="viewer">Viewer</option>
              <option value="author">Author</option>
            </select>
          </>
        )}
        <input
          className="w-full border p-2 rounded mb-3"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
        <input
          className="w-full border p-2 rounded mb-3"
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
        <button
          className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
          onClick={handleAuth}
        >
          {isLogin ? 'Login' : 'Sign Up'}
        </button>
        <p
          className="text-center mt-4 text-blue-500 cursor-pointer"
          onClick={() => setIsLogin(!isLogin)}
        >
          {isLogin ? 'No account? Sign Up' : 'Have account? Login'}
        </p>
      </div>
    </div>
  )
}