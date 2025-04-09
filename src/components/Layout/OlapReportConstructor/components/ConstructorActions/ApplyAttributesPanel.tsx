import type { FC } from 'react'

import { useEffect } from 'react'
import { observer } from 'mobx-react-lite'
import { Button, Spin, Switch, Typography } from '@tinkerbells/xenon-ui'

import { useOlapConfigStore, useUIStore } from '../../../../../stores/RootStore'

interface ApplyAttributesPanelProps {
  pageId: string
}

export const ApplyAttributesPanel: FC<ApplyAttributesPanelProps> = observer(({
  pageId,
}) => {
  const olapConfigStore = useOlapConfigStore()
  const uiStore = useUIStore()

  const isFetching = uiStore.isButtonFetching
  const pivotTableConfig = olapConfigStore.pivotTableConfig

  const isButtonActive
    = pivotTableConfig.rows.length > 0
      && pivotTableConfig.columns.length > 0
      && pivotTableConfig.values.length > 0
      && pivotTableConfig.aggfunc.length > 0

  useEffect(() => {
    if (!isFetching) {
      uiStore.setStartFetching(false)
    }
  }, [isFetching, uiStore])

  const handleClick = () => {
    if (isButtonActive) {
      uiStore.setStartFetching(true)
    }
  }

  return (
    <div className="table-constructor__actions">
      <div className="table-constructor__actions-item">
        <Switch
          className="actions__switch"
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
})
