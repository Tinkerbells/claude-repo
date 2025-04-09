import clsx from 'clsx'
import { useEffect } from 'react'
import { observer } from 'mobx-react-lite'
import { Content } from '@tinkerbells/xenon-ui'
import { Outlet } from '@tanstack/react-router'

import './table-builder.scss'
import { useOlapGeneration } from '../../../api/useOlapQueries'
import { useOlapConfigStore, useUIStore } from '../../../stores/RootStore'
import { PivotTableHeader } from './components/PivotTableHeader/PivotTableHeader'
import { OlapConstructorHeader } from './components/OlapConstructorHeader/OlapConstructorHeader'
import { PivotTableSummary } from '../../Layout/PivotTableComponent/PivotTable/PivotTableSummary'

interface OlapReportBuilderPageProps {
  pageId: string
}

export const OlapReportBuilderPage = observer(({ pageId }: OlapReportBuilderPageProps) => {
  const uiStore = useUIStore()
  const olapConfigStore = useOlapConfigStore()

  const isCollapseOpen = uiStore.isCollapseOpen
  const tableData = olapConfigStore.pivotTableData
  const shouldFetchData = uiStore.isStartFetching

  // Use the custom hook for OLAP generation
  const { generateOlapReport, isLoading, isError } = useOlapGeneration()

  useEffect(() => {
    if (shouldFetchData) {
      generateOlapReport()
    }
  }, [shouldFetchData, generateOlapReport])

  const handleCollapse = (event: boolean) => {
    uiStore.setCollapseOpen(event)
  }

  return (
    <Content className="container">
      <main
        className={clsx(
          'table-builder',
          isCollapseOpen ? 'collapse-open' : '',
        )}
      >
        <div className="table-builder__header">
          <OlapConstructorHeader
            handleCollapse={handleCollapse}
            pageId={pageId}
          />
          {tableData && (
            <PivotTableHeader
              pageId={pageId}
            />
          )}
        </div>

        {tableData && (
          <section className="table-content">
            {!isLoading && tableData && !isError && (
              <PivotTableSummary tableData={tableData} />
            )}
          </section>
        )}
      </main>
      <Outlet />
    </Content>
  )
})
