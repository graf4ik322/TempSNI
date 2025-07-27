import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { AppConfig, PlaceholderConfig, AppError, Theme } from '../types';
import { StorageService } from '../services/storage';

// Действия для reducer
type AppAction =
  | { type: 'LOAD_CONFIG'; payload: AppConfig }
  | { type: 'UPDATE_SETTINGS'; payload: Partial<AppConfig['settings']> }
  | { type: 'ADD_PLACEHOLDER'; payload: PlaceholderConfig }
  | { type: 'UPDATE_PLACEHOLDER'; payload: { id: string; updates: Partial<PlaceholderConfig> } }
  | { type: 'DELETE_PLACEHOLDER'; payload: string }
  | { type: 'SET_ERROR'; payload: AppError | null }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'TOGGLE_THEME' }
  | { type: 'IMPORT_CONFIG'; payload: AppConfig };

// Состояние приложения
interface AppState {
  config: AppConfig;
  currentPlaceholder: PlaceholderConfig | null;
  error: AppError | null;
  loading: boolean;
  theme: Theme;
}

// Контекст
interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
  // Вспомогательные функции
  addPlaceholder: (placeholder: Omit<PlaceholderConfig, 'id' | 'created' | 'modified'>) => void;
  updatePlaceholder: (id: string, updates: Partial<PlaceholderConfig>) => void;
  deletePlaceholder: (id: string) => void;
  setCurrentPlaceholder: (placeholder: PlaceholderConfig | null) => void;
  toggleTheme: () => void;
  setError: (error: AppError | null) => void;
  exportConfig: () => string;
  importConfig: (jsonString: string) => boolean;
}

// Темы
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

// Reducer
function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'LOAD_CONFIG':
      return {
        ...state,
        config: action.payload,
        theme: action.payload.settings.theme === 'dark' ? darkTheme : lightTheme,
      };

    case 'ADD_PLACEHOLDER':
      const newPlaceholder = {
        ...action.payload,
        id: `placeholder_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        created: new Date().toISOString(),
        modified: new Date().toISOString(),
      };
      
      const configWithNewPlaceholder = {
        ...state.config,
        placeholders: [...state.config.placeholders, newPlaceholder],
      };
      
      StorageService.saveConfig(configWithNewPlaceholder);
      
      return {
        ...state,
        config: configWithNewPlaceholder,
      };

    case 'DELETE_PLACEHOLDER':
      const filteredPlaceholders = state.config.placeholders.filter(
        p => p.id !== action.payload
      );
      
      const configWithDeletedPlaceholder = {
        ...state.config,
        placeholders: filteredPlaceholders,
      };
      
      StorageService.saveConfig(configWithDeletedPlaceholder);
      
      return {
        ...state,
        config: configWithDeletedPlaceholder,
      };

    case 'TOGGLE_THEME':
      const newTheme = state.theme.name === 'light' ? 'dark' : 'light';
      const configWithNewTheme = {
        ...state.config,
        settings: { ...state.config.settings, theme: newTheme },
      };
      
      StorageService.saveConfig(configWithNewTheme);
      
      return {
        ...state,
        config: configWithNewTheme,
        theme: newTheme === 'dark' ? darkTheme : lightTheme,
      };

    default:
      return state;
  }
}

// Создаем контекст
const AppContext = createContext<AppContextType | undefined>(undefined);

// Провайдер
interface AppProviderProps {
  children: ReactNode;
}

export function AppProvider({ children }: AppProviderProps) {
  const [state, dispatch] = useReducer(appReducer, {
    config: StorageService.loadConfig(),
    currentPlaceholder: null,
    error: null,
    loading: false,
    theme: lightTheme,
  });

  // Загружаем конфигурацию при инициализации
  useEffect(() => {
    const config = StorageService.loadConfig();
    dispatch({ type: 'LOAD_CONFIG', payload: config });
  }, []);

  // Вспомогательные функции
  const addPlaceholder = (placeholder: Omit<PlaceholderConfig, 'id' | 'created' | 'modified'>) => {
    dispatch({ type: 'ADD_PLACEHOLDER', payload: placeholder as PlaceholderConfig });
  };

  const updatePlaceholder = (id: string, updates: Partial<PlaceholderConfig>) => {
    // TODO: Implement
  };

  const deletePlaceholder = (id: string) => {
    dispatch({ type: 'DELETE_PLACEHOLDER', payload: id });
  };

  const setCurrentPlaceholder = (placeholder: PlaceholderConfig | null) => {
    // TODO: Implement
  };

  const toggleTheme = () => {
    dispatch({ type: 'TOGGLE_THEME' });
  };

  const setError = (error: AppError | null) => {
    // TODO: Implement
  };

  const exportConfig = (): string => {
    return StorageService.exportConfig();
  };

  const importConfig = (jsonString: string): boolean => {
    return StorageService.importConfig(jsonString);
  };

  const value: AppContextType = {
    state,
    dispatch,
    addPlaceholder,
    updatePlaceholder,
    deletePlaceholder,
    setCurrentPlaceholder,
    toggleTheme,
    setError,
    exportConfig,
    importConfig,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}

// Hook для использования контекста
export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}