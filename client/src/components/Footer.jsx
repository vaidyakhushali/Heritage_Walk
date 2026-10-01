import { Link } from 'react-router-dom'
import './Footer.css'

function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-section footer-about">
            <div className="footer-logo">
              <span className="footer-logo-icon">🏛️</span>
              <span className="footer-logo-text">HeritageWalk</span>
            </div>
            <p className="footer-description">
              A community-driven platform to discover, document, and celebrate India's local heritage sites. Every site tells a story — help us preserve it.
            </p>
          </div>

          <div className="footer-section">
            <h4 className="footer-heading">Quick Links</h4>
            <ul className="footer-links">
              <li><Link to="/">Home</Link></li>
              <li><Link to="/explore">Explore Sites</Link></li>
              <li><Link to="/contribute">Contribute</Link></li>
              <li><Link to="/about">About Us</Link></li>
            </ul>
          </div>

          <div className="footer-section">
            <h4 className="footer-heading">Heritage Types</h4>
            <ul className="footer-links">
              <li><Link to="/explore?type=Stepwell">Stepwells</Link></li>
              <li><Link to="/explore?type=Temple">Temples</Link></li>
              <li><Link to="/explore?type=Haveli">Havelis</Link></li>
              <li><Link to="/explore?type=Colonial Building">Colonial Buildings</Link></li>
            </ul>
          </div>

          <div className="footer-section">
            <h4 className="footer-heading">Connect</h4>
            <ul className="footer-links">
              <li><a href="mailto:hello@heritagewalk.in">hello@heritagewalk.in</a></li>
              <li><Link to="/info/community-guidelines">Community Guidelines</Link></li>
              <li><Link to="/info/privacy-policy">Privacy Policy</Link></li>
              <li><Link to="/info/terms-of-use">Terms of Use</Link></li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} HeritageWalk. Built with ❤️ for India's heritage.</p>
          <p className="footer-disclaimer">Community-sourced content. Not a replacement for official heritage records.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
