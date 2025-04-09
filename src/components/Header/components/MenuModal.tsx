import type { FC } from 'react'

import { observer } from 'mobx-react-lite'
import { useNavigate } from '@tanstack/react-router'
import { Button, Modal, Typography } from '@tinkerbells/xenon-ui'

import { useRootStore } from '../../../stores/RootStore'

interface MenuModalProps {
  isModalOpen: boolean
  handleOk: () => void
  handleCancel: () => void
  pageId: string
}

export const MenuModal: FC<MenuModalProps> = observer((props) => {
  const { isModalOpen, handleOk, handleCancel, pageId } = props
  const rootStore = useRootStore()
  const navigate = useNavigate()

  const handleDeleteOlap = () => {
    rootStore.pageManager.removePage(pageId)
    navigate({ to: '/' })
  }

  return (
    <Modal
      title="Вы действительно хотите закрыть эту страницу?"
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
            handleDeleteOlap()
          }}
        >
          Выйти без сохранения
        </Button>,
        <Button
          key="submit"
          // onClick to save the OLAP report
          onClick={() => {
            // Could add saving logic here using MobX store
            handleOk()
          }}
        >
          Сохранить
        </Button>,
      ]}
    >
      <div>
        <Typography>Все несохраненные изменения будут потеряны!</Typography>
      </div>
    </Modal>
  )
})
