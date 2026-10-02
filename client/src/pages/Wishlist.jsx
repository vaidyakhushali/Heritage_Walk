import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import SiteCard from '../components/SiteCard'
import Loader from '../components/Loader'
import { IconHeart, IconSearch } from '../components/Icons'
import './Wishlist.css'

function Wishlist() {
  const { user, loading, token, fetchProfile } = useAuth()
  const navigate = useNavigate()
  const [sites, setSites] = useState([])
  const [fetching, setFetching] = useState(true)

  useEffect(() => {
    if (!loading && !user) {
      navigate('/login')
      return
    }
    if (user) {
      loadWishlistSites()
    }
  }, [user, loading])

  const loadWishlistSites = async () => {
    try {
      const res = await fetch('/api/auth/me', {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (res.ok) {
        const data = await res.json()
        setSites(data.wishlist || [])
      }
    } catch {
      // silently fail
    } finally {
      setFetching(false)
    }
  }

  if (loading || fetching) return <Loader size="full" text="Loading your wishlist..." />
  if (!user) return null

  return (
    <div className="wishlist-page">
      <section className="wishlist-header">
        <div className="container">
          <h1 className="wishlist-title">
            <span className="wishlist-title-icon" aria-hidden="true">
              <IconHeart size={24} color="#f43f5e" fill="currentColor" />
            </span>
            My Wishlist
          </h1>
          <p>Heritage sites you've saved to explore later</p>
        </div>
      </section>

      <section className="wishlist-content section-padding">
        <div className="container">
          {sites.length === 0 ? (
            <div className="wishlist-empty">
              <div className="wishlist-empty-visual">
                <span className="wishlist-empty-heart" aria-hidden="true">
                  <IconHeart size={36} color="#f43f5e" fill="currentColor" />
                </span>
                <div className="wishlist-empty-circles">
                  <span></span><span></span><span></span>
                </div>
              </div>
              <h2>Your wishlist is empty</h2>
              <p>Start exploring heritage sites and tap the heart button to save your favourites here.</p>
              <Link to="/explore" className="btn btn-primary btn-lg">
                <span className="btn-icon" aria-hidden="true"><IconSearch size={18} color="currentColor" /></span>
                Explore Heritage Sites
              </Link>
            </div>
          ) : (
            <>
              <div className="wishlist-count">
                <span>{sites.length} site{sites.length !== 1 ? 's' : ''} saved</span>
              </div>
              <div className="wishlist-grid">
                {sites.map((site, index) => (
                  <div key={site._id} className="wishlist-item" style={{ animationDelay: `${index * 0.08}s` }}>
                    <SiteCard site={site} />
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </section>
    </div>
  )
}

export default Wishlist
