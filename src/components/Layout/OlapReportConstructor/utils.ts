import type { PivotTableFieldsHandbookType } from '../../../types/tableProps'

// export const getTableFiltersWithTypes = (filtersArray: string[]) => {
//   const resultArray = filtersArray.map((filter, index) => {
//     return {
//       attribute: filter,
//       type: ATTRIBUTES_TYPES.NOT_ASSIGNED,
//       attributeId: `${index}-${filter}`,
//       checked: false,
//       attributeSelectedParametrs: DEFAULT_STATE.ARRAY,
//     };
//   });

//   return resultArray;
// };

export function createAttributeTypesArray(statuses: {
  [s: string]: unknown
}) {
  return Object.entries(statuses).map(([value, label]) => ({
    value,
    label,
  }))
}

export function getKeysByPartialValue(object: PivotTableFieldsHandbookType, value: string) {
  const result = Object.keys(object).find(key => object[key] === value)
  console.log(result)
  return result
}
