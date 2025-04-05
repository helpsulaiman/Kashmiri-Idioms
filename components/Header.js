import React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'

export default function Header() {
  const router = useRouter()
  
  // Only render navigation after component mounts (client-side)
  const [mounted, setMounted] = React.useState(false)
  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return (
    <header style={{backgroundColor: '#2563eb', color: 'white', padding: '1rem 0', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'}}>
      <div style={{maxWidth: '1200px', margin: '0 auto', padding: '0 1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
        <Link href="/" legacyBehavior>
          <a style={{fontSize: '1.5rem', fontWeight: 'bold', color: 'white', textDecoration: 'none'}}>
            Kashmiri Idioms
          </a>
        </Link>
      </div>
    </header>
  )

  return (
    <header style={{backgroundColor: '#2563eb', color: 'white', padding: '1rem 0', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'}}>
      <div style={{maxWidth: '1200px', margin: '0 auto', padding: '0 1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
        <Link href="/" legacyBehavior>
          <a style={{fontSize: '1.5rem', fontWeight: 'bold', color: 'white', textDecoration: 'none'}}>
            Kashmiri Idioms
          </a>
        </Link>
        
        <nav>
          <ul style={{display: 'flex', gap: '1rem', listStyle: 'none', margin: 0, padding: 0}}>
            <li>
              <Link href="/" legacyBehavior>
                <a style={{
                  padding: '0.5rem 1rem', 
                  borderRadius: '0.375rem', 
                  backgroundColor: router.pathname === '/' ? 'white' : 'rgba(255, 255, 255, 0.2)',
                  color: router.pathname === '/' ? '#2563eb' : 'white',
                  fontWeight: router.pathname === '/' ? 'bold' : 'normal',
                  textDecoration: 'none',
                  transition: 'background-color 0.2s'
                }}>
                  Home
                </a>
              </Link>
            </li>
            <li>
              <Link href="/suggest" legacyBehavior>
                <a style={{
                  padding: '0.5rem 1rem', 
                  borderRadius: '0.375rem', 
                  backgroundColor: router.pathname === '/suggest' ? 'white' : 'rgba(255, 255, 255, 0.2)',
                  color: router.pathname === '/suggest' ? '#2563eb' : 'white',
                  fontWeight: router.pathname === '/suggest' ? 'bold' : 'normal',
                  textDecoration: 'none',
                  transition: 'background-color 0.2s'
                }}>
                  Suggest
                </a>
              </Link>
            </li>
            <li>
              <Link href="/about" legacyBehavior>
                <a style={{
                  padding: '0.5rem 1rem', 
                  borderRadius: '0.375rem', 
                  backgroundColor: router.pathname === '/about' ? 'white' : 'rgba(255, 255, 255, 0.2)',
                  color: router.pathname === '/about' ? '#2563eb' : 'white',
                  fontWeight: router.pathname === '/about' ? 'bold' : 'normal',
                  textDecoration: 'none',
                  transition: 'background-color 0.2s'
                }}>
                  About
                </a>
              </Link>
            </li>
            <li>
              <Link href="/about-project" legacyBehavior>
                <a style={{
                  padding: '0.5rem 1rem', 
                  borderRadius: '0.375rem', 
                  backgroundColor: router.pathname === '/about-project' ? 'white' : 'rgba(255, 255, 255, 0.2)',
                  color: router.pathname === '/about-project' ? '#2563eb' : 'white',
                  fontWeight: router.pathname === '/about-project' ? 'bold' : 'normal',
                  textDecoration: 'none',
                  transition: 'background-color 0.2s'
                }}>
                  About Project
                </a>
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  )
}
