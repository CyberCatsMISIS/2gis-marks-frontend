import React, { createContext, useContext, useEffect, useState } from 'react'
import { useMapStore } from '@/store/useMapStore'

// Динамический импорт 2GIS Map SDK
let MapGL: any = null

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
        const apiKey = import.meta.env.VITE_2GIS_API_KEY;
        if (!apiKey) {
          console.error('VITE_2GIS_API_KEY не найден в переменных окружения');
          return;
        }

        const loadScript = () => new Promise((resolve, reject) => {
            if ((window as any).mapgl) {
                console.log('2GIS SDK уже загружен');
                return resolve((window as any).mapgl);
            }
            const script = document.createElement('script');
            script.src = 'https://mapgl.2gis.com/api/js/v1';
            script.onload = () => {
                if ((window as any).mapgl) {
                    console.log('2GIS SDK загружен и инициализирован');
                    resolve((window as any).mapgl);
                } else {
                    reject(new Error('mapgl is not available on window'));
                }
            };
            script.onerror = (error) => {
                console.error('Ошибка загрузки 2GIS SDK:', error);
                reject(error);
            };
            document.head.appendChild(script);
        });

        const mapglAPI = await loadScript();
        MapGL = (mapglAPI as any).Map;

        const mapInstance = new MapGL('map-container', {
          center: [center[1], center[0]],
          zoom,
          key: apiKey,
        });

        mapInstance.on('load', () => {
          console.log('Карта 2GIS загружена');
          setIsMapLoaded(true);
        });

        mapInstance.on('error', (error: any) => {
          console.error('Ошибка карты 2GIS:', error);
        });

        setMap(mapInstance);

      } catch (error) {
        console.error('Ошибка инициализации карты:', error);
        const mapContainer = document.getElementById('map-container');
        if (mapContainer) {
          mapContainer.innerHTML = `
            <div style="
              width: 100%;
              height: 100%;
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              display: flex;
              align-items: center;
              justify-content: center;
              color: white;
              font-size: 18px;
              text-align: center;
              flex-direction: column;
              gap: 10px;
            ">
              <div>🗺️</div>
              <div>Карта 2GIS недоступна</div>
              <div style="font-size: 14px; opacity: 0.8;">Проверьте подключение к интернету или API ключ.</div>
            </div>
          `;
          setIsMapLoaded(false); // Карта не загружена
        }
      }
    };

    initMap();

    return () => {
      if (map) {
        map.destroy();
      }
    };
  }, []); // Зависимости убраны, чтобы избежать повторной инициализации

  return (
    <MapContext.Provider value={{ map, isMapLoaded }}>
      {children}
    </MapContext.Provider>
  )
}

