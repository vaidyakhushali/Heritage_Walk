import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import './Toast.css'

function Toast({ message, type = 'success', link, actionLabel, onClick, onClose, duration = 5000 }) {
  const navigate = useNavigate()

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(onClose, duration)
      return () => clearTimeout(timer)
    }
  }, [onClose, duration])

  const icons = {
    success: '✅',
    error: '❌',
    info: 'ℹ️',
    warning: '⚠️'
  }

  const handleClick = (e) => {
    // If the close button was clicked, don't trigger the main toast action
    if (e.target.closest('.toast-close')) return

    if (onClick) {
      onClick()
      onClose()
    } else if (link) {
      navigate(link)
      onClose()
    }
  }

  const isClickable = Boolean(link || onClick)

  return (
    <div
      className={`toast toast-${type} ${isClickable ? 'toast-clickable' : ''}`}
      onClick={handleClick}
      role={isClickable ? 'button' : 'alert'}
      tabIndex={isClickable ? 0 : undefined}
      title={isClickable ? (actionLabel ? `Click to ${actionLabel}` : 'Click to open') : undefined}
    >
      <span className="toast-icon">{icons[type] || '🔔'}</span>
      <div className="toast-content">
        <span className="toast-message">{message}</span>
        {actionLabel && (
          <span className="toast-action-hint">
            {actionLabel} <span className="toast-arrow">→</span>
          </span>
        )}
      </div>
      <button
        className="toast-close"
        onClick={(e) => {
          e.stopPropagation()
          onClose()
        }}
        aria-label="Close notification"
      >
        ×
      </button>
    </div>
  )
}

export default Toast
