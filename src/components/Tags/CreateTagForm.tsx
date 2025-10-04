import React, { useState } from 'react'
import { X, Plus } from 'lucide-react'
import { TagCategory } from '@/types'
import { useMutation } from '@tanstack/react-query'
import { tagsApi } from '@/api/tags'

interface CreateTagFormProps {
  onClose: () => void
  onSuccess: () => void
}

export const CreateTagForm: React.FC<CreateTagFormProps> = ({ onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    category: TagCategory.CUSTOM,
    color: '#3B82F6'
  })

  // Мутация для создания тега
  const createTagMutation = useMutation({
    mutationFn: (data: Omit<Tag, 'id' | 'usageCount'>) => tagsApi.createTag(data),
    onSuccess: () => {
      onSuccess()
    },
    onError: (error) => {
      console.error('Ошибка создания тега:', error)
    }
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.name.trim()) return

    createTagMutation.mutate({
      name: formData.name.trim(),
      category: formData.category,
      color: formData.color
    })
  }

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const predefinedColors = [
    '#3B82F6', '#EF4444', '#10B981', '#F59E0B',
    '#8B5CF6', '#EC4899', '#06B6D4', '#84CC16'
  ]

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Plus className="w-5 h-5 text-2gis-blue" />
            Создать тег
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Название тега *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              className="input-field"
              placeholder="Введите название тега"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Категория
            </label>
            <select
              value={formData.category}
              onChange={(e) => handleChange('category', e.target.value)}
              className="input-field"
            >
              <option value={TagCategory.FOOD}>Еда</option>
              <option value={TagCategory.TRANSPORT}>Транспорт</option>
              <option value={TagCategory.ENTERTAINMENT}>Развлечения</option>
              <option value={TagCategory.SERVICES}>Услуги</option>
              <option value={TagCategory.INFRASTRUCTURE}>Инфраструктура</option>
              <option value={TagCategory.CUSTOM}>Пользовательские</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Цвет
            </label>
            
            {/* Предустановленные цвета */}
            <div className="grid grid-cols-4 gap-2 mb-3">
              {predefinedColors.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => handleChange('color', color)}
                  className={`w-8 h-8 rounded border-2 ${
                    formData.color === color ? 'border-gray-400' : 'border-gray-200'
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>

            {/* Пользовательский цвет */}
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={formData.color}
                onChange={(e) => handleChange('color', e.target.value)}
                className="w-8 h-8 rounded border border-gray-300"
              />
              <input
                type="text"
                value={formData.color}
                onChange={(e) => handleChange('color', e.target.value)}
                className="input-field flex-1"
                placeholder="#000000"
              />
            </div>
          </div>

          <div className="flex gap-2 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary flex-1"
            >
              Отмена
            </button>
            <button
              type="submit"
              disabled={!formData.name.trim() || createTagMutation.isPending}
              className="btn-primary flex-1 disabled:opacity-50"
            >
              {createTagMutation.isPending ? 'Создание...' : 'Создать тег'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
