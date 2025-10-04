# 2GIS Custom Tags Extension - Frontend

Веб-интерфейс для расширения 2ГИС с поддержкой пользовательских меток и тегов.

## 🚀 Возможности

- **Добавление меток**: Кликните на карту для добавления пользовательских меток
- **Автоматическое тегирование**: NLP извлекает теги из описания метки
- **Фильтрация маршрутов**: Строите маршруты с учетом включенных/исключенных тегов
- **Управление тегами**: Создавайте, редактируйте и организуйте теги по категориям
- **Поиск и фильтрация**: Быстрый поиск меток и тегов

## 🛠 Технологии

- **React 18** с TypeScript
- **Vite** для сборки
- **Zustand** для управления состоянием
- **React Query** для работы с API
- **2GIS Map SDK** для картографии
- **Tailwind CSS** для стилизации
- **Lucide React** для иконок

## 📦 Установка

1. **Клонируйте репозиторий**
   ```bash
   git clone <repository-url>
   cd 2gis-marks-frontend
   ```

2. **Установите зависимости**
   ```bash
   npm install
   ```

3. **Настройте переменные окружения**
   ```bash
   cp env.example .env
   ```
   
   Отредактируйте `.env` файл:
   ```env
   VITE_2GIS_API_KEY=your-2gis-api-key-here
   VITE_API_URL=http://localhost:8000/api
   ```

4. **Запустите проект**
   ```bash
   npm run dev
   ```

   Приложение будет доступно по адресу `http://localhost:3000`

## 🏗 Структура проекта

```
src/
├── api/                 # API клиенты
│   ├── client.ts       # Базовый HTTP клиент
│   ├── marks.ts        # API для меток
│   ├── tags.ts         # API для тегов
│   └── routes.ts       # API для маршрутов
├── components/         # React компоненты
│   ├── Layout/         # Компоненты макета
│   ├── Map/           # Компоненты карты
│   ├── Marks/         # Компоненты меток
│   └── Tags/          # Компоненты тегов
├── store/             # Zustand stores
│   ├── useMapStore.ts    # Состояние карты
│   ├── useTagsStore.ts   # Состояние тегов
│   └── useRouteStore.ts  # Состояние маршрутов
├── types/             # TypeScript типы
└── utils/             # Утилиты
```

## 🎯 Основные компоненты

### Карта и метки
- **MapProvider**: Контекст для работы с 2GIS Map SDK
- **MapContainer**: Основной контейнер карты
- **MarkMarker**: Отображение меток на карте
- **NewMarkForm**: Форма добавления новой метки

### Теги
- **TagSelector**: Выбор тегов с поиском
- **TagFilter**: Фильтрация маршрутов по тегам
- **TagsManager**: Управление тегами
- **TagItem**: Отдельный тег с возможностью редактирования

### Маршруты
- **RouteBuilder**: Построение маршрутов с фильтрацией

## 🔧 Разработка

### Добавление новых компонентов

1. **Создайте компонент** в соответствующей папке:
   ```tsx
   // src/components/NewFeature/NewComponent.tsx
   import React from 'react'
   
   interface NewComponentProps {
     // типы пропсов
   }
   
   export const NewComponent: React.FC<NewComponentProps> = ({ ...props }) => {
     return (
       <div>
         {/* JSX */}
       </div>
     )
   }
   ```

2. **Добавьте типы** в `src/types/index.ts` если нужно

3. **Создайте store** в `src/store/` если нужно управление состоянием

4. **Добавьте API** в `src/api/` если нужно взаимодействие с сервером

### Интеграция с 2GIS Map SDK

```tsx
import { MapGL } from '@2gis/mapgl'

// Инициализация карты
const map = new MapGL('map-container', {
  center: [82.9204, 55.0084], // Новосибирск
  zoom: 13,
  key: 'your-api-key'
})

// Добавление маркера
const marker = new DG.Marker([lat, lng], {
  icon: customIcon
})
marker.addTo(map)
```

### Работа с состоянием (Zustand)

```tsx
import { useMapStore } from '@/store/useMapStore'

const MyComponent = () => {
  const { marks, addMark, setSelectedMark } = useMapStore()
  
  const handleAddMark = (mark) => {
    addMark(mark)
  }
  
  return (
    // JSX
  )
}
```

### API запросы (React Query)

```tsx
import { useQuery, useMutation } from '@tanstack/react-query'
import { marksApi } from '@/api/marks'

const MyComponent = () => {
  // Загрузка данных
  const { data, isLoading, error } = useQuery({
    queryKey: ['marks'],
    queryFn: () => marksApi.getMarks()
  })
  
  // Мутация
  const createMutation = useMutation({
    mutationFn: marksApi.createMark,
    onSuccess: () => {
      // обновить кэш
    }
  })
  
  return (
    // JSX
  )
}
```

## 🚀 Сборка для продакшена

```bash
npm run build
```

Собранные файлы будут в папке `dist/`

## 📝 Скрипты

- `npm run dev` - Запуск в режиме разработки
- `npm run build` - Сборка для продакшена
- `npm run preview` - Предварительный просмотр сборки
- `npm run lint` - Проверка кода линтером

## 🔗 Интеграция с бэкендом

API ожидает следующие эндпоинты:

- `GET /api/marks` - Получение меток
- `POST /api/marks` - Создание метки
- `PUT /api/marks/:id` - Обновление метки
- `DELETE /api/marks/:id` - Удаление метки
- `GET /api/tags` - Получение тегов
- `POST /api/routes/build` - Построение маршрута

## 📄 Лицензия

MIT License
