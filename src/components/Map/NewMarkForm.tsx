import React, { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { X, MapPin, Tag } from "lucide-react";
import { CreateMarkRequest } from "@/types";
import { marksApi } from "@/api/marks";
import { tagsApi } from "@/api/tags";
import { useMapStore } from "@/store/useMapStore";
import { useTagsStore } from "@/store/useTagsStore";
import { TagSelector } from "../Tags/TagSelector";

interface NewMarkFormProps {
  position: [number, number];
  text?: string;
  onClose: () => void;
  tit?: string;
}

export const NewMarkForm: React.FC<NewMarkFormProps> = ({
  tit = "Новая метка",
  text,
  position,
  onClose,
}) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [suggestedTags, setSuggestedTags] = useState<string[]>([]);

  const { finishAddingMark } = useMapStore();
  const { getFilteredTags } = useTagsStore();
  const queryClient = useQueryClient();

  // Мутация для создания метки
  const createMarkMutation = useMutation({
    mutationFn: (data: CreateMarkRequest) => marksApi.createMark(data),
    onSuccess: (newMark) => {
      finishAddingMark(newMark);
      queryClient.invalidateQueries({ queryKey: ["marks"] });
      onClose();
    },
    onError: (error) => {
      console.error("Ошибка создания метки:", error);
    },
  });

  // Получение предложенных тегов на основе описания
  const getSuggestedTagsMutation = useMutation({
    mutationFn: (desc: string) => tagsApi.getSuggestedTags(desc),
    onSuccess: (tags) => {
      setSuggestedTags(tags.map((tag) => tag.name));
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const markData: CreateMarkRequest = {
      title: title.trim(),
      description: description.trim(),
      coordinates: position,
      tags: selectedTags,
    };

    console.log(markData);
    createMarkMutation.mutate({
      text: description,
      latitude: position[0],
      longitude: position[1],
    });
  };

  const handleDescriptionChange = (value: string) => {
    setDescription(value);

    // Получаем предложенные теги при изменении описания
    if (value.length > 10) {
      getSuggestedTagsMutation.mutate(value);
    }
  };

  const handleTagToggle = (tagId: string) => {
    setSelectedTags((prev) =>
      prev.includes(tagId)
        ? prev.filter((id) => id !== tagId)
        : [...prev, tagId]
    );
  };

  const availableTags = getFilteredTags();

  return (
    <div className="absolute top-4 left-4 bg-white rounded-lg shadow-lg p-6 w-96 max-h-[80vh] overflow-y-auto z-10">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <MapPin className="w-5 h-5 text-2gis-blue" />
          {tit}
        </h3>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
          <X className="w-5 h-5" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Описание
          </label>
          <textarea
            value={description}
            onChange={(e) => handleDescriptionChange(e.target.value)}
            className="input-field h-20 resize-none"
            placeholder="Опишите место (например: уютное кафе с розетками и Wi-Fi)"
          />
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
            disabled={createMarkMutation.isPending}
            className="btn-primary flex-1"
          >
            {createMarkMutation.isPending ? "Создание..." : "Создать метку"}
          </button>
        </div>
      </form>
    </div>
  );
};
