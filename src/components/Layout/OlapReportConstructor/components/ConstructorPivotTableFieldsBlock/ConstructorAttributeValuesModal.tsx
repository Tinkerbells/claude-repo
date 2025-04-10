import type { FC } from 'react'
import type {
  ColumnDef,
  ColumnFiltersState,
} from '@tanstack/react-table'

import { observer } from 'mobx-react-lite'
import { useEffect, useMemo, useState } from 'react'
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable,
} from '@tanstack/react-table'
import {
  Button,
  Checkbox,
  Input,
  PopoverClose,
  ScrollArea,
  ScrollBar,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Typography,
} from '@tinkerbells/xenon-ui'

import { Constructor } from '@/controllers/ConstructorStore'

import '../../table-constructor.scss'
import { CloseButton } from '../../../../../assets/Icons'
import { aggregationFunctionsHandbook, ATTRIBUTES_TYPES, isAggregationFunctionKey } from '../../../../../consts/pivotTableConsts'

interface ConstructorAttributeValuesModalProps {
  pageId: string
  type: string
}

export const ConstructorAttributeValuesModal: FC<ConstructorAttributeValuesModalProps> = observer(({ type }) => {
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [store] = useState(Constructor)

  const attributeModal = store.attributeModal

  const parametrsCount = attributeModal ? `(${attributeModal.parametrs.length})` : '(0)'

  // Text to display based on attribute type
  const text = type === ATTRIBUTES_TYPES.VALUES
    ? 'Выберите, какие факты применить для агрегирования фактов'
    : 'Выберите, какие значения данного атрибута отображать в таблице'

  // Define table columns
  const columns = useMemo<ColumnDef<string>[]>(
    () => [
      {
        id: 'select',
        size: 24,
        header: ({ table }) => (
          <Checkbox
            checked={table.getIsAllPageRowsSelected()}
            onChange={(value) => {
              table.toggleAllPageRowsSelected(!!value.target.checked)
            }}
            aria-label="Select all"
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            checked={row.getIsSelected()}
            onChange={value => row.toggleSelected(!!value.target.checked)}
            aria-label="Select row"
          />
        ),
      },
      {
        accessorKey: 'parametr',
        cell: ({ row }) => {
          const value = row.original // string
          if (isAggregationFunctionKey(value)) {
            return `${aggregationFunctionsHandbook[value]} (${value})`
          }
          else {
            return value
          }
        },
        header: () => 'Все значения',
        enableColumnFilter: true,
      },
    ],
    [],
  )

  // Initialize table
  const table = useReactTable({
    data: attributeModal?.parametrs ?? [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: { columnFilters },
  })

  const subTableAllRows = table.getRowModel().rows

  // Get selected attribute values from table
  const selectedAttributeValues = table
    .getSelectedRowModel()
    .rows
    .map(item => item.original)

  // Set initial row selection based on attributeModal
  useEffect(() => {
    if (attributeModal?.selectedParametrs) {
      subTableAllRows.forEach((row) => {
        const shouldBeSelected = attributeModal.selectedParametrs.includes(
          row.original,
        )
        if (shouldBeSelected) {
          row.toggleSelected(shouldBeSelected)
        }
        else {
          row.toggleSelected(false)
        }
      })
    }
  }, [attributeModal?.selectedParametrs, subTableAllRows])

  // Handle save button click
  const handleSaveParametrs = () => {
    if (!attributeModal)
      return

    if (type === ATTRIBUTES_TYPES.VALUES) {
      // Set aggregation functions for pivot table
      store.setAggregationFunctionsForPivotTable(selectedAttributeValues)
    }

    // Set selected values for attribute
    store.setAttributeSelectedValues(
      attributeModal.attributeName,
      selectedAttributeValues,
    )
  }

  if (!attributeModal) {
    return <div>No attribute selected</div>
  }

  return (
    <div className="filters-modal">
      <div className="filters-modal__header">
        <div className="filters-modal__header--title">
          <Typography textStyle="strong" level="heading5">
            {attributeModal.attributePlaceholder}
          </Typography>

          <Typography
            textStyle="strong"
            level="heading5"
            className="filters-modal__parametrs-count"
          >
            {parametrsCount}
          </Typography>
        </div>
        <PopoverClose className="filters-modal__button">
          <Button
            variant="ghost"
            size="sm"
          >
            <CloseButton />
          </Button>
        </PopoverClose>
      </div>
      <div className="filters-modal__body">
        <Input.Search
          className="search__field"
          placeholder="Введите название"
          onChange={(event) => {
            const searchValue = event.target.value
            table.getColumn('parametr')?.setFilterValue(searchValue)
          }}
        />
        <Typography style={{ maxWidth: '300px' }}>
          {text}
        </Typography>
        <ScrollArea className="scroll-area">
          <div className="filters-modal__table">
            <Table size="md">
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
                {table.getRowModel().rows.map(row => (
                  <TableRow key={row.id}>
                    {row.getVisibleCells().map(cell => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
        <PopoverClose className="filters-modal__button">
          <Button
            className="filters-modal__save-button"
            onClick={handleSaveParametrs}
          >
            Сохранить
          </Button>
        </PopoverClose>
      </div>
    </div>
  )
})
