import type { Row, RowData, Table } from '@tanstack/react-table'

import { flexRender } from '@tanstack/react-table'
import {
  ScrollArea,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Table as TableXenon,
} from '@tinkerbells/xenon-ui'

interface DataTableProps<TData extends RowData> {
  table: Table<TData>
  onRowClick?: (row: Row<TData>) => void
  selectedRow: string | number
}

export function DataTable<TData extends RowData>({
  table,
  onRowClick,
  selectedRow,
}: DataTableProps<TData>) {
  return (
    <div className="table-item">
      <ScrollArea className="scroll-area">
        <TableXenon size="md">
          <TableHeader>
            {table.getHeaderGroups().map(headerGroup => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <TableHead
                    key={header.id}
                    colSpan={header.colSpan}
                    align="left"
                  >
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext(),
                    )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.map((row) => {
              // eslint-disable-next-line ts/ban-ts-comment
              // @ts-ignore
              const isSelected = String(row.original.id) === selectedRow
              return (
                <TableRow
                  key={row.id}
                  data-state={isSelected && 'selected'}
                  onClick={() => onRowClick?.(row)}
                  style={{
                    cursor: onRowClick ? 'pointer' : 'default',
                    transition: 'background-color 0.2s ease',
                    backgroundColor: isSelected ? '#0591FF1A' : '',
                  }}
                >
                  {row.getVisibleCells().map(cell => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              )
            })}
          </TableBody>
        </TableXenon>
      </ScrollArea>
    </div>
  )
}
