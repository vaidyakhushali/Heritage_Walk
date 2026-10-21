import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import PhotoGallery from '../components/PhotoGallery'
import TravelTipsSection from '../components/TravelTipsSection'
import Loader from '../components/Loader'
import Toast from '../components/Toast'
import {
  IconHeritage,
  IconLocation,
  IconHeart,
  IconCamera,
  IconClock,
  IconStar,
  IconScroll,
  IconUsers,
  IconGallery,
  IconHome,
  IconSearch,
  IconArrowRight,
  MonumentTypeIcon
} from '../components/Icons'
import { fallbackSites } from '../data/fallbackSites'
import { siteService } from '../services/siteService'
import './SiteDetail.css'

function CountUpNumber({ value = 0 }) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setCount(value)
      return
    }

    let frame
    const duration = 750
    let startTimestamp = null

    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp
      const progress = Math.min((timestamp - startTimestamp) / duration, 1)
      const easeOut = 1 - Math.pow(1 - progress, 3)
      setCount(Math.floor(value * easeOut))

      if (progress < 1) {
        frame = window.requestAnimationFrame(step)
      } else {
        setCount(value)
      }
    }

    frame = window.requestAnimationFrame(step)
    return () => window.cancelAnimationFrame(frame)
  }, [value])

  return <span>{count}</span>
}

