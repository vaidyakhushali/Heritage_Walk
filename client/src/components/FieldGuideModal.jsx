import React from 'react'
import {
  IconHeritage,
  IconLocation,
  IconClock,
  IconCamera,
  IconScroll,
  IconX,
  MonumentTypeIcon
} from './Icons'
import './FieldGuideModal.css'

function FieldGuideModal({ site, onClose }) {
  const practical = site.practicalInfo || {
    timings: "8:00 AM – 6:00 PM (Daily)",
    entryFee: "Standard ASI Heritage Entry",
    bestTimeToVisit: "October to March (Morning hours)",
    photographyTips: "Early morning sunlight captures intricate stonework without heavy shadows."
  }

  const mainPhoto = site.photos?.[0]?.url || 'https://images.unsplash.com/photo-1590766940554-634ee7ef6981?auto=format&fit=crop&w=1200&q=80'
  const coords = site.location?.coordinates || { lat: 23.5, lng: 72.5 }

  const handlePrint = () => {
    window.print()
  }

  return (
    <div className="field-guide-overlay" onClick={onClose}>
      <div className="field-guide-container" onClick={(e) => e.stopPropagation()}>
        {/* Modal Toolbar (hidden when printing) */}
        <div className="field-guide-toolbar no-print">
          <div className="toolbar-info">
            <span className="toolbar-badge">Official Preservation Dossier</span>
            <h3>{site.name} • Travel Field Guide</h3>
          </div>
          <div className="toolbar-actions">
            <button type="button" className="btn btn-primary btn-sm" onClick={handlePrint}>
              <IconHeritage size={16} color="currentColor" /> Print / Save as PDF
            </button>
            <button type="button" className="btn btn-secondary btn-sm" onClick={onClose} aria-label="Close guide">
              <IconX size={16} color="currentColor" /> Close
            </button>
          </div>
        </div>

        {/* Printable Field Guide Document Content */}
        <div className="field-guide-document">
          {/* Header Banner */}
          <header className="guide-doc-header">
            <div className="guide-header-top">
              <div className="guide-logo-wrap">
                <IconHeritage size={28} color="#5C2E0A" />
                <div>
                  <span className="guide-org-title">HERITAGEWALK NATIONAL ARCHIVES</span>
                  <span className="guide-org-sub">India Architectural Documentation Initiative</span>
                </div>
              </div>
              <div className="guide-doc-meta">
                <span className="guide-doc-id">DOC-ID: HW-{site.slug.toUpperCase().slice(0, 10)}</span>
                <span className="guide-doc-date">Generated: {new Date().toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
              </div>
            </div>

            <div className="guide-title-section">
              <span className="guide-type-pill">
                <MonumentTypeIcon type={site.type} size={14} color="currentColor" />
                {site.type}
              </span>
              <h1 className="guide-monument-title">{site.name}</h1>
              <p className="guide-loc-bar">
                <IconLocation size={14} color="currentColor" /> {site.location.city}, {site.location.state}
                {site.location.address && ` • ${site.location.address}`}
                <span className="guide-coords"> (GPS: {coords.lat.toFixed(4)}°N, {coords.lng.toFixed(4)}°E)</span>
              </p>
            </div>
          </header>

          {/* Photo & Fast Facts Grid */}
          <div className="guide-visual-facts-grid">
            <div className="guide-photo-frame">
              <img src={mainPhoto} alt={site.name} />
              <span className="guide-photo-caption">{site.photos?.[0]?.caption || site.name}</span>
            </div>

            <div className="guide-facts-card">
              <h3>Field Summary</h3>
              <div className="guide-facts-list">
                <div className="guide-fact-row">
                  <strong>Architectural Category:</strong>
                  <span>{site.type}</span>
                </div>
                {site.period && (
                  <div className="guide-fact-row">
                    <strong>Era / Construction:</strong>
                    <span>{site.period}</span>
                  </div>
                )}
                <div className="guide-fact-row">
                  <strong>Visiting Hours:</strong>
                  <span>{practical.timings}</span>
                </div>
                <div className="guide-fact-row">
                  <strong>Entry Fees:</strong>
                  <span>{practical.entryFee}</span>
                </div>
                <div className="guide-fact-row">
                  <strong>Best Season:</strong>
                  <span>{practical.bestTimeToVisit}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Architectural Overview */}
          <section className="guide-doc-section">
            <h2 className="guide-section-heading">
              <IconHeritage size={18} color="#8B4513" /> Architectural Overview & Structure
            </h2>
            <p className="guide-section-text">{site.description}</p>
          </section>

          {/* Historical Significance */}
          {site.significance && (
            <section className="guide-doc-section">
              <h2 className="guide-section-heading">
                <IconScroll size={18} color="#8B4513" /> Historical & Cultural Significance
              </h2>
              <div className="guide-significance-box">
                <p>{site.significance}</p>
              </div>
            </section>
          )}

          {/* Practical Fieldwork & Photography Advice */}
          <section className="guide-doc-section">
            <h2 className="guide-section-heading">
              <IconCamera size={18} color="#8B4513" /> Practical Field & Photography Notes
            </h2>
            <div className="guide-tips-grid">
              <div className="guide-tip-card">
                <strong><IconCamera size={14} color="currentColor" /> Photography Tips</strong>
                <p>{practical.photographyTips}</p>
              </div>
              <div className="guide-tip-card">
                <strong><IconHeritage size={14} color="currentColor" /> Preservation Etiquette</strong>
                <p>Do not touch or lean on fragile sandstone carvings. Maintain cleanliness on monument grounds and avoid using flash photography near ancient murals.</p>
              </div>
            </div>
          </section>

          {/* Footer */}
          <footer className="guide-doc-footer">
            <div className="guide-footer-left">
              <span>HeritageWalk • Documenting India's Priceless Architecture</span>
              <span>www.heritagewalk.in</span>
            </div>
            <div className="guide-footer-right">
              <span>National Heritage Field Guide • Page 1 of 1</span>
            </div>
          </footer>
        </div>
      </div>
    </div>
  )
}

export default FieldGuideModal
