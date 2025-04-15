import '../styles/globals.css'
import { useEffect, useState } from 'react'

function MyApp({ Component, pageProps }) {
  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    // Add dark mode support
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)')
    const currentTheme = localStorage.getItem('theme')

    if (currentTheme) {
      setIsDark(currentTheme === 'dark')
    } else {
      setIsDark(prefersDarkScheme.matches)
    }

    // Listen for system theme changes
    const handleThemeChange = (e) => {
      setIsDark(e.matches)
      localStorage.setItem('theme', e.matches ? 'dark' : 'light')
    }

    prefersDarkScheme.addEventListener('change', handleThemeChange)

    return () => {
      prefersDarkScheme.removeEventListener('change', handleThemeChange)
    }
  }, [])

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [isDark])

  return (
    <Component {...pageProps} />
  )
}

export default MyApp
