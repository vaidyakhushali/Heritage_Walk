import { Routes, Route, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import { IconHeritage } from './components/Icons'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import InitialLoader from './components/InitialLoader'
import ContextualCursor from './components/ContextualCursor'
import Home from './pages/Home'
import Explore from './pages/Explore'
import SiteDetail from './pages/SiteDetail'
import Contribute from './pages/Contribute'
import About from './pages/About'
import Admin from './pages/Admin'
import Login from './pages/Login'
import Register from './pages/Register'
import Profile from './pages/Profile'
import Wishlist from './pages/Wishlist'
import InformationPage from './pages/InformationPage'
import './App.css'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}

function PageScrollReveal() {
  const { pathname } = useLocation()

  useEffect(() => {
    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) return

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      document.querySelectorAll('.reveal-on-scroll, .stagger-reveal, .how-it-works, .featured-section, .narrative-card, .significance-card, .gallery-section-card, .sidebar-box, .about-section, .audience-card, .stat-item, .step-card').forEach((el) => {
        el.classList.add('is-revealed')
      })
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-revealed')
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.1, rootMargin: '0px 0px -30px 0px' }
    )

    // Give DOM a tick to render
    const timer = setTimeout(() => {
      const elements = document.querySelectorAll(
        '.reveal-on-scroll, .stagger-reveal, .how-it-works, .featured-section, .narrative-card, .significance-card, .gallery-section-card, .sidebar-box, .about-section, .audience-card, .stat-item, .step-card'
      )
      elements.forEach((el) => {
        const rect = el.getBoundingClientRect()
        if (rect.top < window.innerHeight && rect.bottom > 0) {
          el.classList.add('is-revealed')
        } else {
          observer.observe(el)
        }
      })
    }, 60)

    return () => {
      clearTimeout(timer)
      observer.disconnect()
    }
  }, [pathname])

  return null
}

function NotFound() {
  return (
    <div className="not-found">
      <div className="container">
        <span className="not-found-emoji"><IconHeritage size={56} color="currentColor" /></span>
        <h1>404</h1>
        <p>The heritage you're looking for seems lost in history.</p>
        <a href="/" className="btn btn-primary">Return Home</a>
      </div>
    </div>
  )
}

function App() {
  return (
    <div className="app">
      <ContextualCursor />
      <InitialLoader />
      <ScrollToTop />
      <PageScrollReveal />
      <Navbar />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/site/:slug" element={<SiteDetail />} />
          <Route path="/contribute" element={<Contribute />} />
          <Route path="/about" element={<About />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/info/:page" element={<InformationPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}

export default App
