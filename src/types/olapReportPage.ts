import type { OlapReportFiltersType } from './api'
import type { PivotTableType } from './pivotTable'

export interface OlapReportPageType {
  pageId: string
  physicalName: string
  creator?: null | string
  datasetId: number
  id?: number
  modifier?: string
  table?: PivotTableType
  timemark: string
  versionName: string
  pivotTableUrlParams: PivotTableUrlParamsType
  versionRequest?: VersionRequestType // TODO нужна типизация
  filters: OlapReportFiltersType[]
  isCollapseOpen?: boolean
  constructorParametrs: {
    allAttributes: ConstructorAttributeType[]
    isButtonFetching: boolean
    isStartFetching: boolean
    tableConfigurator: {
      rows: ConstructorAttributeType[]
      columns: ConstructorAttributeType[]
      values: ConstructorAttributeType[]
    }
    attributeModal?: {
      attributeName: string
      attributePlaceholder: string
      parametrs: string[]
      selectedParametrs: string[]
      // parametrs: SubTableModalContentType[];
      // selectedParametrs: (string | number)[];
    }
  }
}

export interface ConstructorAttributeType {
  attributeName: string
  attributePlaceholder: string
  attributeType: string
  attributeActions: string[]
  attributeValues: string[]
  attributeId: string
  type: string
  checked: boolean
  selectedAttributeValues: string[]
  selectedAttributeActions?: (string | number)[]
}

export interface ConstructorPivotTableConfiguratorType {
  attributeId: string
  attributeName: string
  attributePlaceholder: string
  // attributeParametrs: (string | number)[];
  // attributeSelectedParametrs:(string | number)[];
  attributeValues: string[]
  selectedAttributeValues: string[]
  attributeActions?: (string | number)[]
  selectedAttributeActions?: (string | number)[]
  checked: boolean
}

// export type AttributeActionsModalType  = {
//   parametr:string,
// }

export interface VersionRequestType {
  rows: string
  columns: string
  values: string
  aggfunc: string
  physical_name: string
  margins?: {
    [key: string]: string
  }
  fill_value?: number

  // physical_name?: string;
  // [key: string]: unknown;
}

// export type PivotTableUrlParamsType = Omit<VersionRequestType,"margins" | "fill_value">

export interface PivotTableUrlParamsType {
  rows: string[]
  columns: string[]
  values: string[]
  aggfunc: string[]
  physical_name: string

  fill_value?: number
  margins?: {
    [key: string]: string
  }
}

// type VersionRequestType<T = unknown> = {
// rows: string[];
// columns: string[];
// values:  string[];
// [key: string]: T;

//   aggfunc?: string | string[];
//   columns?: string | string[];
//   export_option?: string;
//   fill_value?: number;
//   global_filters?: any[]; // Можно уточнить тип, если известна структура
//   margins?: {
//     margins_group?: string;
//     margins_name_rows?: string;
//     margins_name_cols?: string;
//     margins_positition_rows?: string;
//     margins_positition_cols?: string;
//   };
//   physical_name?: string;
//   round?: number;
//   rows?: string | string[];
//   sorting?: {
//     rows?: any[];
//     columns?: any[];
//   };
//   subtotals?: {
//     subtotals_group?: string;
//     subtotals_name_rows?: string;
//     subtotals_name_cols?: string;
//     subtotals_positition_rows?: string;
//     subtotals_positition_cols?: string;
//   };
//   values?: string | string[];
//   [key: string]: T; // Дженерик для остальных полей
// };
// }
