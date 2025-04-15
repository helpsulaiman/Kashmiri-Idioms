import React, { useState } from 'react'
import { createClient } from '@supabase/supabase-js'
import Header from '../components/Header'
// import { ThemeContext } from '../context/ThemeContext'

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const supabase = createClient(supabaseUrl, supabaseKey)
const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const { data, error } = await supabase
      .from('simple_suggestions')
      .insert({
        idiom_kashmiri: formData.idiom_kashmiri,
        translation: formData.translation,
        submitter_email: formData.submitter_email
      });

    if (error) throw error;
    setSubmitted(true);
  } catch (error) {
    setError("Submission failed: " + error.message);
  }
};

export default function SuggestPage() {
  // Theme context removed
  const [formData, setFormData] = useState({
    idiom_kashmiri: '',
    transliteration: '',
    translation: '',
    meaning: '',
    tags: [],
    submitter_name: '',
    submitter_email: '',
    notes: ''
  })
  const [tagInput, setTagInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState(null)

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleTagInputChange = (e) => {
    setTagInput(e.target.value)
  }

  const addTag = () => {
    if (tagInput.trim() !== '' && !formData.tags.includes(tagInput.trim())) {
      setFormData({
        ...formData,
        tags: [...formData.tags, tagInput.trim()]
      })
      setTagInput('')
    }
  }

  const removeTag = (tagToRemove) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter(tag => tag !== tagToRemove)
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      // Use a stored procedure for safer insertion
      const { data, error } = await supabase.rpc('submit_suggestion', {
        idiom_data: {
          idiom_kashmiri: formData.idiom_kashmiri,
          transliteration: formData.transliteration,
          translation: formData.translation,
          meaning: formData.meaning,
          tags: formData.tags,
          submitter_name: formData.submitter_name,
          submitter_email: formData.submitter_email,
          notes: formData.notes
        }
      })

      if (error) throw error

      // Reset form and show success message
      setFormData({
        idiom_kashmiri: '',
        transliteration: '',
        translation: '',
        meaning: '',
        tags: [],
        submitter_name: '',
        submitter_email: '',
        notes: ''
      })
      setSubmitted(true)
    } catch (error) {
      console.error('Error submitting suggestion:', error)
      setError('Failed to submit suggestion. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{minHeight: '100vh', backgroundColor: '#f3f4f6'}}>
      <Header />
      
      <main style={{maxWidth: '1200px', margin: '0 auto', padding: '2rem 1rem'}}>
        <div style={{maxWidth: '56rem', margin: '0 auto', textAlign: 'center', marginBottom: '3rem'}}>
          <h1 style={{fontSize: '2.25rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.025em'}}>Suggest an Idiom</h1>
          <p style={{color: '#4b5563', fontSize: '1.125rem', maxWidth: '42rem', margin: '0 auto'}}>
            Help us preserve Kashmiri language by suggesting idioms that you know.
            Our team will review your submission and add it to our collection.
          </p>
        </div>
        
        {submitted ? (
          <div style={{backgroundColor: '#ecfdf5', border: '1px solid #a7f3d0', color: '#047857', padding: '1.5rem', borderRadius: '0.5rem', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)', textAlign: 'center'}}>
            <h2 style={{fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '0.5rem'}}>Thank You!</h2>
            <p style={{marginBottom: '1rem'}}>Your suggestion has been submitted successfully. Our team will review it soon.</p>
            <button
              onClick={() => setSubmitted(false)}
              style={{padding: '0.5rem 1rem', backgroundColor: '#059669', color: 'white', borderRadius: '0.375rem', border: 'none', cursor: 'pointer', transition: 'all 0.2s ease'}}
            >
              Submit Another Idiom
            </button>
          </div>
        ) : (
          <div style={{backgroundColor: 'white', padding: '1.5rem', borderRadius: '0.5rem', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'}}>
            {error && (
              <div style={{backgroundColor: '#fee2e2', border: '1px solid #fecaca', color: '#b91c1c', padding: '1rem', borderRadius: '0.5rem', marginBottom: '1.5rem'}}>
                {error}
              </div>
            )}
            
            <form onSubmit={handleSubmit}>
              <div style={{display: 'grid', gridTemplateColumns: '1fr', gap: '1.5rem', marginBottom: '1.5rem'}}>
                <div style={{display: 'grid', gridTemplateColumns: '1fr', gap: '1.5rem', '@media (min-width: 768px)': {gridTemplateColumns: '1fr 1fr'}}}>
                  <div>
                    <label style={{display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem'}}>
                      Idiom in Kashmiri <span style={{color: '#dc2626'}}>*</span>
                    </label>
                    <input
                      type="text"
                      name="idiom_kashmiri"
                      value={formData.idiom_kashmiri}
                      onChange={handleInputChange}
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
                  
                  <div>
                    <label style={{display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem'}}>
                      Transliteration <span style={{color: '#dc2626'}}>*</span>
                    </label>
                    <input
                      type="text"
                      name="transliteration"
                      value={formData.transliteration}
                      onChange={handleInputChange}
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
                  
                  <div>
                    <label style={{display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem'}}>
                      English Translation <span style={{color: '#dc2626'}}>*</span>
                    </label>
                    <input
                      type="text"
                      name="translation"
                      value={formData.translation}
                      onChange={handleInputChange}
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
                  
                  
                </div>
                
                <div>
                  <label style={{display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem'}}>
                    Meaning <span style={{color: '#dc2626'}}>*</span>
                  </label>
                  <textarea
                    name="meaning"
                    rows="4"
                    value={formData.meaning}
                    onChange={handleInputChange}
                    style={{
                      width: '100%', 
                      padding: '0.75rem', 
                      border: '1px solid #d1d5db', 
                      borderRadius: '0.375rem', 
                      backgroundColor: 'white', 
                      color: '#111827',
                      resize: 'vertical'
                    }}
                    placeholder="Explain what this idiom means and when it is used"
                    required
                  ></textarea>
                </div>
                
                <div>
                  <label style={{display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem'}}>
                    Tags
                  </label>
                  <div style={{display: 'flex', marginBottom: '0.5rem'}}>
                    <input
                      type="text"
                      value={tagInput}
                      onChange={handleTagInputChange}
                      style={{
                        flex: '1',
                        padding: '0.75rem', 
                        border: '1px solid #d1d5db', 
                        borderRadius: '0.375rem 0 0 0.375rem', 
                        backgroundColor: 'white', 
                        color: '#111827'
                      }}
                      placeholder="Add a tag (e.g., proverb, advice, warning)"
                    />
                    <button
                      type="button"
                      onClick={addTag}
                      style={{
                        backgroundColor: '#2563eb',
                        color: 'white',
                        padding: '0.75rem 1rem',
                        borderRadius: '0 0.375rem 0.375rem 0',
                        border: 'none',
                        cursor: 'pointer'
                      }}
                    >
                      Add
                    </button>
                  </div>
                  
                  <div style={{display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1rem'}}>
                    {formData.tags.map((tag, index) => (
                      <div key={index} style={{
                        backgroundColor: '#dbeafe',
                        color: '#1e40af',
                        padding: '0.25rem 0.75rem',
                        borderRadius: '9999px',
                        display: 'flex',
                        alignItems: 'center'
                      }}>
                        <span>{tag}</span>
                        <button
                          type="button"
                          onClick={() => removeTag(tag)}
                          style={{
                            marginLeft: '0.5rem',
                            color: '#3b82f6',
                            backgroundColor: 'transparent',
                            border: 'none',
                            cursor: 'pointer',
                            fontSize: '1.25rem',
                            lineHeight: '1',
                            padding: '0'
                          }}
                        >
                          &times;
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <label style={{display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem'}}>
                    Your Name
                  </label>
                  <input
                    type="text"
                    name="submitter_name"
                    value={formData.submitter_name}
                    onChange={handleInputChange}
                    style={{
                      width: '100%', 
                      padding: '0.75rem', 
                      border: '1px solid #d1d5db', 
                      borderRadius: '0.375rem', 
                      backgroundColor: 'white', 
                      color: '#111827'
                    }}
                  />
                </div>

                <div>
                  <label style={{display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem'}}>
                    Your Email <span style={{color: '#dc2626'}}>*</span>
                  </label>
                  <input
                    type="email"
                    name="submitter_email"
                    value={formData.submitter_email}
                    onChange={handleInputChange}
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
                
                <div>
                  <label style={{display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem'}}>
                    Additional Notes
                  </label>
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleInputChange}
                    rows="3"
                    style={{
                      width: '100%', 
                      padding: '0.75rem', 
                      border: '1px solid #d1d5db', 
                      borderRadius: '0.375rem', 
                      backgroundColor: 'white', 
                      color: '#111827',
                      resize: 'vertical'
                    }}
                    placeholder="Any additional context or information about this idiom"
                  ></textarea>
                </div>
              </div>
              
              <div>
                <button
                  type="submit"
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    backgroundColor: '#2563eb',
                    color: 'white',
                    borderRadius: '0.375rem',
                    border: 'none',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    opacity: loading ? 0.7 : 1,
                    transition: 'all 0.2s ease'
                  }}
                  disabled={loading}
                >
                  {loading ? 'Submitting...' : 'Submit Suggestion'}
                </button>
              </div>
            </form>
          </div>
        )}
      </main>
      
      <footer style={{backgroundColor: '#1f2937', color: 'white', padding: '1.5rem 0', marginTop: '3rem'}}>
        <div style={{maxWidth: '1200px', margin: '0 auto', padding: '0 1rem', textAlign: 'center'}}>
          <p> 2023 Kashmiri Idioms Project</p>
          <p style={{fontSize: '0.875rem', marginTop: '0.5rem', color: '#9ca3af'}}>Made by @helpsulaiman</p>
        </div>
      </footer>
    </div>
  )
}
