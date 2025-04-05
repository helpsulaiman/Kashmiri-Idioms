import React from 'react'
import Header from '../components/Header'

export default function AboutProject() {
  return (
    <div style={{minHeight: '100vh', backgroundColor: '#f3f4f6'}}>
      <Header />
      
      <main style={{maxWidth: '1200px', margin: '0 auto', padding: '2rem 1rem'}}>
        <div style={{maxWidth: '56rem', margin: '0 auto', textAlign: 'center', marginBottom: '3rem'}}>
          <h1 style={{fontSize: '2.25rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.025em'}}>About The Project</h1>
        </div>
        
        <div style={{backgroundColor: 'white', padding: '2rem', borderRadius: '0.5rem', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)', maxWidth: '48rem', margin: '0 auto'}}>
          <div style={{borderBottom: '1px solid #2563eb', paddingBottom: '1rem', marginBottom: '1.5rem'}}>
            <h2 style={{fontSize: '1.5rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '0.5rem'}}>Project Vision</h2>
          </div>
          
          <div style={{marginBottom: '2rem'}}>
            <p style={{color: '#4b5563', lineHeight: '1.625', marginBottom: '1rem'}}>
              The Kashmiri Idioms Project aims to preserve the rich cultural heritage of Kashmir by documenting and sharing traditional idioms and expressions.
            </p>
            <p style={{color: '#4b5563', lineHeight: '1.625', marginBottom: '1rem'}}>
              Our goal is to create a comprehensive resource for future generations to learn and appreciate the linguistic diversity of Kashmir.
            </p>
          </div>
          
          <div style={{borderTop: '1px solid #e5e7eb', paddingTop: '1.5rem'}}>
            <h3 style={{fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem', color: '#374151'}}>How to Contribute</h3>
            <p style={{color: '#4b5563', lineHeight: '1.625'}}>
              You can submit new idioms through our suggestions page. All submissions will be reviewed by our team before being added to the collection.
            </p>
          </div>
        </div>
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
