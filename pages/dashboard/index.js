import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Header from '../../components/Header'

export default function DashboardLogin() {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()

  useEffect(() => {
    // Check if already authenticated
    if (localStorage.getItem('admin-auth') === 'true') {
      router.push('/dashboard/manage/idioms')
    }
  }, [])

  const handleLogin = (e) => {
    e.preventDefault()
    if (password === 'kashmir123') { // Change this to a secure password
      localStorage.setItem('admin-auth', 'true')
      router.push('/dashboard/manage/idioms')
    } else {
      setError('Incorrect password')
    }
  }

  return (
    <div style={{minHeight: '100vh', backgroundColor: '#f3f4f6'}}>
      <Header />
      
      <main style={{maxWidth: '1200px', margin: '0 auto', padding: '2rem 1rem'}}>
        <div style={{maxWidth: '28rem', margin: '0 auto', backgroundColor: 'white', padding: '2rem', borderRadius: '0.5rem', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'}}>
          <div style={{borderBottom: '1px solid #2563eb', paddingBottom: '1rem', marginBottom: '1.5rem', textAlign: 'center'}}>
            <h1 style={{fontSize: '1.5rem', fontWeight: 'bold', color: '#1f2937'}}>Admin Login</h1>
          </div>
          
          {error && (
            <div style={{backgroundColor: '#fee2e2', border: '1px solid #fecaca', color: '#b91c1c', padding: '1rem', borderRadius: '0.375rem', marginBottom: '1.5rem'}}>
              {error}
            </div>
          )}
          
          <form onSubmit={handleLogin} style={{display: 'flex', flexDirection: 'column', gap: '1.5rem'}}>
            <div>
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
                  color: '#1f2937',
                  outline: 'none',
                  transition: 'border-color 0.2s ease-in-out',
                  ':focus': {borderColor: '#2563eb', boxShadow: '0 0 0 2px rgba(37, 99, 235, 0.2)'}
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
                padding: '0.75rem 1rem', 
                borderRadius: '0.375rem', 
                fontWeight: '500',
                border: 'none',
                cursor: 'pointer',
                transition: 'background-color 0.2s ease-in-out',
                ':hover': {backgroundColor: '#1d4ed8'}
              }}
            >
              Login
            </button>
          </form>
        </div>
      </main>
    </div>
  )
}
