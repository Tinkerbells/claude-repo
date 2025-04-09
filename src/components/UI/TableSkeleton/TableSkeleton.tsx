import type { FC } from 'react'
import type { TableProps } from '@tinkerbells/xenon-ui'

import { Table } from '@tinkerbells/xenon-ui'

import { TableBodySkeleton } from './TableBodySkeleton'
import { TableHeaderSkeleton } from './TableHeaderSkeleton'

interface TableSkeletonProps extends TableProps {
  columns: number
  rowCount?: number
  widths?: (string | number)[]
}

export const TableSkeleton: FC<TableSkeletonProps> = ({ columns, widths, rowCount, ...rest }: TableSkeletonProps) => {
  return (
    <Table {...rest}>
      <TableHeaderSkeleton columns={columns} widths={widths} />
      <TableBodySkeleton columns={columns} rowCount={rowCount} />
    </Table>
  )
}
