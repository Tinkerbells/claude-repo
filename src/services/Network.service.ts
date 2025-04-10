export interface RequestOptions extends RequestInit {
  headers?: Record<string, string>
}

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'

export const BASE_URL = `http://192.168.1.125:5002/`

export class NetworkService {
  protected defaultHeaders: Record<string, string>
  protected baseUrl: string = BASE_URL

  constructor(defaultHeaders: Record<string, string> = {}) {
    this.defaultHeaders = {
      'Content-Type': 'application/json',
      ...defaultHeaders,
    }
  }

  /**
   * Формирует полный URL из предоставленной конечной точки
   * @param endpoint - Конечная точка API
   * @returns Полный URL
   */
  protected buildUrl(endpoint: string): string {
    return `${this.baseUrl}${endpoint}`
  }

  /**
   * Объединяет заголовки по умолчанию с предоставленными заголовками
   * @param headers - Заголовки для объединения с заголовками по умолчанию
   * @returns Объединенные заголовки
   */
  protected buildHeaders(headers: Record<string, string> = {}): Record<string, string> {
    return {
      ...this.defaultHeaders,
      ...headers,
    }
  }

  /**
   * Разбирает ответ API
   * @param response - Объект ответа fetch
   * @returns Разобранные данные ответа
   */
  protected async parseResponse<T>(response: Response): Promise<T> {
    const contentType = response.headers.get('Content-Type') || ''

    if (!response.ok) {
      const error = await response.text()
      throw new Error(error || response.statusText)
    }

    if (contentType.includes('application/json')) {
      return response.json() as Promise<T>
    }

    return response.text() as unknown as Promise<T>
  }

  /**
   * Выполняет fetch-запрос
   * @param endpoint - Конечная точка API
   * @param options - Параметры fetch
   * @returns Разобранные данные ответа
   */
  private async request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    const url = this.buildUrl(endpoint)
    const headers = this.buildHeaders(options.headers)

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      })

      return await this.parseResponse<T>(response)
    }
    catch (error) {
      console.error('Запрос не удался:', error)
      throw error
    }
  }

  /**
   * Выполняет GET-запрос
   * @param endpoint - Конечная точка API
   * @param options - Дополнительные параметры fetch
   * @returns Разобранные данные ответа
   */
  public async get<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'GET',
      ...options,
    })
  }

  /**
   * Выполняет POST-запрос
   * @param endpoint - Конечная точка API
   * @param data - Данные для отправки
   * @param options - Дополнительные параметры fetch
   * @returns Разобранные данные ответа
   */
  public async post<T, D = any>(endpoint: string, data: D, options: RequestOptions = {}): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
      ...options,
    })
  }

  /**
   * Выполняет PUT-запрос
   * @param endpoint - Конечная точка API
   * @param data - Данные для отправки
   * @param options - Дополнительные параметры fetch
   * @returns Разобранные данные ответа
   */
  public async put<T, D = any>(endpoint: string, data: D, options: RequestOptions = {}): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
      ...options,
    })
  }

  /**
   * Выполняет PATCH-запрос
   * @param endpoint - Конечная точка API
   * @param data - Данные для отправки
   * @param options - Дополнительные параметры fetch
   * @returns Разобранные данные ответа
   */
  public async patch<T, D = any>(endpoint: string, data: D, options: RequestOptions = {}): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(data),
      ...options,
    })
  }

  /**
   * Выполняет DELETE-запрос
   * @param endpoint - Конечная точка API
   * @param options - Дополнительные параметры fetch
   * @returns Разобранные данные ответа
   */
  public async delete<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'DELETE',
      ...options,
    })
  }
}

export default NetworkService
