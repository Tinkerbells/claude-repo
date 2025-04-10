import type { FC } from 'react'

import { observer } from 'mobx-react-lite'
import { Button, Modal, Typography } from '@tinkerbells/xenon-ui'

import { PageManager } from '@/controllers/PageManagerStore'

interface MenuModalProps {
  isModalOpen: boolean
  handleOk: () => void
  handleCancel: () => void
  pageId: string
}

export const MenuModal: FC<MenuModalProps> = observer((props) => {
  const { isModalOpen, handleOk, handleCancel, pageId } = props

  // Получаем информацию о странице из PageManager
  const page = PageManager.getPage(pageId)
  const pageName = page?.versionName || `Отчет ${pageId.slice(0, 6)}`

  return (
    <Modal
      title={`Закрыть страницу "${pageName}"?`}
      open={isModalOpen}
      onOk={handleOk}
      onCancel={handleCancel}
      footer={[
        <Button
          key="back"
          variant="outline"
          className="create-table-modal__button"
          onClick={handleCancel}
        >
          Отмена
        </Button>,
        <Button
          key="submit"
          onClick={handleOk}
        >
          Закрыть
        </Button>,
      ]}
    >
      <div>
        <Typography>Все несохраненные изменения будут потеряны!</Typography>
      </div>
    </Modal>
  )
})
