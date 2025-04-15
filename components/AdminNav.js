import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'

export default function AdminNav() {
  const router = useRouter()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <div className="bg-gray-50 dark:bg-gray-800 mb-8 rounded-lg shadow-sm">
      <div className="max-w-3xl mx-auto px-4 py-2">
        <nav className="flex items-center gap-4">
          <Link 
            href="/dashboard/manage/idioms" 
            className={`px-4 py-2 rounded-md transition-colors ${
              router.pathname === '/dashboard/manage/idioms' 
                ? 'bg-blue-600 text-white font-bold' 
                : 'bg-transparent text-gray-700 dark:text-gray-300 hover:bg-blue-600/20'
            }`}
          >
            Manage Idioms
          </Link>
          <Link 
            href="/dashboard/manage/suggestions" 
            className={`px-4 py-2 rounded-md transition-colors ${
              router.pathname === '/dashboard/manage/suggestions' 
                ? 'bg-blue-600 text-white font-bold' 
                : 'bg-transparent text-gray-700 dark:text-gray-300 hover:bg-blue-600/20'
            }`}
          >
            Review Suggestions
          </Link>
          <Link 
            href="/dashboard"
            className="ml-auto px-4 py-2 rounded-md text-red-600 hover:bg-red-600/20 transition-colors"
            onClick={() => {
              localStorage.removeItem('admin-auth')
              router.push('/dashboard')
            }}
          >
            Logout
          </Link>
        </nav>
      </div>
    </div>
  )
}
