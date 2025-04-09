import { useEffect } from 'react'
import { observer } from 'mobx-react-lite'
// src/routes/olapReport.$pageId.tsx
import { createFileRoute, useParams } from '@tanstack/react-router'

import { useOlapConfigStore, usePageManager } from '../stores/RootStore'
import { OlapReportBuilderPage } from '../components/Pages/OlapReportBuilderPage/OlapReportBuilderPage'

// Using observer to make the component reactive to MobX state changes
const RouteComponent = observer(() => {
  const { pageId } = useParams({ from: '/olapReport/$pageId' })
  const pageManager = usePageManager()
  const olapConfigStore = useOlapConfigStore()

  // Get page details from PageManager store
  const pageDetails = pageManager.getPage(pageId)

  // If page details exist, ensure config is loaded
  useEffect(() => {
    // If the page exists in navigation but OLAP config isn't loaded,
    // we need to load it (this is a refresh or direct URL access case)
    if (pageDetails && !olapConfigStore.currentPageId) {
      // Set the current page ID in the OLAP config store
      olapConfigStore.setCurrentPageId(pageId)

      // In a real implementation, you might need to reload the page data here
      // Example: olapConfigStore.loadPageConfiguration(pageId)
    }
  }, [pageDetails, olapConfigStore, pageId])

  // If page doesn't exist in manager, it could be a direct URL access
  // We could add code to fetch and load the configuration here

  // Only render the page if we have page details
  if (!pageDetails) {
    return <div>Loading OLAP report...</div>
  }

  return (
    <OlapReportBuilderPage
      pageId={pageId}
      key={pageId}
    />
  )
})

export const Route = createFileRoute('/olapReport/$pageId')({
  component: RouteComponent,
  shouldReload: false,
  staleTime: Infinity,
})
