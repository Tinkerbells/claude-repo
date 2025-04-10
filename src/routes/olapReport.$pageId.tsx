import { observer } from 'mobx-react-lite'
import { createFileRoute, useParams } from '@tanstack/react-router'

import { OlapReportBuilderPage } from '../components/Pages/OlapReportBuilderPage/OlapReportBuilderPage'

const RouteComponent = observer(() => {
  const { pageId } = useParams({ from: '/olapReport/$pageId' })

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
