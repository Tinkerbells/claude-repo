import type { FC } from 'react'

import { PivotTableConfigurator } from './PivotTableConfigurator'
import { usePageParams } from '../../../../../hooks/usePageParams'
import { DEFAULT_STATE } from '../../../../../consts/globalConsts'

// const initialCheckedFilters = {
//   rows: [],
//   columns: [],
//   indicator: [],
// };

// const initialPivotTableFilters = {
//   rows: [],
//   columns: [],
//   indicators: [],
// };

interface PivotTableConfiguratorsBlockProps {
  pageId: string
}

// type PivotTableFilters = {
//   [key: string]: string[];
// };

export const PivotTableConfiguratorsBlock: FC<
  PivotTableConfiguratorsBlockProps
> = ({ pageId }) => {
  const tableConfigurator
    = usePageParams(pageId).constructorParametrs?.tableConfigurator

  const rows = tableConfigurator?.rows ?? DEFAULT_STATE.ARRAY
  const columns = tableConfigurator?.columns ?? DEFAULT_STATE.ARRAY
  const values = tableConfigurator?.values ?? DEFAULT_STATE.ARRAY

  return (
    <div className="table-constructor__sub-items">
      <PivotTableConfigurator
        pageId={pageId}
        title="Строки"
        attributes={rows}
        type="rows"
        // handleCheckedChange={handleChangeCheckedFilters}
        // handleChangeFiltersOrder={handleChangeFiltersOrder}
        stats="Кол-во значений"
        // selectedAttributes={swapperPanelAttributes}
      />
      <PivotTableConfigurator
        pageId={pageId}
        title="Столбцы"
        attributes={columns}
        type="columns"
        // handleCheckedChange={handleChangeCheckedFilters}
        // handleChangeFiltersOrder={handleChangeFiltersOrder}
        stats="Кол-во значений"
        // selectedAttributes={swapperPanelAttributes}
      />
      <PivotTableConfigurator
        pageId={pageId}
        title="Показатель"
        attributes={values}
        type="values"
        // handleCheckedChange={handleChangeCheckedFilters}
        // handleChangeFiltersOrder={handleChangeFiltersOrder}
        stats="Кол-во функций"
        // selectedAttributes={swapperPanelAttributes}
      />
      <PivotTableConfigurator
        title="Фильтр"
        type="filters"
        pageId={pageId}
        stats="Кол-во значений"
      />
    </div>
  )
}

// const swapperPanelAttributes = useAppSelector((state) => state.tableConstructor.swapperPanelAttributes);
// const swapperPanelType = useAppSelector((state) => state.tableConstructor.swapperPanelType);

// Получаем данные из Redux
// const rows = useAppSelector(selectRows);
// const columns = useAppSelector(selectColumns);
// const indicator = useAppSelector(selectIndicator);
// const pivotTableFieldsParametrs = usePageParams(pageId).constructorParametrs.pivotTableFieldsParametrs;
// const rows = pivotTableFieldsParametrs.rows;
// const columns = pivotTableFieldsParametrs.columns;
// const indicator = pivotTableFieldsParametrs.indicator;

// // Создаём селекторы для конкретной страницы
// const { rows, columns, indicator } = usePivotTableFields(pageId);
// const [selectedPivotTableFilters, setSelectedPivotTableFilters] =
//   useState<CheckedFiltersType>(initialCheckedFilters);
// const [pivotTableFiltersOrder, setPivotTableFiltersOrder] =
//   useState<PivotTableFilters>(initialPivotTableFilters);

//   // const rowsMemo = useMemo(() => pivotTableFiltersOrder.rows, [pivotTableFiltersOrder.rows]);
//   // const columnsMemo = useMemo(() => pivotTableFiltersOrder.columns, [pivotTableFiltersOrder.columns]);
//   // const indicatorMemo = useMemo(() => pivotTableFiltersOrder.indicator, [pivotTableFiltersOrder.indicator]);
// const dispatch = useAppDispatch();

// useEffect(() => {
//   // console.log(checkedFilters.rows);
//   // console.log(checkedFilters.columns);

//   dispatch(setSubTableFilters(selectedPivotTableFilters));
// }, [dispatch, selectedPivotTableFilters]);

// const handleChangeCheckedFilters = useCallback(
//   (type: keyof CheckedFiltersType, selectedSubTableFilters: string[]) => {
//     setSelectedPivotTableFilters((prev: CheckedFiltersType) => ({
//       ...prev,
//       [type]: selectedSubTableFilters,
//     }));
//   },
//   []
// );

// const handleChangeFiltersOrder = useCallback(
//   (type: keyof PivotTableFilters, pivotTableFiltersOrder: string[]) => {
//     //console.log("pivot", pivotTableFiltersOrder);
//     setPivotTableFiltersOrder((prev: PivotTableFilters) => ({
//       ...prev,
//       [type]: pivotTableFiltersOrder,
//     }));
//   },

//   []
// );

// // console.log("columns",columns);
// //console.log("rows", pivotTableFiltersOrder.rows);

// //console.log(rows, "from store")

// useEffect(() => {
//   dispatch(
//     setPivotTableUrlParams({
//       pageId,
//       rows: pivotTableFiltersOrder.rows,
//       columns: pivotTableFiltersOrder.columns,
//       values: pivotTableFiltersOrder.indicator
//     })
//   );
// }, [dispatch]);

// const prevFiltersRef = useRef<PivotTableFilters>(pivotTableFiltersOrder);

// Эффект для selectedPivotTableFilters
// useEffect(() => {
//   dispatch(setSubTableFilters(selectedPivotTableFilters));
// }, [dispatch, selectedPivotTableFilters]);

// useEffect(() => {
//   dispatch(
//     setPivotTableUrlParams({
//       pageId,
//       rows: pivotTableFiltersOrder.rows,
//       columns: pivotTableFiltersOrder.columns,
//       values: pivotTableFiltersOrder.indicator,
//     })
//   );
// }, [indicator, pageId, dispatch, pivotTableFiltersOrder.rows, pivotTableFiltersOrder.columns, pivotTableFiltersOrder.indicator]);

// const handleChangeCheckedFilters = useCallback(
//   (type: keyof CheckedFiltersType, selectedSubTableFilters: string[]) => {
//     //console.log(selectedPivotTableFilters);
//     setSelectedPivotTableFilters(prev => ({
//       ...prev,
//       [type]: selectedSubTableFilters,
//     }));
//   },
//   []
// );

// const handleChangeFiltersOrder = useCallback(
//   (type: keyof PivotTableFilters, newOrder: string[]) => {
//     setPivotTableFiltersOrder(prev => {
//       const newState = {
//         ...prev,
//         [type]: newOrder,
//       };

//       // Сравниваем не просто равенство массивов, а именно порядок элементов
//       if (hasOrderChanged(prevFiltersRef.current[type], newOrder)) {
//         dispatch(
//           setPivotTableUrlParams({
//             pageId,
//             rows: type === 'rows' ? newOrder : prev.rows,
//             columns: type === 'columns' ? newOrder : prev.columns,
//             values: type === 'indicator' ? newOrder : prev.indicator,
//           })
//         );
//         prevFiltersRef.current = newState;
//       }

//       return newState;
//     });
//   },
//   [dispatch, pageId]
// );

// Функция проверки изменения порядка элементов
// const hasOrderChanged = (oldArray: string[] = [], newArray: string[] = []): boolean => {
//   // Если разная длина - порядок точно изменился
//   if (oldArray.length !== newArray.length) return true;

//   // Проверяем каждый элемент на своей позиции
//   return oldArray.some((item, index) => item !== newArray[index]);
// };
