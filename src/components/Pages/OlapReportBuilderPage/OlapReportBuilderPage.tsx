import clsx from 'clsx'
import { observer } from 'mobx-react-lite'
import { useEffect, useState } from 'react'
import { Content } from '@tinkerbells/xenon-ui'
import { Outlet } from '@tanstack/react-router'

import './table-builder.scss'

import { Constructor } from '@/controllers/ConstructorStore'
import { PageManager } from '@/controllers/PageManagerStore'

import { PivotTableHeader } from './components/PivotTableHeader/PivotTableHeader'
import { OlapConstructorHeader } from './components/OlapConstructorHeader/OlapConstructorHeader'
import { PivotTableSummary } from '../../Layout/PivotTableComponent/PivotTable/PivotTableSummary'

interface OlapReportBuilderPageProps {
  pageId: string
}

export const OlapReportBuilderPage = observer(({ pageId }: OlapReportBuilderPageProps) => {
  const [isCollapseOpen, setIsCollapseOpen] = useState(true)
  const [constructor] = useState(Constructor)

  // Устанавливаем текущий pageId для Constructor
  useEffect(() => {
    // Если страница не найдена в PageManager, добавляем её
    // (этот код сработает, если пользователь открыл страницу напрямую по URL)
    const existingPage = PageManager.getPage(pageId)
    if (!existingPage) {
      PageManager.addPage({
        pageId,
        versionName: `Отчет ${pageId.slice(0, 6)}`,
        timemark: new Date().toISOString(),
        physicalName: '',
      })
    }
    constructor.setCurrentPageId(pageId)
  }, [pageId, constructor])

  // Обработчик сворачивания/разворачивания конструктора
  const handleCollapse = (value: boolean) => {
    setIsCollapseOpen(value)
  }

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
            handleCollapse={handleCollapse}
            pageId={pageId}
          />
          {constructor.olapQuery.result.data?.table && (
            <PivotTableHeader
              pageId={pageId}
            />
          )}
        </div>

        {constructor.olapQuery.result.data?.table && (
          <section className="table-content">
            {!constructor.olapQuery.result.isLoading && constructor.olapQuery.result.data?.table && !constructor.olapQuery.result.isError && (
              <PivotTableSummary tableData={constructor.olapQuery.result.data.table} />
            )}
          </section>
        )}
      </main>
      <Outlet />
    </Content>
  )
})
