import React, { useState } from 'react'
import { MapPin, Navigation, Route, X, Plus } from 'lucide-react'
import { useRouteStore } from '@/store/useRouteStore'
import { useMapStore } from '@/store/useMapStore'
import { TagFilter } from '../Tags/TagFilter'

export const RouteBuilder: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false)
  const {
    routeFilter,
    isBuildingRoute,
    setStartPoint,
    setEndPoint,
    addWaypoint,
    removeWaypoint,
    clearWaypoints,
    buildRoute,
    clearRoute
  } = useRouteStore()

  const { selectedMark, setSelectedMark } = useMapStore()

  const handleSetStartPoint = () => {
    if (selectedMark) {
      setStartPoint(selectedMark.coordinates)
      setSelectedMark(null)
    }
  }

  const handleSetEndPoint = () => {
    if (selectedMark) {
      setEndPoint(selectedMark.coordinates)
      setSelectedMark(null)
    }
  }

  const handleAddWaypoint = () => {
    if (selectedMark) {
      addWaypoint(selectedMark.coordinates)
      setSelectedMark(null)
    }
  }

  const handleBuildRoute = () => {
    if (routeFilter?.startPoint && routeFilter?.endPoint) {
      buildRoute()
    }
  }

  const canBuildRoute = routeFilter?.startPoint && routeFilter?.endPoint

  return (
    <div className={`bg-white rounded-lg shadow-md transition-all duration-300 ${
      isExpanded ? 'h-auto' : 'h-16'
    }`}>
      <div 
        className="flex items-center justify-between p-4 cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-2">
          <Route className="w-5 h-5 text-2gis-blue" />
          <h3 className="text-lg font-semibold">Построение маршрута</h3>
        </div>
        <div className="flex items-center gap-2">
          {routeFilter && (
            <button
              onClick={(e) => {
                e.stopPropagation()
                clearRoute()
              }}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <div className={`transform transition-transform ${
            isExpanded ? 'rotate-180' : ''
          }`}>
            <Navigation className="w-4 h-4" />
          </div>
        </div>
      </div>

      {isExpanded && (
        <div className="px-4 pb-4 space-y-4 border-t border-gray-200">
          {/* Точки маршрута */}
          <div className="space-y-3">
            <h4 className="font-medium text-gray-700">Точки маршрута</h4>
            
            {/* Начальная точка */}
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <MapPin className="w-4 h-4 text-green-600" />
              </div>
              <div className="flex-1">
                <div className="text-sm font-medium text-gray-700">Откуда</div>
                <div className="text-sm text-gray-500">
                  {routeFilter?.startPoint 
                    ? `${routeFilter.startPoint[1].toFixed(4)}, ${routeFilter.startPoint[0].toFixed(4)}`
                    : 'Выберите начальную точку'
                  }
                </div>
              </div>
              <button
                onClick={handleSetStartPoint}
                disabled={!selectedMark}
                className="btn-secondary text-sm disabled:opacity-50"
              >
                {selectedMark ? 'Установить' : 'Выберите на карте'}
              </button>
            </div>

            {/* Промежуточные точки */}
            {routeFilter?.waypoints?.map((waypoint, index) => (
              <div key={index} className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium text-blue-600">{index + 1}</span>
                </div>
                <div className="flex-1">
                  <div className="text-sm font-medium text-gray-700">Промежуточная точка</div>
                  <div className="text-sm text-gray-500">
                    {waypoint[1].toFixed(4)}, {waypoint[0].toFixed(4)}
                  </div>
                </div>
                <button
                  onClick={() => removeWaypoint(index)}
                  className="text-red-500 hover:text-red-700"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}

            {/* Кнопка добавления промежуточной точки */}
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                <Plus className="w-4 h-4 text-gray-400" />
              </div>
              <div className="flex-1">
                <button
                  onClick={handleAddWaypoint}
                  disabled={!selectedMark}
                  className="text-sm text-blue-600 hover:text-blue-800 disabled:opacity-50"
                >
                  Добавить промежуточную точку
                </button>
              </div>
            </div>

            {/* Конечная точка */}
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                <MapPin className="w-4 h-4 text-red-600" />
              </div>
              <div className="flex-1">
                <div className="text-sm font-medium text-gray-700">Куда</div>
                <div className="text-sm text-gray-500">
                  {routeFilter?.endPoint 
                    ? `${routeFilter.endPoint[1].toFixed(4)}, ${routeFilter.endPoint[0].toFixed(4)}`
                    : 'Выберите конечную точку'
                  }
                </div>
              </div>
              <button
                onClick={handleSetEndPoint}
                disabled={!selectedMark}
                className="btn-secondary text-sm disabled:opacity-50"
              >
                {selectedMark ? 'Установить' : 'Выберите на карте'}
              </button>
            </div>
          </div>

          {/* Фильтр по тегам */}
          <div className="border-t border-gray-200 pt-4">
            <TagFilter />
          </div>

          {/* Кнопки действий */}
          <div className="flex gap-2 pt-4">
            <button
              onClick={() => clearWaypoints()}
              disabled={!routeFilter?.waypoints?.length}
              className="btn-secondary flex-1 disabled:opacity-50"
            >
              Очистить промежуточные
            </button>
            <button
              onClick={handleBuildRoute}
              disabled={!canBuildRoute || isBuildingRoute}
              className="btn-primary flex-1 disabled:opacity-50"
            >
              {isBuildingRoute ? 'Построение...' : 'Построить маршрут'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
