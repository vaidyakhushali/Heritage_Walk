import React, { useState, useEffect } from 'react'
import QRCode from 'qrcode'
import { IconHeritage, IconX } from './Icons'
import './MonumentPlaqueModal.css'

function MonumentPlaqueModal({ site, onClose }) {
  const [qrDataUrl, setQrDataUrl] = useState('')
  const currentUrl = typeof window !== 'undefined' ? window.location.href : `https://heritagewalk.in/site/${site.slug}`

  useEffect(() => {
    // Generate high-resolution local vector/data QR code
    QRCode.toDataURL(currentUrl, {
      width: 260,
      margin: 1,
      color: {
        dark: '#5C2E0A',
        light: '#FFFDF9'
      }
    })
      .then(url => setQrDataUrl(url))
      .catch(err => console.error('QR generation error', err))
  }, [currentUrl])

  const handlePrint = () => {
    window.print()
  }

  return (
    <div className="plaque-modal-overlay" onClick={onClose}>
      <div className="plaque-modal-box" onClick={(e) => e.stopPropagation()}>
        <button className="plaque-close-btn" onClick={onClose} aria-label="Close modal">
          <IconX size={20} color="var(--color-primary-dark)" />
        </button>

        <div className="plaque-header">
          <span className="plaque-kicker">Digital Monument Registry</span>
          <h3>On-Site Smart QR Plaque</h3>
          <p>Scan with any smartphone camera to open the live visual archives and audio guide.</p>
        </div>

        {/* The Archival Plaque */}
        <div className="heritage-plaque-canvas" id="heritage-plaque-printable">
          <div className="plaque-border-outer">
            <div className="plaque-border-inner">
              <div className="plaque-emblem-row">
                <IconHeritage size={32} color="#5C2E0A" />
                <span className="plaque-org-name">HERITAGEWALK • NATIONAL ARCHIVES</span>
              </div>

              <h2 className="plaque-monument-name">{site.name}</h2>
              <p className="plaque-location-text">
                📍 {site.location.city}, {site.location.state} • {site.period || 'Historic Monument'}
              </p>

              <div className="plaque-qr-center">
                <div className="plaque-qr-frame">
                  {qrDataUrl ? (
                    <img src={qrDataUrl} alt={`QR Code for ${site.name}`} />
                  ) : (
                    <div className="qr-loading">Generating QR...</div>
                  )}
                </div>
                <div className="plaque-scan-instructions">
                  <strong>SCAN WITH SMARTPHONE CAMERA</strong>
                  <span>Access High-Res Visual Archives, Audio Story Guide & Field Notes</span>
                  <span className="plaque-url-sub">{currentUrl}</span>
                </div>
              </div>

              <div className="plaque-footer-meta">
                <span>Registry ID: HW-{site.slug.toUpperCase().slice(0, 10)}</span>
                <span>Type: {site.type}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="plaque-actions">
          <button type="button" className="btn btn-primary" onClick={handlePrint}>
            🖨️ Print / Download Plaque
          </button>
          <button type="button" className="btn btn-secondary" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  )
}

export default MonumentPlaqueModal
