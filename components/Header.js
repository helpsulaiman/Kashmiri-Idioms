import { useState, useEffect } from 'react' // For managing state and effects
import Link from 'next/link' // For navigation links
import { useRouter } from 'next/router' // For getting current page info

export default function Header() {
  const router = useRouter() // Get current page path
  
  // Handle page loading
  const [mounted, setMounted] = useState(false)
  
  // Run once when page loads
  useEffect(() => {
    setMounted(true)
  }, [])

  // Common button styles
  const getButtonStyles = (isActive) => {
    const baseStyles = "px-10 py-7 flex text-lg rounded-lg transition-all duration-300 shadow-sm hover:shadow-md transform hover:scale-105"
    const activeStyles = "bg-white text-blue-600 font-bold"
    const inactiveStyles = "bg-blue-500 text-white hover:bg-blue-400"
    
    return `${baseStyles} ${isActive ? activeStyles : inactiveStyles}`
  }

  // Navigation items configuration
  const navItems = [
    { path: '/', label: 'Home' },
    { path: '/suggest', label: 'Suggest' },
    { path: '/about', label: 'About' },
    { path: '/about-project', label: 'About Project' }
  ]

  // Simple header while page is loading
  if (!mounted) return (
    <header className="app-header bg-gradient-to-r from-blue-600 to-blue-800 text-white p-4 shadow-sm">
      <div className="max-w-3xl mx-auto px-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-white hover:text-blue-200 transition-colors">
          Kashmiri Idioms
        </Link>
      </div>
    </header>
  )

  // Full header after page loads
  return (
    <header className="app-header bg-gradient-to-r from-blue-600 to-blue-800 text-white p-4 shadow-md">
      <div className="max-w-3xl mx-auto px-4 flex justify-between items-center">
        {/* Website title */}
        <Link href="/" className="text-2xl font-bold text-white hover:text-blue-200 transition-colors">
          Kashmiri Idioms
        </Link>
        
        {/* Navigation buttons */}
        <nav className="flex gap-5">
          {navItems.map(item => (
            <button 
              key={item.path}
              onClick={() => router.push(item.path)}
              className={getButtonStyles(router.pathname === item.path)}
            >
              {item.label}
            </button>
          ))}
        </nav>
      </div>
    </header>
  )
}