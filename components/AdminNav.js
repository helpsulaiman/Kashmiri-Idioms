import React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'


export default function AdminNav() {
  const router = useRouter()

  
  return (
    <div style={{backgroundColor: '#f3f4f6', marginBottom: '2rem', borderRadius: '0.5rem', boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)'}}>
      <div style={{maxWidth: '1200px', margin: '0 auto', padding: '0.5rem 1rem'}}>
        <nav>
          <ul style={{display: 'flex', gap: '1rem', alignItems: 'center', listStyle: 'none', padding: 0, margin: 0}}>
            <li>
              <Link 
                href="/dashboard/manage/idioms" 
                style={{
                  padding: '0.5rem 1rem', 
                  borderRadius: '0.375rem', 
                  display: 'inline-block',
                  transition: 'all 0.2s ease',
                  backgroundColor: router.pathname === '/dashboard/manage/idioms' ? '#2563eb' : 'transparent',
                  color: router.pathname === '/dashboard/manage/idioms' ? 'white' : '#374151'
                }}
              >
                Manage Idioms
              </Link>
            </li>
            <li>
              <Link 
                href="/dashboard/manage/suggestions" 
                style={{
                  padding: '0.5rem 1rem', 
                  borderRadius: '0.375rem', 
                  display: 'inline-block',
                  transition: 'all 0.2s ease',
                  backgroundColor: router.pathname === '/dashboard/manage/suggestions' ? '#2563eb' : 'transparent',
                  color: router.pathname === '/dashboard/manage/suggestions' ? 'white' : '#374151'
                }}
              >
                Review Suggestions
              </Link>
            </li>
            <li style={{marginLeft: 'auto'}}>
              <button 
                onClick={() => {
                  localStorage.removeItem('admin-auth')
                  router.push('/dashboard')
                }}
                style={{
                  padding: '0.5rem 1rem', 
                  borderRadius: '0.375rem', 
                  display: 'inline-block',
                  transition: 'all 0.2s ease',
                  backgroundColor: 'transparent',
                  color: '#dc2626',
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                Logout
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  )
}
