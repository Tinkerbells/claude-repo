import clsx from 'clsx'
import { useState } from 'react'
import { observer } from 'mobx-react-lite'
import { Content } from '@tinkerbells/xenon-ui'
import { Outlet } from '@tanstack/react-router'

import './table-builder.scss'

import { Constructor } from '@/controllers/ConstructorStore'

import { PivotTableHeader } from './components/PivotTableHeader/PivotTableHeader'
import { OlapConstructorHeader } from './components/OlapConstructorHeader/OlapConstructorHeader'
import { PivotTableSummary } from '../../Layout/PivotTableComponent/PivotTable/PivotTableSummary'

interface OlapReportBuilderPageProps {
  pageId: string
}

export const OlapReportBuilderPage = observer(({ pageId }: OlapReportBuilderPageProps) => {
  const [{ olapQuery }] = useState(Constructor)

  return (
    <Content className="container">
      <main
        className={clsx(
          'table-builder',
          'collapse-open',
        )}
      >
        <div className="table-builder__header">
          <OlapConstructorHeader
            handleCollapse={() => {}}
            pageId={pageId}
          />
          {olapQuery.result.data?.table && (
            <PivotTableHeader
              pageId={pageId}
            />
          )}
        </div>

        {olapQuery.result.data?.table && (
          <section className="table-content">
            {!olapQuery.result.isLoading && olapQuery.result.data?.table && !olapQuery.result.isError && (
              <PivotTableSummary tableData={olapQuery.result.data.table} />
            )}
          </section>
        )}
      </main>
      <Outlet />
    </Content>
  )
})
