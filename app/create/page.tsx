'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function CreatePost() {
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [user, setUser] = useState<any>(null)
  const router = useRouter()

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser()
      if (!data.user) { router.push('/login'); return }
      setUser(data.user)
    }
    getUser()
  }, [])

  const handleSubmit = async () => {
    if (!title || !body) { alert('Title aur content required hai!'); return }
    setLoading(true)

    const { data: post, error } = await supabase
      .from('posts')
      .insert({ title, body, image_url: imageUrl, author_id: user.id })
      .select()
      .single()

    if (error) { alert('Error: ' + error.message); setLoading(false); return }

    // Gemini AI summary generate karo
    try {
      const res = await fetch('/api/summarize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ postId: post.id, content: body })
      })
    } catch (e) {
      console.log('Summary error:', e)
    }

    router.push('/')
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Create New Post</h1>
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
        placeholder="Write your post content here..."
        value={body}
        onChange={e => setBody(e.target.value)}
      />
      <div className="flex gap-3">
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Publishing...' : 'Publish Post'}
        </button>
        <button
          onClick={() => router.push('/')}
          className="bg-gray-400 text-white px-6 py-2 rounded hover:bg-gray-500"
        >
          Cancel
        </button>
      </div>
    </div>
  )
}