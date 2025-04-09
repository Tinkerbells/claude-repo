import { nanoid } from 'nanoid'
import { makeAutoObservable } from 'mobx'

import type { PivotTableType } from '@/types/pivotTable'

import type { RootStore } from './RootStore'
import type { OlapReportFiltersType } from '../types/api'
import type { ConstructorAttributeType } from '../types/olapReportPage'

import { DEFAULT_STATE } from '../consts/globalConsts'
import { ATTRIBUTES_TYPES } from '../consts/pivotTableConsts'
import {
  createAtrributeFilters,
  getSortedAllAttributes,
  updateTableConfigurator,
} from '../utils/olapStoreUtils'

export class OlapConfigStore {
  rootStore: RootStore

  // Core data for the OLAP configuration
  allAttributes: ConstructorAttributeType[] = []

  // Modal content for attribute selection
  attributeModal: {
    attributeName: string
    attributePlaceholder: string
    parametrs: string[]
    selectedParametrs: string[]
  } | null = null

  // Current pivot table configuration
  pivotTableConfig = {
    rows: [] as string[],
    columns: [] as string[],
    values: [] as string[],
    aggfunc: [] as string[],
    physical_name: '',
  }

  // Current pivot table data
  pivotTableData: PivotTableType | null = null

  // Current page ID (for managing multiple OLAP reports)
  currentPageId: string = ''

  constructor(rootStore: RootStore) {
    this.rootStore = rootStore
    makeAutoObservable(this)
  }

  // Set current page ID
  setCurrentPageId(pageId: string) {
    this.currentPageId = pageId
  }

  // Create a new OLAP report
  createNewOlapReport(filters: OlapReportFiltersType[], physicalName: string, versionName: string) {
    const pageId = nanoid()
    this.currentPageId = pageId
    this.pivotTableConfig.physical_name = physicalName
    this.initializeFromFilters(filters)

    // Add the page to the page manager
    this.rootStore.pageManager.addPage({
      pageId,
      versionName,
      timemark: new Date().toISOString(),
      physicalName,
    })

    return pageId
  }

  // Initialize attributes from filters (when loading a report)
  initializeFromFilters(filters: OlapReportFiltersType[], fieldsForPivotTable = {}) {
    const allAttributes = createAtrributeFilters(filters, fieldsForPivotTable)
    this.allAttributes = getSortedAllAttributes(allAttributes)
    this.updateTableConfiguratorFromAttributes()
  }

