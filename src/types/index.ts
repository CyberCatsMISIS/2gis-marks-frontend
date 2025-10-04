// Основные типы для меток
export interface Mark {
  id: string
  title: string
  description: string
  coordinates: [number, number] // [lng, lat]
  tags: string[]
  createdAt: Date
  updatedAt: Date
  userId: string
}

// Типы для тегов
export interface Tag {
  id: string
  name: string
  category: TagCategory
  color: string
  usageCount: number
}

export enum TagCategory {
  FOOD = 'food',
  TRANSPORT = 'transport',
  ENTERTAINMENT = 'entertainment',
  SERVICES = 'services',
  INFRASTRUCTURE = 'infrastructure',
  CUSTOM = 'custom'
}

// Типы для маршрутов
export interface RouteFilter {
  includeTags: string[]
  excludeTags: string[]
  startPoint: [number, number]
  endPoint: [number, number]
  waypoints?: [number, number][]
}

export interface Route {
  id: string
  name: string
  points: [number, number][]
  distance: number
  duration: number
  tags: string[]
  createdAt: Date
}

// Типы для состояния приложения
export interface MapState {
  center: [number, number]
  zoom: number
  selectedMark: Mark | null
  marks: Mark[]
  isAddingMark: boolean
  newMarkPosition: [number, number] | null
}

export interface TagsState {
  availableTags: Tag[]
  selectedTags: string[]
  filterMode: 'include' | 'exclude'
  searchQuery: string
}

export interface RouteState {
  currentRoute: Route | null
  routeFilter: RouteFilter | null
  isBuildingRoute: boolean
}

// API типы
export interface ApiResponse<T> {
  data: T
  success: boolean
  message?: string
}

export interface CreateMarkRequest {
  title: string
  description: string
  coordinates: [number, number]
  tags: string[]
}

export interface UpdateMarkRequest extends Partial<CreateMarkRequest> {
  id: string
}

export interface GetMarksResponse {
  marks: Mark[]
  total: number
  page: number
  limit: number
}

export interface GetTagsResponse {
  tags: Tag[]
  categories: TagCategory[]
}

export interface BuildRouteRequest {
  startPoint: [number, number]
  endPoint: [number, number]
  waypoints?: [number, number][]
  includeTags?: string[]
  excludeTags?: string[]
}
