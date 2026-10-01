import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { IconUsers } from './Icons'
import './TravelTipsSection.css'

const initialTips = {
  'site-rani-ki-vav': [
    {
      id: 'tip-1',
      author: 'Aarav Sharma',
      category: 'Photography',
      text: 'Visit between 8:00 AM and 10:00 AM. Morning light streams down the western pillars giving unmatched relief depth to the Vishnu avatar sculptures.',
      helpful: 12,
      createdAt: '2 days ago'
    },
    {
      id: 'tip-2',
      author: 'Pooja Mehta',
      category: 'Accessibility',
      text: 'The garden area at ground level is wheelchair-friendly, but descending down the 7 tiers requires navigating stone steps.',
      helpful: 8,
      createdAt: '1 week ago'
    }
  ],
  'site-modhera-sun-temple': [
    {
      id: 'tip-3',
      author: 'Vikram Dave',
      category: 'Timing',
      text: 'If visiting in January, do not miss the annual Modhera Dance Festival held against the illuminated temple facade after sunset!',
      helpful: 15,
      createdAt: '3 days ago'
    },
    {
      id: 'tip-4',
      author: 'Sneha Patel',
      category: 'Photography',
      text: 'Walk around the Surya Kund stepwell perimeter to get the complete reflection of the 52 Sabha Mandapa columns.',
      helpful: 9,
      createdAt: '5 days ago'
    }
  ]
}

function TravelTipsSection({ siteId, siteName }) {
  const { user } = useAuth()
  const storageKey = `hw_tips_${siteId}`

  const [tips, setTips] = useState(() => {
    const saved = localStorage.getItem(storageKey)
    if (saved) {
      try { return JSON.parse(saved) } catch {}
    }
    return initialTips[siteId] || [
      {
        id: `tip-default-${siteId}`,
        author: 'Heritage Field Team',
        category: 'Travel Advice',
        text: `Wear comfortable walking shoes with good grip on stone floors. Early morning visits avoid both crowds and mid-day sun.`,
        helpful: 6,
        createdAt: 'Verified Archive Note'
      }
    ]
  })

  const [newText, setNewText] = useState('')
  const [newCategory, setNewCategory] = useState('Photography')
  const [userUpvotes, setUserUpvotes] = useState({})
  const [showForm, setShowForm] = useState(false)

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(tips))
  }, [tips, storageKey])

  const handleAddTip = (e) => {
    e.preventDefault()
    if (!newText.trim() || !user) return

    const newTip = {
      id: `tip-${Date.now()}`,
      author: user.name,
      category: newCategory,
      text: newText.trim(),
      helpful: 1,
      createdAt: 'Just now'
    }

    setTips([newTip, ...tips])
    setNewText('')
    setShowForm(false)
  }

  const handleUpvote = (id) => {
    if (userUpvotes[id]) return
    setUserUpvotes({ ...userUpvotes, [id]: true })
    setTips(tips.map(t => t.id === id ? { ...t, helpful: t.helpful + 1 } : t))
  }

  const categories = [
    { label: '📷 Photography', value: 'Photography' },
    { label: '⏰ Best Timing', value: 'Timing' },
    { label: '🎟️ Entry & Guide', value: 'Entry & Guide' },
    { label: '♿ Accessibility', value: 'Accessibility' },
    { label: '💡 General Tip', value: 'General Tip' }
  ]

  return (
    <div className="travel-tips-card">
      <div className="travel-tips-header">
        <div>
          <span className="heritage-card-kicker">Field Knowledge</span>
          <h2 className="heritage-card-title">Traveler Advice & Field Tips</h2>
        </div>

        {user ? (
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={() => setShowForm(!showForm)}
          >
            {showForm ? 'Cancel' : '✍️ Share a Field Tip'}
          </button>
        ) : (
          <span className="tips-signin-hint">Sign in to share your field tips</span>
        )}
      </div>

      {showForm && (
        <form onSubmit={handleAddTip} className="add-tip-form">
          <h4>Share your visiting experience at {siteName}</h4>
          <div className="tip-form-row">
            <label className="tip-category-label">Category:</label>
            <div className="tip-category-chips">
              {categories.map(c => (
                <button
                  key={c.value}
                  type="button"
                  className={`tip-cat-chip ${newCategory === c.value ? 'active' : ''}`}
                  onClick={() => setNewCategory(c.value)}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>

          <textarea
            className="form-input tip-textarea"
            rows={3}
            placeholder="Share useful visitor tips: best photo spots, lighting, transport advice, or cultural etiquette..."
            value={newText}
            onChange={(e) => setNewText(e.target.value)}
            required
          />

          <button type="submit" className="btn btn-primary btn-sm submit-tip-btn">
            Publish Field Tip →
          </button>
        </form>
      )}

      <div className="tips-list">
        {tips.map(tip => (
          <div key={tip.id} className="tip-item">
            <div className="tip-meta-row">
              <span className="tip-author">
                <IconUsers size={14} color="var(--color-primary)" />
                <strong>{tip.author}</strong>
              </span>
              <span className="tip-badge">{tip.category}</span>
              <span className="tip-date">{tip.createdAt}</span>
            </div>

            <p className="tip-text">{tip.text}</p>

            <button
              type="button"
              className={`tip-helpful-btn ${userUpvotes[tip.id] ? 'upvoted' : ''}`}
              onClick={() => handleUpvote(tip.id)}
            >
              👍 Helpful ({tip.helpful})
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

export default TravelTipsSection
