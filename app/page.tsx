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
    if (search) query = query.ilike('title', `%${search}%`)
    const { data } = await query
    if (data) setPosts(data)
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Navbar */}
      <nav className="bg-white dark:bg-gray-900 shadow-sm border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-4xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-600">✍️ BlogSpace</h1>
          <div className="flex gap-3">
            {user ? (
              <>
                {(userRole === 'author' || userRole === 'admin') && (
                  <button
                    onClick={() => router.push('/create')}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition"
                  >
                    + New Post
                  </button>
                )}
                <button
                  onClick={handleLogout}
                  className="border border-gray-300 text-gray-600 dark:text-gray-300 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                >
                  Logout
                </button>
              </>
            ) : (
              <button
                onClick={() => router.push('/login')}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition"
              >
                Login
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Search */}
        <div className="relative mb-8">
          <span className="absolute left-3 top-3 text-gray-400">🔍</span>
          <input
            className="w-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-3 pl-10 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Search posts..."
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(0) }}
          />
        </div>

        {/* Posts */}
        {posts.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <p className="text-5xl mb-4">📝</p>
            <p className="text-lg">No posts yet!</p>
          </div>
        ) : (
          <div className="grid gap-6">
            {posts.map(post => (
              <div
                key={post.id}
                onClick={() => router.push(`/post/${post.id}`)}
                className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden cursor-pointer hover:shadow-md hover:-translate-y-1 transition-all duration-200"
              >
                {post.image_url && (
                  <img src={post.image_url} alt={post.title} className="w-full h-52 object-cover" />
                )}
                <div className="p-6">
                  <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-2">{post.title}</h2>
                  {post.summary ? (
                    <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">{post.summary}</p>
                  ) : (
                    <p className="text-gray-400 text-sm italic">No summary available</p>
                  )}
                  <div className="mt-4">
                    <span className="text-blue-500 text-sm font-medium">Read more →</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        <div className="flex justify-center gap-3 mt-8">
          <button
            onClick={() => setPage(p => Math.max(0, p - 1))}
            disabled={page === 0}
            className="px-5 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm font-medium disabled:opacity-40 hover:bg-gray-50 dark:hover:bg-gray-800 transition"
          >
            ← Previous
          </button>
          <span className="px-4 py-2 text-sm text-gray-500">Page {page + 1}</span>
          <button
            onClick={() => setPage(p => p + 1)}
            disabled={posts.length < limit}
            className="px-5 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm font-medium disabled:opacity-40 hover:bg-gray-50 dark:hover:bg-gray-800 transition"
          >
            Next →
          </button>
        </div>
      </div>
    </div>
  )
}