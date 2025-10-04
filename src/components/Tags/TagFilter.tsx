import React from 'react'
import { Filter, Plus, Minus } from 'lucide-react'
import { useTagsStore } from '@/store/useTagsStore'
import { TagSelector } from './TagSelector'

export const TagFilter: React.FC = () => {
  const {
    selectedTags,
    filterMode,
    setFilterMode,
    toggleTag,
    getFilteredTags,
    clearSelectedTags
  } = useTagsStore()

  const availableTags = getFilteredTags()

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Filter className="w-5 h-5 text-2gis-blue" />
          Фильтр по тегам
        </h3>
        {selectedTags.length > 0 && (
          <button
            onClick={clearSelectedTags}
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            Очистить все
          </button>
        )}
      </div>

      {/* Режим фильтрации */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Режим фильтрации
        </label>
        <div className="flex gap-2">
          <button
            onClick={() => setFilterMode('include')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filterMode === 'include'
                ? 'bg-green-100 text-green-800 border border-green-200'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <Plus className="w-4 h-4" />
            Включить теги
          </button>
          <button
            onClick={() => setFilterMode('exclude')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filterMode === 'exclude'
                ? 'bg-red-100 text-red-800 border border-red-200'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <Minus className="w-4 h-4" />
            Исключить теги
          </button>
        </div>
        <p className="text-xs text-gray-500">
          {filterMode === 'include' 
            ? 'Маршрут будет проходить через места с выбранными тегами'
            : 'Места с выбранными тегами будут исключены из маршрута'
          }
        </p>
      </div>

      {/* Выбор тегов */}
      <TagSelector
        selectedTags={selectedTags}
        onTagToggle={toggleTag}
        availableTags={availableTags}
        maxHeight="300px"
      />

      {/* Статистика выбранных тегов */}
      {selectedTags.length > 0 && (
        <div className="bg-gray-50 rounded-lg p-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">
              Выбрано тегов: <span className="font-medium">{selectedTags.length}</span>
            </span>
            <span className={`px-2 py-1 rounded text-xs font-medium ${
              filterMode === 'include' 
                ? 'bg-green-100 text-green-800' 
                : 'bg-red-100 text-red-800'
            }`}>
              {filterMode === 'include' ? 'Включить' : 'Исключить'}
            </span>
          </div>
        </div>
      )}
    </div>
  )
}
