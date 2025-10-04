import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { Plus, Search, Filter, MapPin } from 'lucide-react'
import { marksApi } from '@/api/marks'
import { useMapStore } from '@/store/useMapStore'
import { MarkItem } from './MarkItem'
import { MarkSearch } from './MarkSearch'

export const MarksList: React.FC = () => {
  const { marks, setSelectedMark, selectedMark } = useMapStore()

  // Загрузка меток с сервера
  const { data: marksData, isLoading, error } = useQuery({
    queryKey: ['marks'],
    queryFn: () => marksApi.getMarks(),
    initialData: { marks, total: marks.length, page: 1, limit: 50 }
  })

  const handleMarkSelect = (markId: string) => {
    const mark = marksData?.marks.find(m => m.id === markId)
    if (mark) {
      setSelectedMark(mark)
    }
  }

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Мои метки</h3>
        <div className="flex gap-2">
          <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
            <Search className="w-4 h-4" />
          </button>
          <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
            <Filter className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Поиск меток */}
      <MarkSearch />

      {/* Список меток */}
      <div className="space-y-2">
        {isLoading ? (
          <div className="text-center py-8 text-gray-500">
            Загрузка меток...
          </div>
        ) : error ? (
          <div className="text-center py-8 text-red-500">
            Ошибка загрузки меток
          </div>
        ) : marksData?.marks.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <MapPin className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p>У вас пока нет меток</p>
            <p className="text-sm">Кликните на карту, чтобы добавить первую метку</p>
          </div>
        ) : (
          marksData?.marks.map((mark) => (
            <MarkItem
              key={mark.id}
              mark={mark}
              isSelected={selectedMark?.id === mark.id}
              onSelect={() => handleMarkSelect(mark.id)}
            />
          ))
        )}
      </div>

      {/* Кнопка добавления метки */}
      <button className="w-full flex items-center justify-center gap-2 py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-2gis-blue hover:text-2gis-blue transition-colors">
        <Plus className="w-4 h-4" />
        Добавить метку на карте
      </button>
    </div>
  )
}
