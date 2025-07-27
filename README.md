# TwchPlaceholder

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![React](https://img.shields.io/badge/React-19.1.0-blue.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8.3-blue.svg)
![Vite](https://img.shields.io/badge/Vite-7.0.4-purple.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)

**Frontend-only решение для создания настраиваемых placeholder без использования бекенда.**

## 🚀 Особенности

- ❌ **Нет бекенда** - полностью клиентское решение
- ❌ **Нет API endpoints** - работа только с публичными API
- ❌ **Нет CORS прокси** - прямое обращение к сервисам
- ✅ **React 18+ + TypeScript** - современный стек
- ✅ **LocalStorage** - хранение данных на клиенте
- ✅ **Адаптивный дизайн** - поддержка всех устройств
- ✅ **PWA готовность** - работает как мобильное приложение
- ✅ **Темная/светлая тема** - автоматическое переключение
- ✅ **Поддержка различных типов контента** - текст, изображения, видео, API данные

## 📦 Установка и запуск

### Предварительные требования

- Node.js 18+ 
- npm или yarn

### Клонирование и установка

```bash
# Клонировать репозиторий
git clone https://github.com/your-username/twch-placeholder.git
cd twch-placeholder

# Установить зависимости
npm install

# Запустить в режиме разработки
npm run dev

# Собрать для продакшена
npm run build

# Предварительный просмотр сборки
npm run preview
```

### Доступные скрипты

```bash
npm run dev          # Запуск в режиме разработки
npm run build        # Сборка для продакшена
npm run preview      # Предварительный просмотр сборки
npm run lint         # Проверка кода ESLint
npm run lint:fix     # Исправление ошибок ESLint
npm run format       # Форматирование кода Prettier
npm run type-check   # Проверка типов TypeScript
```

## 🏗️ Архитектура

### Структура проекта

```
src/
├── components/           # Переиспользуемые компоненты
│   ├── ui/              # UI компоненты (Button, Input, Modal)
│   ├── layout/          # Layout компоненты (MainLayout)
│   └── features/        # Функциональные компоненты (PlaceholderView)
├── hooks/               # Custom hooks
├── services/            # API сервисы и утилиты
│   ├── storage.ts       # LocalStorage управление
│   └── api.ts           # Внешние API интеграции
├── stores/              # State management (Context API)
│   └── AppContext.tsx   # Глобальное состояние приложения
├── types/               # TypeScript типы
│   └── index.ts         # Основные интерфейсы
├── utils/               # Вспомогательные функции
├── assets/              # Статические ресурсы
└── styles/              # Глобальные стили
    └── globals.css      # CSS стили и Tailwind
```

### Технологический стек

- **Frontend Framework:** React 18 с TypeScript
- **Сборщик:** Vite 
- **Стилизация:** Tailwind CSS
- **Маршрутизация:** React Router DOM
- **State Management:** React Context API
- **Иконки:** Lucide React
- **HTTP клиент:** Axios
- **Линтинг:** ESLint + Prettier

## 📱 Функциональность

### Типы Placeholder

1. **Текстовый placeholder**
   - Настраиваемый текст
   - Выбор шрифта и размера
   - Цветовая настройка

2. **Изображения**
   - Загрузка через File API
   - Drag & Drop поддержка
   - Предварительный просмотр

3. **Видео**
   - Поддержка различных форматов
   - Встроенный плеер
   - Настройки воспроизведения

4. **API данные**
   - Интеграция с публичными API
   - Кэширование с TTL
   - Обработка ошибок

### Основные возможности

- **Создание и управление** placeholder
- **Полноэкранный режим** для демонстрации
- **Экспорт/импорт** настроек в JSON
- **Шаринг** конфигураций через URL
- **Темная/светлая тема** с автопереключением
- **Адаптивный дизайн** для всех устройств
- **PWA функциональность** для мобильных устройств

## 🔧 Конфигурация

### Настройка тем

Темы настраиваются в `src/stores/AppContext.tsx`:

```typescript
const lightTheme: Theme = {
  name: 'light',
  colors: {
    primary: '#FFFFFF',
    secondary: '#F5F5F5', 
    accent: '#007AFF',
    text: '#000000',
    background: '#FFFFFF',
  },
};

const darkTheme: Theme = {
  name: 'dark',
  colors: {
    primary: '#1A1A1A',
    secondary: '#2A2A2A',
    accent: '#0A84FF', 
    text: '#FFFFFF',
    background: '#1A1A1A',
  },
};
```

### Кэширование API

Настройки кэширования в `src/services/storage.ts`:

```typescript
// TTL по умолчанию - 1 час
const DEFAULT_TTL = 3600;

// Кэширование данных API
StorageService.setCacheEntry(key, data, ttlSeconds);
```

## 🌐 Деплой

### Vercel (рекомендуется)

```bash
# Установить Vercel CLI
npm i -g vercel

# Деплой
vercel --prod
```

### Netlify

```bash
# Сборка
npm run build

# Загрузить папку dist на Netlify
```

### GitHub Pages

Добавить в `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm install
      - run: npm run build
      - uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
```

## 🔒 Безопасность

### Клиентская безопасность

- **HTTPS Only** - только защищенные соединения
- **CSP заголовки** - Content Security Policy
- **XSS защита** - санитизация пользовательского ввода
- **Валидация URL** - проверка внешних API
- **Локальное хранение** - никаких серверных данных

### Ограничения CORS

Приложение работает только с API, поддерживающими CORS:

```typescript
// Проверка поддержки CORS
const corsSupported = await APIService.checkCORSSupport(url);
if (!corsSupported) {
  // Показать предупреждение пользователю
}
```

## 📊 Производительность

### Оптимизации

- **Lazy Loading** - компоненты загружаются по требованию
- **Code Splitting** - разделение кода по маршрутам  
- **Tree Shaking** - удаление неиспользуемого кода
- **Service Worker** - кэширование ресурсов
- **Debounce** - оптимизация пользовательского ввода

### Метрики (цели)

- **Lighthouse Score:** > 90
- **Bundle Size:** < 500KB
- **First Paint:** < 1.5s
- **CLS:** < 0.1

## 🧪 Тестирование

```bash
# Проверка типов
npm run type-check

# Линтинг
npm run lint

# Форматирование
npm run format:check
```

## 🤝 Вклад в проект

1. Fork проекта
2. Создать feature ветку (`git checkout -b feature/AmazingFeature`)
3. Commit изменения (`git commit -m 'Add some AmazingFeature'`)
4. Push в ветку (`git push origin feature/AmazingFeature`)
5. Открыть Pull Request

## 📄 Лицензия

Этот проект лицензирован под MIT License - см. файл [LICENSE](LICENSE) для деталей.

## 👥 Команда

- **Техническое руководство:** [Указать ответственного]
- **Разработка:** AI Development Agent
- **Дизайн:** [Указать ответственного]

## 📞 Поддержка

Если у вас есть вопросы или проблемы:

- 🐛 [Создать Issue](https://github.com/your-username/twch-placeholder/issues)
- 💬 [Обсуждения](https://github.com/your-username/twch-placeholder/discussions)
- 📧 Email: support@twch-placeholder.com

---

**⚠️ Важно:** Приложение работает полностью БЕЗ бекенда. Все данные хранятся локально в браузере пользователя.