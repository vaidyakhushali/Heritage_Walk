import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import SiteCard from '../components/SiteCard'
import Loader from '../components/Loader'
import { IconArrowRight, IconCamera, IconScroll, IconSearch } from '../components/Icons'
import { fallbackSites } from '../data/fallbackSites'
import './Home.css'

const heroSlides = [
  {
    title: "Discover India's Architectural Wonders",
    subtitle: "A community-driven platform to document, preserve, and celebrate ancient stepwells, havelis, and forts hidden across India's towns and cities.",
    image: "https://www.thevintagenews.com/wp-content/uploads/sites/65/2017/04/Detailed-view-of-the-facade.-Photo-Credit-640x427.jpg?auto=format&fit=crop&w=1800&q=85",
    siteName: "Hawa Mahal, Jaipur",
    siteType: "18th Century Monument"
  },
  {
    title: "Explore Subterranean Stepwells",
    subtitle: "Uncover subterranean water architecture like Rani ki Vav and Chand Baori, where engineering met sacred art over a thousand years ago.",
    image: "https://images.travelandleisureasia.com/wp-content/uploads/sites/2/2025/09/11142229/12f80153-aa49-44f0-9073-ce2bdc9e2c65.jpg?auto=format&fit=crop&w=1800&q=85",
    siteName: "Rani ki Vav, Patan",
    siteType: "11th Century UNESCO Stepwell"
  },
  {
    title: "Majestic Forts & Golden Havelis",
    subtitle: "From Mehrangarh Fort perched above Jodhpur to the carved sandstone jharokhas of Patwon Ki Haveli along ancient trade routes.",
    image: "https://img.veenaworld.com/wp-content/uploads/2021/10/Mehrangarh.jpg?auto=format&fit=crop&w=1800&q=85",
    siteName: "Mehrangarh Fort, Jodhpur", 
    siteType: "15th Century Rajput Fortress"
  }
];

