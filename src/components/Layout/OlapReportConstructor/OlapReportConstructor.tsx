import type { FC } from 'react'

import { usePageParams } from '@/hooks/usePageParams'

import { ConstructorActions } from './components/ConstructorActions/ConstructorActions'
import { ConstructorAttributesBlock } from './components/ConstructorAttributesBlock/ConstructorAttributesBlock'
import { PivotTableConfiguratorsBlock } from './components/ConstructorPivotTableFieldsBlock/PivotTableConfiguratorsBlock'

interface OlapReportConstructorProps {
  pageId: string
}

export const OlapReportConstructor: FC<OlapReportConstructorProps> = ({
  pageId,
}) => {
  const constructorAllAttributes = usePageParams(pageId).constructorParametrs.allAttributes

  return (
    <div className="table-constructor">
      <div className="table-constructor__main">
        <ConstructorAttributesBlock
          pageId={pageId}
          constrcutorAllAttributes={constructorAllAttributes}
        />
        <PivotTableConfiguratorsBlock pageId={pageId} />
      </div>
      <ConstructorActions pageId={pageId} />
    </div>
  )
}
