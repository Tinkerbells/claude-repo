import { useState } from 'react'
import { observer } from 'mobx-react-lite'
import { Button, Input, Typography } from '@tinkerbells/xenon-ui'
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
import { useDatasetStore } from '../../../../stores/RootStore'
import { EmptyTableWithHeader } from '../../../UI/DataTable/EmptyTableWithHeader'

interface TablePickerProps {
  tableData: DBTableDatasetAPiType[]
  isLoading: boolean
}

export const TablesListView = observer(({ tableData, isLoading }: TablePickerProps) => {
  const [columnFilters, setColumnFilters] = useState([])
  const datasetStore = useDatasetStore()
  const selectedDatasetId = datasetStore.dbTableDataset.id
  // Handle table selection
  const handleSetSelectedDbData = (id: number, physicalName: string) => {
    datasetStore.updateSelectedTableDataset(id, physicalName)
  }

  // Define table columns
  const columns = [
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
  ]

  const table = useReactTable({
    data: tableData ?? [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: { columnFilters },
  })

  if (isLoading) {
    return <div>Loading tables...</div>
  }

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
              }}
              selectedRow={String(selectedDatasetId)}
            />
          )}
    </div>
  )
})
