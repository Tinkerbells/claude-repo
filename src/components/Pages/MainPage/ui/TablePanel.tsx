import type { FC, ReactNode } from 'react'

import clsx from 'clsx'
import { Typography } from '@tinkerbells/xenon-ui'

interface TablePanelProps {
  name: string
  className: string
  children?: ReactNode
}

export const TablePanel: FC<TablePanelProps> = ({
  name,
  className,
  children,
}) => {
  return (
    <div className={clsx('table-panel', className)}>
      <div className="table-panel__header">
        <Typography textStyle="strong" level="heading5">
          {name}
        </Typography>
      </div>
      <div className="table-panel__content">{children}</div>
    </div>
  )
}
