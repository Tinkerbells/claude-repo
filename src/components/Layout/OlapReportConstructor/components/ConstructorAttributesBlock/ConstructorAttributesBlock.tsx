import { observer } from 'mobx-react-lite'
import { restrictToVerticalAxis } from '@dnd-kit/modifiers'
import {
  useCallback,
  useMemo,
  useState,
} from 'react'
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

import { Constructor } from '@/controllers/ConstructorStore'

import { subTableSelectOptions } from '../../../../../consts/pivotTableConsts'
import { DraggableRow, RowDragHandleCell } from '../TableDndComponants/TableDndComponents'

export const ConstructorAttributesBlock = observer(() => {
  const [store] = useState(Constructor)
  const constructorAllAttributes = store.allAttributes

  const dataIds = useMemo(
    () => constructorAllAttributes.map(({ attributeId }) => attributeId),
    [constructorAllAttributes],
  )

  const totalAttributesCount = `(Всего: ${constructorAllAttributes.length})`

  const sensors = useSensors(
    useSensor(MouseSensor, {}),
    useSensor(TouchSensor, {}),
    useSensor(KeyboardSensor, {}),
  )

  const handleTypeChange = useCallback(
    (attribute: string, type: string) => {
      store.updateAttributeType(attribute, type)
    },
    [store],
  )

  const columns = useMemo(
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
        },
        header: () => 'Атрибуты',
        enableColumnFilter: true,
      },
      {
        header: () => 'Тип',
        id: 'type',
        cell: ({ row }) => {
          const attribute = row.original.attributeName
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
    [handleTypeChange],
  )

  const table = useReactTable({
    data: constructorAllAttributes ?? [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getRowId: row => row.attributeId,
    getFilteredRowModel: getFilteredRowModel(),
  })

  const handleDragEnd = (event) => {
    const { active, over } = event
    if (active && over && active.id !== over.id) {
      const oldIndex = dataIds.indexOf(active.id)
      const newIndex = dataIds.indexOf(over.id)
      const newData = arrayMove(constructorAllAttributes, oldIndex, newIndex)
      store.setTableConfiguratorFields('attribute', newData)
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
})
