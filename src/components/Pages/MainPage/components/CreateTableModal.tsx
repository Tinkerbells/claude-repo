import type { FC } from 'react'

import { useState } from 'react'
import { observer } from 'mobx-react-lite'
import { Button, Input, Modal } from '@tinkerbells/xenon-ui'

import '../main-page.scss'


import { DEFAULT_STATE } from '../../../../consts/globalConsts'

interface CreateTableModalProps {
  isModalOpen: boolean
  handleOk: () => void
  handleCancel: () => void
}

export const CreateTableModal: FC<CreateTableModalProps> = observer((props) => {
  const { isModalOpen, handleOk, handleCancel } = props
  const [pivotTableName, setPivotTableName] = useState(DEFAULT_STATE.STRING)


  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setPivotTableName(value)
  }

  const handleCreateOlap = async () => {

    try {
      // Create new OLAP report using React Query hook
      // Close modal and reset name
      setPivotTableName(DEFAULT_STATE.STRING)
      handleOk()
    }
    catch (error) {
      console.error('Error creating new OLAP report:', error)
    }
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
        />
      </div>
    </Modal>
  )
})
