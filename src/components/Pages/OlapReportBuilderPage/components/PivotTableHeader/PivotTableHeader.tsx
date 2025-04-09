import type { FC } from 'react'

// import "../../main.scss"
import '../../table-builder.scss'

import { Button, Spin, Typography } from '@tinkerbells/xenon-ui'

import { formatDate } from '../../utils/utils'
import { DEFAULT_STATE } from '../../../../../consts/globalConsts'
import { usePageParams } from '../../../../../hooks/usePageParams'
import { useGetTableForTablesQuery, useSaveOlapMutation } from '../../../../../api/apiSlice'

interface OlapReportHeaderType {
  // title?: string;
  // timemark?: string;
  pageId: string
}
export const PivotTableHeader: FC<OlapReportHeaderType> = (props) => {
  const {
    // title, timemark,
    pageId,
  } = props

  const pageParametrs = usePageParams(pageId)
  const pivotTableQueryParams = pageParametrs.pivotTableUrlParams
  const datasedId = pageParametrs.datasetId
  const timemark = pageParametrs.timemark
  const title = pageParametrs.versionName
  const date = timemark ? formatDate(timemark) : DEFAULT_STATE.STRING
  const [saveOlap, { isLoading }] = useSaveOlapMutation()
  const { refetch } = useGetTableForTablesQuery()

  const handleSaveOlap = async () => {
    try {
      const result = await saveOlap({
        rows: pivotTableQueryParams.rows,
        columns: pivotTableQueryParams.columns,
        values: pivotTableQueryParams.values,
        aggfunc: pivotTableQueryParams.aggfunc,
        physical_name: pivotTableQueryParams.physical_name,
        version_name: title,
        dataset_id: datasedId,
      }).unwrap() // `unwrap()` для корректной обработки ошибок
      refetch()
      console.log('Успешно!', result)
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
}
