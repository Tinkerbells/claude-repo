import type { FC } from 'react'

import { Skeleton, TableBody, TableCell, TableRow } from '@tinkerbells/xenon-ui'

interface TableBodySkeletonProps {
  columns: number
  rowCount?: number
}

export const TableBodySkeleton: FC<TableBodySkeletonProps> = ({ columns, rowCount = 20 }) => {
  return (
    <TableBody>
      {Array.from({ length: rowCount }).map((_, rowIndex) => (
        <TableRow key={`row-skeleton-${rowIndex}`}>
          {Array.from({ length: columns }).map((_, colIndex) => (
            <TableCell key={`cell-skeleton-${rowIndex}-${colIndex}`}>
              <Skeleton
                paragraph={{
                  rows: 1,
                  width: '80%',
                }}
                title={false}
                // className={b('item')}
              />
            </TableCell>
          ))}
        </TableRow>
      ))}
    </TableBody>
  )
}
