import type {
  FC,
} from 'react'

import {
  useEffect,
  useMemo,
  // useRef,
  useState,
} from 'react'
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table'
import {
  ScrollArea,
  ScrollBar,
  Spin,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Table as TableXenon,
  Typography,
} from '@tinkerbells/xenon-ui'

import type { DataType } from '../../../../types/tableProps'

import {
  createColumns,
  createReferenceColumns,
  flattenData,
  getNestedObjectForColumns,
} from './utils'
import '../table.scss'

interface TableSummaryProps {
  columns: (string | number)[][]
  indexNames: string[][]
  tableContent: DataType
}

export const TableSummary: FC<TableSummaryProps> = (props) => {
  const { indexNames, columns, tableContent } = props
  const [isLoading, setIsLoading] = useState(true)
  // const isMerged = useAppSelector((state) => state.tableFilters.merged);
  // const columnsNumber = indexNames.length - 1;
  // const previousValues = Array(columnsNumber).fill(null);
  // const tableContainerRef = useRef<HTMLDivElement>(null);

  // console.log(tableContent);

  const columnsNested = getNestedObjectForColumns(tableContent, indexNames)
  const dataColumns = createColumns(columnsNested)
  const referenceColumns = createReferenceColumns(
    indexNames.length,
    columns.length,
  )
  const tableColumns = [...referenceColumns, ...dataColumns]
  const tableBody = useMemo(
    () => flattenData(tableContent, indexNames.length),
    [tableContent, indexNames.length],
  )

  // console.log(tableBody);
  const table = useReactTable({
    data: tableBody,
    columns: tableColumns,
    getCoreRowModel: getCoreRowModel(),
  })

  // console.log(tableBody);
  // console.log(tableColumns);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 100)

    return () => clearTimeout(timer)
  }, [])

  if (isLoading) {
    return (
      <div className="table-container__spinner">
        <Spin tip="Загрузка..." size="large" className="table__spinner" />
        <Typography color="primary">Загрузка таблицы...</Typography>
      </div>

    // <TableSkeleton columns={tableColumns.length} />
    )
  }

  const formatNumber = (value: number): string => {
    const result = String(value).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1 ')
    // console.log(result)
    return result
  }

  // console.log(columns);
  // console.log(data);

  return (
    // <div className="table-container">
  // <div style={{display:"flex", justifyContent:"center", width:"100%"}}>
    <div className="table-container">
      <ScrollArea className="scroll-area">

        <TableXenon view="bordered" size="md">
          <TableHeader>
            {table.getHeaderGroups().map(headerGroup => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <TableHead key={header.id} colSpan={header.colSpan}>
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
              const firstCellValue = row.getVisibleCells()[0]?.getValue()

              // Проверяем, содержит ли первый элемент строки "All"
              const isFirstCellAll = firstCellValue === 'All'
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

                    const formattedValue: string | number
                      = cellValue === undefined
                        ? '-'
                        : !cell.id.includes('level')
                          && typeof cellValue === 'number'
                            ? formatNumber(cellValue)
                            : typeof cellValue === 'string'
                              || typeof cellValue === 'number'
                              ? cellValue
                              : String(cellValue)

                    return (
                      <TableCell
                        key={cell.id}
                        style={cellStyle}
                        align={isAlignRight ? 'right' : 'left'}
                      >
                        {flexRender(cell.column.columnDef.cell, {
                          ...cell.getContext(),
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
        </TableXenon>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>

  // </div>

  // </div>
  )
}
