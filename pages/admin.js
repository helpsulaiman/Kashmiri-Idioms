import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import Header from '../components/Header'
import AdminNav from '../components/AdminNav'

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState('')
  const router = useRouter()
  
  // Check if already authenticated
  useEffect(() => {
    if (localStorage.getItem('admin-auth') === 'true') {
      setIsAuthenticated(true)
    }
  }, [])
  
  // Simple password check
  const handleLogin = (e) => {
    e.preventDefault()
    if (password === 'Cxer2024') {
      setIsAuthenticated(true)
      localStorage.setItem('admin-auth', 'true')
    } else {
      alert('Incorrect password')
    }
  }
  
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
        <Header />
        <div className="flex items-center justify-center py-12">
          <form onSubmit={handleLogin} className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md w-full max-w-md transition-colors">
            <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white text-center">Admin Login</h1>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Password</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                placeholder="Enter admin password"
              />
            </div>
            <button 
              type="submit" 
              className="w-full bg-blue-600 dark:bg-blue-700 text-white p-3 rounded-md hover:bg-blue-700 dark:hover:bg-blue-800 transition-colors"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <AdminNav />

        <h1 className="text-3xl font-bold mb-8 text-center text-gray-900 dark:text-white">ADMIN DASHBOARD</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md transition-colors">
            <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Manage Idioms</h2>
            <p className="mb-4 text-gray-700 dark:text-gray-300">Add, edit, or remove idioms from the database.</p>
            <Link 
              href="/dashboard/manage/idioms" 
              className="inline-block px-4 py-2 bg-blue-600 dark:bg-blue-700 text-white rounded-md hover:bg-blue-700 dark:hover:bg-blue-800 transition-colors"
            >
              Go to Idioms
            </Link>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md transition-colors">
            <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Review Suggestions</h2>
            <p className="mb-4 text-gray-700 dark:text-gray-300">Review and approve user-submitted idiom suggestions.</p>
            <Link 
              href="/dashboard/manage/suggestions" 
              className="inline-block px-4 py-2 bg-green-600 dark:bg-green-700 text-white rounded-md hover:bg-green-700 dark:hover:bg-green-800 transition-colors"
            >
              Go to Suggestions
            </Link>
          </div>
        </div>
      </main>
      
      <footer className="bg-gray-800 dark:bg-gray-950 text-white py-6 mt-12 transition-colors">
        <div className="container mx-auto px-4 text-center">
          <p>© {new Date().getFullYear()} Kashmiri Idioms Project</p>
          <p className="text-sm mt-2 text-gray-400">Made by @helpsulaiman</p>
        </div>
      </footer>
    </div>
  )
}
