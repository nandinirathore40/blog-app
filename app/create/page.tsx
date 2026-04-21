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
    try {
      await fetch('/api/summarize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ postId: post.id, content: body })
      })
    } catch (e) { console.log('Summary error:', e) }
    router.push('/')
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <nav className="bg-white dark:bg-gray-900 shadow-sm border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-3xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-600 cursor-pointer" onClick={() => router.push('/')}>✍️ BlogSpace</h1>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-6 py-10">
        <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-8">Create New Post</h2>

        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-8">
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Title *</label>
            <input
              className="w-full border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter post title..."
              value={title}
              onChange={e => setTitle(e.target.value)}
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Featured Image URL</label>
            <input
              className="w-full border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="https://example.com/image.jpg"
              value={imageUrl}
              onChange={e => setImageUrl(e.target.value)}
            />
          </div>

          <div className="mb-8">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Content *</label>
            <textarea
              className="w-full border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 h-56 resize-none"
              placeholder="Write your post content here..."
              value={body}
              onChange={e => setBody(e.target.value)}
            />
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="bg-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-700 transition disabled:opacity-50"
            >
              {loading ? '⏳ Publishing...' : '🚀 Publish Post'}
            </button>
            <button
              onClick={() => router.push('/')}
              className="border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 px-8 py-3 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}