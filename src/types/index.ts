// Core application configuration types
export interface AppConfig {
  version: string;
  settings: AppSettings;
  placeholders: PlaceholderConfig[];
  cache: CacheStore;
  history: ActionHistory[];
}

export interface AppSettings {
  theme: 'light' | 'dark';
  language: string;
  autoSave: boolean;
}

export interface PlaceholderConfig {
  id: string;
  name: string;
  type: 'text' | 'image' | 'video' | 'api';
  content: PlaceholderContent;
  styling: PlaceholderStyling;
  created: string;
  modified: string;
}

export interface PlaceholderContent {
  text?: string;
  imageUrl?: string;
  videoUrl?: string;
  apiConfig?: APIConfig;
}

export interface PlaceholderStyling {
  backgroundColor: string;
  textColor: string;
  fontSize: string;
  fontFamily: string;
}

export interface APIConfig {
  url: string;
  method: 'GET' | 'POST';
  headers?: Record<string, string>;
  params?: Record<string, any>;
  dataPath?: string; // JSONPath для извлечения данных
  refreshInterval?: number; // в секундах
}

export interface CacheStore {
  [apiUrl: string]: CacheEntry;
}

export interface CacheEntry {
  data: any;
  timestamp: number;
  ttl: number;
}

export interface ActionHistory {
  id: string;
  action: string;
  timestamp: number;
  data: any;
}

// UI Component types
export interface ThemeColors {
  primary: string;
  secondary: string;
  accent: string;
  text: string;
  background: string;
}

export interface Theme {
  name: 'light' | 'dark';
  colors: ThemeColors;
}

// Error handling types
export interface AppError {
  type: 'network' | 'api' | 'validation' | 'unknown';
  message: string;
  details?: any;
  timestamp: number;
}

// Export configuration types
export interface ExportConfig {
  format: 'json' | 'url';
  includeHistory: boolean;
  includeCache: boolean;
}