import { useState, useEffect, useCallback } from 'react'
import {
  IconCamera,
  IconSearch,
  IconX,
  IconArrowRight
} from './Icons'
import './PhotoGallery.css'

function PhotoGallery({ photos = [] }) {
  const [lightboxIndex, setLightboxIndex] = useState(-1)

  const openLightbox = (index) => setLightboxIndex(index)
  const closeLightbox = () => setLightboxIndex(-1)

  const goNext = useCallback(() => {
    if (lightboxIndex < photos.length - 1) setLightboxIndex(lightboxIndex + 1)
    else setLightboxIndex(0)
  }, [lightboxIndex, photos.length])

  const goPrev = useCallback(() => {
    if (lightboxIndex > 0) setLightboxIndex(lightboxIndex - 1)
    else setLightboxIndex(photos.length - 1)
  }, [lightboxIndex, photos.length])

  useEffect(() => {
    const handleKey = (e) => {
      if (lightboxIndex < 0) return
      if (e.key === 'Escape') closeLightbox()
      if (e.key === 'ArrowRight') goNext()
      if (e.key === 'ArrowLeft') goPrev()
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [lightboxIndex, goNext, goPrev])

  if (!photos || photos.length === 0) {
    return (
      <div className="gallery-empty">
        <span className="gallery-empty-icon">
          <IconCamera size={44} color="var(--color-primary-light)" />
        </span>
        <p>No photos documented yet.</p>
        <p className="gallery-empty-sub">Be the first to contribute photos of this heritage site!</p>
      </div>
    )
  }

  return (
    <div className="gallery">
      <div className="gallery-grid">
        {photos.map((photo, index) => (
          <div
            key={index}
            className="gallery-item"
            onClick={() => openLightbox(index)}
            role="button"
            tabIndex={0}
            aria-label={`View photo: ${photo.caption || 'Heritage site photo'}`}
            onKeyDown={(e) => e.key === 'Enter' && openLightbox(index)}
          >
            <img
              src={photo.url}
              alt={photo.caption || 'Heritage site photo'}
              loading="lazy"
            />
            <div className="gallery-item-overlay">
              <span className="gallery-zoom-icon">
                <IconSearch size={22} color="#ffffff" />
              </span>
            </div>
            {photo.caption && (
              <div className="gallery-item-caption">{photo.caption}</div>
            )}
          </div>
        ))}
      </div>

      {lightboxIndex >= 0 && (
        <div className="lightbox" onClick={closeLightbox}>
          <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
            <button className="lightbox-close" onClick={closeLightbox} aria-label="Close lightbox">
              <IconX size={24} color="#ffffff" />
            </button>

            {photos.length > 1 && (
              <>
                <button className="lightbox-nav lightbox-prev" onClick={goPrev} aria-label="Previous photo">‹</button>
                <button className="lightbox-nav lightbox-next" onClick={goNext} aria-label="Next photo">›</button>
              </>
            )}

            <img
              src={photos[lightboxIndex].url}
              alt={photos[lightboxIndex].caption || 'Heritage site photo'}
            />

            <div className="lightbox-info">
              {photos[lightboxIndex].caption && (
                <p className="lightbox-caption">{photos[lightboxIndex].caption}</p>
              )}
              {photos[lightboxIndex].credit && (
                <p className="lightbox-credit">Documented by: {photos[lightboxIndex].credit}</p>
              )}
              <p className="lightbox-counter">{lightboxIndex + 1} / {photos.length}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default PhotoGallery
