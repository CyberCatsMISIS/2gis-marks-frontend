import { apiClient } from './client'
import { Route, BuildRouteRequest, ApiResponse } from '@/types'

export const routesApi = {
  // Построить маршрут с фильтрацией по тегам
  buildRoute: async (data: BuildRouteRequest): Promise<Route> => {
    return apiClient.post<Route>('/routes/build', data)
  },

  // Получить сохраненные маршруты пользователя
  getSavedRoutes: async (): Promise<Route[]> => {
    return apiClient.get<Route[]>('/routes/saved')
  },

  // Сохранить маршрут
  saveRoute: async (route: Omit<Route, 'id' | 'createdAt'>): Promise<Route> => {
    return apiClient.post<Route>('/routes/save', route)
  },

  // Удалить сохраненный маршрут
  deleteRoute: async (id: string): Promise<ApiResponse<null>> => {
    return apiClient.delete<ApiResponse<null>>(`/routes/${id}`)
  },

  // Получить маршрут по ID
  getRoute: async (id: string): Promise<Route> => {
    return apiClient.get<Route>(`/routes/${id}`)
  },

  // Обновить маршрут
  updateRoute: async (id: string, data: Partial<Route>): Promise<Route> => {
    return apiClient.put<Route>(`/routes/${id}`, data)
  },

  // Получить альтернативные маршруты
  getAlternativeRoutes: async (data: BuildRouteRequest): Promise<Route[]> => {
    return apiClient.post<Route[]>('/routes/alternatives', data)
  }
}
