import { useEffect } from 'react'
import { observer } from 'mobx-react-lite'
import { Content } from '@tinkerbells/xenon-ui'
import { Outlet } from '@tanstack/react-router'

import './main-page.scss'
import { TablePanel } from './ui/TablePanel'
import { useDatasetStore } from '../../../stores/RootStore'
import { TablesListView } from './components/TablesListView'
import { TableVersionsView } from './components/TableVersionsView'
import { useGetTableForTables, useGetVersionsForTable } from '../../../api/queryHooks'

// Using observer to automatically re-render when MobX observables change
export const MainPage = observer(() => {
  const datasetStore = useDatasetStore()
  const datasetId = datasetStore.dbTableDataset.id

  // Use React Query hooks for data fetching
  const { data: dbTablesData = [], isLoading: tablesLoading } = useGetTableForTables()
  const { data: tableVersionsData = [], isLoading: versionsLoading } = useGetVersionsForTable(datasetId)

  // Initialize datasetStore with first table when data is loaded
  useEffect(() => {
    if (dbTablesData.length > 0 && datasetId === 0) {
      datasetStore.updateSelectedTableDataset(
        dbTablesData[0].id,
        dbTablesData[0].physical_name,
      )
    }
  }, [dbTablesData, datasetId, datasetStore])

  return (
    <Content className="container">
      <section className="table-management-container">
        <TablePanel className="table-panel--picker" name="Таблица">
          <TablesListView
            tableData={dbTablesData}
            isLoading={tablesLoading}
          />
        </TablePanel>
        <TablePanel className="table-panel--versions" name="Отчеты">
          <TableVersionsView
            tableData={tableVersionsData}
            isLoading={versionsLoading}
          />
        </TablePanel>
      </section>
      <Outlet />
    </Content>
  )
})
