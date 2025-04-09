// import { useEffect } from "react";
// import { useGetSpecificFiltersQuery, usePrefetch } from "../../../api/apiSlice";
// import {
//   AllSpecificFiltersType,
//   FilterType,
// } from "../../../types/tableProps";
// import { setAllSpecificFilters } from "../../../store/features/allAttributeParametrs/allAttributeParametrs";
// import { useAppDispatch, useAppSelector } from "../../../store/store";
// import { setTableConstructorAllAttributes } from "../../../store/features/tableConstructor/tableConstructorSlice";

// export const OlapConstructorMain = () => {
//   const { data} = useGetSpecificFiltersQuery<FilterType>();
//   const allAttributes = useAppSelector(
//     (state) => state.tableConstructor.allAttributes
//   );
//   const prefetchSpecificFilters = usePrefetch('getSpecificFilters');
//   const dispatch = useAppDispatch();

//   useEffect(() => {
//     prefetchSpecificFilters();
//   }, [prefetchSpecificFilters]);

//   useEffect(() => {
//     if (data) {
//       const filtersData: AllSpecificFiltersType = Array.isArray(data)
//         ? { value: data }
//         : data;
//       //console.log(data);
//       dispatch(setAllSpecificFilters(filtersData));
//       const accessibleFilters = Object.keys(data);
//       const tableFiltersWithTypes = tableFiltersWithTypes(accessibleFilters);
//       dispatch(setTableConstructorAllAttributes(tableFiltersWithTypes));
//     }
//   }, [data, dispatch]);

//   return (
//       <div className="table-constructor">
//           <div className="table-constructor__main">

//               <TableConstructorAttributesItem
//                 tableConstructorAttributes={allAttributes}
//               />
//             <TableConstructorSubItemsBlock />
//           </div>
//         <TableConstructorActions />
//       </div>
//   );
// };
