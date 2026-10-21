import { useState, useEffect } from 'react'
import { IconStepwell } from './Icons'
import './InitialLoader.css'

function InitialLoader() {
  const [mounted, setMounted] = useState(() => {
    // Only play full exhibition opening on initial session visit
    if (typeof window !== 'undefined') {
      if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        return false
      }
      return !sessionStorage.getItem('hw_welcomed')
    }
    return false
  })
  const [closing, setClosing] = useState(false)

  useEffect(() => {
    if (!mounted) return

    // Trigger curtain exit after sequence finishes (~1100ms)
    const exitTimer = setTimeout(() => {
      setClosing(true)
    }, 1150)

    // Unmount completely from DOM after fade-out transition (~1600ms)
    const cleanupTimer = setTimeout(() => {
      setMounted(false)
      try {
        sessionStorage.setItem('hw_welcomed', 'true')
      } catch {}
    }, 1650)

    return () => {
      clearTimeout(exitTimer)
      clearTimeout(cleanupTimer)
    }
  }, [mounted])

  if (!mounted) return null

  return (
    <div className={`initial-opening-curtain ${closing ? 'closing' : ''}`} aria-hidden="true">
      <div className="opening-centerpiece">
        <div className="opening-logo-circle">
          <IconStepwell size={38} color="#F7DDA7" />
        </div>

        <h1 className="opening-brand-name">HeritageWalk</h1>
        <p className="opening-tagline">Living Archives of Indian Architecture</p>

        <div className="opening-ornament-line">
          <span className="line-diamond"></span>
        </div>
      </div>
    </div>
  )
}

export default InitialLoader

