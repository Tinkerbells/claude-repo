import type { FC } from 'react'
import type {
  ColumnDef,
} from '@tanstack/react-table'
import type {
  DragEndEvent,
  UniqueIdentifier,
} from '@dnd-kit/core'

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
  // useSortable,
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

import type { ConstructorAttributeType, ConstructorPivotTableConfiguratorType } from '../../../../../types/olapReportPage.ts'

import { useAppDispatch } from '../../../../../store/store.ts'
import './../../table-constructor.scss'
import { DEFAULT_STATE } from '../../../../../consts/globalConsts.ts'
import { ArrowButton, CloseButton } from '../../../../../assets/Icons.tsx'
import { ConstructorAttributeValuesModal } from './ConstructorAttributeValuesModal.tsx'
import {
  DraggableRow,
  RowDragHandleCell,
} from '../TableDndComponants/TableDndComponents.tsx'
import { deleteAttributeFromTableConfigurator, setConstructorAttributeModalContent, setPivotTableUrlParams, setTableConfiguratorFields } from '../../../../../store/features/olapReposrtsPagesSlice/olapReposrtsPagesSlice.ts'

interface Props {
  pageId: string
  stats: string
  title: string
  attributes?: ConstructorAttributeType[]
  type: string
  selectedAttributes?: string[]
  handleCheckedChange?: (
    type: string,
    selectedSubTableFilters: string[]
  ) => void
  handleChangeFiltersOrder?: (
    type: string,
    subTableAttributes: string[]
  ) => void
}

/// ВСЕ ПЕРЕПИСАТЬ!
export const PivotTableConfigurator: FC<Props> = ({
  pageId,
  type,
  title,
  attributes,
  stats,
  // selectedAttributes,
  // handleCheckedChange,
  // handleChangeFiltersOrder
}) => {
  const [configuratorData, setConfiguratorData] = useState<ConstructorAttributeType[]>(DEFAULT_STATE.ARRAY)

  const dataIds = useMemo<UniqueIdentifier[]>(
    () => configuratorData?.map(({ attributeId }) => attributeId),
    [configuratorData],
  )

  const rowsCount = attributes?.length ?? ''

  const dispatch = useAppDispatch()

  useEffect(() => {
    if (attributes) {
      setConfiguratorData(attributes)
      dispatch(setPivotTableUrlParams({ pageId, type, fields: attributes.map(item => item.attributeName) }))
    }
  }, [attributes, dispatch, pageId, type])

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
          // const selectedRowModel = table.getSelectedRowModel();
          // console.log(selectedRowModel);

          // console.log(isSomeRowsSelected, "selectedRows")
          // console.log("header", type, isAllRowsSelected,)
          const hasSelectedRows = table.getSelectedRowModel().rows.length > 0
          const isIndeterminate = hasSelectedRows ? isSomeRowsSelected : false
          return (
            <Checkbox
              data-no-dnd="true"
              checked={
                // table.getIsAllRowsSelected()
                isAllRowsSelected
              }
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
          // console.log(type, " ", row.original.selectedAttributeValues);
          // const selectedCount = row.original.selectedAttributeValues?.length;

          // console.log("selected",row.original.selectedAttributeValues )
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
                // size="sm"
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
                // open={isPopoverOpen}
                withArrow={false}
                // onOpenChange={setIsPopoverOpen}
              >
                <PopoverTrigger asChild>
                  <Button
                    style={{ marginRight: '10px' }}
                    // size="sm"
                    variant="ghost"
                    className="table-button sub-item__table-button"
                    onClick={() =>
                      // handleOpenChange(true);
                      handleChangePopoverContent(row.original)}
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

    [],
  )

  // console.log(initialState);

  const table = useReactTable({
    data: configuratorData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getRowId: row => row.attributeId,
  })

  const subTableAllRows = table.getRowModel().rows

  // const subTableAttributes = useMemo(
  //   () => subTableAllRows.map((item) => item.original.attributeName),
  //   [subTableAllRows]
  // );

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

      // Сначала обновляем локальное состояние
      setConfiguratorData((prevData) => {
        const newData = arrayMove(prevData, oldIndex, newIndex)

        // Затем диспатчим обновление в Redux
        dispatch(setTableConfiguratorFields({
          pageId,
          type,
          updatedAttributes: newData,
        }))

        dispatch(setPivotTableUrlParams({ pageId, type, fields: newData.map(item => item.attributeName) }))
        return newData
      })
    }
  }

  const handleDeleteAttribute = (attribute: string) => {
    dispatch(deleteAttributeFromTableConfigurator({ pageId, attribute }))
  }

  const handleChangePopoverContent = (
    rowData: ConstructorPivotTableConfiguratorType,
  ) => {
    // console.log(rowData);
    const { attributeValues, selectedAttributeValues, attributePlaceholder, attributeName } = rowData
    dispatch(
      setConstructorAttributeModalContent({
        pageId,
        parametrs: attributeValues,
        selectedParametrs: selectedAttributeValues,
        attributePlaceholder,
        attributeName,
      }),
    )
    // dispatch(
    //   setSubTableModalContent({
    //     title: rowData.attribute,
    //     //parametrs: rowData.attributeParametrs,
    //   })
    // );

    // setConstructorAttributeModalContent: (
    //   state,
    //   action: PayloadAction<{
    //     pageId: string;
    //     parametrs: unknown[];
    //     selectedParametrs: unknown[];
    //     title: string;
    //   }>
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
}

// const [isPopoverOpen, setIsPopoverOpen] = useState(false);

// <Popover
// placement="right"
// modal
// open={isPopoverOpen}
// withArrow={false}
// onOpenChange={setIsPopoverOpen}
// >
// <PopoverTrigger
// //asChild
// >
//   <IconButton
//     size="lg"
//     variant="ghost"
//     className="sub-item__table-button"
//     onClick={() =>
//       //handleOpenChange(true);
//       handleChangePopoverContent(row.original)
//     }
//   >
//     <ArrowButton />
//   </IconButton>
// </PopoverTrigger>
// <PopoverContent>
//   <SubTableModal
//     onPopoverClose={() => handleOpenChange(false)}
//   />
// </PopoverContent>
// </Popover>
// </>

// const handleChangePopoverContent = (rowData: TableConstructorItemType) => {
//   setIsPopoverOpen((prev) => !prev);
//   dispatch(setSubTableModalOpen(true));
//   dispatch(
//     setSubTableModalContent({
//       title: rowData.attribute,
//       parametrs: rowData.attributeData,
//     })
//   );
// };
