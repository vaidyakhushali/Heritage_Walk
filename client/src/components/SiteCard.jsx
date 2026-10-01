import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import {
  IconLocation,
  IconHeart,
  IconCamera,
  IconClock,
  IconArrowRight,
  MonumentTypeIcon
} from './Icons'
import './SiteCard.css'

function SiteCard({ site }) {
  const { user, isWishlisted, toggleWishlist } = useAuth()
  const [photoIndex, setPhotoIndex] = useState(0)
  const currentPhoto = site.photos?.[photoIndex]
  const mainPhoto = typeof currentPhoto === 'string' ? currentPhoto : currentPhoto?.url
  const wishlisted = user && site._id ? isWishlisted(site._id) : false

  const handleWishlist = async (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (!user) return
    try {
      await toggleWishlist(site._id)
    } catch {}
  }

  return (
    <Link to={`/site/${site.slug}`} className="site-card">
      <div className="site-card-image">
        {mainPhoto ? (
          <img
            src={mainPhoto}
            alt={site.name}
            loading="lazy"
            onError={() => setPhotoIndex(index => index + 1)}
          />
        ) : null}
        <div className="site-card-placeholder" style={{ display: mainPhoto ? 'none' : 'flex' }}>
          <span className="placeholder-icon">
            <MonumentTypeIcon type={site.type} size={32} color="var(--color-primary-dark)" />
          </span>
          <span className="placeholder-text">{site.type}</span>
        </div>
        <div className="site-card-overlay"></div>
        <span className="site-card-type">
          <MonumentTypeIcon type={site.type} size={13} color="currentColor" style={{ marginRight: '5px' }} />
          {site.type}
        </span>

        {user && (
          <button
            className={`site-card-heart ${wishlisted ? 'hearted' : ''}`}
            onClick={handleWishlist}
            aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
          >
            <IconHeart
              size={18}
              color={wishlisted ? "#e74c3c" : "#ffffff"}
              fill={wishlisted ? "#e74c3c" : "none"}
            />
          </button>
        )}

        {site.photos && site.photos.length > 1 && (
          <span className="site-card-photo-count">
            <IconCamera size={12} color="#ffffff" style={{ marginRight: '4px' }} />
            {site.photos.length}
          </span>
        )}
      </div>

      <div className="site-card-content">
        <h3 className="site-card-name">{site.name}</h3>
        <p className="site-card-location">
          <IconLocation size={14} color="var(--color-accent)" style={{ marginRight: '4px', verticalAlign: '-2px' }} />
          {site.location.city}, {site.location.state}
        </p>
        {site.period && (
          <span className="site-card-period">
            <IconClock size={12} color="currentColor" style={{ marginRight: '4px', verticalAlign: '-1px' }} />
            {site.period}
          </span>
        )}
        <p className="site-card-desc">{site.description}</p>
        <span className="site-card-link">
          Explore this site
          <span className="link-arrow">
            <IconArrowRight size={14} color="currentColor" />
          </span>
        </span>
      </div>
    </Link>
  )
}

export default SiteCard
