import type { OlapReportApiType } from '@/types/api'

import NetworkService from './Network.service'

export class ConstructorService extends NetworkService {
  constructor() {
    super()
  }

  getOlap(versionId: string) {
    return this.get<OlapReportApiType>(`/olap/get_olap?version_id=${versionId}`)
  }
}
