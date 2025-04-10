import { makeAutoObservable } from 'mobx'
import { MobxQuery } from 'mobx-tanstack-query'

import { queryClient } from '@/main'
import { DatasetService } from '@/services/Dataset.service'

import type { DBTableDatasetAPiType, DBTableVersionApiType } from '../types/api'

interface DBTableDatasetType {
  id: number
  physicalName: string
}

class DatasetStore {
  private datasetService: DatasetService = new DatasetService()
  dbTableDataset: DBTableDatasetType = {
    id: 0,
    physicalName: '',
  }

  selectedVersionId: number = 7
  datasetId: string = ''

  tablesForTablesQuery: MobxQuery<DBTableDatasetAPiType[], Error> = new MobxQuery({
    queryClient,
    queryKey: ['tables'],
    queryFn: () => this.datasetService.getTablesForTables(),
    staleTime: 60 * 1000, // 1 minute
    refetchOnWindowFocus: true,
  })

  versionsForTableQuery: MobxQuery<DBTableVersionApiType[], Error> = new MobxQuery({
    queryClient,
    queryKey: ['tablesVersions'],
    queryFn: () => this.datasetService.getVersionsForTable(this.selectedVersionId),
    staleTime: 60 * 1000, // 1 minute
    refetchOnWindowFocus: true,
  })

  constructor() {
    makeAutoObservable(this)
  }

  updateSelectedTableDataset(id: number, physicalName: string): void {
    this.dbTableDataset = { id, physicalName }
  }

  setIdToGetOlap(id: number): void {
    this.selectedVersionId = id
  }

  updateFromTablesData(data: DBTableDatasetAPiType[]): void {
    if (data && data.length > 0) {
      this.updateSelectedTableDataset(data[0].id, data[0].physical_name)
    }
  }
}

export const Dataset = new DatasetStore()
