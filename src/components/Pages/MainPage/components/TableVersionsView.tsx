import type { FC } from 'react'
import type {
  ColumnDef,
  RowSelectionState,
} from '@tanstack/react-table'

import { nanoid } from '@reduxjs/toolkit'
import { memo, useMemo, useState } from 'react'
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
import { useLazyGetOlapQuery } from '../../../../api/apiSlice'
import { useAppDispatch, useAppSelector } from '../../../../store/store'
import { EmptyTableWithHeader } from '../../../UI/DataTable/EmptyTableWithHeader'
import { setOlapReportPageParametrs } from '../../../../store/features/olapReposrtsPagesSlice/olapReposrtsPagesSlice'
// import { useNavigate } from "@tanstack/react-router";

interface TableVersionsProps {
  tableData: DBTableVersionApiType[]
}
const maxTablePagesCount = 5

export const TableVersionsView: FC<TableVersionsProps> = memo(
  ({ tableData }) => {
    console.log(tableData)
    // const { data: tableVersionsData = [] } = useGetVersionsForTableQuery(
    //   { datasetIdToGetVersions },
    const [rowSelection, setRowSelection] = useState<RowSelectionState>({})
    const selectedKey = Object.keys(rowSelection).find(
      key => rowSelection[key],
    )
    const selectedVersionId = selectedKey ? Number(selectedKey) : 0
    const [isModalOpen, setIsModalOpen] = useState(false)
    const tableBuilderPages = useAppSelector(
      state => state.olapReportsPages.pages,
    )
    const iscreateTableButtonActive
      = tableBuilderPages.length < maxTablePagesCount
    const isChooseButtonActive
      = tableData.length !== 0
        && tableBuilderPages.length < maxTablePagesCount
        && selectedVersionId !== 0
    const [triggerGetOlap] = useLazyGetOlapQuery()
    const dispatch = useAppDispatch()
    // const navigate = useNavigate();

    const columns = useMemo<ColumnDef<DBTableVersionApiType>[]>(
      () => [
        {
          id: 'radio',
          header: () => '',
          cell: ({ row }) => {
            // console.log(row);
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
            // { row }
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
      // getRowId: (row) => row.id,
    })

    const showModal = () => {
      setIsModalOpen(true)
    }

    const handleOk = () => {
      // TODO переписать при создании нового олап отчета
      // dispatch(setTablePageParametrs({ pivotTableLabel, pivotTablePageId }));

      setIsModalOpen(false)
    }

    const handleCancel = () => {
      setIsModalOpen(false)
    }

    const handleGetOlap = async () => {
      if (selectedVersionId) {
        const result = await triggerGetOlap({
          olapVersionId: selectedVersionId,
        })

        if (!result?.data) {
          // console.error('No data received from the API');
          return
        }
        const pageId = nanoid()

        const {
          creator,
          dataset_id: datasetId,
          id,
          modifier,
          table,
          timemark,
          version_name: versionName,
          version_request: versionRequest,
          filters,
        } = result.data

        dispatch(
          setOlapReportPageParametrs({
            creator,
            datasetId,
            id,
            modifier,
            table,
            timemark,
            versionName,
            versionRequest,
            filters,
            physicalName: '',
            pageId,
          }),
        )

        // const currentPages = store.getState().olapReportsPages.pages; // Актуальное состояние
        // const pageWasAdded = currentPages.some((page) => page.pageId === pageId);

        console.log(currentPages)

        // if (pageWasAdded) {
        //   //navigate(`/olapReport/${newPageId}`);
        //   navigate({
        //     to: "/olapReport/$pageId",
        //     params: { pageId: pageId },
        //     // search: (prev) => ({ ...prev })
        //   });

        // } else {
        //   console.error('Page was not added to the store');
        //   // Можно показать пользователю ошибку
        // }
      }
    }

    // TODO Button disabled выбрать

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
            disabled={!iscreateTableButtonActive}
          >
            Создать
          </Button>
          <Button
            disabled={
              // !isRowSelected && tableBuilderPages.length <= maxTablePagesCount
              !isChooseButtonActive
            }
            onClick={handleGetOlap}
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
  },
)
