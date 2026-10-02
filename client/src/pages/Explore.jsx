import { useState, useEffect, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import SiteCard from '../components/SiteCard'
import HeritageMap from '../components/HeritageMap'
import Loader from '../components/Loader'
import {
  IconHeritage,
  IconSearch
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
  const currentLocation = searchParams.get('location') || ''
  const currentRegions = searchParams.getAll('region')
  const regionsKey = currentRegions.join(',')
  const currentPage = parseInt(searchParams.get('page')) || 1

  const filterFallbackData = (typeFilter, searchFilter, locationFilter, regions, page, limit) => {
    let result = [...fallbackSites]

    if (typeFilter && typeFilter !== 'all') {
      result = result.filter(site => site.type.toLowerCase() === typeFilter.toLowerCase())
    }

    if (searchFilter && searchFilter.trim()) {
      const query = searchFilter.toLowerCase().trim()
      result = result.filter(site =>
        site.name.toLowerCase().includes(query) ||
        site.location.city.toLowerCase().includes(query) ||
        site.location.state.toLowerCase().includes(query) ||
        site.description.toLowerCase().includes(query)
      )
    }

    if (locationFilter.trim()) {
      const locationQuery = locationFilter.toLowerCase().trim()
      result = result.filter(site =>
        site.location.city.toLowerCase().includes(locationQuery) ||
        site.location.state.toLowerCase().includes(locationQuery)
      )
    }

    if (regions.length > 0) {
      const stateRegions = {
        North: ['Jammu and Kashmir', 'Ladakh', 'Himachal Pradesh', 'Punjab', 'Chandigarh', 'Uttarakhand', 'Haryana', 'Delhi', 'Uttar Pradesh', 'Rajasthan'],
        South: ['Andhra Pradesh', 'Karnataka', 'Kerala', 'Tamil Nadu', 'Telangana', 'Puducherry', 'Lakshadweep'],
        East: ['Bihar', 'Jharkhand', 'Odisha', 'West Bengal', 'Sikkim', 'Assam', 'Arunachal Pradesh', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Tripura'],
        West: ['Goa', 'Gujarat', 'Maharashtra', 'Dadra and Nagar Haveli and Daman and Diu'],
        Central: ['Chhattisgarh', 'Madhya Pradesh']
      }
      const states = regions.flatMap(region => stateRegions[region] || [])
      result = result.filter(site => states.includes(site.location.state))
    }

    setTotal(result.length)
    setPages(Math.ceil(result.length / limit) || 1)
    setDbSites(result.slice((page - 1) * limit, page * limit))
  }

  useEffect(() => {
    fetch('/api/sites/types')
      .then(response => response.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) setTypes(data)
      })
      .catch(() => {})
  }, [])

  useEffect(() => {
    setLoading(true)
    const params = new URLSearchParams()
    if (currentType !== 'all') params.set('type', currentType)
    if (currentSearch) params.set('search', currentSearch)
    if (currentLocation) params.set('location', currentLocation)
    if (currentRegions.length > 0) params.set('region', currentRegions.join(','))
    const page = viewMode === 'map' ? 1 : currentPage
    const limit = viewMode === 'map' ? 50 : 6
    params.set('page', page)
    params.set('limit', limit)

    fetch(`/api/sites?${params.toString()}`)
      .then(response => {
        if (!response.ok) throw new Error('Failed to fetch sites')
        return response.json()
      })
      .then(data => {
        if (data && Array.isArray(data.sites) && data.sites.length > 0) {
          setDbSites(data.sites)
          setTotal(data.total || data.sites.length)
          setPages(data.pages || 1)
        } else {
          filterFallbackData(currentType, currentSearch, currentLocation, currentRegions, page, limit)
        }
        setLoading(false)
      })
      .catch(() => {
        filterFallbackData(currentType, currentSearch, currentLocation, currentRegions, page, limit)
        setLoading(false)
      })
  }, [currentType, currentSearch, currentLocation, regionsKey, currentPage, viewMode])

  const sortedSites = useMemo(() => {
    const sites = [...dbSites]
    if (sortBy === 'name') return sites.sort((a, b) => a.name.localeCompare(b.name))
    if (sortBy === 'photos') {
      return sites.sort((a, b) => (b.photos?.length || 0) - (a.photos?.length || 0))
    }
    if (sortBy === 'contributions') {
      return sites.sort((a, b) => (b.contributionCount || 0) - (a.contributionCount || 0))
    }
    return sites.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0))
  }, [dbSites, sortBy])

  const updateFilter = (key, value) => {
    const params = new URLSearchParams(searchParams)
    if (value && value !== 'all') params.set(key, value)
    else params.delete(key)
    params.delete('page')
    setSearchParams(params)
  }

  const toggleRegion = (region) => {
    const params = new URLSearchParams(searchParams)
    const selectedRegions = params.getAll('region')
    params.delete('region')
    const nextRegions = selectedRegions.includes(region)
      ? selectedRegions.filter(selected => selected !== region)
      : [...selectedRegions, region]
    nextRegions.forEach(selected => params.append('region', selected))
    params.delete('page')
    setSearchParams(params)
  }

  const clearAllFilters = () => setSearchParams({})

  const goToPage = (page) => {
    const params = new URLSearchParams(searchParams)
    params.set('page', page)
    setSearchParams(params)
    window.scrollTo({ top: 300, behavior: 'smooth' })
  }

  return (
    <div className="explore">
      <div className="explore-shell container">
        <header className="explore-intro">
          <h1>Explore Heritage Sites</h1>
          <p>Discover historic monuments, temples, palaces, and hidden landmarks across the region.</p>
        </header>

        <div className="explore-layout">
          <aside className="explore-sidebar">
            <h3>Filters</h3>

            <div className="sidebar-controls">
              <div className="toolbar-field">
                <label htmlFor="search-filter">Search</label>
                <div className="field-with-icon">
                  <IconSearch size={15} color="#7c6557" />
                  <input
                    id="search-filter"
                    type="text"
                    value={currentSearch}
                    onChange={(e) => updateFilter('search', e.target.value)}
                    placeholder="Search sites..."
                  />
                </div>
              </div>

              <div className="toolbar-field">
                <label htmlFor="location-filter">Location</label>
                <input
                  id="location-filter"
                  type="text"
                  placeholder="Search city..."
                  value={currentLocation}
                  onChange={(e) => updateFilter('location', e.target.value)}
                />
              </div>

              <div className="toolbar-field">
                <label htmlFor="sort-filter">Sort by</label>
                <select
                  id="sort-filter"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="featured">Featured</option>
                  <option value="name">Name</option>
                  <option value="photos">Photos</option>
                  <option value="contributions">Popular</option>
                </select>
              </div>
            </div>

            <div className="filter-block">
              <span className="filter-title">Site Type</span>
              {types.map((type) => (
                <label key={type} className="check-row">
                  <input
                    type="checkbox"
                    checked={currentType.toLowerCase() === type.toLowerCase()}
                    onChange={() => updateFilter('type', currentType === type ? 'all' : type)}
                  />
                  <span>{type}</span>
                </label>
              ))}
            </div>

            <div className="filter-block">
              <span className="filter-title">Region</span>
              {['North', 'South', 'East', 'West', 'Central'].map((region) => (
                <label key={region} className="check-row">
                  <input
                    type="checkbox"
                    checked={currentRegions.includes(region)}
                    onChange={() => toggleRegion(region)}
                  />
                  <span>{region}</span>
                </label>
              ))}
            </div>

            <button type="button" className="reset-button" onClick={clearAllFilters}>Reset Filters</button>
          </aside>

          <main className="explore-main-panel">
            <div className="explore-view-toggle" role="group" aria-label="Results view">
              <button
                type="button"
                className={`view-toggle-btn ${viewMode === 'grid' ? 'active' : ''}`}
                onClick={() => setViewMode('grid')}
              >
                Grid
              </button>
              <button
                type="button"
                className={`view-toggle-btn ${viewMode === 'map' ? 'active' : ''}`}
                onClick={() => setViewMode('map')}
              >
                Map
              </button>
            </div>
            {loading ? (
              <Loader size="full" text="Loading India's heritage catalog..." />
            ) : sortedSites.length === 0 ? (
              <div className="explore-empty">
                <span className="empty-icon">
                  <IconHeritage size={48} color="var(--color-primary-light)" />
                </span>
                <h3>No Heritage Sites Match Your Search</h3>
                <p>Try a different town, monument name or clear your filters.</p>
                <button className="btn btn-primary" onClick={clearAllFilters}>
                  View All Heritage Sites
                </button>
              </div>
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
            ) : null}
          </main>
        </div>
      </div>
    </div>
  )
}

export default Explore
