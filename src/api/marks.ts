import { apiClient } from './client'
import { 
  Mark, 
  CreateMarkRequest, 
  UpdateMarkRequest, 
  GetMarksResponse,
  ApiResponse 
} from '@/types'

export const marksApi = {
  // Получить все метки пользователя
  getMarks: async (page = 1, limit = 50): Promise<GetMarksResponse> => {
    return apiClient.get<GetMarksResponse>(`/marks?page=${page}&limit=${limit}`)
  },

  // Получить метку по ID
  getMark: async (id: string): Promise<Mark> => {
    return apiClient.get<Mark>(`/marks/${id}`)
  },

  // Создать новую метку
  createMark: async (data: CreateMarkRequest): Promise<Mark> => {
    return apiClient.post<Mark>('/marks', data)
  },

  // Обновить метку
  updateMark: async (data: UpdateMarkRequest): Promise<Mark> => {
    return apiClient.put<Mark>(`/marks/${data.id}`, data)
  },

  // Удалить метку
  deleteMark: async (id: string): Promise<ApiResponse<null>> => {
    return apiClient.delete<ApiResponse<null>>(`/marks/${id}`)
  },

  // Поиск меток по тегам
  searchMarksByTags: async (tags: string[]): Promise<Mark[]> => {
    const query = tags.join(',')
    return apiClient.get<Mark[]>(`/marks/search?tags=${query}`)
  },

  // Получить метки в области карты
  getMarksInBounds: async (
    bounds: {
      north: number
      south: number
      east: number
      west: number
    }
  ): Promise<Mark[]> => {
    const { north, south, east, west } = bounds
    return apiClient.get<Mark[]>(
      `/marks/bounds?north=${north}&south=${south}&east=${east}&west=${west}`
    )
  }
}
