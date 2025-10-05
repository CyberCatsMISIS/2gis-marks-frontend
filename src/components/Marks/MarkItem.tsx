import React, { useState } from "react";
import { MapPin, Edit, Trash2, Calendar } from "lucide-react";
import { Mark } from "@/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { marksApi } from "@/api/marks";
import { NewMarkForm } from "../Map/NewMarkForm";

interface MarkItemProps {
  mark: Mark;
  isSelected: boolean;
  onSelect: () => void;
}

export const MarkItem: React.FC<MarkItemProps> = ({
  mark,
  isSelected,
  onSelect,
}) => {
  const queryClient = useQueryClient();
  const [show, setShow] = useState(false);

  // Мутация для удаления метки
  const deleteMarkMutation = useMutation({
    mutationFn: (id: string) => marksApi.deleteMark(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["marks"] });
    },
    onError: (error) => {
      console.error("Ошибка удаления метки:", error);
    },
  });

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm("Вы уверены, что хотите удалить эту метку?")) {
      deleteMarkMutation.mutate(mark.id);
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("ru-RU", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(date));
  };

  return (
    <div
      className={`p-3 rounded-lg border cursor-pointer transition-all ${
        isSelected
          ? "border-2gis-blue bg-blue-50"
          : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
      }`}
      onClick={onSelect}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <MapPin className="w-4 h-4 text-2gis-blue flex-shrink-0" />
          </div>

          {mark.text && (
            <p className="text-sm text-gray-600 mb-2 line-clamp-2">
              {mark.text}
            </p>
          )}

          {/* Теги */}
          {mark.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-2">
              {mark.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full"
                >
                  {tag}
                </span>
              ))}
              {mark.tags.length > 3 && (
                <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full">
                  +{mark.tags.length - 3}
                </span>
              )}
            </div>
          )}

          {/* Координаты и дата */}
          <div className="flex items-center gap-4 text-xs text-gray-500">
            <span>
              {mark.longitude.toFixed(4)}, {mark.latitude.toFixed(4)}
            </span>
            <div className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              <span>{formatDate(mark.created_at)}</span>
            </div>
          </div>
        </div>

        {/* Действия */}
        <div className="flex items-center gap-1 ml-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShow(true);
              // TODO: Открыть форму редактирования
            }}
            className="p-1 text-gray-400 hover:text-gray-600 rounded"
          >
            <Edit className="w-3 h-3" />
          </button>
          <button
            onClick={handleDelete}
            disabled={deleteMarkMutation.isPending}
            className="p-1 text-gray-400 hover:text-red-600 rounded disabled:opacity-50"
          >
            <Trash2 className="w-3 h-3" />
          </button>
        </div>
      </div>

      {show && (
        <NewMarkForm
          position={[mark.longitude, mark.latitude]}
          onClose={() => setShow(false)}
          // TODO: change to just universal MarkForm
          tit="Редактирование метки"
        />
      )}
    </div>
  );
};
