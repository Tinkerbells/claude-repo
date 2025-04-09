type AggregationFunctionKey = keyof typeof aggregationFunctionsHandbook

export const ATTRIBUTES_TYPES = {
  ROWS: 'rows',
  COLUMNS: 'columns',
  VALUES: 'values',
  NOT_ASSIGNED: 'notAssigned',
}

export const aggregationFunctionsHandbook = {
  sum: 'Сумма',
  mean: 'Среднее значение',
  median: 'Медиана',
  min: 'Минимум',
  max: 'Максимум',
  count: 'Количество',
  std: 'Стандартное отклонение',
  var: 'Дисперсия',
  prod: 'Произведение',
  first: 'Первый',
  last: 'Последний',
}

export const subTableSelectOptions = [
  { value: 'rows', label: 'Строки' },
  { value: 'columns', label: 'Столбцы' },
  { value: 'values', label: 'Показатель' },
  { value: 'notAssigned', label: 'Не назначено' },
]

export function isAggregationFunctionKey(value: string): value is AggregationFunctionKey {
  return value in aggregationFunctionsHandbook
}
