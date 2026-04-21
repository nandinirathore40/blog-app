'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function Home() {
  const [posts, setPosts] = useState<any[]>([])
  const [user, setUser] = useState<any>(null)
  const [userRole, setUserRole] = useState('')
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(0)
  const limit = 5
  const router = useRouter()

  useEffect(() => {
    getUser()
    getPosts()
  }, [page, search])

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

  const getPosts = async () => {
    let query = supabase
      .from('posts')
      .select('*')
      .range(page * limit, (page + 1) * limit - 1)
      .order('created_at', { ascending: false })

    if (search) {
      query = query.ilike('title', `%${search}%`)
    }

    const { data } = await query
    if (data) setPosts(data)
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Blog</h1>
        <div className="flex gap-3">
          {user ? (
            <>
              {(userRole === 'author' || userRole === 'admin') && (
                <button
                  onClick={() => router.push('/create')}
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  Create Post
                </button>
              )}
              <button
                onClick={handleLogout}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              >
                Logout
              </button>
            </>
          ) : (
            <button
              onClick={() => router.push('/login')}
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              Login
            </button>
          )}
        </div>
      </div>

      <input
        className="w-full border p-2 rounded mb-6"
        placeholder="Search posts..."
        value={search}
        onChange={e => { setSearch(e.target.value); setPage(0) }}
      />

      {posts.length === 0 && (
        <p className="text-gray-500 text-center">No posts yet!</p>
      )}

      {posts.map(post => (
        <div
          key={post.id}
          className="border rounded p-4 mb-4 cursor-pointer hover:shadow-md"
          onClick={() => router.push(`/post/${post.id}`)}
        >
          {post.image_url && (
            <img src={post.image_url} alt={post.title} className="w-full h-48 object-cover rounded mb-3" />
          )}
          <h2 className="text-xl font-semibold">{post.title}</h2>
          {post.summary && (
            <p className="text-gray-600 mt-2 text-sm">{post.summary}</p>
          )}
        </div>
      ))}

      <div className="flex gap-3 mt-4">
        <button
          onClick={() => setPage(p => Math.max(0, p - 1))}
          disabled={page === 0}
          className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
        >
          Previous
        </button>
        <button
          onClick={() => setPage(p => p + 1)}
          disabled={posts.length < limit}
          className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  )
}