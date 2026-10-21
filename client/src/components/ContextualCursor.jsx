import { useEffect, useState } from 'react'

export default function ContextualCursor() {
  const [position, setPosition] = useState({ x: -100, y: -100 })
  const [label, setLabel] = useState('')
  const [expanded, setExpanded] = useState(false)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    // Only enable on desktop pointer devices
    if (typeof window === 'undefined') return
    const isTouch = window.matchMedia('(hover: none) or (pointer: coarse)').matches
    if (isTouch) return

    const handleMouseMove = (e) => {
      setPosition({ x: e.clientX, y: e.clientY })
      if (!visible) setVisible(true)

      // Find closest interactive element with context cue
      const target = e.target.closest('[data-cursor], .site-card, .btn, .showcase-img-wrap, .gallery-item, .heritage-custom-pin, a, button')
      if (!target) {
        setLabel('')
        setExpanded(false)
        return
      }

      if (target.dataset?.cursor) {
        setLabel(target.dataset.cursor)
        setExpanded(true)
      } else if (target.closest('.site-card')) {
        setLabel('EXPLORE')
        setExpanded(true)
      } else if (target.closest('.gallery-item') || target.closest('.showcase-img-wrap')) {
        setLabel('VIEW')
        setExpanded(true)
      } else if (target.closest('.heritage-custom-pin')) {
        setLabel('SITE')
        setExpanded(true)
      } else if (target.tagName === 'BUTTON' || target.closest('.btn')) {
        setLabel('')
        setExpanded(false)
      } else {
        setLabel('')
        setExpanded(false)
      }
    }

    const handleMouseLeave = () => setVisible(false)
    const handleMouseEnter = () => setVisible(true)

    window.addEventListener('mousemove', handleMouseMove, { passive: true })
    document.addEventListener('mouseleave', handleMouseLeave)
    document.addEventListener('mouseenter', handleMouseEnter)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseleave', handleMouseLeave)
      document.removeEventListener('mouseenter', handleMouseEnter)
    }
  }, [visible])

  if (typeof window !== 'undefined' && window.matchMedia('(hover: none) or (pointer: coarse)').matches) {
    return null
  }

  return (
    <div
      className={`hw-context-cursor ${expanded ? 'is-expanded' : ''} ${!visible ? 'is-hidden' : ''}`}
      style={{
        transform: `translate3d(${position.x}px, ${position.y}px, 0)`
      }}
      aria-hidden="true"
    >
      {label}
    </div>
  )
}

