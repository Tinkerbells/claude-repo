import type { OlapReportFiltersType } from '../types/api'
import type { ConstructorAttributeType } from '../types/olapReportPage'

import { DEFAULT_STATE } from '../consts/globalConsts'
import { ATTRIBUTES_TYPES } from '../consts/pivotTableConsts'

export function safeJsonParse(jsonString: string) {
  try {
    return JSON.parse(jsonString.replace(/'/g, '"')) ?? DEFAULT_STATE.ARRAY
  }
  catch (e) {
    console.error('JSON parse error:', e)
    return DEFAULT_STATE.ARRAY
  }
}

function getSelectedAttributeValues(fieldType: string, aggfunc: string[], filterValues: string[]) {
  if (fieldType === ATTRIBUTES_TYPES.VALUES) {
    console.log('true its values')
    return aggfunc.length > 0 ? aggfunc : DEFAULT_STATE.ARRAY
  }
  return filterValues
}

export function createAtrributeFilters(
  filters: OlapReportFiltersType[],
  fieldsForPivotTable: any = {},
) {
  const rows = fieldsForPivotTable.rows ? safeJsonParse(fieldsForPivotTable.rows) : DEFAULT_STATE.ARRAY
  const columns = fieldsForPivotTable.columns ? safeJsonParse(fieldsForPivotTable.columns) : DEFAULT_STATE.ARRAY
  const values = fieldsForPivotTable.values ? safeJsonParse(fieldsForPivotTable.values) : DEFAULT_STATE.ARRAY
  const aggfunc = fieldsForPivotTable.aggfunc ? safeJsonParse(fieldsForPivotTable.aggfunc) : DEFAULT_STATE.ARRAY

  const resultArray = filters.map((item, index) => {
    let fieldType = ATTRIBUTES_TYPES.NOT_ASSIGNED
    if (rows.includes(item.filter_name)) {
      fieldType = ATTRIBUTES_TYPES.ROWS
    }
    else if (columns.includes(item.filter_name)) {
      fieldType = ATTRIBUTES_TYPES.COLUMNS
    }
    else if (values.includes(item.filter_name)) {
      fieldType = ATTRIBUTES_TYPES.VALUES
    }

    return {
      attributeName: item.filter_name,
      attributePlaceholder: item.filter_placeholder,
      attributeType: item.filter_type,
      attributeActions: item.filter_actions,
      attributeValues: item.filter_values,
      type: fieldType,
      attributeId: `${index}-${item.filter_name}`,
      checked: false,
      selectedAttributeValues: getSelectedAttributeValues(
        fieldType,
        aggfunc,
        item.filter_values,
      ),
    }
  })

  return resultArray
}

export function updateTableConfigurator(allAttributes: ConstructorAttributeType[]) {
  return {
    rows: allAttributes.filter(item => item.type === ATTRIBUTES_TYPES.ROWS),
    columns: allAttributes.filter(item => item.type === ATTRIBUTES_TYPES.COLUMNS),
    values: allAttributes.filter(item => item.type === ATTRIBUTES_TYPES.VALUES),
  }
}

export function getSortedAllAttributes(allAttributes: ConstructorAttributeType[]) {
  return allAttributes.sort((a, b) => {
    if (a.type === ATTRIBUTES_TYPES.NOT_ASSIGNED && b.type !== ATTRIBUTES_TYPES.NOT_ASSIGNED)
      return 1
    if (a.type !== ATTRIBUTES_TYPES.NOT_ASSIGNED && b.type === ATTRIBUTES_TYPES.NOT_ASSIGNED)
      return -1
    return 0
  })
}

export function getPivotTableAttributeNames(attributes: ConstructorAttributeType[]) {
  return attributes.map(item => item.attributeName)
}
