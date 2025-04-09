// src/stores/RootStore.ts
import { makeAutoObservable } from 'mobx'
import { createContext, useContext } from 'react'

import { UIStore } from './UIStore'
import { DatasetStore } from './DatasetStore'
import { OlapConfigStore } from './OlapConfigStore'
import { PageManagerStore } from './PageManagerStore'

export class RootStore {
  datasetStore: DatasetStore
  olapConfigStore: OlapConfigStore
  uiStore: UIStore
  pageManager: PageManagerStore

  constructor() {
    this.datasetStore = new DatasetStore(this)
    this.olapConfigStore = new OlapConfigStore(this)
    this.uiStore = new UIStore(this)
    this.pageManager = new PageManagerStore(this)
    makeAutoObservable(this)
  }
}

// Create a React Context for the RootStore
export const RootStoreContext = createContext<RootStore | null>(null)

// Hook to use the RootStore
export function useRootStore() {
  const context = useContext(RootStoreContext)
  if (context === null) {
    throw new Error('useRootStore must be used within a RootStoreProvider')
  }
  return context
}

// Hook to use specific stores
export const useDatasetStore = () => useRootStore().datasetStore
export const useOlapConfigStore = () => useRootStore().olapConfigStore
export const useUIStore = () => useRootStore().uiStore
export const usePageManager = () => useRootStore().pageManager
