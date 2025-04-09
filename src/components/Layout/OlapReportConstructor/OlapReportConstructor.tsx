import type { FC } from 'react'

import { ConstructorActions } from './components/ConstructorActions/ConstructorActions'
import { ConstructorAttributesBlock } from './components/ConstructorAttributesBlock/ConstructorAttributesBlock'
import { PivotTableConfiguratorsBlock } from './components/ConstructorPivotTableFieldsBlock/PivotTableConfiguratorsBlock'

interface OlapReportConstructorProps {
  pageId: string
}

export const OlapReportConstructor: FC<OlapReportConstructorProps> = ({
  pageId,
}) => {
  return (
    <div className="table-constructor">
      <div className="table-constructor__main">
        <ConstructorAttributesBlock
          pageId={pageId}
        />
        <PivotTableConfiguratorsBlock pageId={pageId} />
      </div>
      <ConstructorActions pageId={pageId} />
    </div>
  )
}
