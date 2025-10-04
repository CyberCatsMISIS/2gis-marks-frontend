import { apiClient } from './client'
import { Tag, GetTagsResponse, ApiResponse } from '@/types'

export const tagsApi = {
  // Получить все доступные теги
  getTags: async (): Promise<GetTagsResponse> => {
    return apiClient.get<GetTagsResponse>('/tags')
  },

  // Получить теги по категории
  getTagsByCategory: async (category: string): Promise<Tag[]> => {
    return apiClient.get<Tag[]>(`/tags/category/${category}`)
  },

  // Создать новый тег
  createTag: async (data: Omit<Tag, 'id' | 'usageCount'>): Promise<Tag> => {
    return apiClient.post<Tag>('/tags', data)
  },

  // Обновить тег
  updateTag: async (id: string, data: Partial<Tag>): Promise<Tag> => {
    return apiClient.put<Tag>(`/tags/${id}`, data)
  },

  // Удалить тег
  deleteTag: async (id: string): Promise<ApiResponse<null>> => {
    return apiClient.delete<ApiResponse<null>>(`/tags/${id}`)
  },

  // Поиск тегов
  searchTags: async (query: string): Promise<Tag[]> => {
    return apiClient.get<Tag[]>(`/tags/search?q=${encodeURIComponent(query)}`)
  },

  // Получить рекомендуемые теги на основе описания
  getSuggestedTags: async (description: string): Promise<Tag[]> => {
    return apiClient.post<Tag[]>('/tags/suggest', { description })
  },

  // Обновить счетчик использования тега
  incrementTagUsage: async (tagId: string): Promise<void> => {
    return apiClient.post<void>(`/tags/${tagId}/increment`)
  }
}
