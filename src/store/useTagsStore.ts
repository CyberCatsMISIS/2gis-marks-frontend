import { create } from 'zustand'
import { TagsState, Tag, TagCategory } from '@/types'

interface TagsStore extends TagsState {
  // Действия для тегов
  setAvailableTags: (tags: Tag[]) => void
  addTag: (tag: Tag) => void
  updateTag: (tag: Tag) => void
  removeTag: (tagId: string) => void
  
  // Действия для выбора тегов
  toggleTag: (tagId: string) => void
  setSelectedTags: (tagIds: string[]) => void
  clearSelectedTags: () => void
  
  // Действия для фильтрации
  setFilterMode: (mode: 'include' | 'exclude') => void
  setSearchQuery: (query: string) => void
  
  // Получение отфильтрованных тегов
  getFilteredTags: () => Tag[]
  getSelectedTags: () => Tag[]
}

export const useTagsStore = create<TagsStore>((set, get) => ({
  // Начальное состояние
  availableTags: [],
  selectedTags: [],
  filterMode: 'include',
  searchQuery: '',

  // Действия
  setAvailableTags: (availableTags) => set({ availableTags }),
  addTag: (tag) => set((state) => ({ 
    availableTags: [...state.availableTags, tag] 
  })),
  updateTag: (updatedTag) => set((state) => ({
    availableTags: state.availableTags.map(tag => 
      tag.id === updatedTag.id ? updatedTag : tag
    )
  })),
  removeTag: (tagId) => set((state) => ({
    availableTags: state.availableTags.filter(tag => tag.id !== tagId)
  })),

  toggleTag: (tagId) => set((state) => {
    const isSelected = state.selectedTags.includes(tagId)
    return {
      selectedTags: isSelected
        ? state.selectedTags.filter(id => id !== tagId)
        : [...state.selectedTags, tagId]
    }
  }),
  setSelectedTags: (selectedTags) => set({ selectedTags }),
  clearSelectedTags: () => set({ selectedTags: [] }),

  setFilterMode: (filterMode) => set({ filterMode }),
  setSearchQuery: (searchQuery) => set({ searchQuery }),

  // Селекторы
  getFilteredTags: () => {
    const { availableTags, searchQuery } = get()
    if (!searchQuery) return availableTags
    
    return availableTags.filter(tag => 
      tag.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tag.category.toLowerCase().includes(searchQuery.toLowerCase())
    )
  },
  getSelectedTags: () => {
    const { availableTags, selectedTags } = get()
    return availableTags.filter(tag => selectedTags.includes(tag.id))
  }
}))
