# АРХИТЕКТУРНЫЕ ДИАГРАММЫ И СХЕМЫ
## TwchPlaceholder - Техническая архитектура

### 1. ОБЩАЯ АРХИТЕКТУРА СИСТЕМЫ

```mermaid
graph TB
    A[Browser] --> B[Vanilla JS App]
    B --> C[Local Storage]
    B --> D[Session Storage]
    B --> E[File API]
    B --> F[External APIs]
    
    subgraph "Vanilla Frontend"
        B --> G[DOM Modules]
        B --> H[State Management]
        B --> I[Service Layer]
        B --> J[Utils Layer]
    end
    
    F --> K[Public APIs with CORS]
    F --> L[Fetch API]
    
    style A fill:#e1f5fe
    style B fill:#fff3e0
    style F fill:#f3e5f5
```

### 2. КОМПОНЕНТНАЯ АРХИТЕКТУРА

```mermaid
graph TD
    A[index.html] --> B[main.js]
    B --> C[app.js]
    C --> D[header.js]
    C --> E[navigation.js]
    C --> F[content.js]
    C --> G[footer.js]
    
    F --> H[placeholderView.js]
    F --> I[settingsPanel.js]
    F --> J[configManager.js]
    
    H --> K[textPlaceholder.js]
    H --> L[imagePlaceholder.js]
    H --> M[videoPlaceholder.js]
    
    I --> N[themeSelector.js]
    I --> O[contentEditor.js]
    I --> P[apiIntegration.js]
    
    J --> Q[exportConfig.js]
    J --> R[importConfig.js]
    J --> S[shareConfig.js]
```

### 3. СХЕМА ПОТОКОВ ДАННЫХ

```mermaid
sequenceDiagram
    participant U as User
    participant C as Component
    participant S as State
    participant LS as LocalStorage
    participant API as External API
    
    U->>C: Открывает приложение
    C->>LS: Загружает настройки
    LS-->>C: Возвращает config
    C->>S: Устанавливает state
    
    U->>C: Изменяет настройки
    C->>S: Обновляет state
    S->>LS: Сохраняет в localStorage
    
    U->>C: Запрашивает внешние данные
    C->>API: HTTP запрос
    API-->>C: Данные или ошибка
    C->>S: Обновляет state
    S->>LS: Кэширует данные
```

### 4. СТРУКТУРА ДАННЫХ В LOCALSTORAGE

```javascript
// Структура данных в localStorage (JSON)
const AppConfig = {
  version: "1.0.0",
  settings: {
    theme: "light", // "light" | "dark"
    language: "ru",
    autoSave: true
  },
  placeholders: [
    // PlaceholderConfig объекты
  ],
  cache: {
    // "apiUrl": {
    //   data: any,
    //   timestamp: number,
    //   ttl: number
    // }
  },
  history: [
    // ActionHistory объекты
  ]
};

const PlaceholderConfig = {
  id: "unique-id",
  name: "My Placeholder",
  type: "text", // "text" | "image" | "video" | "api"
  content: {
    text: "Sample text",
    imageUrl: "data:image/...", // или blob URL
    videoUrl: "blob:...",
    apiConfig: {
      // APIConfig объект
    }
  },
  styling: {
    backgroundColor: "#ffffff",
    textColor: "#000000",
    fontSize: "16px",
    fontFamily: "Arial, sans-serif"
  },
  created: "2025-01-01T00:00:00.000Z",
  modified: "2025-01-01T00:00:00.000Z"
};

const APIConfig = {
  url: "https://api.example.com/data",
  method: "GET", // "GET" | "POST"
  headers: {
    "Content-Type": "application/json"
  },
  params: {
    key: "value"
  },
  dataPath: "data.items", // путь к данным в JSON ответе
  refreshInterval: 3600 // в секундах
};
```

### 5. СХЕМА ОБРАБОТКИ ОШИБОК

```mermaid
graph TD
    A[Error Occurs] --> B{Error Type?}
    
    B -->|Network Error| C[Show Offline Message]
    B -->|API Error| D[Show API Error]
    B -->|Validation Error| E[Show Field Error]
    B -->|Unknown Error| F[Show Generic Error]
    
    C --> G[Use Cached Data]
    D --> H[Retry Mechanism]
    E --> I[Highlight Invalid Field]
    F --> J[Log to Console]
    
    G --> K[Continue Operation]
    H --> L{Retry Successful?}
    L -->|Yes| K
    L -->|No| M[Fallback to Cache]
    
    I --> N[Wait for User Fix]
    J --> O[Show Error Boundary]
```

### 6. ЖИЗНЕННЫЙ ЦИКЛ PLACEHOLDER

```mermaid
stateDiagram-v2
    [*] --> Draft
    Draft --> Configuring: user starts editing
    Configuring --> Preview: user previews
    Preview --> Configuring: user continues editing
    Preview --> Active: user activates
    Active --> Fullscreen: user goes fullscreen
    Fullscreen --> Active: user exits fullscreen
    Active --> Editing: user modifies
    Editing --> Active: changes saved
    Active --> Archived: user deactivates
    Archived --> Active: user reactivates
    Archived --> [*]: user deletes
```

