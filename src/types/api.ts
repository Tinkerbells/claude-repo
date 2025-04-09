import type { PivotTableType } from './pivotTable'
import type { VersionRequestType } from './olapReportPage'

export type DBTableDatasetAPiType<T = unknown> = Record<string, T> & {
  display_name: string
  id: number
  latest_timemark: unknown
  physical_name: string
  version_count: number
}

export type DBTableVersionApiType<T = unknown> = Record<string, T> & {
  creator: string
  dataset_id: number
  id: number
  modifier: string
  timemark: string
  version_name: string
}

export type OlapReportApiType<T = unknown> = Record<string, T> & {
  creator: null | string
  dataset_id: number
  id: number
  filters: OlapReportFiltersType[]
  modifier: string
  table: PivotTableType
  timemark: string
  version_name: string
  version_request: VersionRequestType
}

export interface OlapReportFiltersType {
  filter_name: string
  filter_type: string
  filter_placeholder: string
  filter_actions: string[]
  filter_values: string[]
}
