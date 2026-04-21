'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter, useParams } from 'next/navigation'

export default function PostDetail() {
  const [post, setPost] = useState<any>(null)
  const [comments, setComments] = useState<any[]>([])
  const [newComment, setNewComment] = useState('')
  const [user, setUser] = useState<any>(null)
  const [userRole, setUserRole] = useState('')
  const router = useRouter()
  const { id } = useParams()

  useEffect(() => {
    getUser()
    getPost()
    getComments()
  }, [])

  const getUser = async () => {
    const { data } = await supabase.auth.getUser()
    if (data.user) {
      setUser(data.user)
      const { data: userData } = await supabase
        .from('users')
        .select('role')
        .eq('id', data.user.id)
        .single()
      if (userData) setUserRole(userData.role)
    }
  }

  const getPost = async () => {
    const { data } = await supabase
      .from('posts')
      .select('*')
      .eq('id', id)
      .single()
    if (data) setPost(data)
  }

  const getComments = async () => {
    const { data } = await supabase
      .from('comments')
      .select('*, users(name, email)')
      .eq('post_id', id)
      .order('created_at', { ascending: true })
    if (data) setComments(data)
  }

  const addComment = async () => {
    if (!newComment.trim()) return
    if (!user) { router.push('/login'); return }
    await supabase.from('comments').insert({
      post_id: id,
      user_id: user.id,
      comment_text: newComment
    })
    setNewComment('')
    getComments()
  }

  const canEdit = user && post && (user.id === post.author_id || userRole === 'admin')

  if (!post) return <div className="p-6">Loading...</div>

  return (
    <div className="max-w-2xl mx-auto p-6">
      <button
        onClick={() => router.push('/')}
        className="text-blue-500 mb-4 hover:underline"
      >
        ← Back to Home
      </button>

      {post.image_url && (
        <img src={post.image_url} alt={post.title} className="w-full h-64 object-cover rounded mb-4" />
      )}

      <h1 className="text-3xl font-bold mb-2">{post.title}</h1>

      {post.summary && (
        <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded mb-4">
          <p className="text-sm font-semibold text-gray-500 mb-1">AI Summary</p>
          <p className="text-gray-700 dark:text-gray-300">{post.summary}</p>
        </div>
      )}

      <p className="text-gray-700 dark:text-gray-300 mb-6 whitespace-pre-wrap">{post.body}</p>

      {canEdit && (
        <button
          onClick={() => router.push(`/edit/${post.id}`)}
          className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 mb-6"
        >
          Edit Post
        </button>
      )}

      <hr className="mb-4" />
      <h2 className="text-xl font-semibold mb-4">Comments ({comments.length})</h2>

      {comments.map(comment => (
        <div key={comment.id} className="border rounded p-3 mb-3">
          <p className="text-sm text-gray-500">{comment.users?.name || comment.users?.email}</p>
          <p>{comment.comment_text}</p>
        </div>
      ))}

      {user ? (
        <div className="mt-4">
          <textarea
            className="w-full border p-2 rounded mb-2"
            placeholder="Write a comment..."
            value={newComment}
            onChange={e => setNewComment(e.target.value)}
            rows={3}
          />
          <button
            onClick={addComment}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Add Comment
          </button>
        </div>
      ) : (
        <p className="text-gray-500">
          <span className="text-blue-500 cursor-pointer" onClick={() => router.push('/login')}>Login</span> to comment
        </p>
      )}
    </div>
  )
}