### 7. СХЕМА ИНТЕГРАЦИИ С ВНЕШНИМИ API

```mermaid
graph LR
    A[User Input] --> B[URL Validation]
    B --> C{CORS Support?}
    
    C -->|Yes| D[Direct API Call]
    C -->|No| E[JSONP Check]
    
    E -->|Supported| F[JSONP Request]
    E -->|Not Supported| G[Show CORS Warning]
    
    D --> H[Process Response]
    F --> H
    G --> I[Suggest Alternatives]
    
    H --> J[Cache Data]
    J --> K[Update UI]
    
    style G fill:#ffcdd2
    style I fill:#ffcdd2
```

### 8. СХЕМА ЭКСПОРТА/ИМПОРТА КОНФИГУРАЦИИ

```mermaid
graph TD
    A[User Action] --> B{Export or Import?}
    
    B -->|Export| C[Serialize Config]
    B -->|Import| D[File Input]
    
    C --> E[Generate JSON]
    E --> F[Download File]
    E --> G[Generate Share URL]
    
    D --> H[Parse JSON]
    H --> I{Valid Format?}
    
    I -->|Yes| J[Merge with Existing]
    I -->|No| K[Show Error Message]
    
    J --> L[Update State]
    L --> M[Save to LocalStorage]
    
    G --> N[Copy to Clipboard]
    
    style K fill:#ffcdd2
```

### 9. СХЕМА ОБРАБОТКИ ФАЙЛОВ

```mermaid
graph TD
    A[File Drop/Select] --> B[File Validation]
    B --> C{Valid Type?}
    
    C -->|Yes| D{Size OK?}
    C -->|No| E[Show Type Error]
    
    D -->|Yes| F[Process File]
    D -->|No| G[Show Size Error]
    
    F --> H{File Type?}
    
    H -->|Image| I[Create Object URL]
    H -->|Config| J[Parse JSON]
    
    I --> K[Update Preview]
    J --> L[Import Settings]
    
    K --> M[Save to State]
    L --> M
    M --> N[Auto-save to LocalStorage]
    
    style E fill:#ffcdd2
    style G fill:#ffcdd2
```

### 10. СХЕМА ПРОИЗВОДИТЕЛЬНОСТИ

```mermaid
graph TB
    A[App Load] --> B[Service Worker Check]
    B --> C[Cache Resources]
    
    C --> D[Load Critical CSS]
    D --> E[Load Main Bundle]
    E --> F[Lazy Load Routes]
    
    A --> G[Load from LocalStorage]
    G --> H[Restore State]
    H --> I[Render Initial UI]
    
    I --> J[Register Event Listeners]
    J --> K[Start Background Tasks]
    
    K --> L[Cache Cleanup]
    K --> M[Data Synchronization]
    
    style L fill:#e8f5e8
    style M fill:#e8f5e8
```

### 11. СХЕМА АДАПТИВНОСТИ

```mermaid
graph TD
    A[Screen Size Detection] --> B{Device Type?}
    
    B -->|Mobile| C[Mobile Layout]
    B -->|Tablet| D[Tablet Layout]
    B -->|Desktop| E[Desktop Layout]
    
    C --> F[Touch Optimized]
    D --> G[Hybrid Interface]
    E --> H[Mouse/Keyboard Interface]
    
    F --> I[Swipe Gestures]
    G --> J[Responsive Grid]
    H --> K[Hover Effects]
    
    I --> L[Apply Mobile Styles]
    J --> M[Apply Tablet Styles]
    K --> N[Apply Desktop Styles]
```

### 12. СХЕМА БЕЗОПАСНОСТИ (CLIENT-SIDE)

```mermaid
graph TD
    A[User Input] --> B[Input Sanitization]
    B --> C[XSS Prevention]
    C --> D[URL Validation]
    
    D --> E{External API?}
    E -->|Yes| F[HTTPS Check]
    E -->|No| G[Process Internally]
    
    F --> H{Secure Connection?}
    H -->|Yes| I[Proceed with Request]
    H -->|No| J[Block Request]
    
    I --> K[Response Validation]
    K --> L[Safe Data Processing]
    
    G --> L
    J --> M[Show Security Warning]
    
    style J fill:#ffcdd2
    style M fill:#ffcdd2
```

---

## ТЕХНИЧЕСКИЕ ПРИМЕЧАНИЯ

### Ключевые архитектурные решения:

1. **Полностью клиентское решение** - отсутствие серверной части
2. **Модульная архитектура** - легкость расширения и поддержки
3. **Кэширование на клиенте** - повышение производительности
4. **Graceful degradation** - работа при ограничениях сети
5. **Progressive Enhancement** - улучшение UX при наличии возможностей

### Паттерны проектирования:
- **Observer Pattern** - для обновления UI при изменении состояния
- **Strategy Pattern** - для различных типов placeholder
- **Factory Pattern** - для создания компонентов
- **Singleton Pattern** - для управления настройками приложения

### Оптимизации:
- **Code Splitting** - разделение кода по маршрутам
- **Tree Shaking** - удаление неиспользуемого кода
- **Memoization** - кэширование результатов вычислений
- **Virtual Scrolling** - для больших списков (если применимо)