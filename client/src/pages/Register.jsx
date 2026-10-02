import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { IconCamera, IconEye, IconHeart, IconHeritage, IconShield, IconUser } from '../components/Icons'
import Toast from '../components/Toast'
import './Auth.css'

function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState(null)
  const { register } = useAuth()
  const navigate = useNavigate()

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (form.password !== form.confirmPassword) {
      setToast({ message: 'Passwords do not match. Please re-enter.', type: 'error' })
      return
    }
    if (form.password.length < 6) {
      setToast({ message: 'Password must be at least 6 characters long.', type: 'error' })
      return
    }
    setLoading(true)
    try {
      await register(form.name.trim(), form.email.trim(), form.password)
      setToast({
        message: 'Account created successfully! Welcome to HeritageWalk.',
        type: 'success',
        link: '/explore',
        actionLabel: 'Start Exploring'
      })
      setTimeout(() => navigate('/explore'), 1000)
    } catch (err) {
      setToast({ message: err.message || 'Registration failed. Try a different email.', type: 'error' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-container">
        {/* Left Side with Full Heritage Photo Background */}
        <div className="auth-left">
          <div className="auth-left-overlay"></div>
          <div className="auth-left-content">
            <div className="auth-brand">
              <span className="auth-brand-icon"><IconHeritage size={28} color="currentColor" /></span>
              <h2>HeritageWalk</h2>
            </div>
            <div className="explorer-badge-pill"><IconUser size={16} color="currentColor" /> Join Community of Explorers</div>
            <h1 className="auth-left-title">Preserve India's Architectural Legacy</h1>
            <p className="auth-left-desc">
              Become part of a collaborative heritage initiative documenting stepwells, temples, and havelis across India's tier-2 and tier-3 towns.
            </p>

            <div className="auth-features">
              <div className="auth-feature">
                <span className="auth-feature-icon"><IconCamera size={18} color="currentColor" /></span>
                <span>Document unlisted heritage sites & photographs</span>
              </div>
              <div className="auth-feature">
                <span className="auth-feature-icon"><IconHeritage size={18} color="currentColor" /></span>
                <span>Access verified historical timelines and architecture</span>
              </div>
              <div className="auth-feature">
                <span className="auth-feature-icon"><IconHeart size={18} color="currentColor" fill="currentColor" /></span>
                <span>Curate your personalized heritage exploration wishlist</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side Register Form */}
        <div className="auth-right">
          <div className="auth-form-wrapper">
            <h2 className="auth-title">Create Explorer Account</h2>
            <p className="auth-subtitle">Start documenting and bookmarking heritage sites</p>

            <form className="auth-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <div className="input-icon-wrapper">
                  <span className="input-icon"><IconUser size={16} color="currentColor" /></span>
                  <input
                    type="text"
                    name="name"
                    className="form-input input-with-icon"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="e.g., Enter your full name"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Email Address</label>
                <div className="input-icon-wrapper">
                  <span className="input-icon"><IconHeritage size={16} color="currentColor" /></span>
                  <input
                    type="email"
                    name="email"
                    className="form-input input-with-icon"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Password</label>
                <div className="input-icon-wrapper">
                  <span className="input-icon"><IconShield size={16} color="currentColor" /></span>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    className="form-input input-with-icon"
                    value={form.password}
                    onChange={handleChange}
                    placeholder="Min 6 characters..."
                    required
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    <IconEye size={18} color="currentColor" />
                  </button>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Confirm Password</label>
                <div className="input-icon-wrapper">
                  <span className="input-icon"><IconShield size={16} color="currentColor" /></span>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    className="form-input input-with-icon"
                    value={form.confirmPassword}
                    onChange={handleChange}
                    placeholder="Re-enter your password..."
                    required
                  />
                </div>
              </div>

              <button type="submit" className="btn btn-primary btn-lg auth-submit" disabled={loading}>
                {loading ? (
                  <span className="btn-loading"><span className="btn-spinner"></span> Creating Account...</span>
                ) : <><IconUser size={16} color="currentColor" /> Create Free Account →</>}
              </button>
            </form>

            <p className="auth-switch">
              Already have an account? <Link to="/login">Sign in here</Link>
            </p>
          </div>
        </div>
      </div>
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

export default Register
