import React, { useState } from 'react'
import { Search, X } from 'lucide-react'
import { Tag } from '@/types'
import { useTagsStore } from '@/store/useTagsStore'

interface TagSelectorProps {
  selectedTags: string[]
  onTagToggle: (tagId: string) => void
  availableTags: Tag[]
  maxHeight?: string
}

export const TagSelector: React.FC<TagSelectorProps> = ({
  selectedTags,
  onTagToggle,
  availableTags,
  maxHeight = '200px'
}) => {
  const [searchQuery, setSearchQuery] = useState('')
  const { setSearchQuery: setGlobalSearchQuery } = useTagsStore()

  const filteredTags = availableTags.filter(tag =>
    tag.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tag.category.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleSearchChange = (query: string) => {
    setSearchQuery(query)
    setGlobalSearchQuery(query)
  }

  const selectedTagsData = availableTags.filter(tag => 
    selectedTags.includes(tag.id)
  )

  return (
    <div className="space-y-3">
      {/* Поиск тегов */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="input-field pl-10"
          placeholder="Поиск тегов..."
        />
      </div>

      {/* Выбранные теги */}
      {selectedTagsData.length > 0 && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Выбранные теги ({selectedTagsData.length})
          </label>
          <div className="flex flex-wrap gap-2">
            {selectedTagsData.map((tag) => (
              <div
                key={tag.id}
                className="flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
              >
                <span>{tag.name}</span>
                <button
                  onClick={() => onTagToggle(tag.id)}
                  className="hover:bg-blue-200 rounded-full p-0.5"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Доступные теги */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Доступные теги
        </label>
        <div 
          className="border border-gray-200 rounded-lg p-3 space-y-2 overflow-y-auto"
          style={{ maxHeight }}
        >
          {filteredTags.length === 0 ? (
            <p className="text-gray-500 text-sm text-center py-4">
              {searchQuery ? 'Теги не найдены' : 'Нет доступных тегов'}
            </p>
          ) : (
            <div className="space-y-2">
              {filteredTags.map((tag) => (
                <div
                  key={tag.id}
                  className={`flex items-center justify-between p-2 rounded-lg cursor-pointer transition-colors ${
                    selectedTags.includes(tag.id)
                      ? 'bg-blue-50 border border-blue-200'
                      : 'hover:bg-gray-50'
                  }`}
                  onClick={() => onTagToggle(tag.id)}
                >
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: tag.color }}
                    />
                    <span className="text-sm font-medium">{tag.name}</span>
                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                      {tag.category}
                    </span>
                  </div>
                  <div className="text-xs text-gray-400">
                    {tag.usageCount} раз
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
