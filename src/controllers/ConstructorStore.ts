import { nanoid } from 'nanoid'
import { makeAutoObservable } from 'mobx'
import { MobxQuery } from 'mobx-tanstack-query'

import type { PivotTableType } from '@/types/pivotTable'

import { queryClient } from '@/main'
import { ConstructorService } from '@/services/Constructor.service'

import type { ConstructorAttributeType } from '../types/olapReportPage'
import type { OlapReportApiType, OlapReportFiltersType } from '../types/api'

import { DEFAULT_STATE } from '../consts/globalConsts'
import { ATTRIBUTES_TYPES } from '../consts/pivotTableConsts'
import {
  createAtrributeFilters,
  getSortedAllAttributes,
  updateTableConfigurator,
} from '../utils/olapStoreUtils'

interface AttributeModalType {
  attributeName: string
  attributePlaceholder: string
  parametrs: string[]
  selectedParametrs: string[]
}

interface PivotTableConfigType {
  rows: string[]
  columns: string[]
  values: string[]
  aggfunc: string[]
  physical_name: string
}

interface FiltersByType {
  rows: ConstructorAttributeType[]
  columns: ConstructorAttributeType[]
  values: ConstructorAttributeType[]
}

class ConstructorStore {
  private constructorService: ConstructorService = new ConstructorService()
  allAttributes: ConstructorAttributeType[] = []
  attributeModal: AttributeModalType | null = null
  pivotTableConfig: PivotTableConfigType = {
    rows: [],
    columns: [],
    values: [],
    aggfunc: [],
    physical_name: '',
  }

  pivotTableData: PivotTableType | null = null

  currentPageId: string = ''

  olapQuery: MobxQuery<OlapReportApiType, Error> = new MobxQuery({
    queryClient,
    queryKey: ['olap'],
    queryFn: () => this.constructorService.getOlap(this.currentPageId),
    staleTime: 60 * 1000, // 1 minute
    refetchOnWindowFocus: true,
    onDone: (data) => {
      this.initializeFromFilters(data.filters)
    },
    enabled: () => this.currentPageId !== '',
  })

  constructor(currentPage?: string) {
    this.currentPageId = currentPage || ''
    makeAutoObservable(this)
  }

  setCurrentPageId(pageId: string): void {
    this.currentPageId = pageId
  }

  createNewOlapReport(filters: OlapReportFiltersType[], physicalName: string): string {
    const pageId = nanoid()
    this.currentPageId = pageId
    this.pivotTableConfig.physical_name = physicalName
    this.initializeFromFilters(filters)

    return pageId
  }

  initializeFromFilters(filters: OlapReportFiltersType[], fieldsForPivotTable = {}): void {
    const allAttributes = createAtrributeFilters(filters, fieldsForPivotTable)
    this.allAttributes = getSortedAllAttributes(allAttributes)
    this.updateTableConfiguratorFromAttributes()
  }

