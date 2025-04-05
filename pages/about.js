import React from 'react'
import Header from '../components/Header'

export default function AboutPage() {
  return (
    <div style={{minHeight: '100vh', backgroundColor: '#f3f4f6'}}>
      <Header />
      
      <main style={{maxWidth: '1200px', margin: '0 auto', padding: '2rem 1rem'}}>
        <div style={{maxWidth: '56rem', margin: '0 auto', textAlign: 'center', marginBottom: '3rem'}}>
          <h1 style={{fontSize: '2.25rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.025em'}}>About Us</h1>
          <p style={{color: '#4b5563', fontSize: '1.125rem', maxWidth: '42rem', margin: '0 auto'}}>
            Learn more about the team behind the Kashmiri Idioms Project
          </p>
        </div>
        
        <div style={{backgroundColor: 'white', padding: '2rem', borderRadius: '0.5rem', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)', maxWidth: '48rem', margin: '0 auto'}}>
          <div style={{borderBottom: '1px solid #2563eb', paddingBottom: '1rem', marginBottom: '1.5rem'}}>
            <h2 style={{fontSize: '1.5rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '0.5rem'}}>DYD'S SPIRIT</h2>
          </div>
          
          <div style={{marginBottom: '3rem'}}>
            <h3 style={{fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem', color: '#374151'}}>Our Team Members</h3>
            <ul style={{listStyleType: 'disc', paddingLeft: '1.5rem', color: '#4b5563', display: 'grid', gridTemplateColumns: '1fr', gap: '0.5rem', '@media (min-width: 640px)': {gridTemplateColumns: 'repeat(2, 1fr)'}}}>
              <li>Sulaiman Shabir</li>
              <li>Tehniyah Rayaz</li>
              <li>Anha Nabi</li>
              <li>Farees Ahmed</li>
              <li>Furqan Malik</li>
            </ul>
          </div>
          
          <div style={{marginBottom: '3rem'}}>
            <h3 style={{fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem', color: '#374151'}}>Contact Us</h3>
            <p style={{color: '#4b5563'}}>
              Email: <a href="mailto:dydsspirit@gmail.com" style={{color: '#2563eb', textDecoration: 'none', ':hover': {textDecoration: 'underline'}}}>dydsspirit@gmail.com</a>
            </p>
          </div>

          <div style={{marginBottom: '2rem'}}>
            <h3 style={{fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.5rem', color: '#374151'}}>Address</h3>
            <p style={{color: '#4b5563'}}>
              Institute of Technology, Zakura Campus<br />
              Hazratbal, Srinagar, 190005 - J&K
            </p>
          </div>
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
