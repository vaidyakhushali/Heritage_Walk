import { useState, useEffect, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import SiteCard from '../components/SiteCard'
import HeritageMap from '../components/HeritageMap'
import Loader from '../components/Loader'
import {
  IconHeritage,
  IconSearch,
  IconX,
  MonumentTypeIcon
} from '../components/Icons'
import { fallbackSites, fallbackTypes } from '../data/fallbackSites'
import './Explore.css'

function Explore() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [dbSites, setDbSites] = useState([])
  const [types, setTypes] = useState(fallbackTypes)
  const [loading, setLoading] = useState(true)
  const [total, setTotal] = useState(0)
  const [pages, setPages] = useState(1)
  const [sortBy, setSortBy] = useState('featured')
  const [viewMode, setViewMode] = useState('grid') // 'grid' or 'map'

  const currentType = searchParams.get('type') || 'all'
  const currentSearch = searchParams.get('search') || ''
  const currentPage = parseInt(searchParams.get('page')) || 1

  // Fetch distinct types
  useEffect(() => {
    fetch('/api/sites/types')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setTypes(data)
        }
      })
      .catch(() => {})
  }, [])

  // Fetch sites from API with graceful fallback to local dataset
  useEffect(() => {
    setLoading(true)
    const params = new URLSearchParams()
    if (currentType !== 'all') params.set('type', currentType)
    if (currentSearch) params.set('search', currentSearch)
    params.set('page', currentPage)
    params.set('limit', 12)

    fetch(`/api/sites?${params.toString()}`)
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch')
        return res.json()
      })
      .then(data => {
        if (data && Array.isArray(data.sites) && data.sites.length > 0) {
          setDbSites(data.sites)
          setTotal(data.total || data.sites.length)
          setPages(data.pages || 1)
        } else {
          filterFallbackData(currentType, currentSearch)
        }
        setLoading(false)
      })
      .catch(() => {
        filterFallbackData(currentType, currentSearch)
        setLoading(false)
      })
  }, [currentType, currentSearch, currentPage])

  const filterFallbackData = (typeFilter, searchFilter) => {
    let result = [...fallbackSites]

    if (typeFilter && typeFilter !== 'all') {
      result = result.filter(s => s.type.toLowerCase() === typeFilter.toLowerCase())
    }

    if (searchFilter && searchFilter.trim()) {
      const q = searchFilter.toLowerCase().trim()
      result = result.filter(s =>
        s.name.toLowerCase().includes(q) ||
        s.location.city.toLowerCase().includes(q) ||
        s.location.state.toLowerCase().includes(q) ||
        s.description.toLowerCase().includes(q)
      )
    }

    setDbSites(result)
    setTotal(result.length)
    setPages(Math.ceil(result.length / 12) || 1)
  }

  // Sorted sites
  const sortedSites = useMemo(() => {
    const list = [...dbSites]
    if (sortBy === 'name') {
      return list.sort((a, b) => a.name.localeCompare(b.name))
    }
    if (sortBy === 'photos') {
      return list.sort((a, b) => (b.photos?.length || 0) - (a.photos?.length || 0))
    }
    if (sortBy === 'contributions') {
      return list.sort((a, b) => (b.contributionCount || 0) - (a.contributionCount || 0))
    }
    // Default: featured first
    return list.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0))
  }, [dbSites, sortBy])

  const updateFilter = (key, value) => {
    const params = new URLSearchParams(searchParams)
    if (value && value !== 'all') {
      params.set(key, value)
    } else {
      params.delete(key)
    }
    params.delete('page')
    setSearchParams(params)
  }

  const clearAllFilters = () => {
    setSearchParams({})
  }

  const goToPage = (page) => {
    const params = new URLSearchParams(searchParams)
    params.set('page', page)
    setSearchParams(params)
    window.scrollTo({ top: 300, behavior: 'smooth' })
  }

  return (
    <div className="explore">
      {/* Page Header with Real Heritage Background */}
      <section className="explore-header">
        <div className="explore-header-overlay"></div>
        <div className="container explore-header-content">
          <span className="explore-badge">
            <IconHeritage size={14} color="currentColor" style={{ marginRight: '6px' }} />
            Interactive Heritage Repository
          </span>
          <h1>Explore India's Heritage Sites</h1>
          <p>
            Discover, study, and document ancient stepwells, ornate temples, havelis, and colonial monuments across tier-2 and tier-3 towns.
          </p>

          {/* Quick Category Filter Chips */}
          <div className="explore-chips-row">
            <button
              className={`explore-chip ${currentType === 'all' ? 'active' : ''}`}
              onClick={() => updateFilter('type', 'all')}
            >
              All Categories
            </button>
            {types.map(t => (
              <button
                key={t}
                className={`explore-chip ${currentType === t ? 'active' : ''}`}
                onClick={() => updateFilter('type', t)}
              >
                <MonumentTypeIcon type={t} size={14} color="currentColor" style={{ marginRight: '6px', verticalAlign: '-2px' }} />
                {t}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Sticky Filter & Search Bar */}
      <section className="explore-filters">
        <div className="container filters-bar">
          <div className="filter-group filter-search-wrap">
            <span className="search-inline-icon">
              <IconSearch size={18} color="var(--color-text-muted)" />
            </span>
            <input
              id="search-filter"
              type="text"
              className="form-input search-input-styled"
              placeholder="Search by monument name, city, or state..."
              value={currentSearch}
              onChange={(e) => updateFilter('search', e.target.value)}
            />
            {currentSearch && (
              <button
                type="button"
                className="clear-search-btn"
                onClick={() => updateFilter('search', '')}
                aria-label="Clear search text"
              >
                <IconX size={14} color="var(--color-text-muted)" />
              </button>
            )}
          </div>

          <div className="filter-group">
            <label htmlFor="type-filter" className="filter-label">Filter Type:</label>
            <select
              id="type-filter"
              className="form-select filter-select"
              value={currentType}
              onChange={(e) => updateFilter('type', e.target.value)}
            >
              <option value="all">All Heritage Types</option>
              {types.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label htmlFor="sort-filter" className="filter-label">Sort By:</label>
            <select
              id="sort-filter"
              className="form-select filter-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="featured">Featured First</option>
              <option value="name">Name (A - Z)</option>
              <option value="photos">Most Photos</option>
              <option value="contributions">Community Documented</option>
            </select>
          </div>

          {/* View Mode Toggle: Grid vs Map */}
          <div className="explore-view-toggle">
            <button
              type="button"
              className={`view-toggle-btn ${viewMode === 'grid' ? 'active' : ''}`}
              onClick={() => setViewMode('grid')}
              aria-label="Grid View"
            >
              ▦ Grid View
            </button>
            <button
              type="button"
              className={`view-toggle-btn ${viewMode === 'map' ? 'active' : ''}`}
              onClick={() => setViewMode('map')}
              aria-label="Interactive Map View"
            >
              Map View
            </button>
          </div>

          <div className="filter-results-badge">
            <strong>{total}</strong> site{total !== 1 ? 's' : ''} available
          </div>
        </div>

        {/* Active Filter Tags */}
        {(currentType !== 'all' || currentSearch) && (
          <div className="container active-tags-row">
            <span className="active-tags-label">Active Filters:</span>
            {currentType !== 'all' && (
              <span className="filter-tag">
                Type: <strong>{currentType}</strong>
                <button onClick={() => updateFilter('type', 'all')} aria-label="Remove type filter">
                  <IconX size={12} color="currentColor" />
                </button>
              </span>
            )}
            {currentSearch && (
              <span className="filter-tag">
                Search: <strong>"{currentSearch}"</strong>
                <button onClick={() => updateFilter('search', '')} aria-label="Remove search filter">
                  <IconX size={12} color="currentColor" />
                </button>
              </span>
            )}
            <button className="clear-all-link" onClick={clearAllFilters}>
              Clear All Filters
            </button>
          </div>
        )}
      </section>

      {/* Sites Results Section */}
      <section className="explore-results section-padding">
        <div className="container">
          {loading ? (
            <Loader size="full" text="Loading India's heritage catalog..." />
          ) : viewMode === 'map' ? (
            <div className="explore-map-container">
              <HeritageMap sites={sortedSites} selectedType={currentType} />
            </div>
          ) : sortedSites.length > 0 ? (
            <>
              <div className="sites-grid">
                {sortedSites.map((site) => (
                  <SiteCard key={site._id || site.slug} site={site} />
                ))}
              </div>

              {/* Pagination */}
              {pages > 1 && (
                <div className="pagination">
                  <button
                    className="pagination-btn"
                    disabled={currentPage <= 1}
                    onClick={() => goToPage(currentPage - 1)}
                  >
                    Previous
                  </button>

                  <div className="pagination-numbers">
                    {Array.from({ length: pages }, (_, i) => i + 1).map((pageNum) => (
                      <button
                        key={pageNum}
                        className={`pagination-num ${pageNum === currentPage ? 'active' : ''}`}
                        onClick={() => goToPage(pageNum)}
                      >
                        {pageNum}
                      </button>
                    ))}
                  </div>

                  <button
                    className="pagination-btn"
                    disabled={currentPage >= pages}
                    onClick={() => goToPage(currentPage + 1)}
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="explore-empty">
              <span className="empty-icon">
                <IconHeritage size={48} color="var(--color-primary-light)" />
              </span>
              <h3>No Heritage Sites Match Your Search</h3>
              <p>Try searching for a different town, monument name, or clear your category filters.</p>
              <button className="btn btn-primary" onClick={clearAllFilters}>
                View All Heritage Sites
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}

export default Explore
