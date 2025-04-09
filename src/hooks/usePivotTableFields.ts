// import { useMemo } from "react";
// import { createFieldSelectors } from "../store/features/olapReposrtsPagesSlice/olapReportPagesSelectors";
// import { useAppSelector } from "../store/store";
// import { shallowEqual } from "react-redux";

// export const usePivotTableFields = (pageId: string) => {
//     const selectors = useMemo(() => createFieldSelectors(pageId), [pageId]);

//     return {
//       rows: useAppSelector(selectors.selectRows, shallowEqual),
//       columns: useAppSelector(selectors.selectColumns, shallowEqual),
//       indicator: useAppSelector(selectors.selectIndicator, shallowEqual)
//     };
//   };
