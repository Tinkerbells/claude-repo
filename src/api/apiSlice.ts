import type {
  BaseQueryApi,
  FetchArgs,
} from '@reduxjs/toolkit/query/react'

import {
  createApi,
  fetchBaseQuery,
} from '@reduxjs/toolkit/query/react'

import type { PivotTableType } from '../types/pivotTable'
import type {
  DBTableDatasetAPiType,
  DBTableVersionApiType,
  OlapReportApiType,
  OlapReportFiltersType,
} from '../types/api'

import { API_BASE_URL, API_ENDPOINTS } from './apiEndpoints'

// Функция для создания fetchBaseQuery с таймаутом
async function baseQueryWithTimeout(args: string | FetchArgs, api: BaseQueryApi, extraOptions: unknown) {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 60000) // Таймаут 60 секунд

  try {
    const result = await fetchBaseQuery({
      baseUrl: API_BASE_URL,
      signal: controller.signal,
      // @ts-ignore
    })(args, api, extraOptions)

    clearTimeout(timeout)
    return result
  }
  catch (error) {
    clearTimeout(timeout)
    // console.log(error);
    throw error
  }
}

export const olapApi = createApi({
  reducerPath: 'olapApi',
  baseQuery: baseQueryWithTimeout,
  endpoints: builder => ({
    getTableForTables: builder.query<DBTableDatasetAPiType[], void>({
      query: () => API_ENDPOINTS.TABLE_FOR_TABLES,
      // @ts-ignore
      providesTags: ['SaveOlap'],
    }),

    getVersionsForTable: builder.query<
      DBTableVersionApiType[],
      { datasetIdToGetVersions: number }
    >({
      query: ({ datasetIdToGetVersions }) => ({
        url: API_ENDPOINTS.VERSIONS_FOR_TABLE,
        params: {
          dataset_id: datasetIdToGetVersions,
        },
      }),
    }),

    getOlap: builder.query<OlapReportApiType, { olapVersionId: number }>({
      query: ({ olapVersionId }) => ({
        url: API_ENDPOINTS.GET_OLAP,
        params: {
          version_id: olapVersionId,
        },
      }),
    }),

    getSpecificFilters: builder.query<
      OlapReportFiltersType[],
      { physicalName: string }
    >({
      query: ({ physicalName }) => ({
        url: API_ENDPOINTS.SPECIFIC_FILTERS,
        params: {
          physical_name: physicalName,
        },
      }),
    }),

    generateOlap: builder.query<
      PivotTableType,
      {
        rows: string[]
        columns: string[]
        values: string[]
        aggfunc: string[]
        physical_name: string
      }
    >({
      query: ({ rows, columns, values, aggfunc, physical_name }) => ({
        url: API_ENDPOINTS.GENERATE_OLAP,
        method: 'POST',
        body: {
          rows,
          columns,
          values,
          aggfunc,
          round: 2,
          // margins: includeMerged,
          fill_value: 0,
          physical_name,
        },
      }),
    }),

    saveOlap: builder.mutation<
      PivotTableType,
      {
        rows: string[]
        columns: string[]
        values: string[]
        aggfunc: string[]
        physical_name: string
        version_name: string
        dataset_id: number
      }
    >({
      query: ({ rows, columns, values, aggfunc, physical_name, version_name, dataset_id }) => ({
        url: API_ENDPOINTS.SAVE_OLAP,
        method: 'POST',
        body: {
          rows,
          columns,
          values,
          aggfunc,
          round: 2,
          // margins: includeMerged,
          fill_value: 0,
          physical_name,
        },
        params: {
          version_name,
          dataset_id,
          // physical_name: physicalName,
        },
        invalidatesTags: ['SaveOlap'],
      }),
    }),

    //   generatePivotTable: builder.mutation<
    //     TableSummaryProps,
    //     {
    //       rows: string[];
    //       columns: string[];
    //       indicator: string[];
    //       includeMerged: boolean;
    //     }
    //   >({
    //     query: ({ rows, columns, indicator, includeMerged }) => ({
    //       url: "/generate",
    //       method: 'POST',
    //       body: {
    //         rows: rows.join(","),
    //         columns: columns.join(","),
    //         values: indicator.join(","),
    //         round: 2,
    //         margins: includeMerged,
    //         fill_value: 0,
    //       },
    //     }),
    //   }),
    // }),
  }),
})

export const {
  useGetTableForTablesQuery,
  useGetVersionsForTableQuery,
  useLazyGetOlapQuery,
  useLazyGetSpecificFiltersQuery,
  useGenerateOlapQuery,
  useSaveOlapMutation,
  usePrefetch,
} = olapApi
