import type { FC } from 'react'
import type {
  ColumnDef,
  RowSelectionState,
} from '@tanstack/react-table'

import { useMemo, useState } from 'react'
import { observer } from 'mobx-react-lite'
import { useNavigate } from '@tanstack/react-router'
import {
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable,
} from '@tanstack/react-table'
import {
  Button,
  Input,
  Radio,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  Typography,
} from '@tinkerbells/xenon-ui'

import type { DBTableVersionApiType } from '../../../../types/api'

import { formatDate } from '../utils/utils'
import { CreateTableModal } from './CreateTableModal'
import { DataTable } from '../../../UI/DataTable/DataTable'
import { InfoCircleOutlined } from '../../../../assets/Icons'
import { EmptyTableWithHeader } from '../../../UI/DataTable/EmptyTableWithHeader'

interface TableVersionsProps {
  tableData: DBTableVersionApiType[]
  isLoading: boolean
}

export const TableVersionsView: FC<TableVersionsProps> = observer(({ tableData, isLoading }) => {
  const navigate = useNavigate()

  // Component state
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({})
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Get selected version ID
  const selectedKey = Object.keys(rowSelection).find(
    key => rowSelection[key],
  )
  const selectedVersionId = selectedKey ? Number(selectedKey) : 0

  const columns = useMemo<ColumnDef<DBTableVersionApiType>[]>(
    () => [
      {
        id: 'radio',
        header: () => '',
        cell: ({ row }) => {
          return (
            <Radio
              checked={rowSelection[row.original.id] === true}
              onChange={() => {
                const id = row.original.id
                setRowSelection({ [id]: true })
              }}
            />
          )
        },
      },
      {
        accessorKey: 'version_name',
        header: 'Наименование',
        cell: ({ row }) => (
          <Typography>{row.original.version_name}</Typography>
        ),
      },
      {
        accessorKey: 'modifier',
        header: 'Кем изменено',
        cell: ({ row }) => <Typography>{row.original.modifier}</Typography>,
      },
      {
        accessorKey: 'timemark',
        header: 'Дата изменения',
        cell: ({ row }) => (
          <Typography>{formatDate(row.original.timemark)}</Typography>
        ),
      },
      {
        accessorKey: 'additionalInfo',
        header: '',
        cell: ({ row }) => (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="sm" className="table-button">
                <InfoCircleOutlined />
              </Button>
            </TooltipTrigger>
            <TooltipContent className="reports-table-tooltip">
              <Typography className="reports-table-tooltip__text">
                Автор:
                {' '}
                {row.original.creator}
              </Typography>
              <Typography className="reports-table-tooltip__text">
                Дата создания:
                {' '}
                {formatDate(row.original.timemark)}
              </Typography>
            </TooltipContent>
          </Tooltip>
        ),
      },
    ],
    [rowSelection],
  )

  const table = useReactTable({
    data: tableData ?? [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onRowSelectionChange: setRowSelection,
    state: { rowSelection },
  })

  const showModal = () => {
    setIsModalOpen(true)
  }

  const handleOk = () => {
    setIsModalOpen(false)
  }

  const handleCancel = () => {
    setIsModalOpen(false)
  }

  // Direct navigation to OLAP report page
  const handleNavigateToOlapReport = () => {
    if (selectedVersionId) {
      // Navigate directly to the page, letting the route handle data loading
      navigate({
        to: '/olapReport/$pageId',
        params: { pageId: selectedVersionId.toString() },
      })
    }
  }

  if (isLoading) {
    return <div className="versions-panel-view">Loading versions...</div>
  }

  return (
    <div className="versions-panel-view">
      <div className="versions-panel__table">
        <Input.Search
          className="search__field"
          placeholder="Введите название"
          onChange={(event) => {
            const searchValue = event.target.value
            table.getColumn('version_name')?.setFilterValue(searchValue)
          }}
        />
        {tableData.length === 0
          ? (
              <EmptyTableWithHeader table={table} />
            )
          : (
              <DataTable
                table={table}
                onRowClick={row => setRowSelection({ [row.original.id]: true })}
                selectedRow={selectedVersionId}
              />
            )}
      </div>

      <div className="versions-panel__buttons">
        <Button
          variant="outline"
          onClick={showModal}
        >
          Создать
        </Button>
        <Button
          onClick={handleNavigateToOlapReport}
        >
          Выбрать
        </Button>
        {isModalOpen && (
          <CreateTableModal
            isModalOpen={isModalOpen}
            handleOk={() => handleOk()}
            handleCancel={handleCancel}
          />
        )}
      </div>
    </div>
  )
})