  loadExistingOlapReport(olapData: any): string {
    const pageId = nanoid()
    this.currentPageId = pageId

    const {
      filters,
      version_request: versionRequest,
      table,
    } = olapData

    const { rows, columns, values, aggfunc, physical_name } = versionRequest || {}

    this.pivotTableConfig = {
      rows: typeof rows === 'string' ? JSON.parse(rows.replace(/'/g, '"')) : [],
      columns: typeof columns === 'string' ? JSON.parse(columns.replace(/'/g, '"')) : [],
      values: typeof values === 'string' ? JSON.parse(values.replace(/'/g, '"')) : [],
      aggfunc: typeof aggfunc === 'string' ? JSON.parse(aggfunc.replace(/'/g, '"')) : [],
      physical_name: physical_name || '',
    }

    this.initializeFromFilters(filters, versionRequest)

    if (table) {
      this.pivotTableData = table
    }

    return pageId
  }

  get getFiltersByType(): FiltersByType {
    return {
      rows: this.allAttributes.filter(item => item.type === ATTRIBUTES_TYPES.ROWS),
      columns: this.allAttributes.filter(item => item.type === ATTRIBUTES_TYPES.COLUMNS),
      values: this.allAttributes.filter(item => item.type === ATTRIBUTES_TYPES.VALUES),
    }
  }

  updateTableConfiguratorFromAttributes(): void {
    const tableConfigurator = updateTableConfigurator(this.allAttributes)

    this.updatePivotTableConfig(
      tableConfigurator.rows.map(item => item.attributeName),
      tableConfigurator.columns.map(item => item.attributeName),
      tableConfigurator.values.map(item => item.attributeName),
    )
  }

  updatePivotTableConfig(rows?: string[], columns?: string[], values?: string[]): void {
    if (rows)
      this.pivotTableConfig.rows = rows
    if (columns)
      this.pivotTableConfig.columns = columns
    if (values)
      this.pivotTableConfig.values = values
  }

  updateAttributeType(attribute: string, type: string): void {
    this.allAttributes = this.allAttributes.map((item) => {
      if (item.attributeName === attribute) {
        const selectedAttributeValues
          = type === ATTRIBUTES_TYPES.VALUES && item.selectedAttributeValues?.length > 0
            ? DEFAULT_STATE.ARRAY
            : item.selectedAttributeValues

        return { ...item, type, selectedAttributeValues }
      }
      return item
    })

    this.allAttributes = getSortedAllAttributes(this.allAttributes)
    this.updateTableConfiguratorFromAttributes()
  }

  deleteAttributeFromTableConfigurator(attribute: string): void {
    this.allAttributes = this.allAttributes.map(item =>
      item.attributeName === attribute
        ? { ...item, type: ATTRIBUTES_TYPES.NOT_ASSIGNED }
        : item,
    )

    this.allAttributes = getSortedAllAttributes(this.allAttributes)
    this.updateTableConfiguratorFromAttributes()
  }

  setTableConfiguratorFields(type: string, updatedAttributes: ConstructorAttributeType[]): void {
    this.allAttributes = this.allAttributes.map((item) => {
      const updatedItem = updatedAttributes.find(attr => attr.attributeId === item.attributeId)
      return updatedItem && item.type === type ? updatedItem : item
    })

    const attributeNames = updatedAttributes.map(item => item.attributeName)
    if (type === 'rows')
      this.pivotTableConfig.rows = attributeNames
    if (type === 'columns')
      this.pivotTableConfig.columns = attributeNames
    if (type === 'values')
      this.pivotTableConfig.values = attributeNames
  }

  setConstructorAttributeModalContent(
    parametrs: string[],
    selectedParametrs: string[],
    attributePlaceholder: string,
    attributeName: string,
  ): void {
    this.attributeModal = {
      parametrs,
      selectedParametrs,
      attributePlaceholder,
      attributeName,
    }
  }

  setAttributeSelectedValues(attributeName: string, selectedAttributeValues: string[]): void {
    this.allAttributes = this.allAttributes.map(item =>
      item.attributeName === attributeName
        ? { ...item, selectedAttributeValues }
        : item,
    )

    this.allAttributes = getSortedAllAttributes(this.allAttributes)
    this.updateTableConfiguratorFromAttributes()
  }

  setAggregationFunctionsForPivotTable(parametrs: string[]): void {
    this.pivotTableConfig.aggfunc = parametrs
  }

  setPivotTableUrlParams(type: string, fields: string[]): void {
    if (type === 'rows')
      this.pivotTableConfig.rows = fields
    if (type === 'columns')
      this.pivotTableConfig.columns = fields
    if (type === 'values')
      this.pivotTableConfig.values = fields
    if (type === 'aggfunc')
      this.pivotTableConfig.aggfunc = fields
  }

  getPivotTable(): PivotTableType | null {
    return this.olapQuery.result.data?.table || null
  }

  getPivotTableLoading(): boolean {
    return this.olapQuery.result.isLoading
  }

  getPivotTableFetching(): boolean {
    return this.olapQuery.result.isFetching
  }

  resetConfiguration(): void {
    this.allAttributes = []
    this.attributeModal = null
    this.pivotTableConfig = {
      rows: [],
      columns: [],
      values: [],
      aggfunc: [],
      physical_name: '',
    }
    this.pivotTableData = null
  }
}

export const Constructor = new ConstructorStore()
