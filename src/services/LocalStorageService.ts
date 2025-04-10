/**
 * Сервисный класс для работы с localStorage с типовой безопасностью TypeScript
 */
export class LocalStorageService {
  /**
   * Сохраняет значение в localStorage
   * @param key Ключ, под которым будет сохранено значение
   * @param value Значение для сохранения
   * @throws Error если localStorage недоступен или операция не удалась
   */
  public set<T>(key: string, value: T): void {
    try {
      const serializedValue = JSON.stringify(value)
      localStorage.setItem(key, serializedValue)
    }
    catch (error) {
      console.error('Ошибка при сохранении данных в localStorage:', error)
      throw new Error(`Не удалось сохранить данные для ключа "${key}"`)
    }
  }

  /**
   * Сохраняет примитивное значение в localStorage
   * @param key Ключ, под которым будет сохранено значение
   * @param value Примитивное значение для сохранения (число, строка, логическое значение или null)
   * @throws Error если localStorage недоступен или операция не удалась
   */
  public setPrimitive(key: string, value: number | string | boolean | null): void {
    try {
      localStorage.setItem(key, String(value))
    }
    catch (error) {
      console.error('Ошибка при сохранении примитивного значения в localStorage:', error)
      throw new Error(`Не удалось сохранить примитивное значение для ключа "${key}"`)
    }
  }

  /**
   * Сохраняет объект в localStorage
   * @param key Ключ, под которым будет сохранен объект
   * @param value Объект для сохранения
   * @throws Error если localStorage недоступен или операция не удалась
   */
  public setObject(key: string, value: object): void {
    try {
      localStorage.setItem(key, JSON.stringify(value))
    }
    catch (error) {
      console.error('Ошибка при сохранении объекта в localStorage:', error)
      throw new Error(`Не удалось сохранить объект для ключа "${key}"`)
    }
  }

  /**
   * Получает значение из localStorage
   * @param key Ключ, по которому нужно получить значение
   * @param defaultValue Опциональное значение по умолчанию, если ключ не существует
   * @returns Сохраненное значение или defaultValue, если ключ не существует
   * @throws Error если localStorage недоступен или операция не удалась
   */
  public get<T>(key: string, defaultValue?: T): T | undefined {
    try {
      const serializedValue = localStorage.getItem(key)
      if (serializedValue === null) {
        return defaultValue
      }
      return JSON.parse(serializedValue) as T
    }
    catch (error) {
      console.error('Ошибка при получении данных из localStorage:', error)
      throw new Error(`Не удалось получить данные для ключа "${key}"`)
    }
  }

  /**
   * Получает значение из localStorage в виде строки
   * @param key Ключ, по которому нужно получить значение
   * @returns Строковое значение или пустая строка, если ключ не существует
   * @throws Error если localStorage недоступен или операция не удалась
   */
  public getAsString(key: string): string {
    try {
      return localStorage.getItem(key) || ''
    }
    catch (error) {
      console.error('Ошибка при получении строкового значения из localStorage:', error)
      throw new Error(`Не удалось получить строковое значение для ключа "${key}"`)
    }
  }

  /**
   * Получает значение из localStorage в виде логического значения
   * @param key Ключ, по которому нужно получить значение
   * @returns Логическое значение (true, если значение равно строке 'true')
   * @throws Error если localStorage недоступен или операция не удалась
   */
  public getAsBoolean(key: string): boolean {
    try {
      return localStorage.getItem(key) === 'true'
    }
    catch (error) {
      console.error('Ошибка при получении логического значения из localStorage:', error)
      throw new Error(`Не удалось получить логическое значение для ключа "${key}"`)
    }
  }

  /**
   * Получает значение из localStorage в виде целого числа
   * @param key Ключ, по которому нужно получить значение
   * @returns Целое число или 0, если ключ не существует или значение невозможно преобразовать
   * @throws Error если localStorage недоступен или операция не удалась
   */
  public getAsInt(key: string): number {
    try {
      return Number.parseInt(localStorage.getItem(key) || '0', 10)
    }
    catch (error) {
      console.error('Ошибка при получении целочисленного значения из localStorage:', error)
      throw new Error(`Не удалось получить целочисленное значение для ключа "${key}"`)
    }
  }

  /**
   * Получает значение из localStorage в виде числа с плавающей точкой
   * @param key Ключ, по которому нужно получить значение
   * @returns Число с плавающей точкой или 0.0, если ключ не существует или значение невозможно преобразовать
   * @throws Error если localStorage недоступен или операция не удалась
   */
  public getAsFloat(key: string): number {
    try {
      return Number.parseFloat(localStorage.getItem(key) || '0.0')
    }
    catch (error) {
      console.error('Ошибка при получении числа с плавающей точкой из localStorage:', error)
      throw new Error(`Не удалось получить число с плавающей точкой для ключа "${key}"`)
    }
  }

  /**
   * Получает значение из localStorage в виде объекта
   * @param key Ключ, по которому нужно получить значение
   * @returns Объект или пустой объект {}, если ключ не существует
   * @throws Error если localStorage недоступен или операция не удалась
   */
  public getAsObject(key: string): object {
    try {
      return JSON.parse(localStorage.getItem(key) || '{}')
    }
    catch (error) {
      console.error('Ошибка при получении объекта из localStorage:', error)
      throw new Error(`Не удалось получить объект для ключа "${key}"`)
    }
  }

  /**
   * Проверяет, существует ли ключ в localStorage
   * @param key Ключ для проверки
   * @returns Логическое значение, указывающее существует ли ключ
   * @throws Error если localStorage недоступен
   */
  public has(key: string): boolean {
    try {
      return localStorage.getItem(key) !== null
    }
    catch (error) {
      console.error('Ошибка при проверке ключа в localStorage:', error)
      throw new Error(`Не удалось проверить существование ключа "${key}"`)
    }
  }

  /**
   * Удаляет определенный ключ из localStorage
   * @param key Ключ для удаления
   * @throws Error если localStorage недоступен или операция не удалась
   */
  public remove(key: string): void {
    try {
      localStorage.removeItem(key)
    }
    catch (error) {
      console.error('Ошибка при удалении данных из localStorage:', error)
      throw new Error(`Не удалось удалить данные для ключа "${key}"`)
    }
  }

  /**
   * Очищает все данные из localStorage
   * @throws Error если localStorage недоступен или операция не удалась
   */
  public clear(): void {
    try {
      localStorage.clear()
    }
    catch (error) {
      console.error('Ошибка при очистке localStorage:', error)
      throw new Error('Не удалось очистить localStorage')
    }
  }

  /**
   * Получает все ключи, сохраненные в localStorage
   * @returns Массив ключей
   * @throws Error если localStorage недоступен
   */
  public getAllKeys(): string[] {
    try {
      const keys: string[] = []
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i)
        if (key !== null) {
          keys.push(key)
        }
      }
      return keys
    }
    catch (error) {
      console.error('Ошибка при получении всех ключей из localStorage:', error)
      throw new Error('Не удалось получить все ключи из localStorage')
    }
  }
}
