import type { FC } from 'react'

import { useState } from 'react'
import { nanoid } from '@reduxjs/toolkit'

import '../main-page.scss'

import { Button, Input, Modal } from '@tinkerbells/xenon-ui'

import { getCurrentTimeISO } from '../utils/utils'
import { DEFAULT_STATE } from '../../../../consts/globalConsts'
import { useAppDispatch, useAppSelector } from '../../../../store/store'
import { useLazyGetSpecificFiltersQuery } from '../../../../api/apiSlice'
import { setOlapReportPageParametrs } from '../../../../store/features/olapReposrtsPagesSlice/olapReposrtsPagesSlice'

interface CreateTableModalProps {
  isModalOpen: boolean
  handleOk: () => void
  handleCancel: () => void
}

export const CreateTableModal: FC<CreateTableModalProps> = (props) => {
  const { isModalOpen, handleOk, handleCancel } = props
  const [pivotTableName, setPivotTableName] = useState(DEFAULT_STATE.STRING)
  const dbTableDataset = useAppSelector(
    state => state.tableForTables.dbTableDataset,
  )
  // const {data: specificFilters = []} = useGetSpecificFiltersQuery({physicalName:dbTableDataset.physicalName});
  const [triggerGetSpecificFilters] = useLazyGetSpecificFiltersQuery()
  const dispatch = useAppDispatch()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setPivotTableName(value)
  }

  const handleCreateOlap = async () => {
    if (dbTableDataset.physicalName) {
      const result = await triggerGetSpecificFilters({
        physicalName: dbTableDataset.physicalName,
      })

      if (!result?.data) {
        // console.error('No data received from the API');
        return
      }
      // const filters = result.data;

      console.log(result.data)

      if (result.data) {
        const pageId = nanoid()
        dispatch(
          setOlapReportPageParametrs({
            // creator,
            datasetId: dbTableDataset.id,
            // id,
            // modifier,
            // table,
            timemark: getCurrentTimeISO(),
            versionName: pivotTableName,
            physicalName: dbTableDataset.physicalName,
            // versionRequest,
            filters: result.data,
            pageId,
          }),
        )
      }
    }

    setPivotTableName(DEFAULT_STATE.STRING)
    handleOk()
  }

  return (
    <Modal
      title="Название отчета"
      open={isModalOpen}
      onOk={handleOk}
      onCancel={handleCancel}
      footer={[
        <Button
          key="back"
          variant="outline"
          className="create-table-modal__button"
          onClick={() => {
            handleCancel()
            setPivotTableName(DEFAULT_STATE.STRING)
          }}
        >
          Отмена
        </Button>,
        <Button
          key="submit"
          onClick={handleCreateOlap}
          disabled={pivotTableName.length === 0}
        >
          Создать
        </Button>,
      ]}
    >
      <div className="create-table-modal__content">
        <Input
          placeholder="Введите название отчета"
          onChange={handleChange}
          value={pivotTableName}
          // value={tableName}
        />
      </div>
    </Modal>
  )
}
