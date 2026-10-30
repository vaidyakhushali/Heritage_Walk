import { useState, useEffect, useCallback } from 'react'
import { useLocation } from 'react-router-dom'
import './ScrollProgressButton.css'

export default function ScrollProgressButton() {
  const [scrollProgress, setScrollProgress] = useState(0)
  const location = useLocation()

  // Dynamic radius & circumference:
  // SVG size: 52x52, center: (26, 26), radius: 23, stroke: 3
  const radius = 23
  const circumference = 2 * Math.PI * radius // ≈ 144.513

  const updateScrollProgress = useCallback(() => {
    const doc = document.documentElement
    const body = document.body
    const scrollTop = window.pageYOffset || doc.scrollTop || body.scrollTop || 0
    const scrollHeight = Math.max(
      doc.scrollHeight,
      body.scrollHeight,
      doc.offsetHeight,
      body.offsetHeight
    ) - window.innerHeight

    if (scrollHeight <= 0) {
      setScrollProgress(0)
      return
    }

    const currentProgress = Math.min(100, Math.max(0, (scrollTop / scrollHeight) * 100))
    setScrollProgress(currentProgress)
  }, [])

  useEffect(() => {
    let ticking = false

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          updateScrollProgress()
          ticking = false
        })
        ticking = true
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('resize', handleScroll, { passive: true })

    // Calculate on mount and route change
    handleScroll()
    const timer = setTimeout(handleScroll, 100)

    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', handleScroll)
      clearTimeout(timer)
    }
  }, [updateScrollProgress, location.pathname])

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }

  // Calculate dash offset: 0% -> full circumference (hidden), 100% -> 0 (fully visible)
  const strokeDashoffset = circumference - (scrollProgress / 100) * circumference

  return (
    <button
      type="button"
      className="scroll-progress-btn"
      onClick={scrollToTop}
      aria-label="Scroll back to top"
      title="Back to top"
    >
      <svg
        className="scroll-progress-svg"
        width="52"
        height="52"
        viewBox="0 0 52 52"
        aria-hidden="true"
      >
        {/* Background track circle */}
        <circle
          className="scroll-progress-track"
          cx="26"
          cy="26"
          r={radius}
          fill="none"
          strokeWidth="3"
        />
        {/* Dynamic active coral/pink stroke */}
        <circle
          className="scroll-progress-indicator"
          cx="26"
          cy="26"
          r={radius}
          fill="none"
          strokeWidth="3"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          transform="rotate(-90 26 26)"
        />
      </svg>

      <span className="scroll-progress-icon-wrap" aria-hidden="true">
        <svg
          className="scroll-progress-arrow"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.3"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="12" y1="19" x2="12" y2="5" />
          <polyline points="6 11 12 5 18 11" />
        </svg>
      </span>
    </button>
  )
}
