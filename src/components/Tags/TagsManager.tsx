import React, { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Plus, Edit, Trash2, Search, Filter } from 'lucide-react'
import { tagsApi } from '@/api/tags'
import { Tag, TagCategory } from '@/types'
import { TagItem } from './TagItem'
import { CreateTagForm } from './CreateTagForm'

export const TagsManager: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [showCreateForm, setShowCreateForm] = useState(false)
  const queryClient = useQueryClient()

  // Загрузка тегов
  const { data: tagsData, isLoading, error } = useQuery({
    queryKey: ['tags'],
    queryFn: () => tagsApi.getTags(),
    initialData: { tags: [], categories: Object.values(TagCategory) }
  })

  // Мутация для удаления тега
  const deleteTagMutation = useMutation({
    mutationFn: (id: string) => tagsApi.deleteTag(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tags'] })
    },
    onError: (error) => {
      console.error('Ошибка удаления тега:', error)
    }
  })

  const filteredTags = tagsData?.tags.filter(tag => {
    const matchesSearch = tag.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         tag.category.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || tag.category === selectedCategory
    return matchesSearch && matchesCategory
  }) || []

  const categories = [
    { id: 'all', label: 'Все категории' },
    ...(tagsData?.categories || []).map(cat => ({
      id: cat,
      label: getCategoryLabel(cat)
    }))
  ]

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Управление тегами</h3>
        <button
          onClick={() => setShowCreateForm(true)}
          className="btn-primary flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Создать тег
        </button>
      </div>

      {/* Поиск и фильтры */}
      <div className="space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input-field pl-10"
            placeholder="Поиск тегов..."
          />
        </div>

        <div className="flex gap-2">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="input-field flex-1"
          >
            {categories.map(category => (
              <option key={category.id} value={category.id}>
                {category.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Список тегов */}
      <div className="space-y-2">
        {isLoading ? (
          <div className="text-center py-8 text-gray-500">
            Загрузка тегов...
          </div>
        ) : error ? (
          <div className="text-center py-8 text-red-500">
            Ошибка загрузки тегов
          </div>
        ) : filteredTags.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Filter className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p>Теги не найдены</p>
            <p className="text-sm">Создайте первый тег или измените фильтры</p>
          </div>
        ) : (
          filteredTags.map((tag) => (
            <TagItem
              key={tag.id}
              tag={tag}
              onDelete={() => deleteTagMutation.mutate(tag.id)}
              isDeleting={deleteTagMutation.isPending}
            />
          ))
        )}
      </div>

      {/* Форма создания тега */}
      {showCreateForm && (
        <CreateTagForm
          onClose={() => setShowCreateForm(false)}
          onSuccess={() => {
            setShowCreateForm(false)
            queryClient.invalidateQueries({ queryKey: ['tags'] })
          }}
        />
      )}
    </div>
  )
}

// Вспомогательная функция для получения читаемого названия категории
const getCategoryLabel = (category: TagCategory): string => {
  const labels: Record<TagCategory, string> = {
    [TagCategory.FOOD]: 'Еда',
    [TagCategory.TRANSPORT]: 'Транспорт',
    [TagCategory.ENTERTAINMENT]: 'Развлечения',
    [TagCategory.SERVICES]: 'Услуги',
    [TagCategory.INFRASTRUCTURE]: 'Инфраструктура',
    [TagCategory.CUSTOM]: 'Пользовательские'
  }
  return labels[category] || category
}
