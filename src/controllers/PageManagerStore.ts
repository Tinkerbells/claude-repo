import { makeAutoObservable } from 'mobx'

import { LocalStorageService } from '@/services/LocalStorageService'

export interface OlapReportPage {
  pageId: string
  versionName: string
  timemark: string
  physicalName: string
}

class PageManagerStore {
  openPages: OlapReportPage[] = []
  localStorage: LocalStorageService = new LocalStorageService()
  private readonly STORAGE_KEY = 'pageManagerOpenPages'

  constructor() {
    makeAutoObservable(this)
    this.loadFromStorage()
  }

  // Загрузка открытых страниц из localStorage при инициализации
  private loadFromStorage() {
    try {
      const savedPages = this.localStorage.get<OlapReportPage[]>(this.STORAGE_KEY, [])
      if (savedPages && Array.isArray(savedPages)) {
        this.openPages = savedPages
      }
    }
    catch (error) {
      console.error('Ошибка при загрузке страниц из localStorage:', error)
      // Если загрузка не удалась, сохраняем пустой массив по умолчанию
    }
  }

  // Сохранение текущих страниц в localStorage
  private saveToStorage() {
    try {
      this.localStorage.set(this.STORAGE_KEY, this.openPages)
    }
    catch (error) {
      console.error('Ошибка при сохранении страниц в localStorage:', error)
    }
  }

  addPage(page: OlapReportPage) {
    const existingPage = this.openPages.find(p => p.pageId === page.pageId)
    if (!existingPage) {
      this.openPages.push(page)
      this.saveToStorage() // Сохранение после добавления страницы
    }
    return page.pageId
  }

  removePage(pageId: string) {
    this.openPages = this.openPages.filter(page => page.pageId !== pageId)
    this.saveToStorage() // Сохранение после удаления страницы
  }

  getPage(pageId: string) {
    return this.openPages.find(page => page.pageId === pageId)
  }

  // Очистка всех открытых страниц
  clearPages() {
    this.openPages = []
    this.saveToStorage()
  }

  // Обновление страницы
  updatePage(pageId: string, updatedPageData: Partial<OlapReportPage>) {
    const pageIndex = this.openPages.findIndex(page => page.pageId === pageId)
    if (pageIndex !== -1) {
      this.openPages[pageIndex] = {
        ...this.openPages[pageIndex],
        ...updatedPageData,
      }
      this.saveToStorage()
    }
  }
}

export const PageManager = new PageManagerStore()
