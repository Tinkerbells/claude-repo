import type { FC } from 'react'

import { useNavigate } from '@tanstack/react-router'

import '../menu-header.scss'

import { Button, Modal, Typography } from '@tinkerbells/xenon-ui'

import { useAppDispatch } from '../../../store/store'
import { deleteOlapReportPage } from '../../../store/features/olapReposrtsPagesSlice/olapReposrtsPagesSlice'

interface MenuModalProps {
  isModalOpen: boolean
  handleOk: () => void
  handleCancel: () => void
  pageId: string
}

export const MenuModal: FC<MenuModalProps> = (props) => {
  const { isModalOpen, handleOk, handleCancel, pageId } = props
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const handleDeleteOlap = () => {
    // console.log(pageId);
    dispatch(deleteOlapReportPage(pageId))
    navigate({ to: '/' })
  }

  return (
    <Modal
      title="Вы действительно хотите закрыть эту страницу?"
      open={isModalOpen}
      onOk={handleOk}
      onCancel={handleCancel}
      // className="menu-modal"
      footer={[
        <Button
          key="back"
          variant="outline"
          className="create-table-modal__button"
          onClick={() => {
            handleCancel()
            handleDeleteOlap()
            // setPivotTableName(DEFAULT_STATE.STRING);
          }}
        >
          Выйти без сохранения
        </Button>,
        <Button
          key="submit"
          // onClick={() => {
          //   handleOk(pivotTableName, pivotTablePageId);

          // }}
        >
          Сохранить
        </Button>,
      ]}
    >
      <div
      // className="create-table-modal__content"
      >
        <Typography>Все несохраненные изменения будут потеряны!</Typography>
      </div>
    </Modal>
  )
}