  // Load existing OLAP report
  loadExistingOlapReport(olapData: any) {
    const pageId = nanoid()
    this.currentPageId = pageId

    const {
      filters,
      version_request: versionRequest,
      table,
      version_name: versionName,
      timemark,
    } = olapData

    // Extract configuration from version_request
    const { rows, columns, values, aggfunc, physical_name } = versionRequest || {}

    this.pivotTableConfig = {
      rows: typeof rows === 'string' ? JSON.parse(rows.replace(/'/g, '"')) : [],
      columns: typeof columns === 'string' ? JSON.parse(columns.replace(/'/g, '"')) : [],
      values: typeof values === 'string' ? JSON.parse(values.replace(/'/g, '"')) : [],
      aggfunc: typeof aggfunc === 'string' ? JSON.parse(aggfunc.replace(/'/g, '"')) : [],
      physical_name: physical_name || '',
    }

    // Initialize attributes from filters
    this.initializeFromFilters(filters, versionRequest)

    // Set table data
    if (table) {
      this.pivotTableData = table
    }

    // Add the page to the page manager
    this.rootStore.pageManager.addPage({
      pageId,
      versionName,
      timemark,
      physicalName: physical_name || '',
    })

    return pageId
  }

  // Computed properties to get attributes by type
  get getFiltersByType() {
    return {
      rows: this.allAttributes.filter(item => item.type === ATTRIBUTES_TYPES.ROWS),
      columns: this.allAttributes.filter(item => item.type === ATTRIBUTES_TYPES.COLUMNS),
      values: this.allAttributes.filter(item => item.type === ATTRIBUTES_TYPES.VALUES),
    }
  }

  // Update attributes and recalculate configurator
  updateTableConfiguratorFromAttributes() {
    const tableConfigurator = updateTableConfigurator(this.allAttributes)

    // Update pivot table config with new attributes
    this.updatePivotTableConfig(
      tableConfigurator.rows.map(item => item.attributeName),
      tableConfigurator.columns.map(item => item.attributeName),
      tableConfigurator.values.map(item => item.attributeName),
    )
  }

  // Update pivot table config (used for API requests)
  updatePivotTableConfig(rows?: string[], columns?: string[], values?: string[]) {
    if (rows)
      this.pivotTableConfig.rows = rows
    if (columns)
      this.pivotTableConfig.columns = columns
    if (values)
      this.pivotTableConfig.values = values
  }

  // Change attribute type (e.g., move from rows to columns)
  updateAttributeType(attribute: string, type: string) {
    this.allAttributes = this.allAttributes.map((item) => {
      if (item.attributeName === attribute) {
        // Reset selected values when moving to VALUES
        const selectedAttributeValues
          = type === ATTRIBUTES_TYPES.VALUES && item.selectedAttributeValues?.length > 0
            ? DEFAULT_STATE.ARRAY
            : item.selectedAttributeValues

        return { ...item, type, selectedAttributeValues }
      }
      return item
    })

    // Resort and update configurator
    this.allAttributes = getSortedAllAttributes(this.allAttributes)
    this.updateTableConfiguratorFromAttributes()
  }

  // Remove attribute from pivot table configurator
  deleteAttributeFromTableConfigurator(attribute: string) {
    this.allAttributes = this.allAttributes.map(item =>
      item.attributeName === attribute
        ? { ...item, type: ATTRIBUTES_TYPES.NOT_ASSIGNED }
        : item,
    )

    this.allAttributes = getSortedAllAttributes(this.allAttributes)
    this.updateTableConfiguratorFromAttributes()
  }

  // Update attribute order within a category (rows, columns, values)
  setTableConfiguratorFields(type: string, updatedAttributes: ConstructorAttributeType[]) {
    // Update the store with the new order of attributes
    this.allAttributes = this.allAttributes.map((item) => {
      const updatedItem = updatedAttributes.find(attr => attr.attributeId === item.attributeId)
      return updatedItem && item.type === type ? updatedItem : item
    })

    // Update configuration
    const attributeNames = updatedAttributes.map(item => item.attributeName)
    if (type === 'rows')
      this.pivotTableConfig.rows = attributeNames
    if (type === 'columns')
      this.pivotTableConfig.columns = attributeNames
    if (type === 'values')
      this.pivotTableConfig.values = attributeNames
  }

  // Set attribute modal content (for selecting values of an attribute)
  setConstructorAttributeModalContent(
    parametrs: string[],
    selectedParametrs: string[],
    attributePlaceholder: string,
    attributeName: string,
  ) {
    this.attributeModal = {
      parametrs,
      selectedParametrs,
      attributePlaceholder,
      attributeName,
    }
  }

  // Set selected values for an attribute
  setAttributeSelectedValues(attributeName: string, selectedAttributeValues: string[]) {
    this.allAttributes = this.allAttributes.map(item =>
      item.attributeName === attributeName
        ? { ...item, selectedAttributeValues }
        : item,
    )

    this.allAttributes = getSortedAllAttributes(this.allAttributes)
    this.updateTableConfiguratorFromAttributes()
  }

  // Set aggregation functions for pivot table
  setAggregationFunctionsForPivotTable(parametrs: string[]) {
    this.pivotTableConfig.aggfunc = parametrs
  }

  // Update pivot table URL parameters
  setPivotTableUrlParams(type: string, fields: string[]) {
    if (type === 'rows')
      this.pivotTableConfig.rows = fields
    if (type === 'columns')
      this.pivotTableConfig.columns = fields
    if (type === 'values')
      this.pivotTableConfig.values = fields
    if (type === 'aggfunc')
      this.pivotTableConfig.aggfunc = fields
  }

  // Set pivot table data after retrieval from API
  setPagePivotTable(pivotTable: PivotTableType) {
    this.pivotTableData = pivotTable
  }

  // Reset all configuration
  resetConfiguration() {
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
