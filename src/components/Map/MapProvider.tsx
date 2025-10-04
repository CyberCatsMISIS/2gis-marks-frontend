import React, { createContext, useContext, useEffect, useState } from 'react'
import { MapGL } from '@2gis/mapgl'
import { useMapStore } from '@/store/useMapStore'

interface MapContextType {
  map: MapGL | null
  isMapLoaded: boolean
}

const MapContext = createContext<MapContextType | null>(null)

export const useMap = () => {
  const context = useContext(MapContext)
  if (!context) {
    throw new Error('useMap должен использоваться внутри MapProvider')
  }
  return context
}

interface MapProviderProps {
  children: React.ReactNode
}

export const MapProvider: React.FC<MapProviderProps> = ({ children }) => {
  const [map, setMap] = useState<MapGL | null>(null)
  const [isMapLoaded, setIsMapLoaded] = useState(false)
  const { center, zoom } = useMapStore()

  useEffect(() => {
    const initMap = async () => {
      try {
        // Инициализация карты 2GIS
        const mapInstance = new MapGL('map-container', {
          center,
          zoom,
          key: import.meta.env.VITE_2GIS_API_KEY || 'your-api-key-here',
        })

        mapInstance.on('load', () => {
          setIsMapLoaded(true)
        })

        setMap(mapInstance)
      } catch (error) {
        console.error('Ошибка инициализации карты:', error)
      }
    }

    initMap()

    return () => {
      if (map) {
        map.destroy()
      }
    }
  }, [])

  return (
    <MapContext.Provider value={{ map, isMapLoaded }}>
      {children}
    </MapContext.Provider>
  )
}
