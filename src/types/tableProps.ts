export interface DataType {
  [key: string | number]: DataType | string | number
}

export type TableFiltersType = AttributeFilter | null

export interface TableSummaryProps {
  index: string[][]
  columns: (string | number)[][]
  table: string
}

export interface FilterType {
  [key: string]: (string | number)[]
}

export interface PivotTableFieldsHandbookType {
  [key: string]: string
}

export interface AttributeFilter {
  attributeId: string
  attribute: string
  type: string
  checked: boolean
  attributeSelectedParametrs: (string | number)[]
}

export interface AllSpecificFiltersType {
  [key: string]: (string | number)[]
}

export interface TableConstructorItemType {
  attributeId: string
  attribute: string
  attributeParametrs: (string | number)[]
  attributeSelectedParametrs: (string | number)[]
  // selectedAttributeParametrs: (string | number)[];
  checked: boolean
}

export interface CheckedFiltersType {
  [key: string]: string[]
}

export interface SubTableModalContentType {
  id: string
  parametr: string | number
}

export interface TableBuilderPageParametrsType {
  // showTablePage: boolean;
  pivotTableLabel: string
  pivotTablePageId: string
}
