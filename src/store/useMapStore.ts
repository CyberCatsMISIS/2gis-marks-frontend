import { create } from 'zustand'
import { MapState, Mark } from '@/types'

interface MapStore extends MapState {
  // Действия для карты
  setCenter: (center: [number, number]) => void
  setZoom: (zoom: number) => void
  setSelectedMark: (mark: Mark | null) => void
  setMarks: (marks: Mark[]) => void
  addMark: (mark: Mark) => void
  updateMark: (mark: Mark) => void
  removeMark: (markId: string) => void
  
  // Действия для добавления меток
  startAddingMark: (position: [number, number]) => void
  cancelAddingMark: () => void
  finishAddingMark: (mark: Mark) => void
}

export const useMapStore = create<MapStore>((set, get) => ({
  // Начальное состояние
  center: [82.9204, 55.0084], // Новосибирск
  zoom: 13,
  selectedMark: null,
  marks: [],
  isAddingMark: false,
  newMarkPosition: null,

  // Действия
  setCenter: (center) => set({ center }),
  setZoom: (zoom) => set({ zoom }),
  setSelectedMark: (selectedMark) => set({ selectedMark }),
  
  setMarks: (marks) => set({ marks }),
  addMark: (mark) => set((state) => ({ marks: [...state.marks, mark] })),
  updateMark: (updatedMark) => set((state) => ({
    marks: state.marks.map(mark => 
      mark.id === updatedMark.id ? updatedMark : mark
    )
  })),
  removeMark: (markId) => set((state) => ({
    marks: state.marks.filter(mark => mark.id !== markId)
  })),

  startAddingMark: (position) => set({ 
    isAddingMark: true, 
    newMarkPosition: position 
  }),
  cancelAddingMark: () => set({ 
    isAddingMark: false, 
    newMarkPosition: null 
  }),
  finishAddingMark: (mark) => set((state) => ({
    marks: [...state.marks, mark],
    isAddingMark: false,
    newMarkPosition: null
  }))
}))
