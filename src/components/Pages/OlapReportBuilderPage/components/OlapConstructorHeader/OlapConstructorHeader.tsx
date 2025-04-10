import type { FC } from 'react'

import { observer } from 'mobx-react-lite'
import { useEffect, useState } from 'react'
import { Outlet } from '@tanstack/react-router'
import { Button, Flex, Typography } from '@tinkerbells/xenon-ui'

import { DEFAULT_STATE } from '@/consts/globalConsts'
import { ATTRIBUTES_TYPES } from '@/consts/pivotTableConsts'
import { Constructor } from '@/controllers/ConstructorStore'
import { ArrowDownOutlined, ArrowUpOutlined } from '@/assets/Icons'
import { OlapReportConstructor } from '@/components/Layout/OlapReportConstructor/OlapReportConstructor'

interface Props {
  handleCollapse: (event: boolean) => void
  pageId: string
}

export const OlapConstructorHeader: FC<Props> = observer(({ handleCollapse, pageId }) => {
  const [isOpen, setIsOpen] = useState(true)
  const [attributesCount, setAttributesCount] = useState(DEFAULT_STATE.NUMBER)

  const [{ allAttributes }] = useState(Constructor)
  const selectedAttributesTitle = `(Использовано: ${attributesCount})`

  useEffect(() => {
    const assignedAttributes = allAttributes.filter(
      item => item.type !== ATTRIBUTES_TYPES.NOT_ASSIGNED,
    )?.length

    setAttributesCount(assignedAttributes)
  }, [allAttributes])

  const toggleCollapse = () => {
    setIsOpen(!isOpen)
    handleCollapse(!isOpen)
  }

  return (
    <div className="collapse-block">
      <div className="collapse-block__header">
        <Flex className="collapse-block__header-title" align="baseline">
          <Typography textStyle="strong" level="heading5">
            Конструктор отчета
          </Typography>
          <Typography textStyle="strong" className="list-handbook">
            {selectedAttributesTitle}
          </Typography>
        </Flex>

        <Button size="sm" variant="ghost" onClick={toggleCollapse}>
          {isOpen ? <ArrowDownOutlined /> : <ArrowUpOutlined />}
        </Button>
      </div>

      <div
        className={
          isOpen ? 'collapse-content__visible' : 'collapse-content__hidden'
        }
      >
        <OlapReportConstructor
          pageId={pageId}
        />
      </div>
      <Outlet />
    </div>
  )
})
