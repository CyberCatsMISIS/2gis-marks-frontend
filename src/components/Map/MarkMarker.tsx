import React, { useEffect, useRef } from 'react'
import { MapGL } from '@2gis/mapgl'
import { Mark } from '@/types'
import { useMapStore } from '@/store/useMapStore'

interface MarkMarkerProps {
  mark: Mark
  map: MapGL
}

export const MarkMarker: React.FC<MarkMarkerProps> = ({ mark, map }) => {
  const markerRef = useRef<any>(null)
  const { setSelectedMark } = useMapStore()

  useEffect(() => {
    if (map) {
      // Создание маркера на карте
      const marker = new (window as any).DG.Marker([mark.coordinates[1], mark.coordinates[0]], {
        icon: createMarkerIcon(mark.tags),
        title: mark.title
      })

      marker.addTo(map)
      markerRef.current = marker

      // Обработка клика по маркеру
      marker.on('click', () => {
        setSelectedMark(mark)
      })

      return () => {
        if (markerRef.current) {
          markerRef.current.remove()
        }
      }
    }
  }, [map, mark, setSelectedMark])

  return null
}

// Создание иконки маркера на основе тегов
const createMarkerIcon = (tags: string[]) => {
  const color = getTagColor(tags)
  
  return {
    html: `
      <div class="marker-icon" style="
        width: 30px;
        height: 30px;
        background-color: ${color};
        border: 2px solid white;
        border-radius: 50%;
        box-shadow: 0 2px 4px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 14px;
        color: white;
        font-weight: bold;
      ">
        📍
      </div>
    `,
    iconSize: [30, 30],
    iconAnchor: [15, 15]
  }
}

// Получение цвета маркера на основе тегов
const getTagColor = (tags: string[]): string => {
  if (tags.includes('кафе') || tags.includes('ресторан')) return '#FF6B35'
  if (tags.includes('парковка')) return '#0066CC'
  if (tags.includes('wi-fi') || tags.includes('интернет')) return '#28a745'
  if (tags.includes('работа') || tags.includes('офис')) return '#6f42c1'
  return '#6c757d'
}
