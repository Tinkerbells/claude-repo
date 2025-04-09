'use client'

import type { FC } from 'react'
import type {
  ColumnDef,
  ColumnFiltersState,
  RowSelectionState,
} from '@tanstack/react-table'

import { Button, Input, Typography } from '@tinkerbells/xenon-ui'
import { memo, useCallback, useEffect, useMemo, useState } from 'react'
import {
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable,
} from '@tanstack/react-table'

import type { DBTableDatasetAPiType } from '../../../../types/api'

import { formatDate } from '../utils/utils'
import '../main-page.scss'
import { ArrowButton } from '../../../../assets/Icons'
import { DataTable } from '../../../UI/DataTable/DataTable'
import { DEFAULT_STATE } from '../../../../consts/globalConsts'
import { useAppDispatch, useAppSelector } from '../../../../store/store'
import { EmptyTableWithHeader } from '../../../UI/DataTable/EmptyTableWithHeader'
import { updateSelectedTableDataset } from '../../../../store/features/tableForTable/tableForTableSlice'
// import { useQueryState } from 'nuqs'

interface TablePickerProps {
  tableData: DBTableDatasetAPiType[]
}

export const TablesListView: FC<TablePickerProps> = memo(({ tableData }) => {
  // console.log(tableData);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({},
  )

  const selectedDatasetIdFromStore = useAppSelector(state => state.tableForTables.dbTableDataset.id)
  const [selectedDatasetId, setSelectedDatasetId] = useState<number>(DEFAULT_STATE.NUMBER)

  const dispatch = useAppDispatch()

  const handleSetSelectedDbData = useCallback(
    (id: number, physicalName: string) => {
      dispatch(updateSelectedTableDataset({ id, physicalName }))
      // setSelectedDatasetId(String(id));
    },
    [dispatch],
  )

  const columns = useMemo<ColumnDef<DBTableDatasetAPiType>[]>(
    () => [
      {
        accessorKey: 'display_name',
        header: 'Наименование',
        cell: ({ row }) => <Typography>{row.original.display_name}</Typography>,
      },

      {
        accessorKey: 'physical_name',
        header: 'Идентификатор',
        cell: ({ row }) => (
          <Typography>
            {row.original.physical_name?.toLocaleUpperCase()}
          </Typography>
        ),
      },
      {
        accessorKey: 'latest_timemark',
        header: 'Дата последней версии',
        cell: ({ row }) => (
          <Typography>{formatDate(row.original.latest_timemark)}</Typography>
        ),
      },
      {
        accessorKey: 'version_count',
        header: 'Кол-во версий',
        cell: ({ row }) => (
          <Typography>{row.original.version_count}</Typography>
        ),
      },
      {
        header: () => '',
        id: 'arrow',
        size: 15,
        cell: ({ row }) => {
          // console.log(row);
          // const dataId = row.original.id;
          // const data = row.original;
          const id = row.original.id
          const physicalName = row.original.physical_name
          return (
            <Button
              size="lg"
              variant="ghost"
              className="table-button"
              onClick={() => handleSetSelectedDbData(id, physicalName)}
            >
              <ArrowButton />
            </Button>
          )
        },
      },
    ],
    [handleSetSelectedDbData],
  )

  const table = useReactTable({
    data: tableData ?? [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    onColumnFiltersChange: setColumnFilters,
    onRowSelectionChange: setRowSelection,
    getFilteredRowModel: getFilteredRowModel(),
    state: { columnFilters, rowSelection },
    enableMultiRowSelection: false, // only single row selection
  })

  useEffect(() => {
    setSelectedDatasetId((selectedDatasetIdFromStore))
  }, [selectedDatasetIdFromStore])

  return (
    <div className="table-list-view">
      <Input.Search
        className="search__field"
        placeholder="Введите название"
        onChange={(event) => {
          const searchValue = event.target.value
          table.getColumn('display_name')?.setFilterValue(searchValue)
        }}
      />
      {tableData.length === 0
        ? (
            <EmptyTableWithHeader table={table} />
          )
        : (
            <DataTable
              table={table}
              onRowClick={(row) => {
                const id = row.original.id
                const physicalName = row.original.physical_name
                handleSetSelectedDbData(id, physicalName)
                setRowSelection({ [row.original.id]: true })
              }}
              selectedRow={String(selectedDatasetId)}
            />
          )}
    </div>
  )
})
