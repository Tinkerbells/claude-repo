// mport './shifts-table.styles.scss'

// import * as React from 'react'
// import { ReloadOutlined } from '@ant-design/icons'
// import { useVirtualizer } from '@tanstack/react-virtual'
// import {
//   Button,
//   Dropdown,
//   DropdownContent,
//   DropdownItem,
//   DropdownTriggerBasic,
//   Flex,
//   IconButton,
//   ScrollArea,
//   Table,
//   Tooltip,
//   TooltipContent,
//   TooltipTrigger,
// } from '@tinkerbells/xenon-ui'

// import { cn } from '@/shared'
// import { formatShiftsForExport } from '@/pages'
// import { TableBodySkeleton, TableControlPanel, TableHeaderSkeleton, TablePagination } from '@/features'

// import { shiftTableHeaders } from './constants'
// import { ShiftsTableBody } from './shift-table-body'
// import { ShiftsTableHeader } from './shift-table-header'
// import { useShiftsTableContext } from './shifts-table-context'

// export const b = cn('shifts-table')

// function ShiftsTableComponent() {
//   const { searchQuery, handleSearchQuery, tableData, table, refetch, isLoading } = useShiftsTableContext()

//   const parentRef = React.useRef<HTMLDivElement>(null)

//   const { rows } = table.getRowModel()

//   const virtualizer = useVirtualizer({
//     count: rows.length,
//     getScrollElement: () => parentRef.current,
//     estimateSize: () => 34,
//     overscan: 20,
//   })

//   const tableControlPanel = React.useMemo(() => (
//     <TableControlPanel
//       disabled={isLoading}
//       extra={(
//         <Flex align="center" gap="middle">
//           <Dropdown>
//             <DropdownTriggerBasic disabled={isLoading}>Принять</DropdownTriggerBasic>
//             <DropdownContent>
//               <DropdownItem>Дневную</DropdownItem>
//               <DropdownItem>Ночную</DropdownItem>
//             </DropdownContent>
//           </Dropdown>
//           <Tooltip>
//             <TooltipTrigger asChild>
//               <IconButton disabled={isLoading} variant="ghost" onClick={() => refetch()}>
//                 <ReloadOutlined />
//               </IconButton>
//             </TooltipTrigger>
//             <TooltipContent>Обновить данные</TooltipContent>
//           </Tooltip>
//           <Tooltip>
//             <TooltipTrigger asChild>
//               <Button disabled={isLoading}>Сдать</Button>
//             </TooltipTrigger>
//             <TooltipContent>Сдать смену</TooltipContent>
//           </Tooltip>
//         </Flex>
//       )}
//       headers={shiftTableHeaders}
//       formatToExportFunction={formatShiftsForExport}
//       data={tableData}
//       table={table}
//       searchQuery={searchQuery}
//       onSearchChange={handleSearchQuery}
//     />
//   ), [isLoading, refetch, tableData, table, searchQuery, handleSearchQuery])

//   if (isLoading) {
//     return (
//       <div className={b()}>
//         {tableControlPanel}
//         <Flex vertical className={b('container')} justify="center" align="center">
//           <ScrollArea className={b('scroll-area')}>
//             <Table size="sm" className={b('content')}>
//               <TableHeaderSkeleton table={table} />
//               <TableBodySkeleton table={table} />
//             </Table>
//           </ScrollArea>
//         </Flex>
//       </div>
//     )
//   }

//   return (
//     <div className={b()}>
//       {tableControlPanel}
//       <Flex justify="space-between" vertical className={b('container')}>
//         <ScrollArea className={b('scroll-area')} style={{ height: ${virtualizer.getTotalSize()}px }} ref={parentRef}>
//           <Table size="sm" className={b('content')}>
//             <ShiftsTableHeader />
//             <ShiftsTableBody virtualizer={virtualizer} />
//           </Table>
//         </ScrollArea>
//         <TablePagination size="small" className={b('pagination')} table={table} />
//       </Flex>
//     </div>
//   )
// }

// export const ShiftsTableView = React.memo(ShiftsTableComponent)
// import type { useVirtualizer } from '@tanstack/react-virtual'

// import { flexRender } from '@tanstack/react-table'
// import { DownOutlined, RightOutlined } from '@ant-design/icons'

// import './shift-table-body.styles.scss'

// import { Flex, IconButton, TableBody, TableCell, TableRow } from '@tinkerbells/xenon-ui'

// import { cn } from '@/shared'

// import { useShiftsTableContext } from '../shifts-table-context'

// const b = cn('shift-table-body')

// interface ShiftsTableBodyProps {
//   virtualizer: ReturnType<typeof useVirtualizer<HTMLDivElement, Element>>
// }

// export function ShiftsTableBody({ virtualizer }: ShiftsTableBodyProps) {
//   const { table } = useShiftsTableContext()

//   const { rows } = table.getRowModel()

//   if (!table.getRowModel().rows?.length) {
//     return (
//       <TableBody>
//         <TableRow>
//           <TableCell colSpan={table.getAllLeafColumns().length}>Нет результатов</TableCell>
//         </TableRow>
//       </TableBody>
//     )
//   }

//   return (
//     <TableBody>
//       {virtualizer.getVirtualItems().map((virtualRow, index) => {
//         const row = rows[virtualRow.index]
//         return (
//           <TableRow
//             key={row.id}
//             className={b('row', { subrow: row.subRows.length > 0 })}
//             data-state={row.getIsSelected() && 'selected'}
//             style={{
//               height: ${virtualRow.size}px,
//               transform: `translateY(${
//                 virtualRow.start - index * virtualRow.size
//               }px)`,
//             }}
//           >
//             {row.getVisibleCells().map(cell => (
//               <TableCell key={cell.id} textStyle={cell.getIsGrouped() ? 'strong' : undefined}>
//                 {cell.getIsGrouped()
//                   ? (
//                       <>
//                         <Flex
//                           justify="start"
//                           align="center"
//                           gap="middle"
//                           onClick={row.getToggleExpandedHandler()}
//                           className={b('grouped-cell')}
//                         >
//                           <IconButton size="sm" className={b('expand-button')} variant="ghost">
//                             {row.getIsExpanded() ? <DownOutlined /> : <RightOutlined />}
//                           </IconButton>
//                           {flexRender(
//                             cell.column.columnDef.cell,
//                             cell.getContext(),
//                           )}
//                         </Flex>
//                       </>
//                     )
//                   : cell.getIsAggregated()
//                     ? null
//                     : cell.getIsPlaceholder()
//                       ? null
//                       : (
//                           flexRender(
//                             cell.column.columnDef.cell,
//                             cell.getContext(),
//                           )
//                         )}
//               </TableCell>
//             ))}
//           </TableRow>
//         )
//       })}
//     </TableBody>
//   )
// }
