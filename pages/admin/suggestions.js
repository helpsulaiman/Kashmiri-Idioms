import React, { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'
import { useRouter } from 'next/router'
import { verifyAdminPassword } from '../../../lib/adminAuth'
import Header from '../../components/Header'
import AdminNav from '../../components/AdminNav'

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const supabase = createClient(supabaseUrl, supabaseKey)

export default function SuggestionsAdmin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState('')
  const [suggestions, setSuggestions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const router = useRouter()

  // Check existing authentication
  useEffect(() => {
    if (localStorage.getItem('admin-auth') === 'true') {
      setIsAuthenticated(true)
    }
  }, [])

  // Fetch suggestions when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      fetchSuggestions()
    }
  }, [isAuthenticated])

  const handleLogin = (e) => {
    e.preventDefault()
    try {
      if (verifyAdminPassword(password)) {
        setIsAuthenticated(true)
        localStorage.setItem('admin-auth', 'true')
      } else {
        setError('Incorrect password')
      }
    } catch (err) {
      setError(err.message)
    }
  }

  if (!isAuthenticated) {
    return (
      <div style={{minHeight: '100vh', backgroundColor: '#f3f4f6'}}>
        <Header />
        <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '3rem 0'}}>
          <form onSubmit={handleLogin} style={{backgroundColor: 'white', padding: '2rem', borderRadius: '0.5rem', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)', width: '100%', maxWidth: '28rem'}}>
            <h1 style={{fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1.5rem', color: '#111827', textAlign: 'center'}}>Admin Login</h1>
            {error && (
              <div style={{backgroundColor: '#fee2e2', border: '1px solid #fecaca', color: '#b91c1c', padding: '1rem', borderRadius: '0.5rem', marginBottom: '1.5rem'}}>
                {error}
              </div>
            )}
            <div style={{marginBottom: '1rem'}}>
              <label style={{display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem'}}>Password</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{
                  width: '100%', 
                  padding: '0.75rem', 
                  border: '1px solid #d1d5db', 
                  borderRadius: '0.375rem', 
                  backgroundColor: 'white', 
                  color: '#111827'
                }}
                required
              />
            </div>
            <button 
              type="submit" 
              style={{
                width: '100%', 
                backgroundColor: '#2563eb', 
                color: 'white', 
                padding: '0.75rem', 
                borderRadius: '0.375rem', 
                border: 'none',
                cursor: 'pointer',
                transition: 'background-color 0.2s'
              }}
            >
              Login
            </button>
          </form>
        </div>
      </div>
    )
  }

  const fetchSuggestions = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('suggestions')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setSuggestions(data || [])
    } catch (error) {
      console.error('Error fetching suggestions:', error)
      setError('Failed to fetch suggestions')
    } finally {
      setLoading(false)
    }
  }

  const handleApprove = async (suggestion) => {
    try {
      setLoading(true)
      
      // First, add to the idioms table
      const { error: insertError } = await supabase
        .from('idioms')
        .insert([{
          idiom_kashmiri: suggestion.idiom_kashmiri,
          transliteration: suggestion.transliteration,
          translation: suggestion.translation,
          meaning: suggestion.meaning,
          tags: suggestion.tags,
          // Don't copy over submitter info to the public table
        }])

      if (insertError) throw insertError

      // Then update the suggestion status
      const { error: updateError } = await supabase
        .from('suggestions')
        .update({ status: 'approved' })
        .eq('id', suggestion.id)

      if (updateError) throw updateError

      alert('Suggestion approved and added to idioms!')
      fetchSuggestions()
    } catch (error) {
      console.error('Error approving suggestion:', error)
      alert(`Error: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  const handleReject = async (id) => {
    try {
      setLoading(true)
      const { error } = await supabase
        .from('suggestions')
        .update({ status: 'rejected' })
        .eq('id', id)

      if (error) throw error
      
      alert('Suggestion rejected')
      fetchSuggestions()
    } catch (error) {
      console.error('Error rejecting suggestion:', error)
      alert(`Error: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this suggestion?')) return
    
    try {
      setLoading(true)
      const { error } = await supabase
        .from('suggestions')
        .delete()
        .eq('id', id)

      if (error) throw error
      
      alert('Suggestion deleted')
      fetchSuggestions()
    } catch (error) {
      console.error('Error deleting suggestion:', error)
      alert(`Error: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case 'approved':
        return <span className="px-2 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300 text-xs rounded-full">Approved</span>
      case 'rejected':
        return <span className="px-2 py-1 bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-300 text-xs rounded-full">Rejected</span>
      default:
        return <span style={{padding: '0.5rem 1rem', backgroundColor: '#f7dc6f', color: '#1f2937', fontSize: '0.875rem', borderRadius: '0.5rem'}}>Pending</span>
    }
  }

  return (
    <div style={{minHeight: '100vh', backgroundColor: '#f3f4f6'}}>
      <Header />
      <AdminNav />
      
      <main style={{maxWidth: '1200px', margin: '0 auto', padding: '2rem 1rem'}}>
        <h1 style={{fontSize: '2.25rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '1.5rem', textTransform: 'uppercase', letterSpacing: '0.025em'}}>Manage Suggestions</h1>
        
        {loading && <p style={{textAlign: 'center', padding: '2rem 0', color: '#6b7280'}}>Loading...</p>}
        {error && <p style={{textAlign: 'center', padding: '2rem 0', color: '#dc2626'}}>{error}</p>}
        
        {!loading && !error && suggestions.length === 0 && (
          <div style={{backgroundColor: 'white', padding: '2rem', borderRadius: '0.5rem', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'}}>
            <p style={{textAlign: 'center', color: '#6b7280'}}>No suggestions found.</p>
            <p>No suggestions found.</p>
          </div>
        )}
        
        {!loading && !error && suggestions.length > 0 && (
          <div className="space-y-6">
            {suggestions.map((suggestion) => (
              <div key={suggestion.id} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md transition-colors">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className="text-xl font-bold text-gray-800 dark:text-white">{suggestion.idiom_kashmiri}</h2>
                    <p className="text-gray-600 dark:text-gray-400 italic">{suggestion.transliteration}</p>
                  </div>
                  <div className="flex flex-col items-end">
                    {getStatusBadge(suggestion.status)}
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      Submitted on {new Date(suggestion.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                  <div>
                    <h3 className="text-sm uppercase text-gray-500 dark:text-gray-400 font-medium mb-1">Translation</h3>
                    <p className="text-gray-800 dark:text-white">{suggestion.translation}</p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm uppercase text-gray-500 dark:text-gray-400 font-medium mb-1">Meaning</h3>
                    <p className="text-gray-800 dark:text-white">{suggestion.meaning}</p>
                  </div>
                  
                  {suggestion.tags && suggestion.tags.length > 0 && (
                    <div>
                      <h3 className="text-sm uppercase text-gray-500 dark:text-gray-400 font-medium mb-1">Tags</h3>
                      <div className="flex flex-wrap gap-2">
                        {suggestion.tags.map((tag, index) => (
                          <span key={index} className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-300 text-xs px-2 py-1 rounded-full">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <div>
                    <h3 className="text-sm uppercase text-gray-500 dark:text-gray-400 font-medium mb-1">Submitted By</h3>
                    <p className="text-gray-800 dark:text-white">{suggestion.submitter_name}</p>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">{suggestion.submitter_email}</p>
                  </div>
                </div>
                
                {suggestion.notes && (
                  <div className="mb-4">
                    <h3 className="text-sm uppercase text-gray-500 dark:text-gray-400 font-medium mb-1">Additional Notes</h3>
                    <p className="text-gray-800 dark:text-white bg-gray-50 dark:bg-gray-700 p-3 rounded transition-colors">{suggestion.notes}</p>
                  </div>
                )}
                
                <div className="flex justify-end space-x-3">
                  {suggestion.status === 'pending' && (
                    <>
                      <button
                        onClick={() => handleReject(suggestion.id)}
                        className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                        disabled={loading}
                      >
                        Reject
                      </button>
                      <button
                        onClick={() => handleApprove(suggestion)}
                        className="px-4 py-2 bg-green-500 dark:bg-green-600 text-white rounded-md hover:bg-green-600 dark:hover:bg-green-700 transition-colors"
                        disabled={loading}
                      >
                        Approve
                      </button>
                    </>
                  )}
                  <button
                    onClick={() => handleDelete(suggestion.id)}
                    className="px-4 py-2 bg-red-500 dark:bg-red-600 text-white rounded-md hover:bg-red-600 dark:hover:bg-red-700 transition-colors"
                    disabled={loading}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
      
      <footer style={{backgroundColor: '#1f2937', color: 'white', padding: '1.5rem 0', marginTop: '3rem'}}>
        <div style={{maxWidth: '1200px', margin: '0 auto', padding: '0 1rem', textAlign: 'center'}}>
          <p> {new Date().getFullYear()} Kashmiri Idioms Project</p>
          <p style={{fontSize: '0.875rem', marginTop: '0.5rem', color: '#9ca3af'}}>Made by @helpsulaiman</p>
        </div>
      </footer>
    </div>
  )
}
