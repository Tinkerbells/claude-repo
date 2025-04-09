import type { FC } from 'react'
import type {
  ColumnDef,
} from '@tanstack/react-table'
import type {
  DragEndEvent,
  UniqueIdentifier,
} from '@dnd-kit/core'

import { observer } from 'mobx-react-lite'
import { useEffect, useMemo, useState } from 'react'
import { restrictToVerticalAxis } from '@dnd-kit/modifiers'
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table'
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
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
  Button,
  Checkbox,
  Popover,
  PopoverContent,
  PopoverTrigger,
  ScrollArea,
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  Typography,
} from '@tinkerbells/xenon-ui'

import type { ConstructorAttributeType, ConstructorPivotTableConfiguratorType } from '../../../../../types/olapReportPage'

import './../../table-constructor.scss'
import { DEFAULT_STATE } from '../../../../../consts/globalConsts'
import { useOlapConfigStore } from '../../../../../stores/RootStore'
import { ArrowButton, CloseButton } from '../../../../../assets/Icons'
import { ConstructorAttributeValuesModal } from './ConstructorAttributeValuesModal'
import {
  DraggableRow,
  RowDragHandleCell,
} from '../TableDndComponants/TableDndComponents'

interface Props {
  pageId: string
  stats: string
  title: string
  attributes?: ConstructorAttributeType[]
  type: string
  selectedAttributes?: string[]
}

export const PivotTableConfigurator: FC<Props> = observer(({
  pageId,
  type,
  title,
  attributes,
  stats,
}) => {
  // Use MobX store instead of Redux
  const olapConfigStore = useOlapConfigStore()

  const [configuratorData, setConfiguratorData] = useState<ConstructorAttributeType[]>(DEFAULT_STATE.ARRAY)

  const dataIds = useMemo<UniqueIdentifier[]>(
    () => configuratorData?.map(({ attributeId }) => attributeId),
    [configuratorData],
  )

  const rowsCount = attributes?.length ?? ''

  useEffect(() => {
    if (attributes) {
      setConfiguratorData(attributes)
      // Call MobX store method instead of dispatching Redux action
      olapConfigStore.setPivotTableUrlParams(type, attributes.map(item => item.attributeName))
    }
  }, [attributes, olapConfigStore, type])

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
        size: 20,
        header: ({ table }) => {
          const isAllRowsSelected = table.getIsAllRowsSelected()
          const isSomeRowsSelected = table.getIsSomeRowsSelected()
          const hasSelectedRows = table.getSelectedRowModel().rows.length > 0
          const isIndeterminate = hasSelectedRows ? isSomeRowsSelected : false
          return (
            <Checkbox
              data-no-dnd="true"
              checked={isAllRowsSelected}
              indeterminate={isIndeterminate}
              onChange={(value) => {
                const isChecked = value.target.checked
                table.toggleAllPageRowsSelected(isChecked)
              }}
              aria-label="Select all"
            />
          )
        },
        cell: ({ row }) => {
          return (
            <Checkbox
              data-no-dnd="true"
              checked={row.getIsSelected()}
              indeterminate={row.getIsSomeSelected()}
              onChange={(value) => {
                row.toggleSelected(value.target.checked)
              }}
              aria-label="Select row"
            />
          )
        },
      },
      {
        accessorFn: row => row.attributeName,
        id: 'attribute',
        size: 115,
        cell: ({ row }) => {
          return (
            <Tooltip placement="left">
              <TooltipTrigger asChild>
                <span className="table-cell__attribute">
                  {row.original.attributePlaceholder}
                </span>
              </TooltipTrigger>
              <TooltipContent>
                {row.original.attributePlaceholder}
              </TooltipContent>
            </Tooltip>
          )
        },
        header: () => 'Атрибуты',
      },
      {
        header: () => `${stats}`,
        id: 'attributeId',
        size: 20,
        cell: ({ row }) => {
          const totalCount = row.original.attributeValues.length
          const selectedAttributeValuesCount = row.original.selectedAttributeValues.length
          return (
            <span>
              {selectedAttributeValuesCount}
              {' '}
              из
              {totalCount}
            </span>
          )
        },
      },
      {
        header: () => '',
        id: 'closeButton',
        size: 16,
        cell: ({ row }) => {
          const attributeName = row.original.attributeName
          return (
            <>
              <Button
                variant="ghost"
                id={`closeButton-${attributeName}`}
                className="sub-item__table-button sub-item__table-close-button"
                onClick={() => handleDeleteAttribute(attributeName)}
              >
                <CloseButton />
              </Button>
            </>
          )
        },
      },
      {
        header: () => '',
        id: 'arrow',
        size: 16,
        cell: ({ row }) => {
          return (
            <>
              <Popover
                placement="right"
                modal
                withArrow={false}
              >
                <PopoverTrigger asChild>
                  <Button
                    style={{ marginRight: '10px' }}
                    variant="ghost"
                    className="table-button sub-item__table-button"
                    onClick={() => handleChangePopoverContent(row.original)}
                  >
                    <ArrowButton />
                  </Button>
                </PopoverTrigger>
                <PopoverContent>
                  <ConstructorAttributeValuesModal pageId={pageId} type={type} />
                </PopoverContent>
              </Popover>
            </>
          )
        },
      },
    ],
    [stats],
  )

  const table = useReactTable({
    data: configuratorData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getRowId: row => row.attributeId,
  })

  const subTableAllRows = table.getRowModel().rows

  useEffect(() => {
    subTableAllRows.forEach((row) => {
      const shouldBeSelected = row.original.checked
      if (shouldBeSelected) {
        row.toggleSelected(shouldBeSelected)
      }
      else {
        row.toggleSelected(false)
      }
    })
  }, [subTableAllRows])

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (active && over && active.id !== over.id) {
      const oldIndex = dataIds.indexOf(active.id)
      const newIndex = dataIds.indexOf(over.id)

      // Update local state
      setConfiguratorData((prevData) => {
        const newData = arrayMove(prevData, oldIndex, newIndex)

        // Update MobX store instead of dispatching Redux actions
        olapConfigStore.setTableConfiguratorFields(type, newData)
        olapConfigStore.setPivotTableUrlParams(type, newData.map(item => item.attributeName))

        return newData
      })
    }
  }

  const handleDeleteAttribute = (attribute: string) => {
    // Call MobX store method instead of dispatching Redux action
    olapConfigStore.deleteAttributeFromTableConfigurator(attribute)
  }

  const handleChangePopoverContent = (
    rowData: ConstructorPivotTableConfiguratorType,
  ) => {
    const { attributeValues, selectedAttributeValues, attributePlaceholder, attributeName } = rowData

    // Call MobX store method instead of dispatching Redux action
    olapConfigStore.setConstructorAttributeModalContent(
      attributeValues,
      selectedAttributeValues,
      attributePlaceholder,
      attributeName,
    )
  }

  const sensors = useSensors(
    useSensor(MouseSensor, {}),
    useSensor(TouchSensor, {}),
    useSensor(KeyboardSensor, {}),
  )

  return (
    <div className="table-constructor__sub-item">
      <div className="table-constructor__title">
        <Typography textStyle="strong" level="heading5">
          {title}
          {' '}
        </Typography>
        <Typography
          textStyle="strong"
          level="heading5"
          className="list-handbook"
        >
          {`(${rowsCount})`}
        </Typography>
      </div>

      <ScrollArea className="scroll-area">
        <DndContext
          collisionDetection={closestCenter}
          modifiers={[restrictToVerticalAxis]}
          onDragEnd={handleDragEnd}
          sensors={sensors}
        >
          <div className="table-constructor__sub-item-table">
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
