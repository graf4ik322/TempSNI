import axios, { AxiosResponse } from 'axios';
import { APIConfig, AppError } from '../types';
import { StorageService } from './storage';

export class APIService {
  /**
   * Выполняет запрос к внешнему API с кэшированием
   */
  static async fetchData(config: APIConfig): Promise<any> {
    const cacheKey = this.generateCacheKey(config);
    
    // Проверяем кэш
    const cached = StorageService.getCacheEntry(cacheKey);
    if (cached) {
      return cached.data;
    }

    try {
      // Проверяем HTTPS для безопасности
      if (!config.url.startsWith('https://')) {
        throw new Error('Only HTTPS URLs are allowed for security reasons');
      }

      const response = await this.makeRequest(config);
      const data = this.extractData(response.data, config.dataPath);

      // Кэшируем результат
      const ttl = config.refreshInterval || 3600; // 1 час по умолчанию
      StorageService.setCacheEntry(cacheKey, data, ttl);

      return data;
    } catch (error) {
      // Пытаемся использовать устаревший кэш в случае ошибки
      const staleCache = this.getStaleCache(cacheKey);
      if (staleCache) {
        console.warn('Using stale cache due to API error:', error);
        return staleCache;
      }

      throw this.handleError(error);
    }
  }

  /**
   * Выполняет HTTP запрос
   */
  private static async makeRequest(config: APIConfig): Promise<AxiosResponse> {
    const axiosConfig = {
      method: config.method,
      url: config.url,
      headers: {
        'Content-Type': 'application/json',
        ...config.headers,
      },
      timeout: 10000, // 10 секунд
    };

    if (config.method === 'GET' && config.params) {
      axiosConfig.params = config.params;
    } else if (config.method === 'POST' && config.params) {
      axiosConfig.data = config.params;
    }

    return await axios(axiosConfig);
  }

  /**
   * Извлекает данные по JSONPath
   */
  private static extractData(data: any, path?: string): any {
    if (!path) return data;

    try {
      // Простая реализация JSONPath для базовых случаев
      const keys = path.split('.');
      let result = data;

      for (const key of keys) {
        if (key.includes('[') && key.includes(']')) {
          // Обработка массивов: data.items[0]
          const [arrayKey, indexStr] = key.split('[');
          const index = parseInt(indexStr.replace(']', ''));
          result = result[arrayKey][index];
        } else {
          result = result[key];
        }
      }

      return result;
    } catch (error) {
      console.warn('Error extracting data with path:', path, error);
      return data;
    }
  }

  /**
   * Генерирует ключ для кэширования
   */
  private static generateCacheKey(config: APIConfig): string {
    const keyData = {
      url: config.url,
      method: config.method,
      params: config.params,
      headers: config.headers,
    };
    return btoa(JSON.stringify(keyData)).replace(/[^a-zA-Z0-9]/g, '');
  }

  /**
   * Получает устаревший кэш (игнорируя TTL)
   */
  private static getStaleCache(cacheKey: string): any {
    try {
      const cached = localStorage.getItem(`twch_placeholder_cache_${cacheKey}`);
      if (cached) {
        const entry = JSON.parse(cached);
        return entry.data;
      }
    } catch (error) {
      console.error('Error getting stale cache:', error);
    }
    return null;
  }

  /**
   * Обрабатывает ошибки API
   */
  private static handleError(error: any): AppError {
    if (error.code === 'ENOTFOUND' || error.code === 'NETWORK_ERROR') {
      return {
        type: 'network',
        message: 'Нет подключения к интернету',
        details: error,
        timestamp: Date.now(),
      };
    }

    if (error.response) {
      const status = error.response.status;
      let message = 'Ошибка API';

      switch (status) {
        case 400:
          message = 'Неверный запрос';
          break;
        case 401:
          message = 'Не авторизован';
          break;
        case 403:
          message = 'Доступ запрещен';
          break;
        case 404:
          message = 'Ресурс не найден';
          break;
        case 429:
          message = 'Слишком много запросов';
          break;
        case 500:
          message = 'Ошибка сервера';
          break;
        default:
          message = `Ошибка HTTP ${status}`;
      }

      return {
        type: 'api',
        message,
        details: error.response.data,
        timestamp: Date.now(),
      };
    }

    return {
      type: 'unknown',
      message: error.message || 'Неизвестная ошибка',
      details: error,
      timestamp: Date.now(),
    };
  }

  /**
   * Проверяет поддержку CORS для URL
   */
  static async checkCORSSupport(url: string): Promise<boolean> {
    try {
      const response = await fetch(url, {
        method: 'HEAD',
        mode: 'cors',
      });
      return response.ok;
    } catch (error) {
      return false;
    }
  }

  /**
   * Валидирует URL API
   */
  static validateAPIUrl(url: string): { valid: boolean; error?: string } {
    try {
      const parsedUrl = new URL(url);
      
      if (parsedUrl.protocol !== 'https:') {
        return {
          valid: false,
          error: 'Только HTTPS URLs разрешены по соображениям безопасности',
        };
      }

      // Блокируем локальные адреса
      const hostname = parsedUrl.hostname.toLowerCase();
      if (
        hostname === 'localhost' ||
        hostname.startsWith('127.') ||
        hostname.startsWith('192.168.') ||
        hostname.startsWith('10.') ||
        hostname.startsWith('172.')
      ) {
        return {
          valid: false,
          error: 'Локальные адреса не поддерживаются',
        };
      }

      return { valid: true };
    } catch (error) {
      return {
        valid: false,
        error: 'Неверный формат URL',
      };
    }
  }

  /**
   * Очищает кэш для конкретного API
   */
  static clearAPICache(config: APIConfig): void {
    const cacheKey = this.generateCacheKey(config);
    StorageService.removeCacheEntry(cacheKey);
  }

  /**
   * Получает список популярных публичных API с поддержкой CORS
   */
  static getPopularAPIs(): Array<{ name: string; url: string; description: string }> {
    return [
      {
        name: 'JSONPlaceholder',
        url: 'https://jsonplaceholder.typicode.com/posts/1',
        description: 'Тестовые данные для разработки',
      },
      {
        name: 'Cat Facts',
        url: 'https://catfact.ninja/fact',
        description: 'Случайные факты о кошках',
      },
      {
        name: 'Random Quote',
        url: 'https://api.quotable.io/random',
        description: 'Случайные цитаты',
      },
      {
        name: 'Weather API',
        url: 'https://api.openweathermap.org/data/2.5/weather?q=Moscow&appid=YOUR_API_KEY',
        description: 'Данные о погоде (требует API ключ)',
      },
      {
        name: 'Dog Images',
        url: 'https://dog.ceo/api/breeds/image/random',
        description: 'Случайные изображения собак',
      },
    ];
  }
}