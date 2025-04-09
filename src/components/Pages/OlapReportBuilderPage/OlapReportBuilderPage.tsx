import type { FC } from 'react'

import clsx from 'clsx'
import { Content } from '@tinkerbells/xenon-ui'

import './table-builder.scss'

import { Outlet } from '@tanstack/react-router'
import { memo, useEffect, useState } from 'react'

import { useAppDispatch } from '../../../store/store'
// import { useQueryState } from "nuqs";
// import { DEFAULT_STATE } from "../../../consts/globalConsts";
import { useGenerateOlapQuery } from '../../../api/apiSlice'
import { usePageParams } from '../../../hooks/usePageParams'
import { PivotTableHeader } from './components/PivotTableHeader/PivotTableHeader'
// import { useAppDispatch, useAppSelector } from "../../../store/store";
import { OlapConstructorHeader } from './components/OlapConstructorHeader/OlapConstructorHeader'
import { PivotTableSummary } from '../../Layout/PivotTableComponent/PivotTable/PivotTableSummary'
import {
  setIsButtonFetching,
  setPagePivotTable,
} from '../../../store/features/olapReposrtsPagesSlice/olapReposrtsPagesSlice'
// import { setIsPageCollapseOpen } from "../../../store/features/olapReposrtsPagesSlice/olapReposrtsPagesSlice";

interface OlapReportBuilderPageProps {
  pageId: string
  key: string
}

export const OlapReportBuilderPage: FC<OlapReportBuilderPageProps> = memo(
  ({ pageId }) => {
    const [isCollapseOpen, setIsCollapseOpen] = useState(true)
    const pageParametrs = usePageParams(pageId)
    const pivotTableQueryParams = pageParametrs.pivotTableUrlParams
    const tableData = pageParametrs.table
    console.log(tableData)
    const shouldFetchData = pageParametrs.constructorParametrs.isStartFetching
    const {
      data: pivotTable,
      isFetching,
      isError,
      // error,
      refetch,
    } = useGenerateOlapQuery(
      {
        rows: pivotTableQueryParams.rows,
        columns: pivotTableQueryParams.columns,
        values: pivotTableQueryParams.values,
        aggfunc: pivotTableQueryParams.aggfunc,
        physical_name: pivotTableQueryParams.physical_name,
      },
      { skip: !shouldFetchData },
    )
    const dispatch = useAppDispatch()

    // console.log("URL params", pivotTableQueryParams);

    // console.log(pivotTableQueryParams);

    useEffect(() => {
      if (shouldFetchData) {
        refetch()
      }
    }, [refetch, shouldFetchData])

    // useEffect(() => {

    //   setTableData(pageParametrs.table);
    // }, [pageParametrs.table]);

    useEffect(() => {
      if (isFetching && !isError) {
        dispatch(setIsButtonFetching({ pageId, isButtonFetching: true }))
      }
      else {
        dispatch(setIsButtonFetching({ pageId, isButtonFetching: false }))
      }
    }, [dispatch, isError, isFetching, pageId])

    useEffect(() => {
      if (pivotTable && !isError) {
        console.log(pivotTable)
        // console.log("новый олап");
        // console.log(generatedPivotTable);
        dispatch(setPagePivotTable({ pageId, pivotTable }))
      }
    }, [dispatch, isError, pageId, pageParametrs.table, pivotTable])

    const handleCollapse = (event: boolean) => {
      setIsCollapseOpen(event)
      // console.log(event);
      // dispatch(setIsPageCollapseOpen({pageId, isCollapseOpen:event}))
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
                // title={pageParametrs?.versionName}
                // timemark={pageParametrs?.timemark}
                pageId={pageId}
              />
            )}
          </div>

          {tableData && (
            <section className="table-content">
              {!isFetching && tableData && !isError && (
                <PivotTableSummary tableData={tableData} />
              )}
            </section>
          )}
        </main>
        <Outlet />
      </Content>
    )
  },
)
