import type { FC } from 'react'
import type {
  DragEndEvent,
  UniqueIdentifier,
} from '@dnd-kit/core'
import type {
  ColumnDef,
  ColumnFiltersState,
} from '@tanstack/react-table'

import { useCallback, useMemo, useState } from 'react'
import { restrictToVerticalAxis } from '@dnd-kit/modifiers'
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable,
} from '@tanstack/react-table'
import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import {
  Checkbox,
  Input,
  ScrollArea,
  Select,
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
  Typography,
} from '@tinkerbells/xenon-ui'

import type { ConstructorAttributeType } from '@/types/olapReportPage'

import { useAppDispatch } from '@/store/store'
import { subTableSelectOptions } from '@/consts/pivotTableConsts'
import { setConstructorAllAttributesParametrs, updateAttributeType } from '@/store/features/olapReposrtsPagesSlice/olapReposrtsPagesSlice'

import { DraggableRow, RowDragHandleCell } from '../TableDndComponants/TableDndComponents'

interface Props {
  constrcutorAllAttributes: ConstructorAttributeType[]
  pageId: string
}

export const ConstructorAttributesBlock: FC<Props> = ({
  constrcutorAllAttributes,
  pageId,
}) => {
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const dataIds = useMemo<UniqueIdentifier[]>(
    () => constrcutorAllAttributes.map(({ attributeId }) => attributeId),
    [constrcutorAllAttributes],
  )
  const totalAttributesCount = `(Всего: ${constrcutorAllAttributes.length})`

  const dispatch = useAppDispatch()

  const sensors = useSensors(
    useSensor(MouseSensor, {}),
    useSensor(TouchSensor, {}),
    useSensor(KeyboardSensor, {}),
  )

  const handleTypeChange = useCallback(
    (attribute: string, type: string) => {
      dispatch(
        updateAttributeType({
          pageId,
          attribute,
          type,
        }),
      )
    },
    [dispatch, pageId],
  )

  const columns = useMemo<ColumnDef<ConstructorAttributeType>[]>(
    () => [
      {
        id: 'drag-handle',
        header: '',
        cell: ({ row }) => <RowDragHandleCell rowId={row.id} />,
        size: 24,
      },
      {
        id: 'select',
        size: 24,
        header: ({ table }) => (
          <Checkbox
            checked={table.getIsAllPageRowsSelected()}
            onChange={(value) => {
              // console.log(value);
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
        enableSorting: false,
        enableColumnFilter: false,
        enableHiding: false,
      },
      {
        accessorKey: 'attributePlaceholder',
        id: 'attribute',
        cell: ({ row }) => {
          return row.original.attributePlaceholder
          // ?? row.original.attributeName
        },
        header: () => 'Атрибуты',
        enableColumnFilter: true,
      },
      {
        header: () => 'Тип',
        id: 'type',
        cell: ({ row }) => {
          const attribute = row.original.attributeName
          // console.log(attributeSelectedParametrs)
          return (
            <Select
              className="select__attributes-table"
              variant="borderless"
              value={row.original.type}
              data-no-dnd="true"
              options={subTableSelectOptions}
              onChange={(value) => {
                handleTypeChange(attribute, value)
              }}
            />
          )
        },
      },
    ],
    [
      handleTypeChange,
    ],

  )

  const table = useReactTable({
    // data: attributesTableData,
    data: constrcutorAllAttributes ?? [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getRowId: row => row.attributeId,
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: { columnFilters },
  })

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (active && over && active.id !== over.id) {
      const oldIndex = dataIds.indexOf(active.id)
      const newIndex = dataIds.indexOf(over.id)
      const newData = arrayMove(constrcutorAllAttributes, oldIndex, newIndex)
      dispatch(setConstructorAllAttributesParametrs({ pageId, allAttributes: newData }))
    }
  }

  return (
    <div className="table-constructor__attribites-item">
      <div className="table-constructor__title">
        <Typography textStyle="strong" level="heading5">
          Список атрибутов
          {' '}
        </Typography>
        <Typography
          textStyle="strong"
          className="list-handbook"
        >
          {totalAttributesCount}
        </Typography>
      </div>

      <Input.Search
        className="search__field"
        placeholder="Введите название атрибута..."
        onChange={(event) => {
          const searchValue = event.target.value
          table.getColumn('attribute')?.setFilterValue(searchValue)
        }}

      />
      <ScrollArea className="scroll-area">
        <DndContext
          collisionDetection={closestCenter}
          modifiers={[restrictToVerticalAxis]}
          onDragEnd={handleDragEnd}
          sensors={sensors}
        >
          <div className="table-constructor__attribites-table">
            <Table size="sm">
              <TableHeader>
                {table.getHeaderGroups().map(headerGroup => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map(header => (
                      <TableHead
                        key={header.id}
                        colSpan={header.colSpan}
                        align="left"
                      >
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext(),
                            )}
                      </TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>

              <TableBody>
                <SortableContext
                  items={dataIds}
                  strategy={verticalListSortingStrategy}
                >
                  {table.getRowModel().rows.map(row => (
                    <DraggableRow key={row.id} row={row} />
                  ))}
                </SortableContext>
              </TableBody>
            </Table>
          </div>
        </DndContext>
      </ScrollArea>
    </div>
  )
}