function SiteDetail() {
  const { slug } = useParams()
  const { user, isWishlisted, toggleWishlist } = useAuth()

  const [site, setSite] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [toast, setToast] = useState(null)

  // Scroll-triggered reveal for heritage cards
  useEffect(() => {
    if (!site) return
    const waypoints = document.querySelectorAll('.hw-walk-waypoint')
    if (!waypoints.length) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-revealed')
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    )

    waypoints.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [site])

  useEffect(() => {
    window.scrollTo(0, 0)
    siteService.getSiteBySlug(slug)
      .then(data => {
        if (data && data.name) {
          setSite(data)
        } else {
          findFallback(slug)
        }
        setLoading(false)
      })
      .catch(() => {
        findFallback(slug)
      })
  }, [slug])

  const findFallback = (targetSlug) => {
    const found = fallbackSites.find(
      s => s.slug === targetSlug || s.name.toLowerCase().replace(/[^a-z0-9]/g, '-') === targetSlug
    )
    if (found) {
      setSite(found)
    } else {
      setError('Heritage site not found')
    }
    setLoading(false)
  }

  const handleWishlistToggle = async () => {
    if (!user) {
      setToast({
        message: 'Please sign in to save this site to your wishlist.',
        type: 'warning',
        link: `/login?redirect=/site/${slug}`,
        actionLabel: 'Sign In'
      })
      return
    }

    try {
      const res = await toggleWishlist(site._id)
      const added = res.wishlisted
      setToast({
        message: added ? `Saved "${site.name}" to your Wishlist!` : `Removed "${site.name}" from your Wishlist.`,
        type: 'success',
        link: '/wishlist',
        actionLabel: 'View Wishlist'
      })
    } catch {
      setToast({ message: 'Could not update wishlist.', type: 'error' })
    }
  }

  const scrollToGallery = () => {
    const galleryEl = document.getElementById('community-gallery-section')
    if (galleryEl) {
      galleryEl.scrollIntoView({ behavior: 'smooth' })
    }
  }

  if (loading) return <Loader size="full" text="Unveiling heritage site archives..." />

  if (error || !site) {
    return (
      <div className="site-not-found-modern">
        <div className="container">
          <div className="not-found-card">
            <span className="not-found-icon-svg">
              <IconHeritage size={48} color="var(--color-primary)" />
            </span>
            <h2>Heritage Site Not Found</h2>
            <p>The monument or treasure you are searching for might have been updated or does not exist in our registry.</p>
            <div className="not-found-actions">
              <Link to="/explore" className="btn btn-primary">Browse All Heritage Sites</Link>
              <Link to="/" className="btn btn-secondary">Return Home</Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const photos = site.photos && site.photos.length > 0 ? site.photos : [
    { url: "https://images.unsplash.com/photo-1590766940554-634ee7ef6981?auto=format&fit=crop&w=1600&q=85", caption: site.name, credit: "HeritageWalk Explorer" }
  ]

  const mainPhoto = photos[0]
  const sidePhotos = photos.slice(1, 3)
  const wishlisted = user && site._id ? isWishlisted(site._id) : false
  const photoCount = Array.isArray(photos) ? photos.length : 0
  const storiesCount = typeof site.contributionCount === 'number' ? site.contributionCount : 0
  const contributorsCount = site.contributorsCount || (storiesCount > 0 ? Math.max(1, Math.ceil(storiesCount * 0.7)) : 0)

  return (
    <div className="site-detail-modern">
      {/* Top Editorial Header & Showcase */}
      <section className="detail-top-section">
        <div className="container">
          {/* Breadcrumbs */}
          <nav className="detail-breadcrumb" aria-label="Breadcrumb">
            <Link to="/" className="breadcrumb-link">
              <IconHome size={15} color="var(--color-primary)" /> Home
            </Link>
            <span className="breadcrumb-sep">/</span>
            <Link to="/explore" className="breadcrumb-link">Explore Sites</Link>
            <span className="breadcrumb-sep">/</span>
            <span className="breadcrumb-current">{site.name}</span>
          </nav>

          {/* Title and Top Actions Header */}
          <div className="detail-header-card">
            <div className="detail-header-left">
              <div className="detail-badge-group">
                <span className="detail-type-badge">
                  <MonumentTypeIcon type={site.type} size={15} color="var(--color-primary)" />
                  {site.type}
                </span>
                {site.period && (
                  <span className="detail-period-badge">
                    <IconClock size={14} color="#8B4513" />
                    {site.period}
                  </span>
                )}
                {site.featured && (
                  <span className="detail-featured-badge">
                    <IconStar size={14} color="#B25900" fill="#B25900" />
                    Featured Monument
                  </span>
                )}
              </div>

              <h1 className="detail-title">{site.name}</h1>
              
              <div className="detail-location-bar">
                <span className="detail-pin-icon-wrap">
                  <IconLocation size={18} color="var(--color-accent)" />
                </span>
                <span className="detail-location-text">
                  <strong>{site.location.city}, {site.location.state}</strong>
                  {site.location.address && <span className="detail-address-sub"> • {site.location.address}</span>}
                </span>
              </div>
            </div>

            <div className="detail-header-actions">
              <button
                type="button"
                className={`btn detail-action-btn ${wishlisted ? 'btn-wishlisted-active' : 'btn-secondary'}`}
                onClick={handleWishlistToggle}
                aria-label="Wishlist toggle"
              >
                <IconHeart
                  size={18}
                  color={wishlisted ? "#ffffff" : "currentColor"}
                  fill={wishlisted ? "#ffffff" : "none"}
                />
                {wishlisted ? 'Saved in Wishlist' : 'Add to Wishlist'}
              </button>

              <Link
                to={`/contribute?site=${site._id || site.slug}`}
                className="btn btn-primary detail-action-btn"
              >
                <IconCamera size={18} color="#ffffff" />
                Document This Site
              </Link>
            </div>
          </div>

          {/* Editorial Photo Showcase Bento Collage */}
          <div className="editorial-photo-bento">
            {/* Primary Hero Photo */}
            <div
              className="bento-photo-hero"
              onClick={scrollToGallery}
              role="button"
              tabIndex={0}
            >
              <img
                src={mainPhoto.url}
                alt={mainPhoto.caption || site.name}
                loading="eager"
              />
              <div className="bento-hero-gradient">
                <div className="bento-hero-info">
                  <span className="bento-hero-tag">
                    <IconStar size={12} color="#FFF8F0" fill="#FFF8F0" /> Primary Archive
                  </span>
                  <p className="bento-hero-caption">{mainPhoto.caption || site.name}</p>
                </div>
                <span className="bento-fullscreen-hint">
                  <IconSearch size={14} color="rgba(255, 255, 255, 0.9)" /> Expand Gallery
                </span>
              </div>
            </div>

            {/* Secondary Supporting Photos */}
            <div className="bento-side-column">
              {sidePhotos.length > 0 ? (
                sidePhotos.map((photo, idx) => (
                  <div
                    key={idx}
                    className="bento-photo-card"
                    onClick={scrollToGallery}
                    role="button"
                    tabIndex={0}
                  >
                    <img
                      src={photo.url}
                      alt={photo.caption || `${site.name} view ${idx + 2}`}
                      loading="lazy"
                    />
                    <div className="bento-card-overlay">
                      <p className="bento-card-caption">{photo.caption || `Architectural Perspective ${idx + 2}`}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div
                  className="bento-photo-card"
                  onClick={scrollToGallery}
                  role="button"
                  tabIndex={0}
                >
                  <img
                    src="https://images.unsplash.com/photo-1590766940554-634ee7ef6981?auto=format&fit=crop&w=800&q=80"
                    alt="Architectural details"
                    loading="lazy"
                  />
                  <div className="bento-card-overlay">
                    <p className="bento-card-caption">Detailed stone carvings and structural archives</p>
                  </div>
                </div>
              )}

              {/* View All Photos Button Tile */}
              <button
                type="button"
                className="bento-view-all-pill"
                onClick={scrollToGallery}
              >
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                  <IconGallery size={18} color="#FFF8F0" />
                  Browse Photo Archive ({photos.length} Photos)
                </span>
                <span className="bento-pill-arrow">
                  <IconArrowRight size={18} color="#FFF8F0" />
                </span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content & Sticky Fact Sheet */}
      <section className="detail-body-section section-padding">
        <div className="container">
          <div className="detail-layout-grid">
            {/* Left Column: Narrative, History, Gallery & Field Tips */}
            <main className="detail-main-flow">

              {/* Overview & Architecture */}
              <article className="heritage-card narrative-card hw-walk-waypoint">
                <div className="heritage-card-header">
                  <span className="heritage-card-kicker">Architectural Overview</span>
                  <h2 className="heritage-card-title">About {site.name}</h2>
                </div>
                <div className="heritage-card-body">
                  <p className="narrative-lead-text">{site.description}</p>
                </div>
              </article>

              {/* Historical Significance */}
              {site.significance && (
                <article className="heritage-card significance-card hw-walk-waypoint">
                  <div className="significance-icon-badge">
                    <IconScroll size={28} color="var(--color-accent)" />
                  </div>
                  <div className="significance-text-wrap">
                    <span className="heritage-card-kicker">Historical & Cultural Heritage</span>
                    <h3 className="significance-title">Significance & Legacy</h3>
                    <p className="significance-body-text">{site.significance}</p>
                  </div>
                </article>
              )}

              {/* Photo Gallery Section */}
              <section id="community-gallery-section" className="heritage-card gallery-section-card hw-walk-waypoint">
                <div className="gallery-section-header">
                  <div>
                    <span className="heritage-card-kicker">Visual Archives</span>
                    <h2 className="heritage-card-title">Documented Photo Gallery</h2>
                  </div>
                  <span className="gallery-archive-count">
                    <IconGallery size={15} color="var(--color-primary-dark)" style={{ marginRight: '6px' }} />
                    {photos.length} High-Res Photos
                  </span>
                </div>
                <p className="gallery-section-desc">
                  High-resolution photo records contributed by community explorers and verified archives. Click any photograph to view in full resolution lightbox.
                </p>
                <PhotoGallery photos={photos} />
              </section>

              {/* Community Travel Tips & Field Discussions */}
              <TravelTipsSection siteId={site._id || site.slug} siteName={site.name} />
            </main>

            {/* Right Column: Sticky Fact Sheet & Quick Actions */}
            <aside className="detail-sidebar-flow">
              {/* Monument Fact Sheet */}
              <div className="sidebar-box monument-fact-sheet">
                <div className="fact-sheet-header">
                  <span className="fact-sheet-icon">
                    <IconHeritage size={22} color="var(--color-accent)" />
                  </span>
                  <h3>Monument Fact Sheet</h3>
                </div>
                <div className="fact-sheet-divider" />

                <div className="fact-list">
                  <div className="fact-row">
                    <span className="fact-key">
                      <MonumentTypeIcon type={site.type} size={16} color="var(--color-text-muted)" />
                      Category
                    </span>
                    <span className="fact-val fact-val-badge">{site.type}</span>
                  </div>

                  {site.period && (
                    <div className="fact-row">
                      <span className="fact-key">
                        <IconClock size={16} color="var(--color-text-muted)" />
                        Era / Timeline
                      </span>
                      <span className="fact-val">{site.period}</span>
                    </div>
                  )}

                  <div className="fact-row">
                    <span className="fact-key">
                      <IconLocation size={16} color="var(--color-text-muted)" />
                      Town / City
                    </span>
                    <span className="fact-val">{site.location.city}</span>
                  </div>

                  <div className="fact-row">
                    <span className="fact-key">
                      <IconHeritage size={16} color="var(--color-text-muted)" />
                      State
                    </span>
                    <span className="fact-val">{site.location.state}</span>
                  </div>

                  {site.location.address && (
                    <div className="fact-row">
                      <span className="fact-key">
                        <IconLocation size={16} color="var(--color-text-muted)" />
                        Landmark
                      </span>
                      <span className="fact-val">{site.location.address}</span>
                    </div>
                  )}

                  <div className="fact-row">
                    <span className="fact-key">
                      <IconCamera size={16} color="var(--color-text-muted)" />
                      Photos Recorded
                    </span>
                    <span className="fact-val fact-val-highlight">{photos.length} photos</span>
                  </div>

                  <div className="fact-row">
                    <span className="fact-key">
                      <IconUsers size={16} color="var(--color-text-muted)" />
                      Community Records
                    </span>
                    <span className="fact-val">{site.contributionCount || 0} submissions</span>
                  </div>
                </div>

                <div className="fact-sheet-cta-wrap">
                  <button
                    type="button"
                    className={`btn ${wishlisted ? 'btn-wishlisted-active' : 'btn-secondary'} fact-full-btn`}
                    onClick={handleWishlistToggle}
                  >
                    <IconHeart
                      size={18}
                      color={wishlisted ? "#ffffff" : "currentColor"}
                      fill={wishlisted ? "#ffffff" : "none"}
                    />
                    {wishlisted ? 'Saved in Your Wishlist' : 'Save to Wishlist'}
                  </button>
                </div>
              </div>

              {/* DOCUMENTED BY THE COMMUNITY CARD */}
              <div className="sidebar-box community-documented-box">
                <div className="community-doc-header">
                  <span className="community-doc-icon">
                    <IconUsers size={20} color="var(--color-accent)" />
                  </span>
                  <div>
                    <h3 className="community-doc-title">DOCUMENTED BY THE COMMUNITY</h3>
                    <p className="community-doc-subtitle">
                      “Help preserve the story of this place through photographs, memories, and local knowledge.”
                    </p>
                  </div>
                </div>

                <div className="community-doc-stats-grid">
                  <div className="community-stat-block">
                    <span className="community-stat-num">
                      <CountUpNumber value={photoCount} />
                    </span>
                    <span className="community-stat-lbl">PHOTOS</span>
                  </div>
                  <div className="community-stat-block">
                    <span className="community-stat-num">
                      <CountUpNumber value={storiesCount} />
                    </span>
                    <span className="community-stat-lbl">STORIES</span>
                  </div>
                  <div className="community-stat-block">
                    <span className="community-stat-num">
                      <CountUpNumber value={contributorsCount} />
                    </span>
                    <span className="community-stat-lbl">CONTRIBUTORS</span>
                  </div>
                </div>

                <p className="community-doc-statement">
                  Every contribution helps keep local heritage visible for future generations.
                </p>

                <Link
                  to={`/contribute?site=${site._id || site.slug}`}
                  className="btn btn-primary community-doc-cta"
                >
                  <span>＋ CONTRIBUTE TO THIS PLACE</span>
                  <IconArrowRight size={15} color="currentColor" />
                </Link>
              </div>

              {/* Document CTA Box */}
              <div className="sidebar-box sidebar-contribute-box">
                <div className="contribute-box-badge">Community Archiving</div>
                <h4>Have you explored {site.name}?</h4>
                <p>
                  Help preserve India's cultural heritage. Upload your high-resolution photographs and architectural field notes.
                </p>
                <Link
                  to={`/contribute?site=${site._id || site.slug}`}
                  className="btn btn-primary contribute-action-btn"
                >
                  <IconCamera size={16} color="#ffffff" />
                  Contribute Photos Now
                </Link>
              </div>
            </aside>
          </div>
        </div>
      </section>

      {/* Full-width Exploration Banner */}
      <section className="detail-bottom-banner">
        <div className="container">
          <div className="bottom-banner-card">
            <span className="bottom-banner-tag">Preserving Cultural Memory</span>
            <h2 className="bottom-banner-heading">Join the National Heritage Documentation Initiative</h2>
            <p className="bottom-banner-sub">
              Every photograph, inscription record, and historical fact helps researchers, students, and future travelers appreciate these priceless monuments.
            </p>
            <div className="bottom-banner-buttons">
              <Link
                to={`/contribute?site=${site._id || site.slug}`}
                className="btn btn-accent btn-lg banner-btn"
              >
                <IconCamera size={18} color="#ffffff" />
                Document a Site
              </Link>
              <Link
                to="/explore"
                className="btn btn-outline-white btn-lg banner-btn"
              >
                <IconSearch size={18} color="#ffffff" />
                Explore All 12 Sites
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Toast notification */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          link={toast.link}
          actionLabel={toast.actionLabel}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  )
}

export default SiteDetail
