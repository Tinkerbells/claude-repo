import React, { useEffect } from 'react'
import { observer } from 'mobx-react-lite'
import { Layout, ThemeProvider } from '@tinkerbells/xenon-ui'
import { createRootRoute, Outlet } from '@tanstack/react-router'

import { useDatasetStore } from '../stores/RootStore'
import { useGetTableForTables } from '../api/queryHooks'
import { MenuHeader } from '../components/Header/MenuHeader'

// Using observer HOC to make component reactive to MobX state changes
const RootComponent = observer(() => {
  // Use MobX store instead of Redux
  const datasetStore = useDatasetStore()

  // Use React Query hook instead of RTK Query
  const { data: dbTablesData = [] } = useGetTableForTables()

  useEffect(() => {
    if (dbTablesData && dbTablesData.length > 0) {
      // Call MobX store method instead of dispatching Redux action
      datasetStore.updateSelectedTableDataset(
        dbTablesData[0]?.id,
        dbTablesData[0]?.physical_name,
      )
    }
  }, [dbTablesData, datasetStore])

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
})

export default RootComponent

export const Route = createRootRoute({
  component: RootComponent,
})
