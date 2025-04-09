import type { PayloadAction } from '@reduxjs/toolkit'

import { createSlice } from '@reduxjs/toolkit'

import type { PivotTableType } from '../../../types/pivotTable'
import type {
  ConstructorAttributeType,
  OlapReportPageType,
} from '../../../types/olapReportPage'

import { DEFAULT_STATE } from '../../../consts/globalConsts'
import { ATTRIBUTES_TYPES } from '../../../consts/pivotTableConsts'
import {
  createAtrributeFilters,
  getSortedAllAttributes,
  safeJsonParse,
  updateTableConfigurator,
} from './utils'

interface OlapReportPagesType {
  pages: OlapReportPageType[]
}

export type OlapReportParametrsFromApi = Omit<
  OlapReportPageType,
  'constructorParametrs' | 'isCollapseOpen' | 'pivotTableUrlParams'
>

const initialState: OlapReportPagesType = {
  pages: [],
}

// Вспомогательная функция для обновления страницы по ID
function updatePageById(pages: OlapReportPageType[], pageId: string, updateFn: (page: OlapReportPageType) => OlapReportPageType): OlapReportPageType[] {
  return pages.map(page => (page.pageId === pageId ? updateFn(page) : page))
}

// Вспомогательная функция для обновления атрибутов и пересчета конфигуратора
function updateAttributesAndConfigurator(page: OlapReportPageType, updatedAttributes: ConstructorAttributeType[]): OlapReportPageType {
  const sortedAttributes = getSortedAllAttributes(updatedAttributes)
  const tableConfigurator = updateTableConfigurator(sortedAttributes)

  return {
    ...page,
    constructorParametrs: {
      ...page.constructorParametrs,
      allAttributes: sortedAttributes,
      tableConfigurator: {
        rows: tableConfigurator.rows,
        columns: tableConfigurator.columns,
        values: tableConfigurator.values,
      },
    },
  }
}

