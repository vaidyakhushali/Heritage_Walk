import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Loader from '../components/Loader'
import Toast from '../components/Toast'
import './Admin.css'

function Admin() {
  const { user, loading: authLoading } = useAuth()
  const [contributions, setContributions] = useState([])
  const [counts, setCounts] = useState({ all: 0, pending: 0, approved: 0, rejected: 0 })
  const [activeTab, setActiveTab] = useState('pending')
  const [loading, setLoading] = useState(true)
  const [toast, setToast] = useState(null)
  const [reviewModal, setReviewModal] = useState(null)
  const [reviewNote, setReviewNote] = useState('')
  const [previewModal, setPreviewModal] = useState(null)

  const fetchContributions = async (status = activeTab) => {
    setLoading(true)
    try {
      const params = status !== 'all' ? `?status=${status}` : ''
      const res = await fetch(`/api/contributions${params}`)
      const data = await res.json()
      setContributions(data.contributions || [])
      setCounts(data.counts || { all: 0, pending: 0, approved: 0, rejected: 0 })
    } catch {
      setToast({ message: 'Failed to load submissions from database', type: 'error' })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (user && user.role === 'admin') {
      fetchContributions(activeTab)
    } else {
      setLoading(false)
    }
  }, [activeTab, user])

  const handleReview = async (id, status) => {
    try {
      const res = await fetch(`/api/contributions/${id}/review`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, reviewNote })
      })

      if (!res.ok) throw new Error('Review request failed')

      setToast({
        message: `Contribution ${status} successfully!`,
        type: 'success',
        link: '/explore',
        actionLabel: 'View in Catalog'
      })
      setReviewModal(null)
      setReviewNote('')
      fetchContributions(activeTab)
    } catch {
      setToast({ message: 'Failed to update review status', type: 'error' })
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to permanently delete this submission?')) return
    try {
      const res = await fetch(`/api/contributions/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Delete failed')
      setToast({ message: 'Contribution deleted from archives', type: 'success' })
      fetchContributions(activeTab)
    } catch {
      setToast({ message: 'Failed to delete contribution', type: 'error' })
    }
  }

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-IN', {
      day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
    })
  }

  const typeLabels = {
    photo: '📸 Photo Documentation',
    information: '📝 Historical Information',
    new_site: '🏛️ Unlisted Heritage Site',
    correction: '✏️ Record Correction'
  }

  if (authLoading) {
    return <Loader size="full" text="Verifying administrator credentials..." />
  }

  // If user is not logged in or is not an admin
  if (!user || user.role !== 'admin') {
    return (
      <div className="admin">
        <section className="admin-header">
          <div className="container">
            <span className="admin-lock-badge">🛡️ Restricted Administrator Portal</span>
            <h1>Curator & Admin Dashboard</h1>
            <p>Verification & Content Moderation Console</p>
          </div>
        </section>

        <section className="admin-content section-padding">
          <div className="container">
            <div className="admin-lock-card">
              <span className="lock-shield-icon">🛡️</span>
              <h2>Administrator Sign In Required</h2>
              <p>
                This area is reserved for HeritageWalk curators and administrators to review and approve community contributions before publication.
              </p>

              <div className="admin-demo-box">
                <span className="demo-box-label">🔑 Pre-configured Admin Credentials:</span>
                <p>Email: <code>admin@heritagewalk.com</code></p>
                <p>Password: <code>admin123</code></p>
              </div>

              <div className="admin-lock-actions">
                <Link to="/login?redirect=/admin" className="btn btn-primary btn-lg">
                  🛡️ Sign In with Admin Account
                </Link>
                <Link to="/" className="btn btn-secondary btn-lg">
                  Return to Home
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

  return (
    <div className="admin">
      <section className="admin-header">
        <div className="container">
          <span className="admin-lock-badge">👑 Logged in as Administrator: {user.name}</span>
          <h1>Admin Moderation Dashboard</h1>
          <p>Review community photographs, verify historical submissions, and manage heritage archives</p>
        </div>
      </section>

      <section className="admin-content section-padding">
        <div className="container">
          {/* Status Tabs */}
          <div className="admin-tabs">
            {['pending', 'approved', 'rejected', 'all'].map(tab => (
              <button
                key={tab}
                className={`admin-tab ${activeTab === tab ? 'active' : ''}`}
                onClick={() => setActiveTab(tab)}
              >
                <span className="tab-label">
                  {tab === 'pending' ? '⏳ Pending Review' :
                   tab === 'approved' ? '✅ Approved' :
                   tab === 'rejected' ? '❌ Rejected' : '📁 All Submissions'}
                </span>
                <span className={`tab-count badge badge-${tab === 'pending' ? 'warning' : tab === 'approved' ? 'success' : tab === 'rejected' ? 'error' : 'primary'}`}>
                  {counts[tab] || 0}
                </span>
              </button>
            ))}
          </div>

          {/* Contributions List */}
          {loading ? (
            <Loader size="full" text="Loading community submissions..." />
          ) : contributions.length === 0 ? (
            <div className="admin-empty">
              <span className="admin-empty-icon">📭</span>
              <h3>No {activeTab !== 'all' ? activeTab : ''} submissions</h3>
              <p>There are currently no community contributions in the "{activeTab}" queue.</p>
              <Link to="/contribute" className="btn btn-secondary btn-sm" style={{ marginTop: '12px' }}>
                📸 Test Submit a Contribution
              </Link>
            </div>
          ) : (
            <div className="contributions-list stagger-children">
              {contributions.map(contrib => (
                <div key={contrib._id} className="contribution-card">
                  <div className="contrib-header">
                    <div className="contrib-info">
                      <span className="contrib-type">{typeLabels[contrib.type] || contrib.type}</span>
                      <span className={`contrib-status badge badge-${contrib.status === 'pending' ? 'warning' : contrib.status === 'approved' ? 'success' : 'error'}`}>
                        {contrib.status}
                      </span>
                    </div>
                    <span className="contrib-date">{formatDate(contrib.createdAt)}</span>
                  </div>

                  <div className="contrib-body">
                    <div className="contrib-meta">
                      <p className="contrib-contributor">
                        <strong>👤 {contrib.contributor?.name || 'Explorer'}</strong>
                        <span className="contrib-email">{contrib.contributor?.email}</span>
                      </p>
                      {contrib.siteId && (
                        <p className="contrib-site">📍 Documented Site: <strong>{contrib.siteId.name || 'Site'}</strong></p>
                      )}
                      {contrib.siteName && (
                        <p className="contrib-site">🏛️ Suggested Unlisted Site: <strong>{contrib.siteName}</strong></p>
                      )}
                    </div>

                    {contrib.content && (
                      <div className="contrib-content-box">
                        <span className="content-box-label">Submission Content:</span>
                        <p className="contrib-content">{contrib.content}</p>
                      </div>
                    )}

                    {contrib.photos && contrib.photos.length > 0 && (
                      <div className="contrib-photos-section">
                        <span className="content-box-label">Uploaded Photographs ({contrib.photos.length}):</span>
                        <div className="contrib-photos">
                          {contrib.photos.map((photo, i) => (
                            <div key={i} className="contrib-photo-thumb" onClick={() => setPreviewModal(photo)}>
                              <img src={photo} alt={`Contribution photo ${i + 1}`} />
                              <span className="photo-zoom-hint">🔍 Expand</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {contrib.isVerified && (
                      <span className="contrib-verified">
                        ✅ Contributor claims this is verified/original historical information
                      </span>
                    )}

                    {contrib.reviewNote && (
                      <p className="contrib-review-note">
                        💬 Review note: {contrib.reviewNote}
                      </p>
                    )}
                  </div>

                  <div className="contrib-actions">
                    {contrib.status === 'pending' && (
                      <>
                        <button
                          className="btn btn-sm action-approve"
                          onClick={() => handleReview(contrib._id, 'approved')}
                        >
                          ✅ Approve & Publish
                        </button>
                        <button
                          className="btn btn-sm action-reject"
                          onClick={() => {
                            setReviewModal(contrib._id)
                            setReviewNote('')
                          }}
                        >
                          ❌ Reject with Note
                        </button>
                      </>
                    )}
                    <button
                      className="btn btn-sm action-delete"
                      onClick={() => handleDelete(contrib._id)}
                    >
                      🗑️ Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Reject Modal */}
      {reviewModal && (
        <div className="modal-overlay" onClick={() => setReviewModal(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>Reject Contribution</h3>
            <p>Please provide a reason or constructive feedback for the contributor:</p>
            <textarea
              className="form-textarea"
              value={reviewNote}
              onChange={(e) => setReviewNote(e.target.value)}
              placeholder="e.g. Photo quality too low, duplicates existing record, please re-upload in higher resolution..."
              rows={4}
            />
            <div className="modal-actions">
              <button className="btn btn-secondary btn-sm" onClick={() => setReviewModal(null)}>
                Cancel
              </button>
              <button
                className="btn action-reject btn-sm"
                onClick={() => handleReview(reviewModal, 'rejected')}
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Photo Preview Modal */}
      {previewModal && (
        <div className="modal-overlay" onClick={() => setPreviewModal(null)}>
          <div className="preview-modal" onClick={(e) => e.stopPropagation()}>
            <button className="preview-close" onClick={() => setPreviewModal(null)}>×</button>
            <img src={previewModal} alt="Contribution high-res preview" />
          </div>
        </div>
      )}

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

export default Admin
