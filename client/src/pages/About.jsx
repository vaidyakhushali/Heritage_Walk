import { Link } from 'react-router-dom'
import './About.css'

function About() {
  return (
    <div className="about">
      {/* Hero */}
      <section className="about-hero">
        <div className="container">
          <h1>About HeritageWalk</h1>
          <p>Preserving India's architectural heritage, one community at a time</p>
        </div>
      </section>

      {/* Mission */}
      <section className="about-section section-padding">
        <div className="container">
          <div className="about-mission">
            <div className="mission-content">
              <span className="about-icon">🎯</span>
              <h2>Our Mission</h2>
              <p>
                Many people living in tier-2 and tier-3 towns see heritage places every day — stepwells, temples, havelis, colonial-era buildings — without knowing their historical or cultural importance. Many of these sites lack easily accessible photographs, historical information, or written records.
              </p>
              <p>
                <strong>HeritageWalk</strong> exists to change that. We are building a community-driven platform where anyone can discover heritage sites, learn about their history, and contribute to their documentation. Our goal is to create a growing, accessible collection of India's local heritage — one that preserves community knowledge for future generations.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="about-section about-alt section-padding">
        <div className="container">
          <span className="about-icon">🔄</span>
          <h2 className="section-title">How It Works</h2>
          <div className="about-flow">
            <div className="flow-step">
              <div className="flow-num">1</div>
              <h3>Discover</h3>
              <p>Browse heritage sites. View photographs and read historical information contributed by the community.</p>
            </div>
            <div className="flow-arrow">→</div>
            <div className="flow-step">
              <div className="flow-num">2</div>
              <h3>Learn</h3>
              <p>Understand the significance, architecture, and cultural context of each site through community-curated content.</p>
            </div>
            <div className="flow-arrow">→</div>
            <div className="flow-step">
              <div className="flow-num">3</div>
              <h3>Contribute</h3>
              <p>Share your own photographs, knowledge, or memories. Suggest new sites or corrections to existing information.</p>
            </div>
            <div className="flow-arrow">→</div>
            <div className="flow-step">
              <div className="flow-num">4</div>
              <h3>Review & Publish</h3>
              <p>Submissions are reviewed for quality. Approved content becomes part of the permanent heritage record.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Who Is It For */}
      <section className="about-section section-padding">
        <div className="container">
          <span className="about-icon">👥</span>
          <h2 className="section-title">Who Is HeritageWalk For?</h2>
          <div className="audience-grid">
            <div className="audience-card">
              <span className="audience-emoji">🏘️</span>
              <h3>Residents & Visitors</h3>
              <p>Discover heritage places near you. Learn what makes them special before or after visiting.</p>
            </div>
            <div className="audience-card">
              <span className="audience-emoji">🎓</span>
              <h3>Students & Young People</h3>
              <p>Use community-curated information as a starting point for school projects and cultural learning.</p>
            </div>
            <div className="audience-card">
              <span className="audience-emoji">📸</span>
              <h3>Community Contributors</h3>
              <p>Share your photographs and local knowledge. Help build a living record of heritage sites.</p>
            </div>
            <div className="audience-card">
              <span className="audience-emoji">🔬</span>
              <h3>Educators & Researchers</h3>
              <p>Access community-sourced material as supplementary documentation for further academic research.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Content Guidelines */}
      <section className="about-section about-alt section-padding">
        <div className="container">
          <span className="about-icon">📋</span>
          <h2 className="section-title">Content Guidelines</h2>
          <p className="section-subtitle">How we handle community contributions responsibly</p>

          <div className="guidelines-grid">
            <div className="guideline-item">
              <h3>✅ Verified vs. Personal</h3>
              <p>Contributors can mark whether their information is factually verified or based on personal memory and oral history. Both are valuable — we label them appropriately.</p>
            </div>
            <div className="guideline-item">
              <h3>📝 Attribution</h3>
              <p>All contributions are attributed to their contributors. Photographs include credit information. We respect the effort of every contributor.</p>
            </div>
            <div className="guideline-item">
              <h3>🔍 Review Process</h3>
              <p>Submitted content is reviewed before publication. This helps maintain quality, prevent misinformation, and ensure respectful representation.</p>
            </div>
            <div className="guideline-item">
              <h3>✏️ Corrections</h3>
              <p>Anyone can suggest corrections to existing information. Errors are taken seriously and addressed promptly.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Disclaimer */}
      <section className="about-section section-padding">
        <div className="container">
          <div className="disclaimer-block">
            <span className="about-icon">⚠️</span>
            <h2>Important Disclaimer</h2>
            <div className="disclaimer-content">
              <p>HeritageWalk is a <strong>community-sourced documentation platform</strong>. While we strive for accuracy, the information presented here:</p>
              <ul>
                <li>May not be officially verified or academically peer-reviewed</li>
                <li>Should be used as a <strong>starting point</strong> for learning, not as a definitive historical record</li>
                <li>Does not replace official heritage authorities, archaeological surveys, or specialist research</li>
                <li>Cannot guarantee the physical conservation or protection of any heritage site</li>
              </ul>
              <p>We encourage users to cross-reference information with official sources and to report any errors they find.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Get Involved CTA */}
      <section className="about-cta">
        <div className="container">
          <h2>Ready to Make a Difference?</h2>
          <p>Every photograph shared, every story told, every site documented brings us closer to preserving India's heritage for future generations.</p>
          <div className="about-cta-actions">
            <Link to="/contribute" className="btn btn-primary btn-lg">📸 Start Contributing</Link>
            <Link to="/explore" className="btn btn-outline-white btn-lg">🔍 Explore Sites</Link>
          </div>
        </div>
      </section>
    </div>
  )
}

export default About
