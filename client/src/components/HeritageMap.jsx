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
    switch (type) {
      case 'Stepwell': return '💧'
      case 'Temple': return '🛕'
      case 'Fort': return '🏰'
      case 'Haveli': return '🏛️'
      case 'Colonial Building': return '⛪'
      case 'Monument':
      default: return '🗿'
    }
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
    const resolvedSites = (sites.length > 0 ? sites : fallbackSites).map(site => {
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
      const iconEmoji = getPinIconSymbol(site.type)
      const mainPhoto = site.photos?.[0]?.url || 'https://images.unsplash.com/photo-1590766940554-634ee7ef6981?auto=format&fit=crop&w=400&q=80'

      // Custom Heritage Pin Marker
      const customIcon = L.divIcon({
        className: 'heritage-map-pin-wrap',
        html: `
          <div class="heritage-custom-pin" style="background: ${color}; border-color: #fff;">
            <span class="pin-symbol">${iconEmoji}</span>
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
            <p class="popup-loc">📍 ${site.location.city}, ${site.location.state}</p>
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
        <span className="legend-title">🏛️ India Heritage Map:</span>
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
