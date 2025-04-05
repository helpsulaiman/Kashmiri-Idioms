import React, { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'
import { useRouter } from 'next/router'
import Header from '../../../components/Header'
import AdminNav from '../../../components/AdminNav'

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const supabase = createClient(supabaseUrl, supabaseKey)

export default function ManageSuggestionsPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [suggestions, setSuggestions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const router = useRouter()
  
  // All useEffect hooks need to be at the top level
  useEffect(() => {
    // Check if already authenticated
    if (localStorage.getItem('admin-auth') === 'true') {
      setIsAuthenticated(true)
    } else {
      router.push('/dashboard')
    }
  }, [])
  
  // Fetch suggestions when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      fetchSuggestions()
    }
  }, [isAuthenticated])

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
      case 'pending':
        return <span style={{display: 'inline-flex', alignItems: 'center', padding: '0.25rem 0.625rem', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: '500', backgroundColor: '#fef3c7', color: '#92400e'}}>Pending</span>
      case 'approved':
        return <span style={{display: 'inline-flex', alignItems: 'center', padding: '0.25rem 0.625rem', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: '500', backgroundColor: '#dcfce7', color: '#166534'}}>Approved</span>
      case 'rejected':
        return <span style={{display: 'inline-flex', alignItems: 'center', padding: '0.25rem 0.625rem', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: '500', backgroundColor: '#fee2e2', color: '#b91c1c'}}>Rejected</span>
      default:
        return <span style={{display: 'inline-flex', alignItems: 'center', padding: '0.25rem 0.625rem', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: '500', backgroundColor: '#f3f4f6', color: '#374151'}}>Unknown</span>
    }
  }

  if (!isAuthenticated) {
    return <div style={{minHeight: '100vh', backgroundColor: '#f3f4f6', display: 'flex', justifyContent: 'center', alignItems: 'center', color: '#1f2937'}}>Redirecting...</div>
  }

  return (
    <div style={{minHeight: '100vh', backgroundColor: '#f3f4f6'}}>
      <Header />
      <AdminNav />
      
      <main style={{maxWidth: '1200px', margin: '0 auto', padding: '2rem 1rem'}}>
        <div style={{maxWidth: '56rem', margin: '0 auto', textAlign: 'center', marginBottom: '2rem'}}>
          <h1 style={{fontSize: '2.25rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.025em'}}>Manage Suggestions</h1>
        </div>
        
        {loading && <p style={{textAlign: 'center', padding: '2rem', color: '#4b5563'}}>Loading suggestions...</p>}
        {error && <p style={{textAlign: 'center', padding: '2rem', color: '#ef4444'}}>{error}</p>}
        
        {!loading && !error && suggestions.length === 0 && (
          <div style={{backgroundColor: 'white', padding: '2rem', borderRadius: '0.5rem', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)', textAlign: 'center'}}>
            <p style={{color: '#4b5563'}}>No suggestions found.</p>
          </div>
        )}
        
        {!loading && !error && suggestions.length > 0 && (
          <div style={{display: 'flex', flexDirection: 'column', gap: '2rem'}}>
            {suggestions.map((suggestion) => (
              <div key={suggestion.id} style={{backgroundColor: 'white', padding: '1.5rem', borderRadius: '0.5rem', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'}}>
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem', borderBottom: '1px solid #2563eb', paddingBottom: '1rem'}}>
                  <div>
                    <h2 style={{fontSize: '1.25rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '0.25rem'}}>{suggestion.idiom_kashmiri}</h2>
                    <p style={{color: '#6b7280'}}>{suggestion.transliteration}</p>
                  </div>
                  
                  <div style={{display: 'flex', alignItems: 'center'}}>
                    {getStatusBadge(suggestion.status)}
                    <p style={{fontSize: '0.875rem', color: '#6b7280', marginLeft: '1rem'}}>
                      {new Date(suggestion.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                
                <div style={{display: 'grid', gridTemplateColumns: '1fr', gap: '1.5rem', marginBottom: '1.5rem', '@media (min-width: 768px)': {gridTemplateColumns: 'repeat(2, 1fr)'}}}>                  
                  <div>
                    <h3 style={{fontSize: '0.75rem', textTransform: 'uppercase', color: '#6b7280', fontWeight: '500', marginBottom: '0.25rem'}}>Translation</h3>
                    <p style={{color: '#1f2937'}}>{suggestion.translation}</p>
                  </div>
                  
                  <div>
                    <h3 style={{fontSize: '0.75rem', textTransform: 'uppercase', color: '#6b7280', fontWeight: '500', marginBottom: '0.25rem'}}>Meaning</h3>
                    <p style={{color: '#1f2937'}}>{suggestion.meaning}</p>
                  </div>
                  
                  {suggestion.tags && suggestion.tags.length > 0 && (
                    <div>
                      <h3 style={{fontSize: '0.75rem', textTransform: 'uppercase', color: '#6b7280', fontWeight: '500', marginBottom: '0.25rem'}}>Tags</h3>
                      <div style={{display: 'flex', flexWrap: 'wrap', gap: '0.5rem'}}>
                        {suggestion.tags.map((tag, index) => (
                          <span key={index} style={{backgroundColor: '#dbeafe', color: '#1e40af', fontSize: '0.75rem', padding: '0.25rem 0.5rem', borderRadius: '9999px'}}>
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <div>
                    <h3 style={{fontSize: '0.75rem', textTransform: 'uppercase', color: '#6b7280', fontWeight: '500', marginBottom: '0.25rem'}}>Submitted By</h3>
                    <p style={{color: '#1f2937'}}>{suggestion.submitter_name}</p>
                    <p style={{color: '#6b7280', fontSize: '0.875rem'}}>{suggestion.submitter_email}</p>
                  </div>
                </div>
                
                {suggestion.notes && (
                  <div style={{marginBottom: '1.5rem'}}>
                    <h3 style={{fontSize: '0.75rem', textTransform: 'uppercase', color: '#6b7280', fontWeight: '500', marginBottom: '0.25rem'}}>Additional Notes</h3>
                    <p style={{color: '#1f2937', backgroundColor: '#f9fafb', padding: '0.75rem', borderRadius: '0.375rem'}}>{suggestion.notes}</p>
                  </div>
                )}
                
                <div style={{display: 'flex', justifyContent: 'flex-end', gap: '0.75rem'}}>
                  {suggestion.status === 'pending' && (
                    <>
                      <button
                        onClick={() => handleReject(suggestion.id)}
                        style={{
                          padding: '0.5rem 1rem',
                          border: '1px solid #d1d5db',
                          borderRadius: '0.375rem',
                          color: '#374151',
                          backgroundColor: 'white',
                          cursor: 'pointer',
                          transition: 'background-color 0.2s ease-in-out',
                          ':hover': {backgroundColor: '#f3f4f6'}
                        }}
                        disabled={loading}
                      >
                        Reject
                      </button>
                      <button
                        onClick={() => handleApprove(suggestion)}
                        style={{
                          padding: '0.5rem 1rem',
                          borderRadius: '0.375rem',
                          backgroundColor: '#10b981',
                          color: 'white',
                          border: 'none',
                          cursor: 'pointer',
                          transition: 'background-color 0.2s ease-in-out',
                          ':hover': {backgroundColor: '#059669'}
                        }}
                        disabled={loading}
                      >
                        Approve
                      </button>
                    </>
                  )}
                  <button
                    onClick={() => handleDelete(suggestion.id)}
                    style={{
                      padding: '0.5rem 1rem',
                      borderRadius: '0.375rem',
                      backgroundColor: '#ef4444',
                      color: 'white',
                      border: 'none',
                      cursor: 'pointer',
                      transition: 'background-color 0.2s ease-in-out',
                      ':hover': {backgroundColor: '#dc2626'}
                    }}
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
          <p>© {new Date().getFullYear()} Kashmiri Idioms Project</p>
          <p style={{fontSize: '0.875rem', marginTop: '0.5rem', color: '#9ca3af'}}>Made by @helpsulaiman</p>
        </div>
      </footer>
    </div>
  )
}
