import { useState, useEffect } from 'react'
import { useSearchParams, Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import {
  IconHeritage,
  IconCamera,
  IconScroll,
  IconSparkles,
  IconCheck,
  IconEdit,
  IconPlus
} from '../components/Icons'
import Toast from '../components/Toast'
import Loader from '../components/Loader'
import './Contribute.css'

function Contribute() {
  const [searchParams] = useSearchParams()
  const { user, token, loading: authLoading } = useAuth()
  const navigate = useNavigate()

  const [sites, setSites] = useState([])
  const [toast, setToast] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const [form, setForm] = useState({
    type: 'photo',
    siteId: searchParams.get('site') || '',
    siteName: '',
    siteType: 'Monument',
    siteCity: '',
    siteState: '',
    contributorName: '',
    contributorEmail: '',
    content: '',
    isVerified: false,
    photos: []
  })

  // Prefill user data once logged in
  useEffect(() => {
    if (user) {
      setForm(prev => ({
        ...prev,
        contributorName: user.name || '',
        contributorEmail: user.email || ''
      }))
    }
  }, [user])

  // Fetch available sites list
  useEffect(() => {
    fetch('/api/sites?limit=100')
      .then(res => res.json())
      .then(data => {
        if (data && data.sites) {
          setSites(data.sites)
        }
      })
      .catch(() => {})
  }, [])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleSelectType = (selectedTypeValue) => {
    setForm(prev => ({
      ...prev,
      type: selectedTypeValue
    }))
  }

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files).slice(0, 5)
    setForm(prev => ({ ...prev, photos: files }))
  }

  const handleRemoveFile = (index) => {
    setForm(prev => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== index)
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!user) {
      setToast({
        message: 'You must be logged in as an Explorer to contribute.',
        type: 'warning',
        link: '/login?redirect=/contribute',
        actionLabel: 'Sign In Now'
      })
      return
    }

    if (!form.contributorName.trim() || !form.contributorEmail.trim()) {
      setToast({ message: 'Please provide your contributor name and email.', type: 'error' })
      return
    }

    if (form.type === 'new_site' && !form.siteName.trim()) {
      setToast({ message: 'Please provide the name of the new heritage site.', type: 'error' })
      return
    }

    if (!form.content.trim() && form.photos.length === 0) {
      setToast({ message: 'Please add some text description or upload media.', type: 'error' })
      return
    }

    setSubmitting(true)

    try {
      const formData = new FormData()
      formData.append('type', form.type)
      formData.append('contributorName', form.contributorName)
      formData.append('contributorEmail', form.contributorEmail)
      formData.append('isVerified', form.isVerified)

      let finalContent = form.content
      if (form.type === 'new_site') {
        formData.append('siteName', form.siteName)
        formData.append('siteType', form.siteType || 'Monument')
        formData.append('siteCity', form.siteCity || '')
        formData.append('siteState', form.siteState || '')
        if (form.siteCity || form.siteState) {
          finalContent = `Location: ${form.siteCity}, ${form.siteState}\n\n${form.content}`
        }
      } else if (form.siteId) {
        formData.append('siteId', form.siteId)
      }

      // Append content exactly once as a clean string
      formData.append('content', finalContent)

      form.photos.forEach(photo => {
        formData.append('photos', photo)
      })

      const headers = {}
      if (token) {
        headers['Authorization'] = `Bearer ${token}`
      }

      const res = await fetch('/api/contributions', {
        method: 'POST',
        headers,
        body: formData
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error?.message || 'Submission failed')
      }

      setToast({
        message: 'Contribution submitted! Our team will review your media & details.',
        type: 'success',
        link: user?.role === 'admin' ? '/admin' : '/explore',
        actionLabel: user?.role === 'admin' ? 'Open Admin Dashboard' : 'Explore Sites'
      })
      setSubmitted(true)
    } catch (err) {
      setToast({
        message: err.message || 'Something went wrong. Please try again.',
        type: 'error'
      })
    } finally {
      setSubmitting(false)
    }
  }

  if (authLoading) {
    return <Loader size="full" text="Verifying explorer authentication..." />
  }

  // If user is NOT logged in, show the Access Restricted Screen
  if (!user) {
    return (
      <div className="contribute">
        <section className="contribute-header">
          <div className="container">
            <span className="hero-badge-pill">🔒 Community Membership Required</span>
            <h1>Share Your Heritage Knowledge</h1>
            <p>Help document India's local heritage by contributing photographs, videos, and historical information</p>
          </div>
        </section>

        <section className="contribute-auth-lock section-padding">
          <div className="container">
            <div className="auth-lock-card">
              <div className="lock-icon-circle">
                <IconHeritage size={38} color="var(--color-primary-dark)" />
              </div>
              <h2>Explorer Login Required to Contribute</h2>
              <p className="lock-desc">
                To maintain authentic documentation, prevent spam, and give proper credit to contributors, only registered Explorers can submit photographs and heritage details.
              </p>

              <div className="lock-benefits-grid">
                <div className="lock-benefit">
                  <span className="benefit-icon">
                    <IconCamera size={20} color="var(--color-primary)" />
                  </span>
                  <div>
                    <strong>Earn Contributor Credit</strong>
                    <p>Your name is attached to every published photo and story</p>
                  </div>
                </div>
                <div className="lock-benefit">
                  <span className="benefit-icon">
                    <IconScroll size={20} color="var(--color-primary)" />
                  </span>
                  <div>
                    <strong>Preserve Heritage Records</strong>
                    <p>Contribute to community archives reviewed by curators</p>
                  </div>
                </div>
                <div className="lock-benefit">
                  <span className="benefit-icon">
                    <IconSparkles size={20} color="var(--color-primary)" />
                  </span>
                  <div>
                    <strong>Bookmark & Track</strong>
                    <p>Keep a personal wishlist of sites you want to explore</p>
                  </div>
                </div>
              </div>

              <div className="lock-actions">
                <Link to="/login?redirect=/contribute" className="btn btn-primary btn-lg">
                  🔑 Sign In as Explorer
                </Link>
                <Link to="/register" className="btn btn-secondary btn-lg">
                  ✨ Create Free Account
                </Link>
              </div>

              <p className="lock-demo-hint">
                💡 Testing? Use Explorer login: <code>user@heritagewalk.com</code> (password: <code>user123</code>)
              </p>
            </div>
          </div>
        </section>
        
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

  if (submitted) {
    return (
      <div className="contribute">
        <section className="contribute-header">
          <div className="container">
            <h1>Thank You, {user.name}! 🎉</h1>
            <p>Your contribution directly supports India's cultural heritage documentation</p>
          </div>
        </section>
        <section className="contribute-success section-padding">
          <div className="container">
            <div className="success-card">
              <span className="success-icon">
                <IconCheck size={48} color="#27AE60" />
              </span>
              <h2>Contribution Submitted for Review</h2>
              <p>
                Your submission has been queued for verification by our curators. Once approved in the Curator Dashboard, it will be published to the national catalog with your attribution!
              </p>
              <div className="success-actions">
                <button
                  className="btn btn-primary"
                  onClick={() => {
                    setSubmitted(false)
                    setForm({
                      type: 'photo',
                      siteId: '',
                      siteName: '',
                      siteType: 'Monument',
                      siteCity: '',
                      siteState: '',
                      contributorName: user.name,
                      contributorEmail: user.email,
                      content: '',
                      isVerified: false,
                      photos: []
                    })
                  }}
                >
                  📸 Submit Another Contribution
                </button>
                <Link to="/explore" className="btn btn-secondary">
                  🔍 Browse All Sites
                </Link>
              </div>
            </div>
          </div>
        </section>
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

  const contributionOptions = [
    {
      value: 'photo',
      icon: (color) => <IconCamera size={22} color={color} />,
      title: 'Photos & Videos',
      desc: 'Contribute photos or videos for an existing heritage monument'
    },
    {
      value: 'information',
      icon: (color) => <IconScroll size={22} color={color} />,
      title: 'Field Notes & History',
      desc: 'Add historical facts, architectural details, or inscriptions'
    },
    {
      value: 'new_site',
      icon: (color) => <IconHeritage size={22} color={color} />,
      title: 'Suggest a New Site',
      desc: 'Submit an undocumented stepwell, fort, haveli, or temple'
    },
    {
      value: 'correction',
      icon: (color) => <IconEdit size={22} color={color} />,
      title: 'Report a Correction',
      desc: 'Suggest edits or corrections to existing records'
    }
  ]

  return (
    <div className="contribute">
      <section className="contribute-header">
        <div className="container">
          <span className="hero-badge-pill">👤 Logged in as: {user.name}</span>
          <h1>Share Your Heritage Knowledge</h1>
          <p>
            Help document India's local heritage by contributing photographs, videos, historical information, or new site records
          </p>
        </div>
      </section>

      <section className="contribute-form-section section-padding">
        <div className="container">
          <div className="contribute-card">
            <form onSubmit={handleSubmit} className="contribute-form">
              {/* Contribution Type Selection */}
              <div className="form-section">
                <h3 className="form-section-title">1. What are you contributing?</h3>
                <div className="radio-grid">
                  {contributionOptions.map(opt => {
                    const isSelected = form.type === opt.value
                    const iconColor = isSelected ? 'var(--color-primary)' : '#8B4513'
                    return (
                      <button
                        key={opt.value}
                        type="button"
                        className={`radio-card ${isSelected ? 'selected' : ''}`}
                        onClick={() => handleSelectType(opt.value)}
                        aria-pressed={isSelected}
                      >
                        <div className="radio-card-top">
                          <span className="radio-card-icon">{opt.icon(iconColor)}</span>
                          <span className="radio-card-label">{opt.title}</span>
                          {isSelected && (
                            <span className="radio-card-active-dot">
                              <IconCheck size={14} color="#FFFFFF" />
                            </span>
                          )}
                        </div>
                        <span className="radio-card-desc">{opt.desc}</span>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Site Selection */}
              <div className="form-section">
                <h3 className="form-section-title">
                  {form.type === 'new_site' ? '2. New Heritage Site Details' : '2. Select Heritage Site'}
                </h3>

                {form.type === 'new_site' ? (
                  <div className="form-grid">
                    <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                      <label className="form-label">Monument Name *</label>
                      <input
                        type="text"
                        name="siteName"
                        className="form-input"
                        value={form.siteName}
                        onChange={handleChange}
                        placeholder="e.g., Bhujiyo Kotho Bastion"
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Monument Type *</label>
                      <select
                        name="siteType"
                        className="form-select"
                        value={form.siteType}
                        onChange={handleChange}
                      >
                        <option value="Fort">Fort / Bastion</option>
                        <option value="Stepwell">Stepwell (Vav / Baori)</option>
                        <option value="Temple">Temple</option>
                        <option value="Haveli">Haveli / Palace</option>
                        <option value="Colonial Building">Colonial Building</option>
                        <option value="Monument">Historic Monument</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label className="form-label">City / Town *</label>
                      <input
                        type="text"
                        name="siteCity"
                        className="form-input"
                        value={form.siteCity}
                        onChange={handleChange}
                        placeholder="e.g., Jamnagar"
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">State *</label>
                      <input
                        type="text"
                        name="siteState"
                        className="form-input"
                        value={form.siteState}
                        onChange={handleChange}
                        placeholder="e.g., Gujarat"
                        required
                      />
                    </div>
                  </div>
                ) : (
                  <div className="form-group">
                    <label className="form-label">Choose a documented heritage site</label>
                    <select
                      name="siteId"
                      className="form-select"
                      value={form.siteId}
                      onChange={handleChange}
                    >
                      <option value="">— Select from documented sites —</option>
                      {sites.map(site => (
                        <option key={site._id} value={site._id}>
                          {site.name} ({site.type}) — {site.location?.city}, {site.location?.state}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

              {/* Contributor Information */}
              <div className="form-section">
                <h3 className="form-section-title">3. Contributor Attribution</h3>
                <div className="form-grid">
                  <div className="form-group">
                    <label className="form-label">Your Name *</label>
                    <input
                      type="text"
                      name="contributorName"
                      className="form-input"
                      value={form.contributorName}
                      onChange={handleChange}
                      placeholder="Your full name"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Your Email *</label>
                    <input
                      type="email"
                      name="contributorEmail"
                      className="form-input"
                      value={form.contributorEmail}
                      onChange={handleChange}
                      placeholder="your.email@example.com"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Content Description */}
              <div className="form-section">
                <h3 className="form-section-title">4. Heritage Details & Narrative</h3>
                <div className="form-group">
                  <label className="form-label">
                    {form.type === 'photo'
                      ? 'Photo descriptions or context (optional)'
                      : form.type === 'new_site'
                      ? 'Detailed architectural description & historical significance *'
                      : 'Detailed information, field notes, or correction details *'}
                  </label>
                  <textarea
                    name="content"
                    className="form-textarea"
                    rows="5"
                    value={form.content}
                    onChange={handleChange}
                    placeholder="Share what you know: historical era, patron king, architectural style, current condition, or cultural stories..."
                    required={form.type !== 'photo'}
                  ></textarea>
                </div>
              </div>

              {/* Photo Upload */}
              <div className="form-section">
                <h3 className="form-section-title">5. Upload Photos or Videos</h3>
                <p className="form-section-desc">
                  Upload up to 5 original photos or videos (JPG, PNG, WebP, MP4, WebM, MOV • Max 50MB each).
                </p>

                <div className="file-upload-zone">
                  <input
                    type="file"
                    id="photo-input"
                    multiple
                    accept="image/jpeg,image/png,image/webp,video/mp4,video/webm,video/quicktime"
                    onChange={handleFileChange}
                    className="file-input-hidden"
                  />
                  <label htmlFor="photo-input" className="file-upload-label">
                    <span className="upload-icon">📸</span>
                    <span className="upload-text">
                      <strong>Click to browse files</strong> or drag and drop media here
                    </span>
                    <span className="upload-hint">Supported formats: JPG, PNG, WebP, MP4, WebM, MOV (up to 5 files)</span>
                  </label>
                </div>

                {form.photos.length > 0 && (
                  <div className="file-preview-list">
                    {form.photos.map((file, idx) => (
                      <div key={idx} className="file-preview-item">
                        <span className="file-preview-name">{file.type.startsWith('video/') ? '🎬' : '📷'} {file.name}</span>
                        <span className="file-preview-size">
                          ({(file.size / (1024 * 1024)).toFixed(2)} MB)
                        </span>
                        <button
                          type="button"
                          className="file-preview-remove"
                          onClick={() => handleRemoveFile(idx)}
                          aria-label="Remove media"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Verification & Submission */}
              <div className="form-section form-submit-section">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="isVerified"
                    checked={form.isVerified}
                    onChange={handleChange}
                  />
                  <span>
                    I confirm that I have visited this site or verified this historical information from credible heritage archives, and I own the rights to the uploaded photographs.
                  </span>
                </label>

                <button
                  type="submit"
                  className="btn btn-primary btn-lg submit-btn"
                  disabled={submitting}
                >
                  {submitting ? 'Submitting Heritage Record...' : '🚀 Submit Contribution for Review'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

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

export default Contribute
