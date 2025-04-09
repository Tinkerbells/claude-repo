import { useEffect } from 'react'

import './main-page.scss'

import { Content } from '@tinkerbells/xenon-ui'
import { Outlet } from '@tanstack/react-router'

import { TablePanel } from './ui/TablePanel'
import { useAppSelector } from '../../../store/store'
import { TablesListView } from './components/TablesListView'
import { DEFAULT_STATE } from '../../../consts/globalConsts'
import { TableVersionsView } from './components/TableVersionsView'
import {

  useGetTableForTablesQuery,
  useGetVersionsForTableQuery,
  usePrefetch,
} from '../../../api/apiSlice'

export function MainPage() {
  const datasetIdToGetVersions = useAppSelector(
    state => state.tableForTables.dbTableDataset.id,
  )
  const { data: dbTablesData = [] } = useGetTableForTablesQuery()
  const { data: tableVersionsData = [] } = useGetVersionsForTableQuery(
    { datasetIdToGetVersions },
    { skip: datasetIdToGetVersions === DEFAULT_STATE.NUMBER },
  )

  const prefetchTableForTables = usePrefetch('getTableForTables')
  // const dispatch = useAppDispatch();

  useEffect(() => {
    prefetchTableForTables()
  }, [prefetchTableForTables])

  // useEffect(() => {
  //   if (dbTablesData) {
  //     dispatch(
  //       updateSelectedTableDataset({
  //         id: dbTablesData[0]?.id,
  //         physicalName: dbTablesData[0]?.physical_name,
  //       })
  //     );
  //   }
  // }, [dbTablesData, dispatch]);

  return (
    <Content className="container">
      <section className="table-management-container">
        <TablePanel className="table-panel--picker" name="Таблица">
          <TablesListView tableData={dbTablesData} />
        </TablePanel>
        <TablePanel className="table-panel--versions" name="Отчеты">
          <TableVersionsView tableData={tableVersionsData} />
        </TablePanel>
      </section>
      <Outlet />
    </Content>
  )
}
