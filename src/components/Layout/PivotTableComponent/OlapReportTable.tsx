import type { FC } from 'react'

import { useMemo } from 'react'

import type { TableSummaryProps } from '../../../types/tableProps'

import { TableSummary } from './TableSummary/TableSummary'
// import { TableSummaryVirtualize } from "./TableSummary/TableSummaryVirtualization";

interface Props {
  data: TableSummaryProps
}

export const TableComponent: FC<Props> = ({ data }) => {
  const { index: indexNames, columns, table } = data
  // const [tableColumns, setTableColumns] =
  //   useState<(string | number)[][]>(DEFAULT_STATE.ARRAY);
  // const [tableContent, setTableContent] = useState(DEFAULT_STATE.OBJECT);
  // const [loading, setLoading] = useState(false);
  const tableParsed = useMemo(() => JSON.parse(table), [table])
  // console.log(tableParsed);

  // useEffect(() => {
  //   const calculateTableData = async () => {
  //     setLoading(true);
  //     await new Promise((resolve) => setTimeout(resolve, 0));
  //     setTableColumns(columns);
  //     setTableContent(tableParsed);
  //     setLoading(false)
  //   };
  //   calculateTableData();

  // }, [columns, tableParsed])

  // console.log(columns);
  // if (loading) {
  //   return (
  //     <>
  //       <Spin tip="Загрузка таблицы" size="lg" className="table__spinner" />
  //     </>
  //   );
  // }

  return (
    <>
      <TableSummary
        columns={columns}
        tableContent={tableParsed}
        indexNames={indexNames}
      />
      {/* <TableSummaryVirtualize
        columns={columns}
        tableContent={tableParsed}
        indexNames={indexNames}
        /> */}
    </>
  )
}
