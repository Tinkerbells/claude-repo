// src/components/Pages/OlapReportBuilderPage/components/PivotTableHeader/PivotTableHeader.tsx
import type { FC } from 'react'

import { observer } from 'mobx-react-lite'
import { Button, Spin, Typography } from '@tinkerbells/xenon-ui'

import '../../table-builder.scss'
import { formatDate } from '../../utils/utils'
import { DEFAULT_STATE } from '../../../../../consts/globalConsts'
import { useGetTableForTables, useSaveOlap } from '../../../../../api/queryHooks'
import { useOlapConfigStore, usePageManager } from '../../../../../stores/RootStore'

interface OlapReportHeaderType {
  pageId: string
}

export const PivotTableHeader: FC<OlapReportHeaderType> = observer((props) => {
  const { pageId } = props

  // Use MobX stores instead of Redux
  const olapConfigStore = useOlapConfigStore()
  const pageManager = usePageManager()

  // Get page details from MobX stores
  const pageDetails = pageManager.getPage(pageId)
  const pivotTableConfig = olapConfigStore.pivotTableConfig

  // Get values from page details
  const datasetId = 0
  const timemark = pageDetails?.timemark || ''
  const title = pageDetails?.versionName || ''
  const date = timemark ? formatDate(timemark) : DEFAULT_STATE.STRING

  // Use React Query hooks instead of RTK Query
  const { refetch } = useGetTableForTables()
  const saveOlapMutation = useSaveOlap()
  const isLoading = saveOlapMutation.isPending

  const handleSaveOlap = async () => {
    try {
      await saveOlapMutation.mutateAsync({
        rows: pivotTableConfig.rows,
        columns: pivotTableConfig.columns,
        values: pivotTableConfig.values,
        aggfunc: pivotTableConfig.aggfunc,
        physical_name: pivotTableConfig.physical_name,
        version_name: title,
        dataset_id: datasetId,
      })

      // Refetch table list after successful save
      refetch()
      console.log('Успешно!')
    }
    catch (err) {
      console.error('Ошибка:', err)
    }
  }

  return (
    <div className="table-block__header">
      <div className="table-block__header--title">
        <Typography textStyle="strong" level="heading5">
          {title ?? ''}
        </Typography>
        <Typography textStyle="strong" level="heading5">
          {date}
        </Typography>
      </div>

      <div className="table-block__header--buttons">
        <Button variant="ghost" onClick={handleSaveOlap}>
          {isLoading ? <Spin className="button__spinner" /> : 'Сохранить'}
        </Button>
      </div>
    </div>
  )
})
