// import { useQueryState } from "nuqs";
import React, { useEffect } from 'react'
import { Layout, ThemeProvider } from '@tinkerbells/xenon-ui'
// import * as React from "react";
import { createRootRoute, Outlet } from '@tanstack/react-router'

import { useAppDispatch } from '../store/store'
import { useGetTableForTablesQuery } from '../api/apiSlice'
import { MenuHeader } from '../components/Header/MenuHeader'
import { updateSelectedTableDataset } from '../store/features/tableForTable/tableForTableSlice'
// import { useQueryState } from "nuqs";

export const Route = createRootRoute({
  component: RootComponent,
})

function RootComponent() {
  const { data: dbTablesData = [] } = useGetTableForTablesQuery()
  // const [selectedDatasetId, setSelectedDatasetId] = useQueryState('datasetId');
  const dispatch = useAppDispatch()

  useEffect(() => {
    if (dbTablesData) {
      dispatch(
        updateSelectedTableDataset({
          id: dbTablesData[0]?.id,
          physicalName: dbTablesData[0]?.physical_name,
        }),
      )
    }
  }, [dbTablesData, dispatch])

  return (
    <React.Fragment>
      <ThemeProvider defaultTheme="light">
        <Layout>
          <Layout.Content>
            <MenuHeader />
            <Outlet />
          </Layout.Content>
        </Layout>
      </ThemeProvider>
    </React.Fragment>
  )
}
