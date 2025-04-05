import React, { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'
import { useRouter } from 'next/router'
import Header from '../../../components/Header'
import AdminNav from '../../../components/AdminNav'

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const supabase = createClient(supabaseUrl, supabaseKey)

export default function ManageIdiomsPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [idioms, setIdioms] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [currentIdiom, setCurrentIdiom] = useState({
    idiom_kashmiri: '',
    transliteration: '',
    translation: '',
    meaning: '',
    tags: [],
    audio_url: ''
  })
  const [isEditing, setIsEditing] = useState(false)
  const [tagInput, setTagInput] = useState('')
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
  
  // Fetch idioms when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      fetchIdioms()
    }
  }, [isAuthenticated])

  const fetchIdioms = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('idioms')
        .select('*')
        .order('id', { ascending: true })

      if (error) throw error
      setIdioms(data || [])
    } catch (error) {
      console.error('Error fetching idioms:', error)
      setError('Failed to fetch idioms')
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setCurrentIdiom({ ...currentIdiom, [name]: value })
  }

  const handleTagInputChange = (e) => {
    setTagInput(e.target.value)
  }

  const addTag = () => {
    if (tagInput.trim() !== '' && !currentIdiom.tags.includes(tagInput.trim())) {
      setCurrentIdiom({
        ...currentIdiom,
        tags: [...currentIdiom.tags, tagInput.trim()]
      })
      setTagInput('')
    }
  }

  const removeTag = (tagToRemove) => {
    setCurrentIdiom({
      ...currentIdiom,
      tags: currentIdiom.tags.filter(tag => tag !== tagToRemove)
    })
  }

  const resetForm = () => {
    setCurrentIdiom({
      idiom_kashmiri: '',
      transliteration: '',
      translation: '',
      meaning: '',
      tags: [],
      audio_url: ''
    })
    setIsEditing(false)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      setLoading(true)
      
      if (isEditing && currentIdiom.id) {
        // Update existing idiom
        const { error } = await supabase
          .from('idioms')
          .update({
            idiom_kashmiri: currentIdiom.idiom_kashmiri,
            transliteration: currentIdiom.transliteration,
            translation: currentIdiom.translation,
            meaning: currentIdiom.meaning,
            tags: currentIdiom.tags,
            audio_url: currentIdiom.audio_url
          })
          .eq('id', currentIdiom.id)

        if (error) throw error
        alert('Idiom updated successfully!')
      } else {
        // Add new idiom
        const { error } = await supabase
          .from('idioms')
          .insert([{
            idiom_kashmiri: currentIdiom.idiom_kashmiri,
            transliteration: currentIdiom.transliteration,
            translation: currentIdiom.translation,
            meaning: currentIdiom.meaning,
            tags: currentIdiom.tags,
            audio_url: currentIdiom.audio_url
          }])

        if (error) throw error
        alert('Idiom added successfully!')
      }
      
      // Refresh the idiom list and reset the form
      fetchIdioms()
      resetForm()
    } catch (error) {
      console.error('Error saving idiom:', error)
      alert(`Error: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (idiom) => {
    setCurrentIdiom({
      ...idiom,
      tags: idiom.tags || []
    })
    setIsEditing(true)
    window.scrollTo(0, 0)
  }

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this idiom?')) return
    
    try {
      setLoading(true)
      const { error } = await supabase
        .from('idioms')
        .delete()
        .eq('id', id)

      if (error) throw error
      alert('Idiom deleted successfully!')
      fetchIdioms()
    } catch (error) {
      console.error('Error deleting idiom:', error)
      alert(`Error: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  if (!isAuthenticated) {
    return <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center text-gray-900 dark:text-white transition-colors">Redirecting...</div>
  }

  return (
    <div style={{minHeight: '100vh', backgroundColor: '#f3f4f6'}}>
      <Header />
      <AdminNav />
      
      <main style={{maxWidth: '1200px', margin: '0 auto', padding: '2rem 1rem'}}>
        <div style={{backgroundColor: 'white', padding: '2rem', borderRadius: '0.5rem', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)', marginBottom: '2rem'}}>
          <div style={{borderBottom: '1px solid #2563eb', paddingBottom: '1rem', marginBottom: '1.5rem'}}>
            <h2 style={{fontSize: '1.5rem', fontWeight: 'bold', color: '#1f2937'}}>
              {isEditing ? 'Edit Idiom' : 'Add New Idiom'}
            </h2>
          </div>
          
          <form onSubmit={handleSubmit} style={{display: 'flex', flexDirection: 'column', gap: '1.5rem'}}>
            <div style={{display: 'grid', gridTemplateColumns: '1fr', gap: '1.5rem', '@media (min-width: 768px)': {gridTemplateColumns: 'repeat(2, 1fr)'}}}>
              <div>
                <label style={{display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem'}}>Idiom in Kashmiri</label>
                <input
                  type="text"
                  name="idiom_kashmiri"
                  value={currentIdiom.idiom_kashmiri}
                  onChange={handleInputChange}
                  style={{
                    width: '100%', 
                    padding: '0.75rem', 
                    border: '1px solid #d1d5db', 
                    borderRadius: '0.375rem', 
                    backgroundColor: 'white', 
                    color: '#1f2937',
                    outline: 'none',
                    transition: 'border-color 0.2s ease-in-out',
                    ':focus': {borderColor: '#2563eb', boxShadow: '0 0 0 2px rgba(37, 99, 235, 0.2)'}
                  }}
                  required
                />
              </div>
              
              <div>
                <label style={{display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem'}}>Transliteration</label>
                <input
                  type="text"
                  name="transliteration"
                  value={currentIdiom.transliteration}
                  onChange={handleInputChange}
                  style={{
                    width: '100%', 
                    padding: '0.75rem', 
                    border: '1px solid #d1d5db', 
                    borderRadius: '0.375rem', 
                    backgroundColor: 'white', 
                    color: '#1f2937',
                    outline: 'none',
                    transition: 'border-color 0.2s ease-in-out',
                    ':focus': {borderColor: '#2563eb', boxShadow: '0 0 0 2px rgba(37, 99, 235, 0.2)'}
                  }}
                  required
                />
              </div>
            </div>
            
            <div>
              <label style={{display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem'}}>Translation</label>
              <input
                type="text"
                name="translation"
                value={currentIdiom.translation}
                onChange={handleInputChange}
                style={{
                  width: '100%', 
                  padding: '0.75rem', 
                  border: '1px solid #d1d5db', 
                  borderRadius: '0.375rem', 
                  backgroundColor: 'white', 
                  color: '#1f2937',
                  outline: 'none',
                  transition: 'border-color 0.2s ease-in-out',
                  ':focus': {borderColor: '#2563eb', boxShadow: '0 0 0 2px rgba(37, 99, 235, 0.2)'}
                }}
                required
              />
            </div>
            
            <div>
              <label style={{display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem'}}>Meaning</label>
              <textarea
                name="meaning"
                value={currentIdiom.meaning}
                onChange={handleInputChange}
                style={{
                  width: '100%', 
                  padding: '0.75rem', 
                  border: '1px solid #d1d5db', 
                  borderRadius: '0.375rem', 
                  backgroundColor: 'white', 
                  color: '#1f2937',
                  outline: 'none',
                  height: '6rem',
                  transition: 'border-color 0.2s ease-in-out',
                  ':focus': {borderColor: '#2563eb', boxShadow: '0 0 0 2px rgba(37, 99, 235, 0.2)'}
                }}
                required
              ></textarea>
            </div>
            
            <div>
              <label style={{display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem'}}>Audio URL (optional)</label>
              <input
                type="text"
                name="audio_url"
                value={currentIdiom.audio_url}
                onChange={handleInputChange}
                style={{
                  width: '100%', 
                  padding: '0.75rem', 
                  border: '1px solid #d1d5db', 
                  borderRadius: '0.375rem', 
                  backgroundColor: 'white', 
                  color: '#1f2937',
                  outline: 'none',
                  transition: 'border-color 0.2s ease-in-out',
                  ':focus': {borderColor: '#2563eb', boxShadow: '0 0 0 2px rgba(37, 99, 235, 0.2)'}
                }}
              />
            </div>
            
            <div>
              <label style={{display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem'}}>Tags</label>
              <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
                <input
                  type="text"
                  value={tagInput}
                  onChange={handleTagInputChange}
                  style={{
                    flexGrow: 1, 
                    padding: '0.75rem', 
                    border: '1px solid #d1d5db', 
                    borderRadius: '0.375rem', 
                    backgroundColor: 'white', 
                    color: '#1f2937',
                    outline: 'none',
                    transition: 'border-color 0.2s ease-in-out',
                    ':focus': {borderColor: '#2563eb', boxShadow: '0 0 0 2px rgba(37, 99, 235, 0.2)'}
                  }}
                  placeholder="Add a tag"
                />
                <button
                  type="button"
                  onClick={addTag}
                  style={{
                    backgroundColor: '#2563eb', 
                    color: 'white', 
                    padding: '0.75rem 1rem', 
                    borderRadius: '0.375rem', 
                    fontWeight: '500',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'background-color 0.2s ease-in-out',
                    ':hover': {backgroundColor: '#1d4ed8'}
                  }}
                >
                  Add
                </button>
              </div>
              
              <div style={{display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.5rem'}}>
                {currentIdiom.tags.map((tag, index) => (
                  <span key={index} style={{display: 'inline-flex', alignItems: 'center', padding: '0.25rem 0.625rem', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: '500', backgroundColor: '#dbeafe', color: '#1e40af'}}>
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      style={{marginLeft: '0.375rem', color: '#3b82f6', ':hover': {color: '#1e40af'}, cursor: 'pointer', border: 'none', background: 'none', padding: '0', fontSize: '1rem'}}
                    >
                      &times;
                    </button>
                  </span>
                ))}
              </div>
            </div>
            
            <div style={{display: 'flex', gap: '1rem', marginTop: '0.5rem'}}>
              <button
                type="submit"
                style={{
                  backgroundColor: '#2563eb', 
                  color: 'white', 
                  padding: '0.75rem 1.5rem', 
                  borderRadius: '0.375rem', 
                  fontWeight: '500',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s ease-in-out',
                  ':hover': {backgroundColor: '#1d4ed8'}
                }}
              >
                {isEditing ? 'Update Idiom' : 'Add Idiom'}
              </button>
              
              {isEditing && (
                <button
                  type="button"
                  onClick={resetForm}
                  style={{
                    backgroundColor: '#e5e7eb', 
                    color: '#374151', 
                    padding: '0.75rem 1.5rem', 
                    borderRadius: '0.375rem', 
                    fontWeight: '500',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'background-color 0.2s ease-in-out',
                    ':hover': {backgroundColor: '#d1d5db'}
                  }}
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>
        
        <div style={{backgroundColor: 'white', borderRadius: '0.5rem', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)', overflow: 'hidden'}}>
          <div style={{borderBottom: '1px solid #e5e7eb', padding: '1rem', backgroundColor: '#f9fafb'}}>
            <h2 style={{fontSize: '1.25rem', fontWeight: 'bold', color: '#1f2937'}}>All Idioms</h2>
          </div>
          
          {loading && <p style={{textAlign: 'center', padding: '1rem', color: '#4b5563'}}>Loading idioms...</p>}
          {error && <p style={{textAlign: 'center', padding: '1rem', color: '#ef4444'}}>{error}</p>}
          
          {!loading && !error && idioms.length === 0 && (
            <p style={{textAlign: 'center', padding: '1rem', color: '#4b5563'}}>No idioms found.</p>
          )}
          
          {!loading && !error && idioms.length > 0 && (
            <div style={{overflowX: 'auto'}}>
              <table style={{width: '100%', borderCollapse: 'collapse'}}>
                <thead style={{backgroundColor: '#f9fafb', borderBottom: '1px solid #e5e7eb'}}>
                  <tr>
                    <th style={{padding: '0.75rem 1.5rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em'}}>Idiom</th>
                    <th style={{padding: '0.75rem 1.5rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em'}}>Translation</th>
                    <th style={{padding: '0.75rem 1.5rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em'}}>Tags</th>
                    <th style={{padding: '0.75rem 1.5rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em'}}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {idioms.map((idiom) => (
                    <tr key={idiom.id} style={{borderBottom: '1px solid #e5e7eb', ':hover': {backgroundColor: '#f9fafb'}}}>
                      <td style={{padding: '1rem 1.5rem', whiteSpace: 'nowrap'}}>
                        <div style={{fontSize: '0.875rem', fontWeight: '500', color: '#1f2937'}}>{idiom.idiom_kashmiri}</div>
                        <div style={{fontSize: '0.875rem', color: '#6b7280'}}>{idiom.transliteration}</div>
                      </td>
                      <td style={{padding: '1rem 1.5rem', whiteSpace: 'nowrap'}}>
                        <div style={{fontSize: '0.875rem', color: '#1f2937'}}>{idiom.translation}</div>
                      </td>
                      <td style={{padding: '1rem 1.5rem', whiteSpace: 'nowrap'}}>
                        <div style={{display: 'flex', flexWrap: 'wrap', gap: '0.25rem'}}>
                          {idiom.tags && idiom.tags.map((tag, index) => (
                            <span key={index} style={{padding: '0.25rem 0.5rem', fontSize: '0.75rem', backgroundColor: '#dbeafe', color: '#1e40af', borderRadius: '9999px'}}>
                              {tag}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td style={{padding: '1rem 1.5rem', whiteSpace: 'nowrap', fontSize: '0.875rem', fontWeight: '500'}}>
                        <button
                          onClick={() => handleDelete(idiom.id)}
                          style={{color: '#ef4444', marginRight: '1rem', background: 'none', border: 'none', cursor: 'pointer', ':hover': {color: '#b91c1c'}}}
                        >
                          Delete
                        </button>
                        <button
                          onClick={() => handleEdit(idiom)}
                          style={{color: '#2563eb', background: 'none', border: 'none', cursor: 'pointer', ':hover': {color: '#1d4ed8'}}}
                        >
                          Edit
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
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
