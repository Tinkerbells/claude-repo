import { makeAutoObservable } from 'mobx'

import type { RootStore } from './RootStore'
import type { DBTableDatasetAPiType } from '../types/api'

export class DatasetStore {
  rootStore: RootStore

  dbTableDataset: { id: number, physicalName: string } = {
    id: 0,
    physicalName: '',
  }

  selectedVersionId: number = 0

  constructor(rootStore: RootStore) {
    this.rootStore = rootStore
    makeAutoObservable(this)
  }

  updateSelectedTableDataset(id: number, physicalName: string) {
    this.dbTableDataset = { id, physicalName }
  }

  setIdToGetOlap(id: number) {
    this.selectedVersionId = id
  }

  // Method to update store from API data
  updateFromTablesData(data: DBTableDatasetAPiType[]) {
    if (data && data.length > 0) {
      this.updateSelectedTableDataset(data[0].id, data[0].physical_name)
    }
  }
}
