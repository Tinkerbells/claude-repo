import type { FC } from 'react'

import { Skeleton, TableHead, TableHeader, TableRow } from '@tinkerbells/xenon-ui'

interface TableHeaderSkeletonProps {
  columns: number
  widths?: (string | number)[]
}

export const TableHeaderSkeleton: FC<TableHeaderSkeletonProps> = ({ columns, widths = [] }) => {
  return (
    <TableHeader>
      <TableRow>
        {Array.from({ length: columns }).map((_, index) => {
          const width = widths[index] || 'auto' // Use provided width or default to 'auto'

          return (
            <TableHead
              key={`header-skeleton-${index}`}
              style={{ width }}
            >
              <Skeleton
                // className={b('skeleton')}
                title={false}
                paragraph={{
                  rows: 1,
                }}
              />
            </TableHead>
          )
        })}
      </TableRow>
    </TableHeader>
  )
}
