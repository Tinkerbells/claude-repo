// import { createSelector } from "@reduxjs/toolkit";
// import { AttributeFilter } from "../../../types/tableProps";
// import { ATTRIBUTES_TYPES } from "../../../consts/pivotTableConsts";

// export const selectedRows = createSelector(
//     (state) => state.tableConstructor.allAttributes,
//     (state) => state.allAttributeParametrs,
//     (allAttributes:AttributeFilter[], allAttributeParametrs) => {
//       return allAttributes
//         .filter((item:AttributeFilter) => item.type === ATTRIBUTES_TYPES.ROWS)
//         .map((item:AttributeFilter) => ({
//           checked:item.checked,
//           attribute: item.attribute,
//           attributeId: `row-${item.attribute}`,
//           attributeParametrs: allAttributeParametrs[item.attribute],
//           attributeSelectedParametrs:item.attributeSelectedParametrs
//         }));
//     }
//   );

//   export const selectedColumns = createSelector(
//     (state) => state.tableConstructor.allAttributes,
//     (state) => state.allAttributeParametrs,
//     (allAttributes:AttributeFilter[], allAttributeParametrs) => {
//       return allAttributes
//         .filter((item:AttributeFilter) => item.type === ATTRIBUTES_TYPES.COLUMNS)
//         .map((item:AttributeFilter) => ({
//           checked:item.checked,
//           attribute: item.attribute,
//           attributeId: `column-${item.attribute}`,
//           attributeParametrs: allAttributeParametrs[item.attribute],
//           attributeSelectedParametrs:item.attributeSelectedParametrs
//           //selectedAttributeParametrs: allSpecificFilters[item.attribute]
//         }));
//     }
//   );

//   export const selectedIndicators = createSelector(
//     (state) => state.tableConstructor.allAttributes,
//     (state) => state.allAttributeParametrs,
//     (allAttributes:AttributeFilter[], allAttributeParametrs) => {
//       return allAttributes
//         .filter((item:AttributeFilter) => item.type === ATTRIBUTES_TYPES.INDICATOR)
//         .map((item:AttributeFilter) => ({
//           checked:item.checked,
//           attribute: item.attribute,
//           attributeId: `indicator-${item.attribute}`,
//           attributeParametrs: allAttributeParametrs[item.attribute],
//           attributeSelectedParametrs:item.attributeSelectedParametrs
//           //selectedAttributeParametrs: allSpecificFilters[item.attribute]
//         }));
//     }
//   );
