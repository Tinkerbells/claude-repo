import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import type { PivotTableType } from '@/types/pivotTable'

import type { DBTableDatasetAPiType, DBTableVersionApiType, OlapReportApiType } from '../types/api'

import { fetchClient } from './apiClient'
import { API_BASE_URL } from './apiEndpoints'

export function useGetTableForTables() {
  return useQuery<DBTableDatasetAPiType[]>({
    queryKey: ['tables'],
    queryFn: () => fetchClient('/all/get_table_for_tables'),
  })
}

export function useGetVersionsForTable(datasetId: number) {
  return useQuery<DBTableVersionApiType[]>({
    queryKey: ['versions', datasetId],
    queryFn: () => fetchClient(`/all/get_versions_for_table?dataset_id=${datasetId}`),
    enabled: datasetId > 0, // Only run if datasetId is valid
  })
}

export function useGetSpecificFilters(physicalName: string) {
  return useQuery({
    queryKey: ['filters', physicalName],
    queryFn: () => fetchClient(`/all/get_specific_filters?physical_name=${physicalName}`),
    enabled: !!physicalName, // Only run when physicalName is available
  })
}

export function useGetOlap(versionId: number) {
  return useQuery<OlapReportApiType>({
    queryKey: ['olap', versionId],
    queryFn: () => fetchClient(`/olap/get_olap?version_id=${versionId}`),
    enabled: versionId > 0, // Only run when versionId is valid
  })
}

export function useGenerateOlap() {
  return useMutation<
    PivotTableType,
    Error,
    {
      rows: string[]
      columns: string[]
      values: string[]
      aggfunc: string[]
      physical_name: string
      fill_value?: number
      round?: number
    }
  >({
    mutationFn: (config) => {
      return fetchClient('/olap/generate_olap', {
        method: 'POST',
        body: JSON.stringify({
          ...config,
          round: 2, // Default values
          fill_value: 0,
        }),
      })
    },
  })
}

export function useSaveOlap() {
  const queryClient = useQueryClient()

  return useMutation<
    any,
    Error,
    {
      rows: string[]
      columns: string[]
      values: string[]
      aggfunc: string[]
      physical_name: string
      version_name: string
      dataset_id: number
      fill_value?: number
      round?: number
    }
  >({
    mutationFn: (data) => {
      const { version_name, dataset_id, ...requestData } = data

      const url = new URL(`${API_BASE_URL}/olap/save_olap`)
      url.searchParams.append('version_name', version_name)
      url.searchParams.append('dataset_id', dataset_id.toString())

      return fetchClient(url.pathname + url.search, {
        method: 'POST',
        body: JSON.stringify({
          ...requestData,
          round: 2, // Default values
          fill_value: 0,
        }),
      })
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['versions', variables.dataset_id] })
      queryClient.invalidateQueries({ queryKey: ['tables'] })
    },
  })
}

// Custom hook to load specific filters and initialize OLAP configuration
export function useInitializeOlapConfig(physicalName: string) {
  return useQuery({
    queryKey: ['filters', physicalName],
    queryFn: () => fetchClient(`/all/get_specific_filters?physical_name=${physicalName}`),
    enabled: !!physicalName,
  })
}
