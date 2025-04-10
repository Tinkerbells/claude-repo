import type { FC } from 'react'

import { useState } from 'react'
import { observer } from 'mobx-react-lite'

import { Constructor } from '@/controllers/ConstructorStore'

import { PivotTableConfigurator } from './PivotTableConfigurator'
import { DEFAULT_STATE } from '../../../../../consts/globalConsts'

interface PivotTableConfiguratorsBlockProps {
  pageId: string
}

export const PivotTableConfiguratorsBlock: FC<PivotTableConfiguratorsBlockProps> = observer(({ pageId }) => {
  // Use MobX store instead of Redux with usePageParams
  const [store] = useState(Constructor)

  // Get filtered attributes from MobX store computed property
  const filtersByType = store.getFiltersByType

  // Safely access the attributes or use default empty array
  const rows = filtersByType.rows ?? DEFAULT_STATE.ARRAY
  const columns = filtersByType.columns ?? DEFAULT_STATE.ARRAY
  const values = filtersByType.values ?? DEFAULT_STATE.ARRAY

  return (
    <div className="table-constructor__sub-items">
      <PivotTableConfigurator
        pageId={pageId}
        title="Строки"
        attributes={rows}
        type="rows"
        stats="Кол-во значений"
      />
      <PivotTableConfigurator
        pageId={pageId}
        title="Столбцы"
        attributes={columns}
        type="columns"
        stats="Кол-во значений"
      />
      <PivotTableConfigurator
        pageId={pageId}
        title="Показатель"
        attributes={values}
        type="values"
        stats="Кол-во функций"
      />
      <PivotTableConfigurator
        title="Фильтр"
        type="filters"
        pageId={pageId}
        stats="Кол-во значений"
      />
    </div>
  )
})