function Home() {
  const [featuredSites, setFeaturedSites] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeSlide, setActiveSlide] = useState(0)
  const [heroSearch, setHeroSearch] = useState('')
  const navigate = useNavigate()

  // Auto rotate hero slides every 6 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide(prev => (prev + 1) % heroSlides.length)
    }, 6000)
    return () => clearInterval(timer)
  }, [])

  // Fetch featured sites with instant fallback
  useEffect(() => {
    fetch('/api/sites/featured')
      .then(res => {
        if (!res.ok) throw new Error('API request failed')
        return res.json()
      })
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setFeaturedSites(data)
        } else {
          // Fallback to featured items from local dataset
          setFeaturedSites(fallbackSites.filter(s => s.featured))
        }
        setLoading(false)
      })
      .catch(() => {
        // Safe fallback
        setFeaturedSites(fallbackSites.filter(s => s.featured))
        setLoading(false)
      })
  }, [])

  const handleHeroSearch = (e) => {
    e.preventDefault()
    if (heroSearch.trim()) {
      navigate(`/explore?search=${encodeURIComponent(heroSearch.trim())}`)
    } else {
      navigate('/explore')
    }
  }

  const currentSlide = heroSlides[activeSlide]

  return (
    <div className="home">
      {/* Hero Section with Live Background Photo & Carousel */}
      <section
        className="hero"
        style={{
          backgroundImage: `linear-gradient(rgba(30, 14, 6, 0.72), rgba(65, 28, 8, 0.85)), url(${currentSlide.image})`
        }}
      >
        <div className="hero-overlay-radial"></div>

        <div className="container hero-container">
          <div className="hero-content">
            <span className="hero-badge">
              🏛️ Community Heritage Documentation Platform
            </span>

            <h1 className="hero-title">{currentSlide.title}</h1>
            <p className="hero-subtitle">{currentSlide.subtitle}</p>

            {/* Interactive Hero Search */}
            <form className="hero-search-form" onSubmit={handleHeroSearch}>
              <span className="hero-search-icon">🔍</span>
              <input
                type="text"
                className="hero-search-input"
                placeholder="Search cities (e.g. Patan, Jaipur, Hampi)"
                value={heroSearch}
                onChange={(e) => setHeroSearch(e.target.value)}
              />
              <button type="submit" className="hero-search-btn">
                Search Sites →
              </button>
            </form>

            <div className="hero-actions">
              <Link to="/explore" className="btn btn-primary btn-lg hero-cta-btn">
                🔍 Explore All
              </Link>
              <Link to="/contribute" className="btn btn-outline-white btn-lg hero-cta-btn">
                📸 Contribute Documentation
              </Link>
            </div>
          </div>

          {/* Floating Showcase Card */}
          <div className="hero-showcase-card">
            <div className="showcase-img-wrap">
              <img src={currentSlide.image} alt={currentSlide.siteName} />
              <span className="showcase-badge">Featured Location</span>
            </div>
            <div className="showcase-details">
              <h4>{currentSlide.siteName}</h4>
              <p>{currentSlide.siteType}</p>
              <Link to="/explore" className="showcase-link">
                View in Catalog →
              </Link>
            </div>

            {/* Carousel Indicators */}
            <div className="hero-slide-dots">
              {heroSlides.map((slide, idx) => (
                <button
                  key={idx}
                  className={`slide-dot ${idx === activeSlide ? 'active' : ''}`}
                  onClick={() => setActiveSlide(idx)}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="hero-scroll-hint">
          <span>Scroll down to explore</span>
          <div className="scroll-arrow">↓</div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="container">
          <div className="stats-grid stagger-children">
            <div className="stat-item">
              <span className="stat-icon">🏛️</span>
              <span className="stat-number">12+</span>
              <span className="stat-label">Documented Heritage Sites</span>
            </div>
            <div className="stat-item">
              <span className="stat-icon">📍</span>
              <span className="stat-number">4+</span>
              <span className="stat-label">States Across India</span>
            </div>
            <div className="stat-item">
              <span className="stat-icon">📸</span>
              <span className="stat-number">35+</span>
              <span className="stat-label">High-Resolution Photos</span>
            </div>
            <div className="stat-item">
              <span className="stat-icon">👥</span>
              <span className="stat-number">100%</span>
              <span className="stat-label">Community Sourced</span>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="how-it-works section-padding">
        <div className="container">
          <div className="steps-heading">
            <div>
              <span className="section-pill">A shared process</span>
              <h2 className="section-title">From discovery to documentation</h2>
            </div>
            <p className="steps-intro">
              Explore local heritage, learn its story, then help preserve it for the next visitor.
            </p>
          </div>

          <div className="steps-grid">
            <article className="step-card">
              <span className="step-number">01</span>
              <h3><IconSearch size={21} color="var(--color-primary)" /> Discover</h3>
              <p>
                Find stepwells, temples, havelis, and monuments by place, period, or architectural style.
              </p>
              <Link to="/explore" className="step-link">Browse the catalog <IconArrowRight size={15} color="currentColor" /></Link>
            </article>

            <article className="step-card">
              <span className="step-number">02</span>
              <h3><IconScroll size={21} color="var(--color-primary)" /> Learn</h3>
              <p>
                Explore site histories, cultural context, and photographs shared by local explorers.
              </p>
              <Link to="/explore" className="step-link">Read a site story <IconArrowRight size={15} color="currentColor" /></Link>
            </article>

            <article className="step-card">
              <span className="step-number">03</span>
              <h3><IconCamera size={21} color="var(--color-primary)" /> Contribute</h3>
              <p>
                Share original photos, field notes, or a heritage place that is missing from the catalog.
              </p>
              <Link to="/contribute" className="step-link">Share your fieldwork <IconArrowRight size={15} color="currentColor" /></Link>
            </article>
          </div>
        </div>
      </section>

      {/* Featured Sites */}
      <section className="featured-section section-padding">
        <div className="container">
          <div className="section-header-between">
            <div>
              <span className="section-pill">Curated Highlights</span>
              <h2 className="section-title">Featured Heritage Sites</h2>
              <p className="section-subtitle">
                Iconic architectural marvels documenting India's deep history
              </p>
            </div>
            <Link to="/explore" className="btn btn-secondary featured-header-btn">
              Explore All Sites ({fallbackSites.length}) →
            </Link>
          </div>

          {loading ? (
            <Loader text="Loading featured heritage sites..." />
          ) : (
            <>
              <div className="featured-grid stagger-children">
                {featuredSites.map(site => (
                  <SiteCard key={site._id || site.slug} site={site} />
                ))}
              </div>
              <div className="featured-cta">
                <Link to="/explore" className="btn btn-primary btn-lg">
                  🔍 View All Documented Sites in Catalog →
                </Link>
              </div>
            </>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container cta-content">
          <span className="cta-badge">Join the Movement</span>
          <h2>Every Local Heritage Site Has a Story.<br />Help Us Preserve It.</h2>
          <p>
            Your photographs and local knowledge help safeguard monuments before they are forgotten. Sign in as an Explorer to contribute your documentation today.
          </p>
          <div className="cta-buttons">
            <Link to="/contribute" className="btn btn-accent btn-lg">
              📸 Start Contributing Documentation
            </Link>
            <Link to="/register" className="btn btn-outline-white btn-lg">
              ✨ Create Explorer Account
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home
