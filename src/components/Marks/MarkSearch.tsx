import React, { useState } from "react";
import { Search, X } from "lucide-react";
import { useMapStore } from "@/store/useMapStore";

export const MarkSearch: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const { marks, setSelectedMark } = useMapStore();

  const filteredMarks = [].filter(
    (mark) =>
      mark.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mark.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mark.tags.some((tag) =>
        tag.toLowerCase().includes(searchQuery.toLowerCase())
      )
  );

  const handleMarkSelect = (mark: any) => {
    setSelectedMark(mark);
  };

  const clearSearch = () => {
    setSearchQuery("");
  };

  return (
    <div className="space-y-2">
      {/* Поле поиска */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="input-field pl-10 pr-10"
          placeholder="Поиск по названию, описанию или тегам..."
        />
        {searchQuery && (
          <button
            onClick={clearSearch}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Результаты поиска */}
      {searchQuery && (
        <div className="bg-gray-50 rounded-lg p-2 max-h-48 overflow-y-auto">
          {filteredMarks?.length === 0 ? (
            <div className="text-center py-4 text-gray-500 text-sm">
              Ничего не найдено
            </div>
          ) : (
            <div className="space-y-1">
              {filteredMarks?.map((mark) => (
                <button
                  key={mark.id}
                  onClick={() => handleMarkSelect(mark)}
                  className="w-full text-left p-2 hover:bg-white rounded text-sm"
                >
                  <div className="font-medium text-gray-900 truncate">
                    {mark?.title}
                  </div>
                  {mark.description && (
                    <div className="text-gray-500 truncate">
                      {mark?.description}
                    </div>
                  )}
                  {mark.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-1">
                      {mark?.tags.slice(0, 2).map((tag) => (
                        <span
                          key={tag}
                          className="px-1.5 py-0.5 bg-blue-100 text-blue-600 text-xs rounded"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
