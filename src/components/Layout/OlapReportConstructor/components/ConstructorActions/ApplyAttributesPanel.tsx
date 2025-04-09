import type { FC } from 'react'

import { useEffect } from 'react'
import { Button, Spin, Switch, Typography } from '@tinkerbells/xenon-ui'

import { useAppDispatch } from '../../../../../store/store'
import { usePageParams } from '../../../../../hooks/usePageParams'
import { setIsStartFetching } from '../../../../../store/features/olapReposrtsPagesSlice/olapReposrtsPagesSlice'

interface ApplyAttributesPanelProps {
  pageId: string
}

export const ApplyAttributesPanel: FC<ApplyAttributesPanelProps> = ({
  pageId,
}) => {
  // const [checked, setChecked] = useState<boolean>(false);

  const pageParams = usePageParams(pageId)
  const isFetching = pageParams.constructorParametrs.isButtonFetching
  const dispatch = useAppDispatch()
  const pivotTableQueryParams = pageParams.pivotTableUrlParams

  const isButtonActive
    = pivotTableQueryParams.rows.length > 0
      && pivotTableQueryParams.columns.length > 0
      && pivotTableQueryParams.values.length > 0
      && pivotTableQueryParams.aggfunc.length > 0

  // const onChange = () => {
  //   setChecked(!checked);
  //   dispatch(setPivotTableMergedURLParam(!checked));
  // };

  useEffect(() => {
    if (!isFetching) {
      dispatch(setIsStartFetching({ pageId, isStartFetching: false }))
    }
  }, [isFetching, dispatch, pageId])

  const handleClick = () => {
    if (isButtonActive) {
      dispatch(setIsStartFetching({ pageId, isStartFetching: true }))
    }
  }

  return (
    <div className="table-constructor__actions">
      <div className="table-constructor__actions-item">
        <Switch
          className="actions__switch"
          // value={checked}
          // onChange={onChange}
        />
        <Typography>Учитывать общее значение</Typography>
      </div>
      <div className="table-constructor__actions-item">
        <Button
          disabled={!isButtonActive}
          className="actions__button"
          onClick={handleClick}
        >
          {isFetching ? <Spin className="button__spinner" /> : 'Применить'}
        </Button>
      </div>
    </div>
  )
}
