// import { OlapReportFiltersType } from "../types/api";
// import { VersionRequestType } from "../types/olapReportPage";

// // export const ATTRIBUTES_TYPES = {
// //   ROWS: "rows",
// //   COLUMNS: "columns",
// //   INDICATOR: "indicator",
// //   NOT_ASSIGNED: "notAssigned",
// // };

// export const createFieldParametrs = (
//   //@ts-ignore
//   allAttributes: OlapConstructorAttributeType[],
//   type: string,
//   prefix: string // "row", "column", "indicator"
// ) =>
//   allAttributes
//     .filter(item => item.type === type)
//     .map(item => ({
//       checked: item.checked,
//       attributeName: item.attributeName,
//       attributeValues:item.attributeValues,
//       selectedAttributeValues: item.selectedAttributeValues,
//       attributePlaceholder:item.attributePlaceholder,
//       attributeId: `${prefix}-${item.attributeName}`,
//       // attributeActions:item.attributeActions,
//       // selectedAttributeActions:item.selectedAttributeActions
//     }));
