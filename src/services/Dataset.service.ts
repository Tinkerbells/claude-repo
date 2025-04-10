import type { DBTableDatasetAPiType, DBTableVersionApiType } from '@/types/api'

import NetworkService from './Network.service'

export class DatasetService extends NetworkService {
  constructor() {
    super()
  }

  getTablesForTables() {
    return this.get<DBTableDatasetAPiType[]>('/all/get_table_for_tables')
  }

  getVersionsForTable(datasetId: number) {
    return this.get<DBTableVersionApiType[]>(`/all/get_versions_for_table?dataset_id=${datasetId}`)
  }
}
