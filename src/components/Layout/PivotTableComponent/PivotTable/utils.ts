import type { DataType } from '../../../../types/tableProps'
import type {
  PivotTableDataType,
  PivotTableIndexType,
} from '../../../../types/pivotTable'

import { aggregationFunctionsHandbook, isAggregationFunctionKey } from '../../../../consts/pivotTableConsts'

// TODO пока оставила ключи как level, но возможно придется переписать
export function createReferenceColumns(index: PivotTableIndexType[]) {
  const data = index.map((column, index) => ({
    header: column.comment,
    // accessorKey: column.index_level_name,
    accessorKey: `level_${index}`,
  }))
  return data
}

export function getNestedObjectForColumns(index: PivotTableIndexType[], tableContent: PivotTableDataType): PivotTableDataType {
  const path = index.map(item => item.level[0])
  let result: PivotTableDataType = tableContent
  for (const key of path) {
    if (result && typeof result === 'object' && key in result) {
      const value = result[key]
      if (typeof value === 'object' && value !== null) {
        result = value as PivotTableDataType
      }
      else {
        return { value } as unknown as PivotTableDataType
      }
    }
    else {
      return result
    }
  }
  return result
}

function normalizeKey(key: string): string {
  return key.replace(/[()]/g, '').replace(/\./g, '_').replace(/\s+/g, '_')
}

export function createColumns(obj: PivotTableDataType, path: string[] = []): any[] {
  return Object.entries(obj).map(([key, value]) => {
    const modifiedKey = normalizeKey(key)
    const currentPath = [...path, modifiedKey]
    const uniqueKey = currentPath.join('_')

    let header = key === '_space_' ? '' : key
    if (isAggregationFunctionKey(key)) {
      header = aggregationFunctionsHandbook[key]
    }

    if (typeof value === 'object' && !Array.isArray(value)) {
      return {
        header,
        columns: createColumns(value, currentPath),
      }
    }
    else {
      return {
        header,
        accessorKey: uniqueKey,
      }
    }
  })
}

export function flattenData(obj: PivotTableDataType, maxLevels: number) {
  const result: PivotTableIndexType[] = []

  const processObject = (
    obj: PivotTableIndexType,
    path: string[] = [],
    level: number = 0,
  ) => {
    Object.entries(obj).forEach(([key, value]) => {
      const currentPath = [...path, key]

      if (typeof value === 'object' && !Array.isArray(value)) {
        processObject(value, currentPath, level + 1)
      }
      else {
        const uniqueKey = currentPath.slice(maxLevels).join('_')
        const normalizedKey = normalizeKey(uniqueKey)

        const row = result.find((row) => {
          return Array.from({ length: maxLevels }).every(
            // eslint-disable-next-line ts/ban-ts-comment
            // @ts-ignore
            (_, i) => row[`level_${i}`] === currentPath[i],
          )
        })

        if (row) {
          // eslint-disable-next-line ts/ban-ts-comment
          // @ts-ignore
          row[normalizedKey] = value
        }
        else {
          const newRow: DataType = {}
          for (let i = 0; i < maxLevels; i++) {
            newRow[`level_${i}`] = currentPath[i]
          }
          // eslint-disable-next-line ts/ban-ts-comment
          // @ts-ignore
          newRow[normalizedKey] = value
          // eslint-disable-next-line ts/ban-ts-comment
          // @ts-ignore
          result.push(newRow)
        }
      }
    })
  }
  // eslint-disable-next-line ts/ban-ts-comment
  // @ts-expect-error
  processObject(obj)
  return result
}

function formatNumber(value: number): string {
  const result = String(value).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1 ')
  // console.log(result)
  return result
}

export function formatCellValue(cellValue: unknown, cellId?: string) {
  if (cellValue === undefined) {
    return '-'
  }

  if (cellValue === '_space_') {
    return ''
  }

  if (typeof cellValue === 'number') {
    return cellId && !cellId.includes('level')
      ? formatNumber(cellValue)
      : cellValue
  }

  if (typeof cellValue === 'string') {
    return cellValue
  }

  return String(cellValue)
}
