import { useState, useEffect, useRef } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import {
  IconStepwell,
  IconUser,
  IconHeart,
  IconCamera,
  IconShield,
  IconSparkles
} from './Icons'
import './Navbar.css'

function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const userMenuRef = useRef(null)

  // Handle navbar shadow on scroll
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const toggleMenu = () => setIsOpen(!isOpen)
  const closeMenu = () => {
    setIsOpen(false)
    setDropdownOpen(false)
  }

  const handleLogout = () => {
    logout()
    closeMenu()
    navigate('/')
  }

  const getInitials = (name) => {
    if (!name) return 'HW'
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <nav className={`navbar ${scrolled ? 'navbar-scrolled' : ''}`}>
      <div className="container navbar-container">
        <Link to="/" className="navbar-logo" onClick={closeMenu}>
          <span className="logo-mark" aria-hidden="true">
            <IconStepwell size={21} color="#F7DDA7" />
          </span>
          <span className="logo-text">HeritageWalk</span>
        </Link>

        <button
          className={`navbar-toggle ${isOpen ? 'active' : ''}`}
          onClick={toggleMenu}
          aria-label="Toggle navigation menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        <div className={`navbar-menu ${isOpen ? 'open' : ''}`}>
          <NavLink to="/" className="navbar-link" onClick={closeMenu}>Home</NavLink>
          <NavLink to="/explore" className="navbar-link" onClick={closeMenu}>Explore</NavLink>
          <NavLink to="/contribute" className="navbar-link" onClick={closeMenu}>Contribute</NavLink>
          <NavLink to="/about" className="navbar-link" onClick={closeMenu}>About</NavLink>

          <div className="navbar-right">
            {user ? (
              <div
                className="navbar-user"
                ref={userMenuRef}
              >
                <button
                  type="button"
                  className={`navbar-avatar-btn ${dropdownOpen ? 'active' : ''}`}
                  onClick={() => setDropdownOpen(prev => !prev)}
                  aria-expanded={dropdownOpen}
                  aria-haspopup="true"
                >
                  <span className="navbar-avatar">{getInitials(user.name)}</span>
                  <span className="navbar-username">{user.name.split(' ')[0]}</span>
                  <span className={`dropdown-arrow ${dropdownOpen ? 'open' : ''}`}>▾</span>
                </button>

                {dropdownOpen && (
                  <div className="navbar-dropdown">
                    <div className="dropdown-header">
                      <div className="dropdown-user-badge">
                        {user.role === 'admin' ? (
                          <>
                            <IconShield size={14} color="var(--color-accent)" /> Administrator
                          </>
                        ) : (
                          <>
                            <IconSparkles size={14} color="var(--color-accent)" /> Community Explorer
                          </>
                        )}
                      </div>
                      <span className="dropdown-name">{user.name}</span>
                      <span className="dropdown-email">{user.email}</span>
                    </div>

                    <div className="dropdown-divider"></div>

                    <Link to="/profile" className="dropdown-item" onClick={closeMenu}>
                      <span className="dropdown-item-icon">
                        <IconUser size={16} color="var(--color-primary)" />
                      </span>
                      <span>My Profile</span>
                    </Link>

                    <Link to="/wishlist" className="dropdown-item" onClick={closeMenu}>
                      <span className="dropdown-item-icon">
                        <IconHeart size={16} color="#e74c3c" fill="#e74c3c" />
                      </span>
                      <span>My Saved Wishlist</span>
                      {user.wishlist?.length > 0 && (
                        <span className="dropdown-item-badge">{user.wishlist.length}</span>
                      )}
                    </Link>

                    <Link to="/contribute" className="dropdown-item" onClick={closeMenu}>
                      <span className="dropdown-item-icon">
                        <IconCamera size={16} color="var(--color-primary)" />
                      </span>
                      <span>Contribute Documentation</span>
                    </Link>

                    {user.role === 'admin' && (
                      <Link to="/admin" className="dropdown-item admin-dropdown-highlight" onClick={closeMenu}>
                        <span className="dropdown-item-icon">
                          <IconShield size={16} color="var(--color-primary-dark)" />
                        </span>
                        <span>Curator Dashboard</span>
                      </Link>
                    )}

                    <div className="dropdown-divider"></div>

                    <button
                      type="button"
                      className="dropdown-item dropdown-logout"
                      onClick={handleLogout}
                    >
                      <span className="dropdown-item-icon">
                        <IconUser size={16} color="var(--color-error)" />
                      </span>
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="navbar-auth">
                <Link to="/login" className="navbar-link" onClick={closeMenu}>Sign In</Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
