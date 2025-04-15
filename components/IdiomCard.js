import React, { useState, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'

export default function IdiomCard({ idiom }) {
  const [expanded, setExpanded] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)
  const cardRef = useRef(null)
  const modalRef = useRef(null)
  const [cardBounds, setCardBounds] = useState(null)

  useEffect(() => {
    setMounted(true)
    return () => setMounted(false)
  }, [])

  const handleCardClick = () => {
    if (cardRef.current) {
      const bounds = cardRef.current.getBoundingClientRect()
      setCardBounds(bounds)
      setExpanded(true)
      setIsAnimating(true)
      
      requestAnimationFrame(() => {
        if (modalRef.current) {
          modalRef.current.style.transform = 'translate(-50%, -50%)'
          modalRef.current.style.width = '100%'
          modalRef.current.style.maxWidth = '56rem'
          modalRef.current.style.left = '50%'
          modalRef.current.style.top = '50%'
          modalRef.current.style.opacity = '1'
        }
      })
    }
  }

  const handleClose = () => {
    if (modalRef.current && cardBounds) {
      modalRef.current.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
      modalRef.current.style.transform = 'none';
      modalRef.current.style.width = `${cardBounds.width}px`;
      modalRef.current.style.left = `${cardBounds.left}px`;
      modalRef.current.style.top = `${cardBounds.top}px`;
      modalRef.current.style.opacity = '0';

      const onTransitionEnd = () => {
        modalRef.current.removeEventListener('transitionend', onTransitionEnd);
        setExpanded(false);
        setCardBounds(null);
        setIsAnimating(false);
      };
      
      modalRef.current.addEventListener('transitionend', onTransitionEnd);
    }
  }

  const handleInnerClick = (e) => {
    e.stopPropagation()
  }

  const handleEscape = (e) => {
    if (e.key === 'Escape' && expanded) {
      handleClose()
    }
  }

  useEffect(() => {
    if (mounted) {
      document.addEventListener('keydown', handleEscape)
      return () => document.removeEventListener('keydown', handleEscape)
    }
  }, [expanded, mounted])

  const modalContent = (expanded || isAnimating) && cardBounds && (
    <div 
      style={{
        position: 'fixed',
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        zIndex: 50,
        backgroundColor: expanded ? 'rgba(0, 0, 0, 0.5)' : isAnimating ? 'rgba(0, 0, 0, 0.5)' : 'rgba(0, 0, 0, 0)',
        transition: 'background-color 0.3s ease-out',
        pointerEvents: expanded ? 'auto' : 'none',
        opacity: isAnimating ? (expanded ? 1 : 0) : (expanded ? 1 : 0)
      }}
      onClick={handleClose}
    >
      <div 
        ref={modalRef}
        style={{
          position: 'fixed',
          backgroundColor: 'white',
          borderRadius: '0.5rem',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          overflow: 'hidden',
          width: cardBounds.width,
          height: 'auto',
          left: cardBounds.left,
          top: cardBounds.top,
          opacity: expanded ? 1 : 0,
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          transformOrigin: 'top left',
          zIndex: 51
        }}
        onClick={handleInnerClick}
      >
        <div style={{position: 'relative', width: '100%', height: '100%'}}>
          <button 
            style={{
              position: 'absolute',
              top: '0.5rem',
              right: '0.5rem',
              padding: '0.25rem',
              borderRadius: '9999px',
              zIndex: 10,
              color: '#6b7280',
              backgroundColor: '#f3f4f6',
              transition: 'all 0.2s ease',
              border: 'none',
              cursor: 'pointer'
            }}
            onClick={handleClose}
            aria-label="Close"
          >
            <svg style={{width: '1rem', height: '1rem'}} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          
          <div style={{display: 'flex', height: '100%'}}>
            {/* Left side - Idiom details */}
            <div style={{flex: 1, padding: '1.5rem', borderRight: '1px solid #f3f4f6'}}>
              <h2 style={{
                fontSize: '1.5rem', 
                fontWeight: 'bold', 
                marginBottom: '1rem', 
                color: '#1f2937'
              }}>
                {idiom.idiom_kashmiri}
              </h2>
              
              <p style={{
                color: '#4b5563', 
                marginBottom: '1rem', 
                fontStyle: 'italic'
              }}>
                {idiom.transliteration}
              </p>
              
              <p style={{
                color: '#1f2937', 
                fontWeight: '500', 
                marginBottom: '1.5rem'
              }}>
                {idiom.translation}
              </p>
              
              {idiom.tags && idiom.tags.length > 0 && (
                <div style={{display: 'flex', flexWrap: 'wrap', gap: '0.5rem'}}>
                  {idiom.tags.map((tag) => (
                    <span 
                      key={tag} 
                      style={{
                        backgroundColor: '#dbeafe',
                        color: '#1e40af',
                        fontSize: '0.75rem',
                        padding: '0.25rem 0.5rem',
                        borderRadius: '9999px'
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
            
            {/* Right side - Meaning and audio */}
            <div style={{
              flex: 1, 
              padding: '1.5rem',
              backgroundColor: '#f9fafb'
            }}>
              <div style={{marginBottom: '1.5rem'}}>
                <h3 style={{
                  fontSize: '0.875rem', 
                  textTransform: 'uppercase', 
                  color: '#6b7280', 
                  letterSpacing: '0.05em', 
                  marginBottom: '0.75rem'
                }}>
                  Meaning
                </h3>
                <p style={{color: '#4b5563', lineHeight: '1.625'}}>
                  {idiom.meaning}
                </p>
              </div>
              
              {idiom.audio_url && (
                <div>
                  <h3 style={{
                    fontSize: '0.875rem', 
                    textTransform: 'uppercase', 
                    color: '#6b7280', 
                    letterSpacing: '0.05em', 
                    marginBottom: '0.75rem'
                  }}>
                    Pronunciation
                  </h3>
                  <audio 
                    controls 
                    style={{
                      width: '100%',
                      height: '36px',
                      borderRadius: '8px',
                      outline: 'none'
                    }}
                  >
                    <source src={idiom.audio_url} type="audio/mpeg" />
                  </audio>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <>
      <div 
        ref={cardRef}
        style={{
          backgroundColor: 'white',
          borderRadius: '0.5rem',
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
          padding: '1rem',
          cursor: 'pointer',
          transition: 'all 0.3s ease',
          opacity: expanded || isAnimating ? 0 : 1,
          height: '180px',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between'
        }}
        onClick={handleCardClick}
      >
        <div>
          <h2 style={{
            fontSize: '1.1rem', 
            fontWeight: 'bold', 
            marginBottom: '0.4rem', 
            color: '#1f2937',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden'
          }}>
            {idiom.idiom_kashmiri}
          </h2>
          
          <p style={{
            color: '#4b5563', 
            marginBottom: '0.4rem', 
            fontStyle: 'italic',
            fontSize: '0.9rem',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden'
          }}>
            {idiom.transliteration}
          </p>
          
          <p style={{
            color: '#1f2937', 
            fontWeight: '500', 
            marginBottom: '0.5rem',
            fontSize: '0.9rem',
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden'
          }}>
            {idiom.translation}
          </p>
        </div>
        
        {idiom.tags && idiom.tags.length > 0 && (
          <div style={{display: 'flex', flexWrap: 'wrap', gap: '0.3rem'}}>
            {idiom.tags.map((tag) => (
              <span 
                key={tag} 
                style={{
                  backgroundColor: '#dbeafe',
                  color: '#1e40af',
                  fontSize: '0.7rem',
                  padding: '0.2rem 0.4rem',
                  borderRadius: '9999px'
                }}
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {mounted && modalContent && createPortal(modalContent, document.body)}
    </>
  )
}
