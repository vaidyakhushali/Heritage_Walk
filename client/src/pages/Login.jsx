import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { IconCamera, IconCheck, IconEye, IconHeart, IconHeritage, IconScroll, IconShield, IconUser } from '../components/Icons'
import Toast from '../components/Toast'
import './Auth.css'

function Login() {
  const [loginRole, setLoginRole] = useState('user') // 'user' | 'admin'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState(null)
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const redirectPath = new URLSearchParams(location.search).get('redirect')

  const handleRoleTabChange = (role) => {
    setLoginRole(role)
    setEmail('')
    setPassword('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!email.trim() || !password.trim()) {
      setToast({ message: 'Please enter both your email address and password.', type: 'error' })
      return
    }

    setLoading(true)
    try {
      const data = await login(email.trim(), password)
      const userObj = data.user
      
      if (userObj.role === 'admin') {
        setToast({
          message: 'Welcome Administrator! Authenticated successfully.',
          type: 'success',
          link: '/admin',
          actionLabel: 'Open Curator Dashboard'
        })
        setTimeout(() => navigate(redirectPath || '/admin'), 1000)
      } else {
        setToast({
          message: `Welcome back, ${userObj.name}!`,
          type: 'success',
          link: '/explore',
          actionLabel: 'Explore Heritage Sites'
        })
        setTimeout(() => navigate(redirectPath || '/'), 1000)
      }
    } catch (err) {
      setToast({
        message: err.message || 'Invalid email or password. Please verify your credentials.',
        type: 'error'
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-container">
        {/* Left Side with Full Heritage Photo Background */}
        <div className={`auth-left ${loginRole === 'admin' ? 'auth-left-admin' : ''}`}>
          <div className="auth-left-overlay"></div>
          <div className="auth-left-content">
            <div className="auth-brand">
              <span className="auth-brand-icon"><IconHeritage size={28} color="currentColor" /></span>
              <h2>HeritageWalk</h2>
            </div>
            
            {loginRole === 'admin' ? (
              <>
                <div className="admin-badge-pill"><IconShield size={16} color="currentColor" /> Curator & Admin Portal</div>
                <h1 className="auth-left-title">Heritage Administration</h1>
                <p className="auth-left-desc">
                  Sign in with your administrator credentials to review community photographs, curate historical archives, and moderate submissions.
                </p>
                <div className="auth-features">
                  <div className="auth-feature">
                    <span className="auth-feature-icon"><IconShield size={18} color="currentColor" /></span>
                    <span>Review and approve community photographs</span>
                  </div>
                  <div className="auth-feature">
                    <span className="auth-feature-icon"><IconCheck size={18} color="currentColor" /></span>
                    <span>Verify submitted historical information</span>
                  </div>
                  <div className="auth-feature">
                    <span className="auth-feature-icon"><IconHeritage size={18} color="currentColor" /></span>
                    <span>Manage the public heritage repository</span>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="explorer-badge-pill"><IconUser size={16} color="currentColor" /> Community Explorer Portal</div>
                <h1 className="auth-left-title">Welcome Back, Explorer</h1>
                <p className="auth-left-desc">
                  Continue your journey discovering India's architectural marvels. Sign in to contribute and save sites.
                </p>
                <div className="auth-features">
                  <div className="auth-feature">
                    <span className="auth-feature-icon"><IconCamera size={18} color="currentColor" /></span>
                    <span>Document and upload photographs</span>
                  </div>
                  <div className="auth-feature">
                    <span className="auth-feature-icon"><IconHeart size={18} color="currentColor" fill="currentColor" /></span>
                    <span>Save sites to your personal wishlist</span>
                  </div>
                  <div className="auth-feature">
                    <span className="auth-feature-icon"><IconScroll size={18} color="currentColor" /></span>
                    <span>Share local lore and historical knowledge</span>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Right Side Form */}
        <div className="auth-right">
          <div className="auth-form-wrapper">
            {/* Role Switch Tabs */}
            <div className="auth-role-tabs">
              <button
                type="button"
                className={`auth-role-tab ${loginRole === 'user' ? 'active' : ''}`}
                onClick={() => handleRoleTabChange('user')}
              >
                <IconUser size={16} color="currentColor" /> Explorer Sign In
              </button>
              <button
                type="button"
                className={`auth-role-tab ${loginRole === 'admin' ? 'active admin-tab-active' : ''}`}
                onClick={() => handleRoleTabChange('admin')}
              >
                <IconShield size={16} color="currentColor" /> Admin Portal
              </button>
            </div>

            <h2 className="auth-title">
              {loginRole === 'admin' ? 'Administrator Sign In' : 'Explorer Sign In'}
            </h2>
            <p className="auth-subtitle">
              {loginRole === 'admin' 
                ? 'Enter your administrator email and password'
                : 'Enter your email address and password to access your account'}
            </p>

            <form className="auth-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">
                  {loginRole === 'admin' ? 'Admin Email Address' : 'Email Address'}
                </label>
                <div className="input-icon-wrapper">
                  <span className="input-icon"><IconUser size={16} color="currentColor" /></span>
                  <input
                    type="email"
                    className="form-input input-with-icon"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={loginRole === 'admin' ? 'Enter admin email...' : 'Enter your email...'}
                    autoComplete="email"
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
                    className="form-input input-with-icon"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password..."
                    autoComplete="current-password"
                    required
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <IconEye size={18} color="currentColor" /> : <IconEye size={18} color="currentColor" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className={`btn btn-lg auth-submit ${loginRole === 'admin' ? 'btn-primary-dark' : 'btn-primary'}`}
                disabled={loading}
              >
                {loading ? (
                  <span className="btn-loading">
                    <span className="btn-spinner"></span> Authenticating...
                  </span>
                ) : (
                  loginRole === 'admin' ? <><IconShield size={16} color="currentColor" /> Sign In as Administrator →</> : <><IconHeritage size={16} color="currentColor" /> Sign In as Explorer →</>
                )}
              </button>
            </form>

            <p className="auth-switch">
              Don't have an account yet? <Link to="/register">Register as an Explorer</Link>
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

export default Login
