import type { RowData, Table } from '@tanstack/react-table'

import { flexRender } from '@tanstack/react-table'
import {
  TableHead,
  TableHeader,
  TableRow,
  Table as TableXenon,
} from '@tinkerbells/xenon-ui'

import { EmptyMenu } from '../../../assets/Icons'
import './data-table.scss'

interface DataTableProps<TData extends RowData> {
  table: Table<TData>
}

export function EmptyTableWithHeader<TData extends RowData>({
  table,
}: DataTableProps<TData>) {
  return (
    <div className="empty-table">
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
      </TableXenon>
      <div className="empty-menu">
        <EmptyMenu />

      </div>

    </div>
  )
}
