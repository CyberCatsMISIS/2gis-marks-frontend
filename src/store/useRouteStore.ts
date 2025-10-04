import { create } from 'zustand'
import { RouteState, Route, RouteFilter } from '@/types'

interface RouteStore extends RouteState {
  // Действия для маршрутов
  setCurrentRoute: (route: Route | null) => void
  setRouteFilter: (filter: RouteFilter | null) => void
  setIsBuildingRoute: (isBuilding: boolean) => void
  
  // Действия для фильтрации
  updateIncludeTags: (tags: string[]) => void
  updateExcludeTags: (tags: string[]) => void
  setStartPoint: (point: [number, number]) => void
  setEndPoint: (point: [number, number]) => void
  addWaypoint: (point: [number, number]) => void
  removeWaypoint: (index: number) => void
  clearWaypoints: () => void
  
  // Действия для построения маршрута
  buildRoute: () => Promise<void>
  clearRoute: () => void
}

export const useRouteStore = create<RouteStore>((set, get) => ({
  // Начальное состояние
  currentRoute: null,
  routeFilter: null,
  isBuildingRoute: false,

  // Действия
  setCurrentRoute: (currentRoute) => set({ currentRoute }),
  setRouteFilter: (routeFilter) => set({ routeFilter }),
  setIsBuildingRoute: (isBuildingRoute) => set({ isBuildingRoute }),

  updateIncludeTags: (includeTags) => set((state) => ({
    routeFilter: state.routeFilter ? {
      ...state.routeFilter,
      includeTags
    } : {
      includeTags,
      excludeTags: [],
      startPoint: [0, 0],
      endPoint: [0, 0]
    }
  })),
  updateExcludeTags: (excludeTags) => set((state) => ({
    routeFilter: state.routeFilter ? {
      ...state.routeFilter,
      excludeTags
    } : {
      includeTags: [],
      excludeTags,
      startPoint: [0, 0],
      endPoint: [0, 0]
    }
  })),
  setStartPoint: (startPoint) => set((state) => ({
    routeFilter: state.routeFilter ? {
      ...state.routeFilter,
      startPoint
    } : {
      includeTags: [],
      excludeTags: [],
      startPoint,
      endPoint: [0, 0]
    }
  })),
  setEndPoint: (endPoint) => set((state) => ({
    routeFilter: state.routeFilter ? {
      ...state.routeFilter,
      endPoint
    } : {
      includeTags: [],
      excludeTags: [],
      startPoint: [0, 0],
      endPoint
    }
  })),
  addWaypoint: (waypoint) => set((state) => ({
    routeFilter: state.routeFilter ? {
      ...state.routeFilter,
      waypoints: [...(state.routeFilter.waypoints || []), waypoint]
    } : {
      includeTags: [],
      excludeTags: [],
      startPoint: [0, 0],
      endPoint: [0, 0],
      waypoints: [waypoint]
    }
  })),
  removeWaypoint: (index) => set((state) => ({
    routeFilter: state.routeFilter && state.routeFilter.waypoints ? {
      ...state.routeFilter,
      waypoints: state.routeFilter.waypoints.filter((_, i) => i !== index)
    } : state.routeFilter
  })),
  clearWaypoints: () => set((state) => ({
    routeFilter: state.routeFilter ? {
      ...state.routeFilter,
      waypoints: []
    } : state.routeFilter
  })),

  buildRoute: async () => {
    const { routeFilter } = get()
    if (!routeFilter) return

    set({ isBuildingRoute: true })
    
    try {
      // Здесь будет вызов API для построения маршрута
      // const route = await routeApi.buildRoute(routeFilter)
      // set({ currentRoute: route })
    } catch (error) {
      console.error('Ошибка построения маршрута:', error)
    } finally {
      set({ isBuildingRoute: false })
    }
  },
  clearRoute: () => set({ currentRoute: null })
}))
