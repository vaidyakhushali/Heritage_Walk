import { useState, useEffect, useRef } from 'react'
import { IconSparkles } from './Icons'
import './AudioTourPlayer.css'

function AudioTourPlayer({ site }) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [rate, setRate] = useState(1.0)
  const [hasSpeechSupport, setHasSpeechSupport] = useState(true)
  const utteranceRef = useRef(null)

  useEffect(() => {
    if (!('speechSynthesis' in window)) {
      setHasSpeechSupport(false)
    }

    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel()
      }
    }
  }, [])

  // Prepare full narration script
  const narrationScript = `Welcome to the audio tour of ${site.name}, located in ${site.location.city}, ${site.location.state}. Built during ${site.period || 'ancient times'}, this ${site.type} is an exceptional architectural treasure. ${site.description} ${site.significance ? `Historically, ${site.significance}` : ''} Thank you for exploring India's living heritage with HeritageWalk.`

  const startNarration = () => {
    if (!('speechSynthesis' in window)) return

    if (isPaused) {
      window.speechSynthesis.resume()
      setIsPaused(false)
      setIsPlaying(true)
      return
    }

    window.speechSynthesis.cancel()

    const utterance = new SpeechSynthesisUtterance(narrationScript)
    utterance.rate = rate
    utterance.pitch = 1.0

    // Try finding an English or Indian-English voice
    const voices = window.speechSynthesis.getVoices()
    const preferredVoice = voices.find(v => v.lang === 'en-IN' || v.name.includes('India')) || voices.find(v => v.lang.startsWith('en'))
    if (preferredVoice) utterance.voice = preferredVoice

    utterance.onstart = () => {
      setIsPlaying(true)
      setIsPaused(false)
    }

    utterance.onend = () => {
      setIsPlaying(false)
      setIsPaused(false)
    }

    utterance.onerror = () => {
      setIsPlaying(false)
      setIsPaused(false)
    }

    utteranceRef.current = utterance
    window.speechSynthesis.speak(utterance)
  }

  const pauseNarration = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.pause()
      setIsPlaying(false)
      setIsPaused(true)
    }
  }

  const stopNarration = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel()
      setIsPlaying(false)
      setIsPaused(false)
    }
  }

  const handleRateChange = (newRate) => {
    setRate(newRate)
    if (isPlaying) {
      stopNarration()
      setTimeout(startNarration, 100)
    }
  }

  if (!hasSpeechSupport) return null

  return (
    <div className="audio-tour-player">
      <div className="audio-tour-header">
        <div className="audio-tour-title-wrap">
          <span className="audio-tour-badge">
            <IconSparkles size={14} color="#C17817" />
            Interactive Audio Guide
          </span>
          <h3>Audio Story & Architectural Walkthrough</h3>
        </div>

        {isPlaying && (
          <div className="soundwave-container" aria-label="Audio playing">
            <span className="soundwave-bar bar-1"></span>
            <span className="soundwave-bar bar-2"></span>
            <span className="soundwave-bar bar-3"></span>
            <span className="soundwave-bar bar-4"></span>
            <span className="soundwave-bar bar-5"></span>
          </div>
        )}
      </div>

      <p className="audio-tour-sub">
        Listen to the narrated history, architecture, and legends of {site.name} while exploring this page.
      </p>

      <div className="audio-controls-row">
        {!isPlaying ? (
          <button
            type="button"
            className="btn btn-primary audio-play-btn"
            onClick={startNarration}
          >
            ▶️ {isPaused ? 'Resume Audio Tour' : 'Play Audio Guide'}
          </button>
        ) : (
          <button
            type="button"
            className="btn btn-secondary audio-pause-btn"
            onClick={pauseNarration}
          >
            ⏸️ Pause Narration
          </button>
        )}

        {(isPlaying || isPaused) && (
          <button
            type="button"
            className="btn btn-outline audio-stop-btn"
            onClick={stopNarration}
          >
              ⏹️ Stop
          </button>
        )}

        <div className="audio-speed-selector">
          <span className="speed-label">Speed:</span>
          {[0.8, 1.0, 1.25].map((s) => (
            <button
              key={s}
              type="button"
              className={`speed-pill ${rate === s ? 'active' : ''}`}
              onClick={() => handleRateChange(s)}
            >
              {s}x
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

export default AudioTourPlayer
