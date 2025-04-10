import { observer } from 'mobx-react-lite'
import { useEffect, useState } from 'react'
import { Content } from '@tinkerbells/xenon-ui'
import { Outlet } from '@tanstack/react-router'

import './main-page.scss'

import { Dataset } from '@/controllers/DatasetStore'

import { TablePanel } from './ui/TablePanel'
import { TablesListView } from './components/TablesListView'
import { TableVersionsView } from './components/TableVersionsView'

export const MainPage = observer(() => {
  const [store] = useState(Dataset)
  const datasetId = store.dbTableDataset.id

  const { data: dbTablesData = [], isLoading: tablesLoading } = store.tablesForTablesQuery.result
  const { data: tableVersionsData = [], isLoading: versionsLoading } = store.versionsForTableQuery.result

  useEffect(() => {
    if (dbTablesData.length > 0 && datasetId === 0) {
      store.updateSelectedTableDataset(
        dbTablesData[0].id,
        dbTablesData[0].physical_name,
      )
    }
  }, [dbTablesData, datasetId, store])

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
