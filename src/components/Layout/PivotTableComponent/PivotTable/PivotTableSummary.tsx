import type { FC } from 'react'

import { useMemo, useRef } from 'react'
import { useVirtualizer } from '@tanstack/react-virtual'
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table'
import {
  ScrollArea,
  ScrollBar,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@tinkerbells/xenon-ui'

import '../table.scss'

import type { PivotTableType } from '../../../../types/pivotTable'

import {
  createColumns,
  createReferenceColumns,
  flattenData,
  formatCellValue,
  getNestedObjectForColumns,
} from './utils'

interface PivotTableSummaryProps {
  tableData: PivotTableType
}

export const PivotTableSummary: FC<PivotTableSummaryProps> = ({
  tableData,
}) => {
  const { index, table: tableContent } = tableData
  const referenceColumns = createReferenceColumns(index)
  const nestedColumnsKeys = getNestedObjectForColumns(index, tableContent)
  const nestedColumns = createColumns(nestedColumnsKeys)
  const tableColumns = [...referenceColumns, ...nestedColumns]

  // console.log("columns", tableColumns);

  const tableBody = useMemo(
    () => flattenData(tableContent, index.length),
    [index.length, tableContent],
  )

  const table = useReactTable({
    data: tableBody,
    columns: tableColumns,
    getCoreRowModel: getCoreRowModel(),
  })

  const { rows } = table.getRowModel()

  const parentRef = useRef<HTMLDivElement>(null)

  const virtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 34,
    overscan: 20,
  })

  return (
    <div className="table-container">
      <ScrollArea className="scroll-area">
        <div style={{ height: `${virtualizer.getTotalSize()}px` }} ref={parentRef}>
          <Table view="bordered" size="md">
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup, groupIndex) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header, headerIndex) => {
                  // Определяем, нужно ли объединять эту колонку
                    const shouldMergeVertically
                    = headerIndex < index.length && groupIndex === 0 // Объединяем только в первой строке

                    // Если колонка входит в объединяемые и это первая строка — делаем rowSpan
                    if (shouldMergeVertically) {
                      return (
                        <TableHead
                          key={header.id}
                          colSpan={header.colSpan}
                          rowSpan={table.getHeaderGroups().length} // Растягиваем на все строки
                        >
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                        </TableHead>
                      )
                    }

                    // Если колонка входит в объединяемые, но это не первая строка — пропускаем
                    if (headerIndex < index.length) {
                      return null
                    }

                    // Все остальные колонки рендерим как обычно
                    return (
                      <TableHead key={header.id} colSpan={header.colSpan}>
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                      </TableHead>
                    )
                  })}
                </TableRow>
              ))}
            </TableHeader>

            <TableBody>
              {table.getRowModel().rows.map((row) => {
                const firstCellValue = row.getVisibleCells()[0]?.getValue()
                // eslint-disable-next-line ts/ban-ts-comment
                // @ts-ignore
                const isFirstCellAll = firstCellValue.includes('Общий итог')
                const rowStyle = isFirstCellAll ? { fontWeight: 'bold' } : {}

                return (
                  <TableRow key={row.id} style={rowStyle}>
                    {row.getVisibleCells().map((cell) => {
                    // Получаем значение ячейки
                    // console.log(cell);
                      const cellValue = cell.getValue()
                      const isAll = cell.id.includes('All')
                      const isAlignRight
                      = !cell.id.includes('level')
                        && typeof cellValue === 'number'
                      const cellStyle = isAll ? { fontWeight: 'bold' } : {}

                      const formattedValue = formatCellValue(cellValue, cell?.id)

                      return (
                        <TableCell
                          key={cell.id}
                          style={cellStyle}
                          align={isAlignRight ? 'right' : 'left'}
                        >
                          {flexRender(cell.column.columnDef.cell, {
                            ...cell.getContext(),
                            // eslint-disable-next-line ts/ban-ts-comment
                            // @ts-ignore
                            renderValue: () => formattedValue,
                          })}
                        </TableCell>
                      )
                    })}
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  )
}