export const olapReportsPagesSlice = createSlice({
  name: 'olapReportsPages',
  initialState,
  reducers: {
    setOlapReportPageParametrs: (
      state,
      action: PayloadAction<OlapReportParametrsFromApi>,
    ) => {
      const { filters, physicalName, versionRequest, pageId } = action.payload

      const defaultFields = {
        rows: '',
        columns: '',
        values: '',
        physical_name: physicalName,
        aggfunc: '',
      }

      const {
        rows = defaultFields.rows,
        columns = defaultFields.columns,
        values = defaultFields.values,
        physical_name = defaultFields.physical_name,
        aggfunc = defaultFields.aggfunc,
      } = versionRequest || {}

      const fieldsForPivotTable = { rows, columns, values, aggfunc }
      const allAttributes = createAtrributeFilters(filters, fieldsForPivotTable)
      const sortedAllAttributes = getSortedAllAttributes(allAttributes)
      const tableConfigurator = updateTableConfigurator(sortedAllAttributes)

      state.pages.push({
        ...action.payload,
        pageId,
        isCollapseOpen: true,
        constructorParametrs: {
          allAttributes: sortedAllAttributes,
          isStartFetching: false,
          isButtonFetching: false,
          tableConfigurator: {
            rows: tableConfigurator.rows,
            columns: tableConfigurator.columns,
            values: tableConfigurator.values,
          },
        },
        pivotTableUrlParams: {
          rows: [],
          columns: [],
          values: [],
          physical_name: physical_name || physicalName,
          aggfunc: safeJsonParse(aggfunc) || DEFAULT_STATE.STRING,
        },
      })
    },

    deleteOlapReportPage: (state, action: PayloadAction<string>) => {
      state.pages = state.pages.filter(page => page.pageId !== action.payload)
    },

    setConstructorAllAttributesParametrs: (
      state,
      action: PayloadAction<{
        pageId: string
        allAttributes: ConstructorAttributeType[]
      }>,
    ) => {
      const { pageId, allAttributes } = action.payload
      state.pages = updatePageById(state.pages, pageId, (page) => {
        const sortedAllAttributes = getSortedAllAttributes(allAttributes)
        const tableConfigurator = updateTableConfigurator(sortedAllAttributes)

        return {
          ...page,
          constructorParametrs: {
            ...page.constructorParametrs,
            allAttributes: sortedAllAttributes,
            isButtonActive: false,
            isButtonFetching: false,
            tableConfigurator: {
              rows: tableConfigurator.rows,
              columns: tableConfigurator.columns,
              values: tableConfigurator.values,
            },
          },
        }
      })
    },

    updateAttributeType: (
      state,
      action: PayloadAction<{
        pageId: string
        attribute: string
        type: string
      }>,
    ) => {
      const { pageId, attribute, type } = action.payload
      state.pages = updatePageById(state.pages, pageId, (page) => {
        const updatedAttributes = page.constructorParametrs.allAttributes.map((item) => {
          if (item.attributeName === attribute) {
            const selectedAttributeValues
              = type === ATTRIBUTES_TYPES.VALUES && item.selectedAttributeValues?.length > 0
                ? DEFAULT_STATE.ARRAY
                : item.selectedAttributeValues

            return { ...item, type, selectedAttributeValues }
          }
          return item
        })

        return updateAttributesAndConfigurator(page, updatedAttributes)
      })
    },

    deleteAttributeFromTableConfigurator: (
      state,
      action: PayloadAction<{
        pageId: string
        attribute: string
      }>,
    ) => {
      const { pageId, attribute } = action.payload
      state.pages = updatePageById(state.pages, pageId, (page) => {
        const updatedAttributes = page.constructorParametrs.allAttributes.map(item =>
          item.attributeName === attribute
            ? { ...item, type: ATTRIBUTES_TYPES.NOT_ASSIGNED }
            : item,
        )

        return updateAttributesAndConfigurator(page, updatedAttributes)
      })
    },

    setTableConfiguratorFields: (
      state,
      action: PayloadAction<{
        pageId: string
        type: string
        updatedAttributes: ConstructorAttributeType[]
      }>,
    ) => {
      const { pageId, type, updatedAttributes } = action.payload
      state.pages = updatePageById(state.pages, pageId, page => ({
        ...page,
        constructorParametrs: {
          ...page.constructorParametrs,
          tableConfigurator: {
            ...(page.constructorParametrs.tableConfigurator ?? {}),
            [type]: updatedAttributes,
          },
        },
      }))
    },

    setIsButtonFetching: (
      state,
      action: PayloadAction<{ pageId: string, isButtonFetching: boolean }>,
    ) => {
      const { pageId, isButtonFetching } = action.payload
      state.pages = updatePageById(state.pages, pageId, page => ({
        ...page,
        constructorParametrs: {
          ...page.constructorParametrs,
          isButtonFetching,
        },
      }))
    },

    setIsStartFetching: (
      state,
      action: PayloadAction<{ pageId: string, isStartFetching: boolean }>,
    ) => {
      const { pageId, isStartFetching } = action.payload
      state.pages = updatePageById(state.pages, pageId, page => ({
        ...page,
        constructorParametrs: {
          ...page.constructorParametrs,
          isStartFetching,
        },
      }))
    },

    setConstructorAttributeModalContent: (
      state,
      action: PayloadAction<{
        pageId: string
        parametrs: string[]
        selectedParametrs: string[]
        attributePlaceholder: string
        attributeName: string
      }>,
    ) => {
      const { pageId, ...modalContent } = action.payload
      state.pages = updatePageById(state.pages, pageId, page => ({
        ...page,
        constructorParametrs: {
          ...page.constructorParametrs,
          attributeModal: modalContent,
        },
      }))
    },

    setAttributeSelectedValues: (
      state,
      action: PayloadAction<{
        pageId: string
        attributeName: string
        selectedAttributeValues: string[]
      }>,
    ) => {
      const { pageId, attributeName, selectedAttributeValues } = action.payload

      state.pages = updatePageById(state.pages, pageId, (page) => {
        const updatedAttributes = page.constructorParametrs.allAttributes.map(item =>
          item.attributeName === attributeName
            ? { ...item, selectedAttributeValues }
            : item,
        )

        return updateAttributesAndConfigurator(page, updatedAttributes)
      })
    },

    setAggregationFunctionsForPivotTable: (
      state,
      action: PayloadAction<{ parametrs: string[], pageId: string }>,
    ) => {
      const { pageId, parametrs } = action.payload
      state.pages = updatePageById(state.pages, pageId, page => ({
        ...page,
        pivotTableUrlParams: {
          ...page.pivotTableUrlParams,
          aggfunc: parametrs,
        },
      }))
    },

    setPivotTableUrlParams: (
      state,
      action: PayloadAction<{ pageId: string, type: string, fields: string[] }>,
    ) => {
      const { pageId, type, fields } = action.payload
      state.pages = updatePageById(state.pages, pageId, page => ({
        ...page,
        pivotTableUrlParams: {
          ...page.pivotTableUrlParams,
          [type]: fields,
        },
      }))
    },

    setPagePivotTable: (
      state,
      action: PayloadAction<{ pageId: string, pivotTable: PivotTableType }>,
    ) => {
      const { pageId, pivotTable } = action.payload
      state.pages = updatePageById(state.pages, pageId, page => ({
        ...page,
        table: pivotTable,
      }))
    },
  },
})

export const {
  setOlapReportPageParametrs,
  setConstructorAllAttributesParametrs,
  updateAttributeType,
  setAttributeSelectedValues,
  setConstructorAttributeModalContent,
  setAggregationFunctionsForPivotTable,
  setPivotTableUrlParams,
  deleteAttributeFromTableConfigurator,
  setIsButtonFetching,
  deleteOlapReportPage,
  setTableConfiguratorFields,
  setIsStartFetching,
  setPagePivotTable,
} = olapReportsPagesSlice.actions

export default olapReportsPagesSlice.reducer
