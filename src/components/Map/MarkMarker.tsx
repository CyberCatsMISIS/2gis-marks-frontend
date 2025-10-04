import React, { useEffect, useRef } from 'react'
import { Mark } from '@/types'
import { useMapStore } from '@/store/useMapStore'

interface MarkMarkerProps {
  mark: Mark
  map: any
}

// Получение цвета маркера на основе тегов
const getTagColor = (tags: string[]): string => {
  if (tags.includes('кафе') || tags.includes('ресторан')) return '#FF6B35'
  if (tags.includes('парковка')) return '#0066CC'
  if (tags.includes('wi-fi') || tags.includes('интернет')) return '#28a745'
  if (tags.includes('работа') || tags.includes('офис')) return '#6f42c1'
  return '#6c757d'
}

// Создание иконки маркера в виде data URL
const createMarkerIconUrl = (tags: string[]): string => {
  const color = getTagColor(tags);
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 36 36">
      <defs>
        <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="1" stdDeviation="1" flood-color="rgba(0,0,0,0.3)"/>
        </filter>
      </defs>
      <circle cx="18" cy="18" r="15" fill="${color}" stroke="white" stroke-width="2" filter="url(#shadow)"/>
      <text x="50%" y="50%" dominant-baseline="central" text-anchor="middle" font-size="18" dy=".1em">📍</text>
    </svg>
  `.trim();
  return `data:image/svg+xml;base64,${btoa(svg)}`;
};


export const MarkMarker: React.FC<MarkMarkerProps> = ({ mark, map }) => {
  const markerRef = useRef<any | null>(null)
  const { setSelectedMark } = useMapStore()

  useEffect(() => {
    if (map && (window as any).mapgl) {
      const mapgl = (window as any).mapgl;
      let marker: any;

      const createMarker = () => {
        try {
          marker = new mapgl.Marker(map, {
            coordinates: [mark.coordinates[1], mark.coordinates[0]],
            icon: createMarkerIconUrl(mark.tags),
            size: [36, 36],
            anchor: [18, 18],
          });

          // Обработка клика по маркеру
          marker.on('click', () => {
            setSelectedMark(mark)
          });

          markerRef.current = marker;

        } catch (error) {
          console.error('Ошибка создания маркера:', error)
        }
      }

      createMarker()

      return () => {
        if (markerRef.current) {
          markerRef.current.destroy()
        }
      }
    }
  }, [map, mark, setSelectedMark])

  return null
}