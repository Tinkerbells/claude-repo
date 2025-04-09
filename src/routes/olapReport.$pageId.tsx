import { createFileRoute } from '@tanstack/react-router'

import { usePageParams } from '../hooks/usePageParams'
import { OlapReportBuilderPage } from '../components/Pages/OlapReportBuilderPage/OlapReportBuilderPage'

export const Route = createFileRoute('/olapReport/$pageId')({
  component: RouteComponent,
  shouldReload: false,
  staleTime: Infinity,
})

function RouteComponent() {
  const { pageId } = Route.useParams()
  const pageParametrs = usePageParams(pageId)
  // console.log(pageParametrs);

  return (
    pageParametrs && (
      <OlapReportBuilderPage
        pageId={pageId}
        key={pageId}
      />
    )
  )
}

// console.log("versionrequest", pageParametrs?.versionRequest);

// TODO
// будет использоваться только олин раз перед рендером
// changeConstructorAttriburesGroupsType = {rows: [список атрибутов], columns: [список атрибутов], indicator:[список атрибутов] }
