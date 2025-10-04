import React, { useState } from 'react'
import { Edit, Trash2, MoreVertical } from 'lucide-react'
import { Tag } from '@/types'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { tagsApi } from '@/api/tags'

interface TagItemProps {
  tag: Tag
  onDelete: () => void
  isDeleting: boolean
}

export const TagItem: React.FC<TagItemProps> = ({ tag, onDelete, isDeleting }) => {
  const [isEditing, setIsEditing] = useState(false)
  const [editData, setEditData] = useState({
    name: tag.name,
    category: tag.category,
    color: tag.color
  })
  const queryClient = useQueryClient()

  // Мутация для обновления тега
  const updateTagMutation = useMutation({
    mutationFn: (data: Partial<Tag>) => tagsApi.updateTag(tag.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tags'] })
      setIsEditing(false)
    },
    onError: (error) => {
      console.error('Ошибка обновления тега:', error)
    }
  })

  const handleSave = () => {
    updateTagMutation.mutate(editData)
  }

  const handleCancel = () => {
    setEditData({
      name: tag.name,
      category: tag.category,
      color: tag.color
    })
    setIsEditing(false)
  }

  const getCategoryLabel = (category: string): string => {
    const labels: Record<string, string> = {
      food: 'Еда',
      transport: 'Транспорт',
      entertainment: 'Развлечения',
      services: 'Услуги',
      infrastructure: 'Инфраструктура',
      custom: 'Пользовательские'
    }
    return labels[category] || category
  }

  if (isEditing) {
    return (
      <div className="p-3 border border-gray-200 rounded-lg bg-white">
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Название
            </label>
            <input
              type="text"
              value={editData.name}
              onChange={(e) => setEditData(prev => ({ ...prev, name: e.target.value }))}
              className="input-field"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Категория
            </label>
            <select
              value={editData.category}
              onChange={(e) => setEditData(prev => ({ ...prev, category: e.target.value as any }))}
              className="input-field"
            >
              <option value="food">Еда</option>
              <option value="transport">Транспорт</option>
              <option value="entertainment">Развлечения</option>
              <option value="services">Услуги</option>
              <option value="infrastructure">Инфраструктура</option>
              <option value="custom">Пользовательские</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Цвет
            </label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={editData.color}
                onChange={(e) => setEditData(prev => ({ ...prev, color: e.target.value }))}
                className="w-8 h-8 rounded border border-gray-300"
              />
              <input
                type="text"
                value={editData.color}
                onChange={(e) => setEditData(prev => ({ ...prev, color: e.target.value }))}
                className="input-field flex-1"
              />
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleSave}
              disabled={updateTagMutation.isPending}
              className="btn-primary flex-1 disabled:opacity-50"
            >
              {updateTagMutation.isPending ? 'Сохранение...' : 'Сохранить'}
            </button>
            <button
              onClick={handleCancel}
              className="btn-secondary flex-1"
            >
              Отмена
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-3 border border-gray-200 rounded-lg bg-white hover:bg-gray-50 transition-colors">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div
            className="w-4 h-4 rounded-full flex-shrink-0"
            style={{ backgroundColor: tag.color }}
          />
          <div className="flex-1 min-w-0">
            <div className="font-medium text-gray-900 truncate">
              {tag.name}
            </div>
            <div className="text-sm text-gray-500">
              {getCategoryLabel(tag.category)} • Использован {tag.usageCount} раз
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => setIsEditing(true)}
            className="p-1 text-gray-400 hover:text-gray-600 rounded"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={onDelete}
            disabled={isDeleting}
            className="p-1 text-gray-400 hover:text-red-600 rounded disabled:opacity-50"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
