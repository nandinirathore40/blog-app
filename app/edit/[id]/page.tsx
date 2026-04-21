'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter, useParams } from 'next/navigation'

export default function EditPost() {
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [userRole, setUserRole] = useState('')
  const router = useRouter()
  const { id } = useParams()

  useEffect(() => {
    getUser()
    getPost()
  }, [])

  const getUser = async () => {
    const { data } = await supabase.auth.getUser()
    if (!data.user) { router.push('/login'); return }
    setUser(data.user)
    const { data: userData } = await supabase
      .from('users')
      .select('role')
      .eq('id', data.user.id)
      .single()
    if (userData) setUserRole(userData.role)
  }

  const getPost = async () => {
    const { data } = await supabase
      .from('posts')
      .select('*')
      .eq('id', id)
      .single()
    if (data) {
      setTitle(data.title)
      setBody(data.body)
      setImageUrl(data.image_url || '')
    }
  }

  const handleUpdate = async () => {
    setLoading(true)
    const { error } = await supabase
      .from('posts')
      .update({ title, body, image_url: imageUrl })
      .eq('id', id)
    if (error) { alert('Error: ' + error.message); setLoading(false); return }
    router.push(`/post/${id}`)
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Edit Post</h1>
      <input
        className="w-full border p-2 rounded mb-4"
        placeholder="Title"
        value={title}
        onChange={e => setTitle(e.target.value)}
      />
      <input
        className="w-full border p-2 rounded mb-4"
        placeholder="Image URL (optional)"
        value={imageUrl}
        onChange={e => setImageUrl(e.target.value)}
      />
      <textarea
        className="w-full border p-2 rounded mb-4 h-48"
        placeholder="Content"
        value={body}
        onChange={e => setBody(e.target.value)}
      />
      <div className="flex gap-3">
        <button
          onClick={handleUpdate}
          disabled={loading}
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Updating...' : 'Update Post'}
        </button>
        <button
          onClick={() => router.push(`/post/${id}`)}
          className="bg-gray-400 text-white px-6 py-2 rounded"
        >
          Cancel
        </button>
      </div>
    </div>
  )
}