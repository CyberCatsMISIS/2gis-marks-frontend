import React, { useEffect, useRef } from 'react'
import { MapGL, Marker } from '@2gis/mapgl'
import { Mark } from '@/types'
import { useMapStore } from '@/store/useMapStore'

interface MarkMarkerProps {
  mark: Mark
  map: MapGL
}

export const MarkMarker: React.FC<MarkMarkerProps> = ({ mark, map }) => {
  const markerRef = useRef<Marker | null>(null)
  const { setSelectedMark } = useMapStore()

  useEffect(() => {
    if (map) {
      try {
        // Создание маркера на карте
        const marker = new Marker(map, {
          coordinates: mark.coordinates,
          icon: createMarkerIcon(mark.tags),
          title: mark.title
        })

        markerRef.current = marker

        // Обработка клика по маркеру
        marker.on('click', () => {
          setSelectedMark(mark)
        })

        return () => {
          if (markerRef.current) {
            markerRef.current.destroy()
          }
        }
      } catch (error) {
        console.error('Ошибка создания маркера:', error)
      }
    }
  }, [map, mark, setSelectedMark])

  return null
}

// Создание иконки маркера на основе тегов
const createMarkerIcon = (tags: string[]) => {
  const color = getTagColor(tags)
  
  // Создаем HTML элемент для иконки
  const iconElement = document.createElement('div')
  iconElement.className = 'marker-icon'
  iconElement.style.cssText = `
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
    cursor: pointer;
  `
  iconElement.textContent = '📍'
  
  return iconElement
}

// Получение цвета маркера на основе тегов
const getTagColor = (tags: string[]): string => {
  if (tags.includes('кафе') || tags.includes('ресторан')) return '#FF6B35'
  if (tags.includes('парковка')) return '#0066CC'
  if (tags.includes('wi-fi') || tags.includes('интернет')) return '#28a745'
  if (tags.includes('работа') || tags.includes('офис')) return '#6f42c1'
  return '#6c757d'
}
