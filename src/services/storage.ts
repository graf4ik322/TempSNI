import { AppConfig, CacheEntry } from '../types';

const STORAGE_KEYS = {
  APP_CONFIG: 'twch_placeholder_config',
  CACHE: 'twch_placeholder_cache',
  SESSION: 'twch_placeholder_session',
} as const;

const DEFAULT_CONFIG: AppConfig = {
  version: '1.0.0',
  settings: {
    theme: 'light',
    language: 'ru',
    autoSave: true,
  },
  placeholders: [],
  cache: {},
  history: [],
};

export class StorageService {
  /**
   * Загружает конфигурацию приложения из localStorage
   */
  static loadConfig(): AppConfig {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.APP_CONFIG);
      if (!stored) return DEFAULT_CONFIG;
      
      const config = JSON.parse(stored) as AppConfig;
      return { ...DEFAULT_CONFIG, ...config };
    } catch (error) {
      console.error('Error loading config from localStorage:', error);
      return DEFAULT_CONFIG;
    }
  }

  /**
   * Сохраняет конфигурацию приложения в localStorage
   */
  static saveConfig(config: AppConfig): void {
    try {
      localStorage.setItem(STORAGE_KEYS.APP_CONFIG, JSON.stringify(config));
    } catch (error) {
      console.error('Error saving config to localStorage:', error);
    }
  }

  /**
   * Загружает данные из кэша
   */
  static getCacheEntry(key: string): CacheEntry | null {
    try {
      const cached = localStorage.getItem(`${STORAGE_KEYS.CACHE}_${key}`);
      if (!cached) return null;

      const entry = JSON.parse(cached) as CacheEntry;
      
      // Проверяем TTL
      if (Date.now() > entry.timestamp + entry.ttl * 1000) {
        this.removeCacheEntry(key);
        return null;
      }

      return entry;
    } catch (error) {
      console.error('Error loading cache entry:', error);
      return null;
    }
  }

  /**
   * Сохраняет данные в кэш с TTL
   */
  static setCacheEntry(key: string, data: any, ttlSeconds: number = 3600): void {
    try {
      const entry: CacheEntry = {
        data,
        timestamp: Date.now(),
        ttl: ttlSeconds,
      };
      localStorage.setItem(`${STORAGE_KEYS.CACHE}_${key}`, JSON.stringify(entry));
    } catch (error) {
      console.error('Error saving cache entry:', error);
    }
  }

  /**
   * Удаляет запись из кэша
   */
  static removeCacheEntry(key: string): void {
    try {
      localStorage.removeItem(`${STORAGE_KEYS.CACHE}_${key}`);
    } catch (error) {
      console.error('Error removing cache entry:', error);
    }
  }

  /**
   * Экспортирует конфигурацию в JSON
   */
  static exportConfig(): string {
    const config = this.loadConfig();
    return JSON.stringify(config, null, 2);
  }

  /**
   * Импортирует конфигурацию из JSON
   */
  static importConfig(jsonString: string): boolean {
    try {
      const config = JSON.parse(jsonString) as AppConfig;
      
      // Валидация базовой структуры
      if (!config.version || !config.settings || !Array.isArray(config.placeholders)) {
        throw new Error('Invalid config format');
      }

      this.saveConfig(config);
      return true;
    } catch (error) {
      console.error('Error importing config:', error);
      return false;
    }
  }
}