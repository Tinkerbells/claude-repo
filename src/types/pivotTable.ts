export interface PivotTableType {
  index: PivotTableIndexType[]
  columns: PivotTableIndexType[]
  table: PivotTableDataType
}

export interface PivotTableIndexType {
  index_level_name: string
  comment: string
  level: string[]
}

export interface PivotTableDataType {
  [key: string | number]: PivotTableDataType | string | number
}
