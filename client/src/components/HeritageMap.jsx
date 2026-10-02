import { useEffect, useRef } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { fallbackSites } from '../data/fallbackSites'
import './HeritageMap.css'

function HeritageMap({ sites = [], selectedType = 'all' }) {
  const mapContainerRef = useRef(null)
  const mapInstanceRef = useRef(null)
  const markersGroupRef = useRef(null)

  // Strict India Geographic Boundaries
  const indiaSouthWest = L.latLng(6.5, 68.0)
  const indiaNorthEast = L.latLng(37.5, 97.5)
  const indiaBounds = L.latLngBounds(indiaSouthWest, indiaNorthEast)
  const indiaCenter = [22.5, 78.5]

  const getPinColor = (type) => {
    switch (type) {
      case 'Stepwell': return '#16a085'
      case 'Temple': return '#d35400'
      case 'Fort': return '#8e44ad'
      case 'Haveli': return '#c0392b'
      case 'Colonial Building': return '#2980b9'
      case 'Monument':
      default: return '#8B4513'
    }
  }

  const getPinIconSymbol = (type) => {
    const svgMap = {
      Stepwell: '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="M12 2.5c2.5 2.8 4.5 4.8 4.5 8.4A4.5 4.5 0 0 1 7.5 11c0-3.6 2-5.6 4.5-8.5Zm-1.1 9.8h2.2v8.2h-2.2v-8.2Zm-2.4 1.7h7v2.1h-7v-2.1Z" fill="currentColor"/></svg>',
      Temple: '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="M12 2.5 7.8 6.2h8.4L12 2.5Zm-5.5 5.3h11v2.2h-1.5v7.2H7.8v-7.2H6.5V7.8Zm1.8 2.2v5.6h7.4V10h-7.4Zm-2.1 8.8h11.6v1.7H6.2v-1.7Z" fill="currentColor"/></svg>',
      Fort: '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="M4 18.5h16v2H4v-2Zm1-12.2h2V8h2.5V6.3h2.5V8H14V6.3h2.5V8h2.5v8.5H5V6.3Zm2.5 3.1h9V9h-9v.4Zm0 3.1h9v.4h-9v-.4Z" fill="currentColor"/></svg>',
      Haveli: '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="M3.5 20.5h17v1.7h-17v-1.7Zm1.4-12.2 5.8-5 5.9 5v10.2h-11.7V8.3Zm2.5 1.4v8.2h6.7v-8.2H7.4Zm1.6 1.2h3.5v1.8H9v-1.8Zm0 3h3.5v1.8H9v-1.8Z" fill="currentColor"/></svg>',
      'Colonial Building': '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="M5 20.5h14v1.5H5v-1.5Zm1.5-12.6 5.3-4.3 5.2 4.3v11.7H6.5V7.9Zm2 1.6v8.1h2.4v-8.1H8.5Zm4.6 0v8.1h2.4v-8.1h-2.4Z" fill="currentColor"/></svg>',
      Monument: '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="M12 2.5 15 6v9.7h2.2v4.8H6.7v-4.8H9V6l3-3.5Zm-2.1 8.1h4.2v7.5H9.9v-7.5Z" fill="currentColor"/></svg>'
    }
    return svgMap[type] || svgMap.Monument
  }

  // Initialize Map strictly bounded to India
  useEffect(() => {
    if (!mapContainerRef.current) return
    if (mapInstanceRef.current) return

    const map = L.map(mapContainerRef.current, {
      center: indiaCenter,
      zoom: 5,
      minZoom: 5, // Restricts zooming out past India
      maxZoom: 16,
      maxBounds: indiaBounds, // Restricts panning strictly to India
      maxBoundsViscosity: 1.0, // Hard lock prevents dragging away from India
      scrollWheelZoom: true
    })

    // Standard OpenStreetMap Tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 18,
      minZoom: 5,
      bounds: indiaBounds
    }).addTo(map)

    const markersGroup = L.layerGroup().addTo(map)
    markersGroupRef.current = markersGroup
    mapInstanceRef.current = map

    setTimeout(() => {
      map.invalidateSize()
      map.fitBounds(indiaBounds, { padding: [20, 20] })
    }, 200)

    return () => {
      map.remove()
      mapInstanceRef.current = null
    }
  }, [])

  // Update Markers when sites or selectedType change
  useEffect(() => {
    if (!mapInstanceRef.current || !markersGroupRef.current) return

    markersGroupRef.current.clearLayers()

    // Ensure all sites have valid coordinates using fallback dataset if needed
    const resolvedSites = sites.map(site => {
      let coords = site.location?.coordinates
      if (!coords || !coords.lat) {
        const found = fallbackSites.find(f => f.slug === site.slug || f.name === site.name)
        if (found && found.location?.coordinates) {
          coords = found.location.coordinates
        }
      }
      return {
        ...site,
        location: {
          ...site.location,
          coordinates: coords || { lat: 23.5, lng: 72.5 }
        }
      }
    })

    const filteredSites = selectedType && selectedType !== 'all'
      ? resolvedSites.filter(s => s.type.toLowerCase() === selectedType.toLowerCase())
      : resolvedSites

    if (filteredSites.length === 0) return

    const bounds = L.latLngBounds()

    filteredSites.forEach(site => {
      const { lat, lng } = site.location.coordinates
      const color = getPinColor(site.type)
      const pinSvg = getPinIconSymbol(site.type)
      const mainPhoto = site.photos?.[0]?.url || 'https://images.unsplash.com/photo-1590766940554-634ee7ef6981?auto=format&fit=crop&w=400&q=80'

      // Custom Heritage Pin Marker
      const customIcon = L.divIcon({
        className: 'heritage-map-pin-wrap',
        html: `
          <div class="heritage-custom-pin" style="background: ${color}; border-color: #fff; color: #fff;">
            <span class="pin-symbol">${pinSvg}</span>
          </div>
        `,
        iconSize: [36, 36],
        iconAnchor: [18, 36],
        popupAnchor: [0, -36]
      })

      const popupContent = `
        <div class="heritage-map-popup">
          <div class="popup-img-wrap">
            <img src="${mainPhoto}" alt="${site.name}" />
            <span class="popup-type-pill" style="background: ${color};">${site.type}</span>
          </div>
          <div class="popup-body">
            <h4>${site.name}</h4>
            <p class="popup-loc"><svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true" style="vertical-align:middle; margin-right:4px;"><path d="M12 21s6-5.6 6-11A6 6 0 1 0 6 10c0 5.4 6 11 6 11Zm0-8.5a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5Z" fill="currentColor"/></svg>${site.location.city}, ${site.location.state}</p>
            ${site.period ? `<p class="popup-era">⏳ ${site.period}</p>` : ''}
            <a href="/site/${site.slug}" class="popup-btn">
              Explore Monument →
            </a>
          </div>
        </div>
      `

      const marker = L.marker([lat, lng], { icon: customIcon })
      marker.bindPopup(popupContent, { maxWidth: 280, className: 'hw-leaflet-popup' })
      markersGroupRef.current.addLayer(marker)
      bounds.extend([lat, lng])
    })

    if (filteredSites.length > 0 && mapInstanceRef.current) {
      if (filteredSites.length === 1) {
        const { lat, lng } = filteredSites[0].location.coordinates
        mapInstanceRef.current.setView([lat, lng], 8)
      } else if (selectedType !== 'all') {
        mapInstanceRef.current.fitBounds(bounds, { padding: [50, 50], maxZoom: 8 })
      } else {
        // Default to whole India view containing all pins
        mapInstanceRef.current.fitBounds(bounds, { padding: [40, 40], maxZoom: 7 })
      }
      setTimeout(() => {
        mapInstanceRef.current?.invalidateSize()
      }, 200)
    }
  }, [sites, selectedType])

  return (
    <div className="heritage-map-wrapper">
      <div className="heritage-map-legend">
        <span className="legend-title"><svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" style={{ verticalAlign: 'middle', marginRight: '6px' }}><path d="M3 20h18v2H3v-2Zm2-5.8V7.2l5-3.1 5 3.1v7h-5v-4.2H5Zm2.5-1.1h2.6V9.4h2.1v3.7h2.6V8.2L12 5.9l-4.5 2.3v4.8Z" fill="currentColor" /></svg>India Heritage Map:</span>
        <span className="legend-item"><span className="legend-dot" style={{ background: '#16a085' }}></span> Stepwells</span>
        <span className="legend-item"><span className="legend-dot" style={{ background: '#d35400' }}></span> Temples</span>
        <span className="legend-item"><span className="legend-dot" style={{ background: '#8e44ad' }}></span> Forts</span>
        <span className="legend-item"><span className="legend-dot" style={{ background: '#c0392b' }}></span> Havelis</span>
        <span className="legend-item"><span className="legend-dot" style={{ background: '#2980b9' }}></span> Colonial</span>
        <span className="legend-item"><span className="legend-dot" style={{ background: '#8B4513' }}></span> Monuments</span>
      </div>
      <div ref={mapContainerRef} className="heritage-leaflet-container" />
    </div>
  )
}

export default HeritageMap
