import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Toast from '../components/Toast'
import Loader from '../components/Loader'
import {
  IconHeritage,
  IconSparkles,
  IconCamera,
  IconHeart,
  IconLocation,
  IconSearch,
  IconArrowRight
} from '../components/Icons'
import './Profile.css'

function Profile() {
  const { user, token, loading, updateProfile, logout } = useAuth()
  const navigate = useNavigate()
  const [editing, setEditing] = useState(false)
  const [toast, setToast] = useState(null)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({ name: '', bio: '', location: '' })
  const [contributions, setContributions] = useState([])
  const [contributionsLoading, setContributionsLoading] = useState(true)
  const [contributionsError, setContributionsError] = useState('')

  useEffect(() => {
    if (!loading && !user) {
      navigate('/login')
    }
    if (user) {
      setForm({ name: user.name, bio: user.bio || '', location: user.location || '' })
    }
  }, [user, loading])

  useEffect(() => {
    if (!user || !token) return

    let isCurrent = true
    fetch('/api/contributions/mine', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(async res => {
        const data = await res.json()
        if (!res.ok) throw new Error(data.error?.message || 'Could not load contributions')
        if (isCurrent) setContributions(data.contributions || [])
      })
      .catch(err => {
        if (isCurrent) setContributionsError(err.message)
      })
      .finally(() => {
        if (isCurrent) setContributionsLoading(false)
      })

    return () => { isCurrent = false }
  }, [user, token])

  if (loading) return <Loader size="full" text="Loading your explorer passport..." />
  if (!user) return null

  const handleSave = async () => {
    setSaving(true)
    try {
      await updateProfile(form)
      setEditing(false)
      setToast({ message: 'Profile updated successfully!', type: 'success' })
    } catch (err) {
      setToast({ message: err.message, type: 'error' })
    } finally {
      setSaving(false)
    }
  }

  const getInitials = (name) => name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)

  const memberSince = new Date(user.createdAt || Date.now()).toLocaleDateString('en-IN', {
    month: 'long', year: 'numeric'
  })

  const wishlistCount = user.wishlist?.length || 0
  const photoCount = contributions.reduce((count, item) => count + (item.photos?.length || 0), 0)
  const videoCount = contributions.reduce((count, item) => count + (item.videos?.length || 0), 0)

  const contributionTypeLabels = {
    photo: 'Photo contribution',
    information: 'Field notes',
    new_site: 'New heritage location',
    correction: 'Record correction'
  }

  const formatContributionDate = (date) => new Date(date).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'short', year: 'numeric'
  })

  return (
    <div className="profile-page">
      <section className="profile-header">
        <div className="container">
          <span className="profile-badge-kicker">
            <IconSparkles size={14} color="#C17817" />
            Official Heritage Explorer Passport
          </span>
            <h1>Your Heritage Contributions</h1>
            <p>Review the photos, videos, field notes, and heritage locations you have submitted.</p>
        </div>
      </section>

      <section className="profile-content section-padding">
        <div className="container">
          <div className="profile-layout">
            {/* Left Column: Profile Card & Quick Links */}
            <div className="profile-left-col">
              {/* Profile Card */}
              <div className="profile-card">
                <div className="profile-avatar-section">
                  <div className="profile-avatar-large">
                    {getInitials(user.name)}
                  </div>
                  <h2 className="profile-name">{user.name}</h2>
                  <p className="profile-email">{user.email}</p>
                  <span className="profile-role-pill">
                    {user.role === 'admin' ? <><IconHeritage size={14} color="currentColor" /> Administrator</> : <><IconSparkles size={14} color="currentColor" /> Heritage Explorer</>}
                  </span>
                  {user.location && (
                    <p className="profile-location">
                      <IconLocation size={14} color="var(--color-accent)" style={{ marginRight: '4px' }} />
                      {user.location}
                    </p>
                  )}
                </div>

                <div className="profile-stats-row">
                  <div className="profile-stat">
                    <span className="profile-stat-num">{wishlistCount}</span>
                    <span className="profile-stat-label">Saved Sites</span>
                  </div>
                  <div className="profile-stat">
                    <span className="profile-stat-num">{contributions.length}</span>
                    <span className="profile-stat-label">Contributions</span>
                  </div>
                  <div className="profile-stat">
                    <span className="profile-stat-num">{memberSince}</span>
                    <span className="profile-stat-label">Member Since</span>
                  </div>
                </div>

                {user.bio && <p className="profile-bio">{user.bio}</p>}

                <div className="profile-actions">
                  <button className="btn btn-primary btn-sm" onClick={() => setEditing(!editing)}>
                    {editing ? 'Cancel Editing' : 'Edit Profile'}
                  </button>
                  <Link to="/wishlist" className="btn btn-secondary btn-sm">
                    <IconHeart size={14} color="currentColor" /> Saved Wishlist
                  </Link>
                  <Link to="/contribute" className="btn btn-secondary btn-sm">
                    <IconCamera size={14} color="currentColor" /> Contribute
                  </Link>
                </div>
              </div>

              {/* Edit Form */}
              {editing && (
                <div className="profile-edit-card slide-up">
                  <h3>Edit Profile Details</h3>
                  <div className="form-group">
                    <label className="form-label">Display Name</label>
                    <input
                      type="text"
                      className="form-input"
                      value={form.name}
                      onChange={(e) => setForm(p => ({ ...p, name: e.target.value }))}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">City / State Location</label>
                    <input
                      type="text"
                      className="form-input"
                      value={form.location}
                      onChange={(e) => setForm(p => ({ ...p, location: e.target.value }))}
                      placeholder="e.g. Ahmedabad, Gujarat"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Explorer Biography</label>
                    <textarea
                      className="form-textarea"
                      value={form.bio}
                      onChange={(e) => setForm(p => ({ ...p, bio: e.target.value }))}
                      placeholder="Tell the community about your interest in Indian architectural heritage..."
                      rows={3}
                    />
                  </div>
                  <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
                    {saving ? 'Saving...' : 'Save Profile Updates'}
                  </button>
                </div>
              )}

              {/* Quick Links */}
              <div className="profile-links-card">
                <h3>Explorer Shortcuts</h3>
                <Link to="/explore" className="profile-link-item">
                  <span className="profile-link-icon">
                    <IconSearch size={18} color="var(--color-primary)" />
                  </span>
                  <div><strong>Explore Heritage Catalog</strong><p>Discover stepwells, forts & temples</p></div>
                  <span className="profile-link-arrow">
                    <IconArrowRight size={16} color="currentColor" />
                  </span>
                </Link>
                <Link to="/wishlist" className="profile-link-item">
                  <span className="profile-link-icon">
                    <IconHeart size={18} color="#e74c3c" fill="#e74c3c" />
                  </span>
                  <div><strong>My Saved Wishlist</strong><p>{wishlistCount} monuments saved</p></div>
                  <span className="profile-link-arrow">
                    <IconArrowRight size={16} color="currentColor" />
                  </span>
                </Link>
                <Link to="/contribute" className="profile-link-item">
                  <span className="profile-link-icon">
                    <IconCamera size={18} color="var(--color-primary)" />
                  </span>
                  <div><strong>Submit Documentation</strong><p>Upload high-res monument photos</p></div>
                  <span className="profile-link-arrow">
                    <IconArrowRight size={16} color="currentColor" />
                  </span>
                </Link>
              </div>
            </div>

            {/* Right Column: User-submitted field records */}
            <div className="profile-right-col">
              <section className="contributions-panel">
                <div className="contributions-heading">
                  <div>
                    <span className="contributions-kicker">Field archive</span>
                    <h2>Your submissions</h2>
                    <p>Every record is shown with its review status and submitted media.</p>
                  </div>
                  <Link to="/contribute" className="btn btn-primary btn-sm">
                    <IconCamera size={14} color="currentColor" /> Add contribution
                  </Link>
                </div>

                <div className="contribution-totals" aria-label="Contribution totals">
                  <div><strong>{contributions.length}</strong><span>Records</span></div>
                  <div><strong>{photoCount}</strong><span>Photos</span></div>
                  <div><strong>{videoCount}</strong><span>Videos</span></div>
                </div>

                {contributionsLoading && <p className="contributions-message">Loading your submissions...</p>}
                {!contributionsLoading && contributionsError && (
                  <p className="contributions-message error">{contributionsError}</p>
                )}
                {!contributionsLoading && !contributionsError && contributions.length === 0 && (
                  <div className="contributions-empty">
                    <IconCamera size={28} color="var(--color-primary)" />
                    <h3>No contributions yet</h3>
                    <p>Your submitted photos, videos, notes, and new locations will appear here.</p>
                    <Link to="/contribute" className="btn btn-secondary btn-sm">Make your first contribution</Link>
                  </div>
                )}

                <div className="contributions-list">
                  {contributions.map(contribution => {
                    const title = contribution.siteName || contribution.siteId?.name || 'Heritage record'
                    const location = [contribution.siteLocation?.city, contribution.siteLocation?.state]
                      .filter(Boolean).join(', ')
                    const media = [
                      ...(contribution.photos || []).map(url => ({ url, type: 'photo' })),
                      ...(contribution.videos || []).map(url => ({ url, type: 'video' }))
                    ]

                    return (
                      <article className="contribution-entry" key={contribution._id}>
                        <div className="contribution-entry-heading">
                          <div>
                            <span className="contribution-type">
                              {contribution.type === 'photo' && contribution.videos?.length
                                ? (contribution.photos?.length ? 'Photo & video contribution' : 'Video contribution')
                                : contributionTypeLabels[contribution.type] || 'Heritage contribution'}
                            </span>
                            <h3>{title}</h3>
                            {location && <p className="contribution-location"><IconLocation size={14} /> {location}</p>}
                            <time dateTime={contribution.createdAt}>{formatContributionDate(contribution.createdAt)}</time>
                          </div>
                          <span className={`contribution-status ${contribution.status || 'pending'}`}>
                            {contribution.status || 'pending'}
                          </span>
                        </div>
                        {contribution.content && <p className="contribution-content">{contribution.content}</p>}
                        {contribution.reviewNote && <p className="contribution-content">Review note: {contribution.reviewNote}</p>}
                        {media.length > 0 && (
                          <div className="contribution-media-grid">
                            {media.map((item, index) => item.type === 'video' ? (
                              <video key={`${item.url}-${index}`} src={item.url} controls preload="metadata">
                                Your browser does not support video playback.
                              </video>
                            ) : (
                              <img key={`${item.url}-${index}`} src={item.url} alt={`${title} contribution ${index + 1}`} loading="lazy" />
                            ))}
                          </div>
                        )}
                      </article>
                    )
                  })}
                </div>
              </section>
            </div>
          </div>
        </div>
      </section>

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  )
}

export default Profile
