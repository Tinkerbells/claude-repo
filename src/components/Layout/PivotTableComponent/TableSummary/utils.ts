import type { DataType } from '../../../../types/tableProps'

export function getNestedObjectForColumns(tableContent: DataType, keys: (string | number)[][]) {
  const path = keys.map(key => key[0])
  let result = tableContent
  for (const key of path) {
    if (result && Object.prototype.hasOwnProperty.call(result, key)) {
      // @ts-ignore
      // console.log(result);
      result = result[key]
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

export function createColumns(obj: DataType, path: string[] = []): any[] {
  return Object.entries(obj).map(([key, value]) => {
    const modifiedKey = normalizeKey(key)
    const currentPath = [...path, modifiedKey]
    const uniqueKey = currentPath.join('_')

    if (typeof value === 'object' && !Array.isArray(value)) {
      return {
        header: key,
        columns: createColumns(value, currentPath),
      }
    }
    else {
      return {
        // id:`${uniqueKey}`,
        header: key,
        accessorKey: uniqueKey,
      }
    }
  })
}

export function createReferenceColumns(rowsCount: number, columnsCount: number) {
  const data = Array.from({ length: rowsCount }, () =>
    new Array(columnsCount).fill(null))
  return data.map((item, index) => {
    return {
      header: item,
      accessorKey: `level_${index}`,
    }
  })
}

export function flattenData(obj: DataType, maxLevels: number) {
  const result: DataType[] = []

  const processObject = (
    obj: DataType,
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
            (_, i) => row[`level_${i}`] === currentPath[i],
          )
        })

        if (row) {
          row[normalizedKey] = value
        }
        else {
          const newRow: DataType = {}
          for (let i = 0; i < maxLevels; i++) {
            newRow[`level_${i}`] = currentPath[i]
          }
          newRow[normalizedKey] = value
          result.push(newRow)
        }
      }
    })
  }

  processObject(obj)
  return result
}
