import React, { useState } from 'react'
import { MapPin, Route, Tag, Settings, ChevronLeft, ChevronRight } from 'lucide-react'
import { RouteBuilder } from '../Routes/RouteBuilder'
import { MarksList } from '../Marks/MarksList'
import { TagsManager } from '../Tags/TagsManager'

type SidebarTab = 'marks' | 'routes' | 'tags' | 'settings'

export const Sidebar: React.FC = () => {
  const [activeTab, setActiveTab] = useState<SidebarTab>('marks')
  const [isCollapsed, setIsCollapsed] = useState(false)

  const tabs = [
    { id: 'marks' as const, label: 'Метки', icon: MapPin },
    { id: 'routes' as const, label: 'Маршруты', icon: Route },
    { id: 'tags' as const, label: 'Теги', icon: Tag },
    { id: 'settings' as const, label: 'Настройки', icon: Settings },
  ]

  const renderContent = () => {
    switch (activeTab) {
      case 'marks':
        return <MarksList />
      case 'routes':
        return <RouteBuilder />
      case 'tags':
        return <TagsManager />
      case 'settings':
        return <div className="p-4 text-center text-gray-500">Настройки в разработке</div>
      default:
        return null
    }
  }

  return (
    <div className={`bg-white border-r border-gray-200 transition-all duration-300 ${
      isCollapsed ? 'w-16' : 'w-80'
    } flex flex-col`}>
      {/* Заголовок */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <h2 className="text-lg font-semibold text-gray-900">
              Панель управления
            </h2>
          )}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1 text-gray-400 hover:text-gray-600 rounded"
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Навигация */}
      <nav className="p-2">
        <div className="space-y-1">
          {tabs.map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'bg-2gis-blue text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                {!isCollapsed && <span>{tab.label}</span>}
              </button>
            )
          })}
        </div>
      </nav>

      {/* Контент */}
      <div className="flex-1 overflow-y-auto">
        {!isCollapsed && renderContent()}
      </div>
    </div>
  )
}
