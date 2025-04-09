import { useNavigate } from '@tanstack/react-router'

import { API_BASE_URL } from './apiEndpoints'
import { useGenerateOlap, useGetSpecificFilters, useSaveOlap } from './queryHooks'
import { useDatasetStore, useOlapConfigStore, useUIStore } from '../stores/RootStore'

// Hook for generating OLAP reports
export function useOlapGeneration() {
  const olapConfigStore = useOlapConfigStore()
  const uiStore = useUIStore()
  const generateOlap = useGenerateOlap()

  const generateOlapReport = async () => {
    uiStore.setStartFetching(true)
    uiStore.setButtonFetching(true)

    try {
      const result = await generateOlap.mutateAsync({
        rows: olapConfigStore.pivotTableConfig.rows,
        columns: olapConfigStore.pivotTableConfig.columns,
        values: olapConfigStore.pivotTableConfig.values,
        aggfunc: olapConfigStore.pivotTableConfig.aggfunc,
        physical_name: olapConfigStore.pivotTableConfig.physical_name,
      })

      // Update the store with the result
      olapConfigStore.setPagePivotTable(result)

      return result
    }
    finally {
      uiStore.setButtonFetching(false)
      uiStore.setStartFetching(false)
    }
  }

  return {
    generateOlapReport,
    isLoading: generateOlap.isPending,
    isError: generateOlap.isError,
    error: generateOlap.error,
  }
}

// Hook for saving OLAP reports
export function useOlapSave() {
  const olapConfigStore = useOlapConfigStore()
  const datasetStore = useDatasetStore()
  const uiStore = useUIStore()
  const saveOlap = useSaveOlap()

  const saveOlapReport = async (versionName: string) => {
    uiStore.setButtonFetching(true)

    try {
      await saveOlap.mutateAsync({
        rows: olapConfigStore.pivotTableConfig.rows,
        columns: olapConfigStore.pivotTableConfig.columns,
        values: olapConfigStore.pivotTableConfig.values,
        aggfunc: olapConfigStore.pivotTableConfig.aggfunc,
        physical_name: olapConfigStore.pivotTableConfig.physical_name,
        version_name: versionName,
        dataset_id: datasetStore.dbTableDataset.id,
      })
    }
    finally {
      uiStore.setButtonFetching(false)
    }
  }

  return {
    saveOlapReport,
    isLoading: saveOlap.isPending,
    isError: saveOlap.isError,
    error: saveOlap.error,
  }
}

// Hook for loading existing OLAP reports
export function useLoadOlapReport() {
  const olapConfigStore = useOlapConfigStore()
  const navigate = useNavigate()

  const loadOlapReport = async (versionId: number) => {
    try {
      const result = await fetch(`${API_BASE_URL}/olap/get_olap?version_id=${versionId}`)
      const data = await result.json()

      // Initialize the store with the loaded data
      const pageId = olapConfigStore.loadExistingOlapReport(data)

      // Navigate to the OLAP report page
      navigate({ to: '/olapReport/$pageId', params: { pageId } })

      return data
    }
    catch (error) {
      console.error('Error loading OLAP report:', error)
      throw error
    }
  }

  return {
    loadOlapReport,
  }
}

// Hook for creating new OLAP reports
export function useCreateOlapReport() {
  const olapConfigStore = useOlapConfigStore()
  const datasetStore = useDatasetStore()
  const navigate = useNavigate()

  const { refetch } = useGetSpecificFilters(datasetStore.dbTableDataset.physicalName)

  const createNewOlapReport = async () => {
    try {
      // Fetch filters for the selected dataset
      const { data: filters } = await refetch()

      if (!filters) {
        throw new Error('No filters available for the selected dataset')
      }

      // Initialize the OLAP configuration with filters
      const pageId = olapConfigStore.createNewOlapReport(
        filters,
        datasetStore.dbTableDataset.physicalName,
      )

      // Navigate to the new OLAP report page
      navigate({ to: '/olapReport/$pageId', params: { pageId } })

      return pageId
    }
    catch (error) {
      console.error('Error creating new OLAP report:', error)
      throw error
    }
  }

  return {
    createNewOlapReport,
  }
}
