// src/stores/PageManagerStore.ts
import { makeAutoObservable } from 'mobx'

import type { RootStore } from './RootStore'

// Interface for a page in the navigation
export interface OlapReportPage {
  pageId: string
  versionName: string
  timemark: string
  physicalName: string
}

export class PageManagerStore {
  rootStore: RootStore

  // Store open OLAP report pages
  openPages: OlapReportPage[] = []

  constructor(rootStore: RootStore) {
    this.rootStore = rootStore
    makeAutoObservable(this)
  }

  // Add a new page to the navigation
  addPage(page: OlapReportPage) {
    // Check if page already exists to avoid duplicates
    const existingPage = this.openPages.find(p => p.pageId === page.pageId)
    if (!existingPage) {
      this.openPages.push(page)
    }
    return page.pageId
  }

  // Remove a page from the navigation
  removePage(pageId: string) {
    this.openPages = this.openPages.filter(page => page.pageId !== pageId)
  }

  // Get a specific page by ID
  getPage(pageId: string) {
    return this.openPages.find(page => page.pageId === pageId)
  }
}
