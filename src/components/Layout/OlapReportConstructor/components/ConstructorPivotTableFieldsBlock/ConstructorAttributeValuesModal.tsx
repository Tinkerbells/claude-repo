import type { FC } from 'react'
import type {
  ColumnDef,
  ColumnFiltersState,
} from '@tanstack/react-table'

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

// import { SubTableModalContentType } from "../../../../../types/tableProps";
import { CloseButton } from '../../../../../assets/Icons'
import { useAppDispatch } from '../../../../../store/store'
import '../../table-constructor.scss'
import { usePageParams } from '../../../../../hooks/usePageParams'
import { DEFAULT_STATE } from '../../../../../consts/globalConsts'
import { aggregationFunctionsHandbook, ATTRIBUTES_TYPES, isAggregationFunctionKey } from '../../../../../consts/pivotTableConsts'
import {
  setAggregationFunctionsForPivotTable,
  setAttributeSelectedValues,
} from '../../../../../store/features/olapReposrtsPagesSlice/olapReposrtsPagesSlice'

interface ConstructorAttributeValuesModalProps {
  pageId: string
  type: string
}

export const ConstructorAttributeValuesModal: FC<
  ConstructorAttributeValuesModalProps
> = ({ pageId, type }) => {
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const attributeModal
    = usePageParams(pageId).constructorParametrs.attributeModal
  const parametrsCount = `(${attributeModal?.parametrs.length})`
  const dispatch = useAppDispatch()
  const text = type === ATTRIBUTES_TYPES.VALUES ? 'Выберите, какие факты применить для агрегирования фактов ' : 'Выберите, какие значения данного атрибута отображать в таблице'

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

  const table = useReactTable({
    // data: attributesTableData,
    data: attributeModal?.parametrs ?? [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    // getRowId: (row) => row.attributeId,
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: { columnFilters },
  })

  const subTableAllRows = table.getRowModel().rows

  const selectedAttributeValues = table
    .getSelectedRowModel()
    .rows
    .map(item => item.original)

  // console.log(selectedAttributeValues);

  useEffect(() => {
    subTableAllRows.forEach((row) => {
      const shouldBeSelected = attributeModal?.selectedParametrs.includes(
        row.original,
      )
      if (shouldBeSelected) {
        row.toggleSelected(shouldBeSelected)
      }
      else {
        row.toggleSelected(false)
      }
    })
  }, [attributeModal?.selectedParametrs, subTableAllRows])

  const handleSaveParametrs = () => {
    if (type === ATTRIBUTES_TYPES.VALUES) {
      // console.log(type);
      dispatch(
        setAggregationFunctionsForPivotTable({
          pageId,
          parametrs: selectedAttributeValues,
        }),
      )
    }
    // нужно поменять allAttributes для всех
    dispatch(
      setAttributeSelectedValues({
        pageId,
        attributeName: attributeModal?.attributeName ?? DEFAULT_STATE.STRING,
        selectedAttributeValues,
      }),
    )

    // setAttributeSelectedValues: (
    //   state,
    //   action: PayloadAction<{
    //     pageId: string;
    //     attributeName: string;
    //     selectedAttributeValues: string[];
    //   }>
    // TODO добавить для всех выбранных атрибутов
    // пока для суммы
    // dispatch(
    //   setAttributeSelectedParametrs({
    //     attribute: title,
    //     selectedParametrs: selectedAttributeParametrs,
    //   })
    // );
  }

  return (
    <div className="filters-modal">
      <div className="filters-modal__header">
        <div className="filters-modal__header--title">
          <Typography textStyle="strong" level="heading5">
            {attributeModal?.attributePlaceholder}
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
            // onClick={handleCancel}
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
}

// import {
//   ColumnDef,
//   ColumnFiltersState,
//   flexRender,
//   getCoreRowModel,
//   getFilteredRowModel,
//   useReactTable,
// } from "@tanstack/react-table";
// import { SubTableModalContentType } from "../../../../../types/tableProps";
// import { CloseButton } from "../../../../../assets/Icons";
// import { setAttributeSelectedParametrs } from "../../../../../store/features/tableConstructor/tableConstructorSlice";

// export const ConstructorAttributeModal: FC = () => {
//   const subTableModalData = useAppSelector(
//     (state) => state.tableConstructor.subTableModal
//   );
//   const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
//   const title: string = subTableModalData.title;
//   const parametrs = subTableModalData.parametrs;
//   const attributeSelectedParametrs = useAppSelector((state) =>
//     state.tableConstructor.allAttributes.find(
//       (item) => item.attribute === title
//     )?.attributeSelectedParametrs
//   );
//   //console.log(attributeSelectedParametrs );
//   const parametrsCount = `(${parametrs.length})`;
//   const dispatch = useAppDispatch();

//   const columns = useMemo<ColumnDef<SubTableModalContentType>[]>(
//     () => [
//       {
//         id: "select",
//         size: 24,
//         header: ({ table }) => (
//           <Checkbox
//             checked={table.getIsAllPageRowsSelected()}
//             onChange={(value) => {
//               table.toggleAllPageRowsSelected(!!value.target.checked);
//             }}
//             aria-label="Select all"
//           />
//         ),
//         cell: ({ row }) => (
//           <Checkbox
//             checked={row.getIsSelected()}
//             onChange={(value) => row.toggleSelected(!!value.target.checked)}
//             aria-label="Select row"
//           />
//         ),
//       },
//       {
//         accessorKey: "parametr",
//         cell: ({ row }) => {
//           const value = row.original.parametr;
//           return value;
//         },
//         header: () => "Все значения",
//         enableColumnFilter: true,
//       },
//     ],
//     []
//   );

//   const table = useReactTable({
//     //data: attributesTableData,
//     data: parametrs,
//     columns,
//     getCoreRowModel: getCoreRowModel(),
//     //getRowId: (row) => row.attributeId,
//     onColumnFiltersChange: setColumnFilters,
//     getFilteredRowModel: getFilteredRowModel(),
//     state: { columnFilters },
//   });

//   const subTableAllRows = table.getRowModel().rows;
//   const selectedAttributeParametrs = table
//     .getSelectedRowModel()
//     .rows.map((item) => item.original.parametr);

//     //console.log(selectedAttributeParametrs);

//   useEffect(() => {
//     subTableAllRows.forEach((row) => {
//       const shouldBeSelected = attributeSelectedParametrs?.includes(row.original.parametr);
//       if (shouldBeSelected) {
//         row.toggleSelected(shouldBeSelected);
//       } else {
//         row.toggleSelected(false);
//       }
//     });
//   }, [attributeSelectedParametrs, subTableAllRows]);

//   const handleSaveParametrs = () => {
//     dispatch(
//       setAttributeSelectedParametrs({
//         attribute: title,
//         selectedParametrs: selectedAttributeParametrs,
//       })
//     );
//   };

//   return (
//     <div className="filters-modal">
//       <div className="filters-modal__header">
//         <div className="filters-modal__header--title">
//           <Typography textStyle="strong" level="heading5">
//             {pivotTableFieldsHandBook[title]}
//           </Typography>

//           <Typography
//             textStyle="strong"
//             level="heading5"
//             className="filters-modal__parametrs-count"
//           >
//             {parametrsCount}
//           </Typography>
//         </div>
//         <PopoverClose className="filters-modal__button">
//           <Button
//             variant="ghost"
//             size="sm"
//             //onClick={handleCancel}
//           >
//             <CloseButton />
//           </Button>
//         </PopoverClose>
//       </div>
//       <div className="filters-modal__body">
//         <Input.Search
//           className="search__field"
//           placeholder="Введите название"
//           onChange={(event) => {
//             const searchValue = event.target.value;
//             table.getColumn("parametr")?.setFilterValue(searchValue);
//           }}
//         />
//         <Typography>
//           Выберите, какие значения данного атрибута отображать в таблице
//         </Typography>
//         <ScrollArea className="scroll-area">
//           <div className="filters-modal__table">
//             <Table size="md">
//               <TableHeader>
//                 {table.getHeaderGroups().map((headerGroup) => (
//                   <TableRow key={headerGroup.id}>
//                     {headerGroup.headers.map((header) => (
//                       <TableHead
//                         key={header.id}
//                         colSpan={header.colSpan}
//                         align="left"
//                       >
//                         {flexRender(
//                           header.column.columnDef.header,
//                           header.getContext()
//                         )}
//                       </TableHead>
//                     ))}
//                   </TableRow>
//                 ))}
//               </TableHeader>
//               <TableBody>
//                 {table.getRowModel().rows.map((row) => (
//                   <TableRow key={row.id}>
//                     {row.getVisibleCells().map((cell) => (
//                       <TableCell key={cell.id}>
//                         {flexRender(
//                           cell.column.columnDef.cell,
//                           cell.getContext()
//                         )}
//                       </TableCell>
//                     ))}
//                   </TableRow>
//                 ))}
//               </TableBody>
//             </Table>
//           </div>
//           <ScrollBar orientation="horizontal" />
//         </ScrollArea>
//         <PopoverClose className="filters-modal__button">
//           <Button
//             className="filters-modal__save-button"
//             onClick={handleSaveParametrs}
//           >
//             Сохранить
//           </Button>
//         </PopoverClose>
//       </div>
//     </div>
//   );
// };
